import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query'
import { apiService, RequestMethod, ApiAuthResponse, PaginationParams } from './api'

// ===== 类型定义 =====

export interface QueryHookOptions<T = any> extends Omit<UseQueryOptions<ApiAuthResponse<T>>, 'queryKey' | 'queryFn'> {
  invalidateOnSuccess?: string[]
}

export interface MutationHookOptions<T = any, V = any> extends UseMutationOptions<ApiAuthResponse<T>, Error, V> {
  invalidateQueries?: string[]
  onSuccess?: (data: ApiAuthResponse<T>, variables: V, context: unknown) => void | Promise<void>
}

// ===== 工具函数 =====

const createQueryKey = (method: RequestMethod, url: string, data?: any): string[] => {
  return [method.toLowerCase(), url, data].filter(Boolean) as string[]
}

const createPaginationQueryKey = (url: string, params?: PaginationParams & Record<string, any>): string[] => {
  return ['pagination', url, params].filter(Boolean) as string[]
}

const handleInvalidateQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
  queryKeys: string[] = ['get', 'pagination']
) => {
  queryKeys.forEach(key => {
    queryClient.invalidateQueries({ queryKey: [key] })
  })
}

// ===== 核心统一Hooks =====

/**
 * 统一的查询hook - 支持所有HTTP方法的查询
 */
export const useApiQuery = <T = any>(
  method: RequestMethod,
  url: string,
  data?: any,
  options?: QueryHookOptions<T>
) => {
  return useQuery({
    queryKey: createQueryKey(method, url, data),
    queryFn: () => apiService.request<T>(method, url, data),
    staleTime: 5 * 60 * 1000, // 5分钟
    ...options,
  })
}

/**
 * 统一的变更hook - 支持所有HTTP方法的变更
 */
export const useApiMutation = <T = any, V = any>(
  method: RequestMethod,
  url: string,
  options?: MutationHookOptions<T, V>
) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (variables: V) => {
      if (method === 'GET') {
        return apiService.request<T>(method, url, undefined)
      } else {
        return apiService.request<T>(method, url, variables)
      }
    },
    onSuccess: (data, variables, context) => {
      // 自动刷新相关查询
      const queriesToInvalidate = options?.invalidateQueries || ['get', 'pagination']
      handleInvalidateQueries(queryClient, queriesToInvalidate)
      
      // 调用用户自定义的onSuccess
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

// ===== 便捷专用Hooks =====

/**
 * GET查询hook
 */
export const useApiGet = <T = any>(
  url: string,
  params?: Record<string, any>,
  options?: QueryHookOptions<T>
) => {
  return useQuery({
    queryKey: ['get', url, params],
    queryFn: () => apiService.get<T>(url, { params }),
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}

/**
 * 分页查询hook
 */
export const useApiPagination = <T = any>(
  url: string,
  params?: PaginationParams & Record<string, any>,
  options?: QueryHookOptions<T>
) => {
  return useQuery({
    queryKey: createPaginationQueryKey(url, params),
    queryFn: () => apiService.get<T>(url, { params }),
    staleTime: 2 * 60 * 1000, // 分页数据2分钟过期
    placeholderData: (previousData) => previousData, // 保持上一页数据，提供更好的用户体验
    ...options,
  })
}

/**
 * POST变更hook
 */
export const useApiPost = <T = any, V = any>(
  url: string,
  options?: MutationHookOptions<T, V>
) => {
  return useApiMutation<T, V>('POST', url, options)
}

/**
 * PUT变更hook
 */
export const useApiPut = <T = any, V = any>(
  url: string,
  options?: MutationHookOptions<T, V>
) => {
  return useApiMutation<T, V>('PUT', url, options)
}

/**
 * DELETE变更hook
 */
export const useApiDelete = <T = any>(
  url: string,
  options?: MutationHookOptions<T, void>
) => {
  return useApiMutation<T, void>('DELETE', url, options)
}

/**
 * PATCH变更hook
 */
export const useApiPatch = <T = any, V = any>(
  url: string,
  options?: MutationHookOptions<T, V>
) => {
  return useApiMutation<T, V>('PATCH', url, options)
}

// ===== 高级用法Hooks =====

/**
 * 动态API调用hook
 */
export const useDynamicApi = <T = any, V = any>(
  method: RequestMethod,
  url: string,
  options?: MutationHookOptions<T, V>
) => {
  return useApiMutation<T, V>(method, url, options)
}

/**
 * 批量操作hook
 */
export const useBatchOperation = <T = any, V = any>(
  url: string = '/batch',
  options?: MutationHookOptions<T, V>
) => {
  return useApiMutation<T, V>('POST', url, {
    invalidateQueries: ['get', 'pagination'],
    ...options,
  })
}

/**
 * 条件查询hook
 */
export const useConditionalQuery = <T = any>(
  condition: boolean,
  method: RequestMethod,
  url: string,
  data?: any,
  options?: QueryHookOptions<T>
) => {
  return useApiQuery<T>(method, url, data, {
    ...options,
    enabled: condition && (options?.enabled ?? true),
  })
}

/**
 * 文件上传hook
 */
export const useFileUpload = <T = any>(
  url: string,
  options?: MutationHookOptions<T, File>
) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (file: File) => apiService.upload<T>(url, file),
    onSuccess: (data, variables, context) => {
      handleInvalidateQueries(queryClient, ['get'])
      options?.onSuccess?.(data, variables, context)
    },
    ...options,
  })
}

/**
 * 无限滚动查询hook
 */
export const useInfiniteQuery = <T = any>(
  url: string,
  params?: Record<string, any>,
  options?: Omit<UseQueryOptions<ApiAuthResponse<T>>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: ['infinite', url, params],
    queryFn: () => apiService.get<T>(url, { params }),
    staleTime: 5 * 60 * 1000,
    ...options,
  })
}