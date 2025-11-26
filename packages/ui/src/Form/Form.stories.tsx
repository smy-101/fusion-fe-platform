import type { Meta, StoryObj } from '@storybook/react'
import { useRef, useState } from 'react'
import { Form, FormItem, type FormInstance } from './index'
import { Input } from '../Input'
import { Button } from '../Button'

const meta: Meta<typeof Form> = {
  title: 'Components/Form',
  component: Form,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

// 基础表单示例
export const Basic: Story = {
  render: () => {
    const onFinish = (values: any) => {
      console.log('表单提交成功:', values)
      alert('表单提交成功: ' + JSON.stringify(values, null, 2))
    }

    const onFinishFailed = (errors: any) => {
      console.log('表单验证失败:', errors)
    }

    return (
      <div className="w-96 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">基础表单</h2>
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
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码' },
              { minLength: 6, message: '密码至少6个字符' }
            ]}
          >
            <Input type="password" placeholder="请输入密码" />
          </FormItem>

          <FormItem>
            <Button type="submit" className="w-full">
              提交
            </Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}

// 带初始值的表单
export const WithInitialValues: Story = {
  render: () => {
    const initialValues = {
      username: 'admin',
      email: 'admin@example.com',
      phone: '13800138000'
    }

    const onFinish = (values: any) => {
      console.log('表单提交成功:', values)
    }

    return (
      <div className="w-96 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">带初始值的表单</h2>
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
            name="phone"
            label="手机号"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }
            ]}
          >
            <Input placeholder="请输入手机号" />
          </FormItem>

          <FormItem>
            <Button type="submit" className="w-full">
              提交
            </Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}

// 使用form实例的表单
export const WithFormInstance: Story = {
  render: () => {
    const formRef = useRef<FormInstance>(null)

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
      <div className="w-96 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">使用Form实例</h2>
        
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

          <FormItem>
            <Button type="submit" className="w-full">
              提交
            </Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}

// 自定义验证
export const CustomValidation: Story = {
  render: () => {
    const onFinish = (values: any) => {
      console.log('表单提交成功:', values)
    }

    return (
      <div className="w-96 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">自定义验证</h2>
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
            name="age"
            label="年龄"
            rules={[
              { required: true, message: '请输入年龄' },
              {
                custom: (value) => {
                  const age = Number(value)
                  if (isNaN(age) || age < 18 || age > 100) {
                    return '年龄必须在18-100之间'
                  }
                  return undefined
                }
              }
            ]}
          >
            <Input type="number" placeholder="请输入年龄" />
          </FormItem>

          <FormItem>
            <Button type="submit" className="w-full">
              提交
            </Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}

// 动态表单字段
export const DynamicFields: Story = {
  render: () => {
    const [hobbies, setHobbies] = useState<string[]>([''])

    const addHobby = () => {
      setHobbies([...hobbies, ''])
    }

    const removeHobby = (index: number) => {
      if (hobbies.length > 1) {
        setHobbies(hobbies.filter((_, i) => i !== index))
      }
    }

    const onFinish = (values: any) => {
      console.log('表单提交成功:', values)
    }

    return (
      <div className="w-96 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">动态表单字段</h2>
        <Form onFinish={onFinish}>
          <FormItem
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </FormItem>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              爱好
            </label>
            {hobbies.map((_, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <FormItem name={`hobby_${index}`} className="flex-1 mb-0">
                  <Input placeholder={`爱好 ${index + 1}`} />
                </FormItem>
                {hobbies.length > 1 && (
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => removeHobby(index)}
                  >
                    删除
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addHobby}
            >
              添加爱好
            </Button>
          </div>

          <FormItem>
            <Button type="submit" className="w-full">
              提交
            </Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}