import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { Form, FormItem } from '@fusion/ui/Form'
import { Input } from '@fusion/ui/Input'
import { Button } from '@fusion/ui/Button'

interface LoginFormData {
  username: string
  password: string
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (values: LoginFormData) => {
    setLoading(true)
    
    try {
      // Mock登录逻辑
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 简单的mock验证
      if (values.username === 'admin' && values.password === '123456') {
        // 存储token到localStorage
        localStorage.setItem('token', 'mock-jwt-token')
        localStorage.setItem('user', JSON.stringify({
          id: 1,
          username: 'admin',
          name: '管理员',
          role: 'admin'
        }))
        
        alert('登录成功！')
        // 跳转到首页
        navigate('/')
      } else {
        alert('用户名或密码错误！\n提示：admin/123456')
      }
    } catch (error) {
      alert('登录失败，请重试')
    } finally {
      setLoading(false)
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
              disabled={loading}
              className="w-full"
            >
              {loading ? '登录中...' : '登录'}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default Login