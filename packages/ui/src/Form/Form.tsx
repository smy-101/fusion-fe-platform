import React, { useState, useCallback, useImperativeHandle, forwardRef, useEffect } from 'react'

// 表单字段值的类型
export type FormValues = Record<string, any>

// 验证规则的类型
export interface ValidationRule {
  required?: boolean
  message?: string
  pattern?: RegExp
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  custom?: (value: any, values?: FormValues) => string | undefined
}

// 字段验证配置
export interface FieldValidation {
  [fieldName: string]: ValidationRule[]
}

// 表单错误类型
export type FormErrors = Record<string, string>

// 表单实例接口
export interface FormInstance {
  getFieldsValue: () => FormValues
  setFieldsValue: (values: Partial<FormValues>) => void
  validateFields: () => Promise<FormValues>
  resetFields: () => void
  getFieldValue: (name: string) => any
  setFieldValue: (name: string, value: any) => void
  getFieldError: (name: string) => string[]
  setFields: (fields: { name: string; value?: any; errors?: string[] }[]) => void
}

// 表单项Props
export interface FormItemProps {
  name?: string
  label?: string
  required?: boolean
  rules?: ValidationRule[]
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}

// 表单Props
export interface FormProps {
  initialValues?: FormValues
  onFinish?: (values: FormValues) => void | Promise<void>
  onFinishFailed?: (errors: FormErrors) => void
  onValuesChange?: (changedValues: FormValues, allValues: FormValues) => void
  form?: FormInstance
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
}

// 内部表单上下文
interface FormContextType {
  values: FormValues
  errors: FormErrors
  touched: Record<string, boolean>
  setFieldValue: (name: string, value: any) => void
  setFieldError: (name: string, error: string) => void
  setFieldTouched: (name: string, touched: boolean) => void
  validateField: (name: string) => Promise<string | undefined>
  registerField: (name: string, rules?: ValidationRule[]) => void
  unregisterField: (name: string) => void
}

const FormContext = React.createContext<FormContextType | null>(null)

// Hook用于使用表单上下文
export const useFormInstance = (): FormContextType => {
  const context = React.useContext(FormContext)
  if (!context) {
    throw new Error('useFormInstance must be used within a Form component')
  }
  return context
}

