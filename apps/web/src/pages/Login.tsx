import React from 'react'
import { useNavigate } from 'react-router'
import { Form, FormItem } from '@fusion/ui/Form'
import { Input } from '@fusion/ui/Input'
import { Button } from '@fusion/ui/Button'
import { useLogin } from '@fusion/shared/auth-hooks'

interface LoginFormData {
  username: string
  password: string
}

const Login: React.FC = () => {
  const navigate = useNavigate()
  const loginMutation = useLogin()

  const handleSubmit = async (values: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(values)
      
      // 登录成功，跳转到首页
      navigate('/')
    } catch (error) {
      console.error('登录失败:', error)
      // 错误处理已经在useLogin中完成
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            登录到您的账户
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            测试账号：admin / 123456
          </p>
        </div>
        
        <Form
          onFinish={handleSubmit}
          className="mt-8 space-y-6"
        >
          <FormItem
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              { minLength: 3, message: '用户名至少3个字符' }
            ]}
          >
            <Input
              type="text"
              placeholder="请输入用户名"
              autoComplete="username"
            />
          </FormItem>
          
          <FormItem
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码' },
              { minLength: 6, message: '密码至少6个字符' }
            ]}
          >
            <Input
              type="password"
              placeholder="请输入密码"
              autoComplete="current-password"
            />
          </FormItem>
          
          <div>
            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full"
            >
              {loginMutation.isPending ? '登录中...' : '登录'}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default Login