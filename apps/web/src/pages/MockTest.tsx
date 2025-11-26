import React from 'react'
import { useAuthStatus } from '@fusion/shared'
import { Button } from '@fusion/ui/Button'

const MockTest: React.FC = () => {
  const { isAuthenticated, user, token } = useAuthStatus()

  const handleTestLogin = async () => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'admin',
          password: '123456'
        })
      })
      const data = await response.json()
      console.log('Login response:', data)
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Mock API 测试页面</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">认证状态</h2>
        <div className="space-y-2">
          <p><strong>已登录:</strong> {isAuthenticated ? '是' : '否'}</p>
          <p><strong>用户信息:</strong> {user ? JSON.stringify(user, null, 2) : '无'}</p>
          <p><strong>Token:</strong> {token || '无'}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">测试账号</h2>
        <div className="space-y-2 text-sm">
          <p><strong>管理员:</strong> admin / 123456</p>
          <p><strong>普通用户:</strong> user / 123456</p>
          <p><strong>测试用户:</strong> test / 123456</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">快速测试</h2>
        <Button onClick={handleTestLogin} className="mb-4">
          测试登录 (admin/123456)
        </Button>
        <p className="text-sm text-gray-600">
          点击按钮测试mock登录功能，查看浏览器控制台的响应结果
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <h3 className="font-semibold text-blue-800 mb-2">Mock模式说明</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• 当前已启用Mock API模式</li>
          <li>• 所有API请求都会被拦截并返回模拟数据</li>
          <li>• 登录后会生成模拟的JWT token</li>
          <li>• 用户数据存储在localStorage中</li>
          <li>• 可以通过环境变量 VITE_ENABLE_MOCK 控制开关</li>
        </ul>
      </div>
    </div>
  )
}

export default MockTest