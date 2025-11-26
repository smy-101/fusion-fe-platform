import { useMutation, useQuery, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query'
import { apiService, LoginRequest, LoginResponse, ApiAuthResponse } from './api'

// ===== 类型定义 =====

export interface AuthHookOptions extends Omit<UseMutationOptions<ApiAuthResponse<LoginResponse>, Error, LoginRequest>, 'onSuccess' | 'onError'> {
  onSuccess?: (data: ApiAuthResponse<LoginResponse>, variables: LoginRequest, context: unknown) => void | Promise<void>
  onError?: (error: Error, variables: LoginRequest, context: unknown) => void | Promise<void>
}

export interface LogoutOptions extends Omit<UseMutationOptions<ApiAuthResponse, Error, void>, 'onSuccess' | 'onError'> {
  redirectUrl?: string
  onSuccess?: (data: ApiAuthResponse, variables: void, context: unknown) => void | Promise<void>
  onError?: (error: Error, variables: void, context: unknown) => void | Promise<void>
}

export interface CurrentUserOptions extends Omit<UseQueryOptions<ApiAuthResponse<LoginResponse['user']>>, 'queryKey' | 'queryFn'> {
  enabled?: boolean
}

// ===== 工具函数 =====

const setAuthData = (data: LoginResponse): void => {
  try {
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
  } catch (error) {
    console.error('Failed to save auth data:', error)
  }
}

const clearAuthData = (): void => {
  try {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  } catch (error) {
    console.error('Failed to clear auth data:', error)
  }
}

const redirectToLogin = (url: string = '/login'): void => {
  if (typeof window !== 'undefined') {
    window.location.href = url
  }
}

// ===== 认证Hooks =====

/**
 * 登录hook
 */
export const useLogin = (options?: AuthHookOptions) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: LoginRequest) => apiService.login(credentials),
    onSuccess: (data, variables, context) => {
      if (data.code === 200 && data.data) {
        setAuthData(data.data)
        
        // 设置用户信息到query cache
        queryClient.setQueryData(['currentUser'], data.data.user)
      }
      
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
    onError: (error, variables, context) => {
      console.error('登录失败:', error)
      if (options?.onError) {
        options.onError(error, variables, context)
      }
    },
    ...options,
  })
}

/**
 * 登出hook
 */
export const useLogout = (options?: LogoutOptions) => {
  const queryClient = useQueryClient()
  const redirectUrl = options?.redirectUrl || '/login'

  return useMutation({
    mutationFn: () => apiService.logout(),
    onSuccess: (data, variables, context) => {
      clearAuthData()
      
      // 清除query cache
      queryClient.clear()
      
      // 跳转到登录页
      redirectToLogin(redirectUrl)
      
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
    onError: (error, variables, context) => {
      console.error('登出失败:', error)
      
      // 即使API调用失败，也要清除本地数据
      clearAuthData()
      queryClient.clear()
      redirectToLogin(redirectUrl)
      
      if (options?.onError) {
        options.onError(error, variables, context)
      }
    },
    ...options,
  })
}

/**
 * 获取当前用户信息hook
 */
export const useCurrentUser = (options?: CurrentUserOptions) => {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null
  
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => apiService.getCurrentUser(),
    enabled: !!token && (options?.enabled ?? true),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5分钟
    ...options,
  })
}

/**
 * 刷新token hook
 */
export const useRefreshToken = (options?: Omit<UseMutationOptions<ApiAuthResponse<{ token: string }>, Error, void>, 'onSuccess' | 'onError'> & {
  onSuccess?: (data: ApiAuthResponse<{ token: string }>, variables: void, context: unknown) => void | Promise<void>
  onError?: (error: Error, variables: void, context: unknown) => void | Promise<void>
}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => apiService.refreshToken(),
    onSuccess: (data, variables, context) => {
      if (data.code === 200 && data.data) {
        try {
          localStorage.setItem('token', data.data.token)
        } catch (error) {
          console.error('Failed to save refreshed token:', error)
        }
      }
      
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context)
      }
    },
    onError: (error, variables, context) => {
      console.error('刷新token失败:', error)
      
      // 刷新失败，清除本地数据并跳转登录
      clearAuthData()
      queryClient.clear()
      redirectToLogin()
      
      if (options?.onError) {
        options.onError(error, variables, context)
      }
    },
    ...options,
  })
}

// ===== 高级认证Hooks =====

/**
 * 条件性用户查询 - 只有在满足条件时才查询用户信息
 */
export const useConditionalCurrentUser = (
  condition: boolean,
  options?: CurrentUserOptions
) => {
  return useCurrentUser({
    ...options,
    enabled: condition && (options?.enabled ?? true)
  })
}

/**
 * 自动刷新token的hook - 在token即将过期时自动刷新
 */
export const useAutoRefreshToken = () => {
  const refreshToken = useRefreshToken()
  
  // 这里可以添加token过期检测逻辑
  // 例如：检查token的exp字段，或者在特定时间间隔后自动刷新
  
  return {
    refreshToken,
    isRefreshing: refreshToken.isPending
  }
}

/**
 * 认证状态检查hook
 */
export const useAuthStatus = () => {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null
  const { data: user, isLoading, error } = useCurrentUser({
    enabled: !!token
  })
  
  return {
    isAuthenticated: !!token && !!user,
    user: user?.data,
    isLoading,
    error,
    token
  }
}