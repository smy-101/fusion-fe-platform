import React, { useRef } from 'react'
import { Form, FormItem } from './index'
import { Input } from '../Input'
import { Button } from '../Button'

// 基础使用示例
export const BasicFormExample: React.FC = () => {
  const onFinish = (values: any) => {
    console.log('表单提交成功:', values)
    alert('表单提交成功！\n' + JSON.stringify(values, null, 2))
  }

  const onFinishFailed = (errors: any) => {
    console.log('表单验证失败:', errors)
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">基础表单示例</h2>
      
      <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
        <FormItem
          name="username"
          label="用户名"
          rules={[
            { required: true, message: '请输入用户名' },
            { minLength: 3, message: '用户名至少3个字符' }
          ]}
        >
          <Input placeholder="请输入用户名" />
        </FormItem>

        <FormItem
          name="email"
          label="邮箱"
          rules={[
            { required: true, message: '请输入邮箱' },
            { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '请输入有效的邮箱地址' }
          ]}
        >
          <Input type="email" placeholder="请输入邮箱" />
        </FormItem>

        <FormItem
          name="age"
          label="年龄"
          rules={[
            { required: true, message: '请输入年龄' },
            { min: 18, message: '年龄必须大于等于18岁' },
            { max: 100, message: '年龄不能超过100岁' }
          ]}
        >
          <Input type="number" placeholder="请输入年龄" />
        </FormItem>

        <FormItem>
          <Button type="submit" className="w-full">
            提交表单
          </Button>
        </FormItem>
      </Form>
    </div>
  )
}

// 带初始值的表单示例
export const FormWithInitialValues: React.FC = () => {
  const initialValues = {
    username: 'admin',
    email: 'admin@example.com',
    age: '25'
  }

  const onFinish = (values: any) => {
    console.log('表单提交成功:', values)
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">带初始值的表单</h2>
      
      <Form initialValues={initialValues} onFinish={onFinish}>
        <FormItem
          name="username"
          label="用户名"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input placeholder="请输入用户名" />
        </FormItem>

        <FormItem
          name="email"
          label="邮箱"
          rules={[
            { required: true, message: '请输入邮箱' },
            { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '请输入有效的邮箱地址' }
          ]}
        >
          <Input type="email" placeholder="请输入邮箱" />
        </FormItem>

        <FormItem
          name="age"
          label="年龄"
          rules={[{ required: true, message: '请输入年龄' }]}
        >
          <Input type="number" placeholder="请输入年龄" />
        </FormItem>

        <FormItem>
          <Button type="submit" className="w-full">
            提交表单
          </Button>
        </FormItem>
      </Form>
    </div>
  )
}

// 使用Form实例的示例
export const FormWithInstance: React.FC = () => {
  const formRef = useRef<any>(null)

  const onFinish = (values: any) => {
    console.log('表单提交成功:', values)
  }

  const setFormValues = () => {
    formRef.current?.setFieldsValue({
      username: 'testuser',
      email: 'test@example.com',
      age: '30'
    })
  }

  const getFormValues = () => {
    const values = formRef.current?.getFieldsValue()
    console.log('当前表单值:', values)
    alert('当前表单值: ' + JSON.stringify(values, null, 2))
  }

  const resetForm = () => {
    formRef.current?.resetFields()
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">使用Form实例</h2>
      
      <div className="mb-4 flex gap-2">
        <Button onClick={setFormValues} variant="secondary" size="sm">
          设置值
        </Button>
        <Button onClick={getFormValues} variant="secondary" size="sm">
          获取值
        </Button>
        <Button onClick={resetForm} variant="danger" size="sm">
          重置
        </Button>
      </div>

      <Form 
        onFinish={onFinish}
        ref={formRef}
      >
        <FormItem
          name="username"
          label="用户名"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input placeholder="请输入用户名" />
        </FormItem>

        <FormItem
          name="email"
          label="邮箱"
          rules={[
            { required: true, message: '请输入邮箱' },
            { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '请输入有效的邮箱地址' }
          ]}
        >
          <Input type="email" placeholder="请输入邮箱" />
        </FormItem>

        <FormItem
          name="age"
          label="年龄"
          rules={[{ required: true, message: '请输入年龄' }]}
        >
          <Input type="number" placeholder="请输入年龄" />
        </FormItem>

        <FormItem>
          <Button type="submit" className="w-full">
            提交表单
          </Button>
        </FormItem>
      </Form>
    </div>
  )
}

// 自定义验证示例
export const CustomValidationExample: React.FC = () => {
  const onFinish = (values: any) => {
    console.log('表单提交成功:', values)
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">自定义验证示例</h2>
      
      <Form onFinish={onFinish}>
        <FormItem
          name="password"
          label="密码"
          rules={[
            { required: true, message: '请输入密码' },
            { minLength: 6, message: '密码至少6个字符' }
          ]}
        >
          <Input type="password" placeholder="请输入密码" />
        </FormItem>

        <FormItem
          name="confirmPassword"
          label="确认密码"
          rules={[
            { required: true, message: '请确认密码' },
            {
              custom: (value, values) => {
                if (value !== values?.password) {
                  return '两次输入的密码不一致'
                }
                return undefined
              }
            }
          ]}
        >
          <Input type="password" placeholder="请再次输入密码" />
        </FormItem>

        <FormItem
          name="phone"
          label="手机号"
          rules={[
            { required: true, message: '请输入手机号' },
            {
              custom: (value) => {
                const phoneRegex = /^1[3-9]\d{9}$/
                if (!phoneRegex.test(value)) {
                  return '请输入有效的手机号'
                }
                return undefined
              }
            }
          ]}
        >
          <Input placeholder="请输入手机号" />
        </FormItem>

        <FormItem>
          <Button type="submit" className="w-full">
            提交表单
          </Button>
        </FormItem>
      </Form>
    </div>
  )
}

export default BasicFormExample