// 表单组件
export const Form = forwardRef<FormInstance, FormProps>(({
  initialValues = {},
  onFinish,
  onFinishFailed,
  onValuesChange,
  className = '',
  style,
  children
}, ref) => {
  const [values, setValues] = useState<FormValues>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [fields, setFields] = useState<Map<string, ValidationRule[]>>(new Map())

  // 注册字段
  const registerField = useCallback((name: string, rules?: ValidationRule[]) => {
    setFields(prev => new Map(prev).set(name, rules || []))
  }, [])

  // 注销字段
  const unregisterField = useCallback((name: string) => {
    setFields(prev => {
      const newFields = new Map(prev)
      newFields.delete(name)
      return newFields
    })
    setValues(prev => {
      const newValues = { ...prev }
      delete newValues[name]
      return newValues
    })
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[name]
      return newErrors
    })
    setTouched(prev => {
      const newTouched = { ...prev }
      delete newTouched[name]
      return newTouched
    })
  }, [])

  // 验证单个字段
  const validateField = useCallback(async (name: string): Promise<string | undefined> => {
    const rules = fields.get(name)
    if (!rules) return undefined

    const value = values[name]
    
    for (const rule of rules) {
      // 必填验证
      if (rule.required && (!value || value.toString().trim() === '')) {
        return rule.message || '此字段为必填项'
      }

      // 如果值为空且不是必填，跳过其他验证
      if (!value || value.toString().trim() === '') {
        continue
      }

      // 正则验证
      if (rule.pattern && !rule.pattern.test(value.toString())) {
        return rule.message || '格式不正确'
      }

      // 最小长度验证
      if (rule.minLength && value.toString().length < rule.minLength) {
        return rule.message || `最少需要${rule.minLength}个字符`
      }

      // 最大长度验证
      if (rule.maxLength && value.toString().length > rule.maxLength) {
        return rule.message || `最多允许${rule.maxLength}个字符`
      }

      // 数值最小值验证
      if (rule.min !== undefined && Number(value) < rule.min) {
        return rule.message || `值不能小于${rule.min}`
      }

      // 数值最大值验证
      if (rule.max !== undefined && Number(value) > rule.max) {
        return rule.message || `值不能大于${rule.max}`
      }

      // 自定义验证
      if (rule.custom) {
        const customError = rule.custom(value, values)
        if (customError) return customError
      }
    }

    return undefined
  }, [fields, values])

  // 设置字段值
  const setFieldValue = useCallback((name: string, value: any) => {
    const prevValues = values
    const newValues = { ...prevValues, [name]: value }
    setValues(newValues)
    
    // 触发值变化回调
    if (onValuesChange) {
      onValuesChange({ [name]: value }, newValues)
    }
    
    // 如果字段已经被触碰过，实时验证
    if (touched[name]) {
      validateField(name).then(error => {
        setFieldError(name, error || '')
      })
    }
  }, [values, touched, onValuesChange, validateField])

  // 设置字段错误
  const setFieldError = useCallback((name: string, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }))
  }, [])

  // 设置字段触碰状态
  const setFieldTouched = useCallback((name: string, isTouched: boolean) => {
    setTouched(prev => ({ ...prev, [name]: isTouched }))
    
    // 当字段被触碰时，进行验证
    if (isTouched) {
      validateField(name).then(error => {
        setFieldError(name, error || '')
      })
    }
  }, [validateField, setFieldError])

  // 验证所有字段
  const validateFields = useCallback(async (): Promise<FormValues> => {
    const fieldNames = Array.from(fields.keys())
    const fieldErrors: FormErrors = {}
    
    // 验证所有字段
    await Promise.all(
      fieldNames.map(async (fieldName) => {
        const error = await validateField(fieldName)
        if (error) {
          fieldErrors[fieldName] = error
        }
      })
    )
    
    setErrors(fieldErrors)
    
    if (Object.keys(fieldErrors).length > 0) {
      throw fieldErrors
    }
    
    return values
  }, [fields, validateField, values])

  // 获取所有字段值
  const getFieldsValue = useCallback((): FormValues => {
    return { ...values }
  }, [values])

  // 设置多个字段值
  const setFieldsValue = useCallback((newValues: Partial<FormValues>) => {
    const updatedValues = { ...values, ...newValues }
    setValues(updatedValues)
    
    if (onValuesChange) {
      onValuesChange(newValues, updatedValues)
    }
  }, [values, onValuesChange])

  // 获取单个字段值
  const getFieldValue = useCallback((name: string): any => {
    return values[name]
  }, [values])

  // 获取字段错误
  const getFieldError = useCallback((name: string): string[] => {
    const error = errors[name]
    return error ? [error] : []
  }, [errors])

  // 设置多个字段
  const setFieldsData = useCallback((fieldList: { name: string; value?: any; errors?: string[] }[]) => {
    const newValues = { ...values }
    const newErrors = { ...errors }
    
    fieldList.forEach(field => {
      if (field.value !== undefined) {
        newValues[field.name] = field.value
      }
      if (field.errors) {
        newErrors[field.name] = field.errors[0] || ''
      }
    })
    
    setValues(newValues)
    setErrors(newErrors)
  }, [values, errors])

  // 重置表单
  const resetFields = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  // 表单提交
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const submitValues = await validateFields()
      
      if (onFinish) {
        await onFinish(submitValues)
      }
    } catch (fieldErrors) {
      if (onFinishFailed) {
        onFinishFailed(fieldErrors as FormErrors)
      }
    }
  }, [validateFields, onFinish, onFinishFailed])

  // 暴露表单实例方法
  useImperativeHandle(ref, () => ({
    getFieldsValue,
    setFieldsValue,
    validateFields,
    resetFields,
    getFieldValue,
    setFieldValue,
    getFieldError,
    setFields: setFieldsData
  }), [getFieldsValue, setFieldsValue, validateFields, resetFields, getFieldValue, setFieldValue, getFieldError, setFieldsData])

  const contextValue: FormContextType = {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    validateField,
    registerField,
    unregisterField
  }

  return (
    <FormContext.Provider value={contextValue}>
      <form onSubmit={handleSubmit} className={className} style={style} noValidate>
        {children}
      </form>
    </FormContext.Provider>
  )
})

Form.displayName = 'Form'

// 表单项组件
export const FormItem: React.FC<FormItemProps> = ({
  name,
  label,
  required,
  rules = [],
  className = '',
  style,
  children
}) => {
  const { values, errors, touched, setFieldValue, setFieldTouched, registerField, unregisterField } = useFormInstance()

  // 注册字段
  useEffect(() => {
    if (name) {
      registerField(name, rules)
    }
    
    return () => {
      if (name) {
        unregisterField(name)
      }
    }
  }, [name, rules, registerField, unregisterField])

  // 如果没有name，直接渲染children
  if (!name) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    )
  }

  const error = errors[name]
  const isTouched = touched[name]
  const hasError = error && isTouched

  // 克隆children并注入必要的props
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const childProps = {
        value: values[name] || '',
        onChange: (e: any) => {
          const value = e?.target?.value ?? e
          setFieldValue(name, value)
          const originalOnChange = (child as any).props?.onChange
          if (originalOnChange) {
            originalOnChange(e)
          }
        },
        onBlur: (e: any) => {
          setFieldTouched(name, true)
          const originalOnBlur = (child as any).props?.onBlur
          if (originalOnBlur) {
            originalOnBlur(e)
          }
        }
      }
      return React.cloneElement(child, childProps)
    }
    return child
  })

  return (
    <div className={`mb-4 ${className}`} style={style}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {(required || rules.some(rule => rule.required)) && (
            <span className="text-red-500 ml-1">*</span>
          )}
        </label>
      )}
      {childrenWithProps}
      {hasError && (
        <div className="mt-1 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  )
}

// 创建表单实例的Hook
export const useForm = (): FormInstance => {
  const [formInstance] = useState<FormInstance>(() => ({
    getFieldsValue: () => ({}),
    setFieldsValue: () => {},
    validateFields: async () => ({}),
    resetFields: () => {},
    getFieldValue: () => undefined,
    setFieldValue: () => {},
    getFieldError: () => [],
    setFields: () => {}
  }))

  return formInstance
}

