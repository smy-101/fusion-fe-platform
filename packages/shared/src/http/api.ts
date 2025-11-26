import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { mockApiService, isMockMode } from './mock-api'

// ===== 类型定义 =====

export interface ApiAuthResponse<T = any> {
  code: number
  data: T
  message: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    id: number
    username: string
    name: string
    role: string
  }
}

export interface PaginationParams {
  page?: number
  pageSize?: number
}

export interface ApiError {
  code: number
  message: string
  details?: any
}

export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

// ===== API服务类 =====

class ApiService {
  private client: AxiosInstance
  private static instance: ApiService

  constructor() {
    this.client = axios.create({
      baseURL: this.getApiBaseUrl(),
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  // 单例模式
  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService()
    }
    return ApiService.instance
  }

  private setupInterceptors() {
    // 请求拦截器 - 添加JWT token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getToken()
        if (token) {
          config.headers = config.headers || {}
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error: any) => {
        return Promise.reject(error)
      }
    )

    // 响应拦截器 - 处理token过期和统一错误处理
    this.client.interceptors.response.use(
      (response: AxiosResponse<ApiAuthResponse>) => {
        return response
      },
      (error: any) => {
        this.handleError(error)
        return Promise.reject(error)
      }
    )
  }

  private getToken(): string | null {
    try {
      return localStorage.getItem('token')
    } catch {
      return null
    }
  }

  private getApiBaseUrl(): string {
    try {
      return (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || 'http://localhost:3001/api'
    } catch {
      return 'http://localhost:3001/api'
    }
  }

  private clearAuthData(): void {
    try {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    } catch {
      // 忽略localStorage错误
    }
  }

  private handleError(error: any): void {
    if (error.response?.status === 401) {
      this.clearAuthData()
      // 避免在服务端渲染时调用window
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
  }

  // ===== 认证相关方法 =====

  async login(credentials: LoginRequest): Promise<ApiAuthResponse<LoginResponse>> {
    if (isMockMode()) {
      return mockApiService.login(credentials)
    }
    const response = await this.client.post('/auth/login', credentials)
    return response.data
  }

  async logout(): Promise<ApiAuthResponse> {
    if (isMockMode()) {
      return mockApiService.logout()
    }
    const response = await this.client.post('/auth/logout')
    return response.data
  }

  async getCurrentUser(): Promise<ApiAuthResponse<LoginResponse['user']>> {
    if (isMockMode()) {
      return mockApiService.getCurrentUser()
    }
    const response = await this.client.get('/auth/me')
    return response.data
  }

  async refreshToken(): Promise<ApiAuthResponse<{ token: string }>> {
    if (isMockMode()) {
      return mockApiService.refreshToken()
    }
    const response = await this.client.post('/auth/refresh')
    return response.data
  }

  // ===== HTTP方法 =====

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiAuthResponse<T>> {
    if (isMockMode()) {
      return mockApiService.get<T>(url)
    }
    const response = await this.client.get(url, config)
    return response.data
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiAuthResponse<T>> {
    if (isMockMode()) {
      return mockApiService.post<T>(url, data)
    }
    const response = await this.client.post(url, data, config)
    return response.data
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiAuthResponse<T>> {
    if (isMockMode()) {
      return mockApiService.put<T>(url, data)
    }
    const response = await this.client.put(url, data, config)
    return response.data
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiAuthResponse<T>> {
    if (isMockMode()) {
      return mockApiService.post<T>(url, data) // Mock中使用POST代替PATCH
    }
    const response = await this.client.patch(url, data, config)
    return response.data
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiAuthResponse<T>> {
    if (isMockMode()) {
      return mockApiService.delete<T>(url)
    }
    const response = await this.client.delete(url, config)
    return response.data
  }

  // ===== 统一请求方法 =====

  async request<T = any>(
    method: RequestMethod,
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiAuthResponse<T>> {
    const requestConfig: AxiosRequestConfig = {
      ...config,
      url,
      method,
    }

    if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
      requestConfig.data = data
    }

    const response = await this.client.request(requestConfig)
    return response.data
  }

  // ===== 文件上传 =====

  async upload<T = any>(url: string, file: File, config?: AxiosRequestConfig): Promise<ApiAuthResponse<T>> {
    const formData = new FormData()
    formData.append('file', file)

    const uploadConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    }

    const response = await this.client.post(url, formData, uploadConfig)
    return response.data
  }

  // ===== 批量操作 =====

  async batch<T = any>(operations: Array<{
    method: RequestMethod
    url: string
    data?: any
  }>): Promise<ApiAuthResponse<T[]>> {
    const response = await this.client.post('/batch', { operations })
    return response.data
  }
}

// ===== 导出 =====

export const apiService = ApiService.getInstance()
export default apiService

// 导出工具函数
export const createApiUrl = (base: string, path: string, params?: Record<string, any>): string => {
  const url = new URL(path, base)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value))
      }
    })
  }
  return url.toString()
}