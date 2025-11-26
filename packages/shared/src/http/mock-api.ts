import { ApiAuthResponse, LoginRequest, LoginResponse } from './api'

// ===== Mock数据 =====

const mockUsers = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    name: '管理员',
    role: 'admin'
  },
  {
    id: 2,
    username: 'user',
    password: '123456',
    name: '普通用户',
    role: 'user'
  },
  {
    id: 3,
    username: 'test',
    password: '123456',
    name: '测试用户',
    role: 'user'
  }
]

// ===== Mock API服务 =====

export class MockApiService {
  private static instance: MockApiService

  static getInstance(): MockApiService {
    if (!MockApiService.instance) {
      MockApiService.instance = new MockApiService()
    }
    return MockApiService.instance
  }

  // 模拟网络延迟
  private delay(ms: number = 1000): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // 生成mock token
  private generateToken(user: { id: number; username: string }): string {
    return btoa(JSON.stringify({
      id: user.id,
      username: user.username,
      exp: Date.now() + 24 * 60 * 60 * 1000 // 24小时过期
    }))
  }

  // 登录
  async login(credentials: LoginRequest): Promise<ApiAuthResponse<LoginResponse>> {
    await this.delay(800) // 模拟网络延迟

    const user = mockUsers.find(
      u => u.username === credentials.username && u.password === credentials.password
    )

    if (user) {
      const token = this.generateToken(user)
      const { password, ...userWithoutPassword } = user

      return {
        code: 200,
        data: {
          token,
          user: userWithoutPassword
        },
        message: '登录成功'
      }
    } else {
      return {
        code: 401,
        data: null as any,
        message: '用户名或密码错误'
      }
    }
  }

  // 登出
  async logout(): Promise<ApiAuthResponse> {
    await this.delay(300)
    return {
      code: 200,
      data: null,
      message: '登出成功'
    }
  }

  // 获取当前用户信息
  async getCurrentUser(): Promise<ApiAuthResponse<LoginResponse['user']>> {
    await this.delay(500)

    const token = this.getToken()
    if (!token) {
      return {
        code: 401,
        data: null as any,
        message: '未登录'
      }
    }

    try {
      const decoded = JSON.parse(atob(token))
      if (decoded.exp < Date.now()) {
        return {
          code: 401,
          data: null as any,
          message: 'Token已过期'
        }
      }

      const user = mockUsers.find(u => u.id === decoded.id)
      if (user) {
        const { password, ...userWithoutPassword } = user
        return {
          code: 200,
          data: userWithoutPassword,
          message: '获取用户信息成功'
        }
      }

      return {
        code: 404,
        data: null as any,
        message: '用户不存在'
      }
    } catch {
      return {
        code: 401,
        data: null as any,
        message: 'Token无效'
      }
    }
  }

  // 刷新token
  async refreshToken(): Promise<ApiAuthResponse<{ token: string }>> {
    await this.delay(400)

    const token = this.getToken()
    if (!token) {
      return {
        code: 401,
        data: null as any,
        message: '未登录'
      }
    }

    try {
      const decoded = JSON.parse(atob(token))
      const user = mockUsers.find(u => u.id === decoded.id)
      
      if (user) {
        const newToken = this.generateToken(user)
        return {
          code: 200,
          data: { token: newToken },
          message: 'Token刷新成功'
        }
      }

      return {
        code: 404,
        data: null as any,
        message: '用户不存在'
      }
    } catch {
      return {
        code: 401,
        data: null as any,
        message: 'Token无效'
      }
    }
  }

  // 获取token
  private getToken(): string | null {
    try {
      return localStorage.getItem('token')
    } catch {
      return null
    }
  }

  // ===== 通用API方法（用于其他API的mock） =====

  async get<T = any>(url: string): Promise<ApiAuthResponse<T>> {
    await this.delay(600)
    
    // 根据URL返回不同的mock数据
    if (url === '/users') {
      const users = mockUsers.map(({ password, ...user }) => user)
      return {
        code: 200,
        data: users as T,
        message: '获取用户列表成功'
      }
    }

    if (url.startsWith('/users/')) {
      const id = parseInt(url.split('/')[2])
      const user = mockUsers.find(u => u.id === id)
      if (user) {
        const { password, ...userWithoutPassword } = user
        return {
          code: 200,
          data: userWithoutPassword as T,
          message: '获取用户信息成功'
        }
      }
    }

    return {
      code: 404,
      data: null as any,
      message: 'API未找到'
    }
  }

  async post<T = any>(url: string, data?: any): Promise<ApiAuthResponse<T>> {
    await this.delay(800)
    
    // 处理不同的POST请求
    if (url === '/users') {
      const newUser = {
        id: mockUsers.length + 1,
        ...data,
        role: 'user'
      }
      mockUsers.push(newUser)
      const { password, ...userWithoutPassword } = newUser
      return {
        code: 200,
        data: userWithoutPassword as T,
        message: '用户创建成功'
      }
    }

    return {
      code: 200,
      data: data as T,
      message: '操作成功'
    }
  }

  async put<T = any>(url: string, data?: any): Promise<ApiAuthResponse<T>> {
    await this.delay(700)
    
    if (url.startsWith('/users/')) {
      const id = parseInt(url.split('/')[2])
      const userIndex = mockUsers.findIndex(u => u.id === id)
      if (userIndex !== -1) {
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...data }
        const { password, ...userWithoutPassword } = mockUsers[userIndex]
        return {
          code: 200,
          data: userWithoutPassword as T,
          message: '用户更新成功'
        }
      }
    }

    return {
      code: 404,
      data: null as any,
      message: '资源未找到'
    }
  }

  async delete<T = any>(url: string): Promise<ApiAuthResponse<T>> {
    await this.delay(500)
    
    if (url.startsWith('/users/')) {
      const id = parseInt(url.split('/')[2])
      const userIndex = mockUsers.findIndex(u => u.id === id)
      if (userIndex !== -1) {
        mockUsers.splice(userIndex, 1)
        return {
          code: 200,
          data: null as T,
          message: '用户删除成功'
        }
      }
    }

    return {
      code: 404,
      data: null as any,
      message: '资源未找到'
    }
  }
}

// 导出mock服务实例
export const mockApiService = MockApiService.getInstance()

// 工具函数：检查是否启用mock模式
export const isMockMode = (): boolean => {
  return import.meta.env.VITE_ENABLE_MOCK === 'true' || 
         import.meta.env.NODE_ENV === 'development'
}