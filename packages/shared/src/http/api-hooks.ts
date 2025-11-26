import { 
  useApiGet, 
  useApiPost, 
  useApiPut, 
  useApiDelete,
  useApiPagination, 
  useApiMutation,
  useConditionalQuery
} from './http-hooks'

// ===== 用户管理模块 =====

export const useUsers = (params?: { page?: number; pageSize?: number; search?: string }) => {
  return useApiPagination('/users', params)
}

export const useUser = (id: string, options?: { enabled?: boolean }) => {
  return useConditionalQuery(!!id, 'GET', `/users/${id}`, undefined, {
    enabled: options?.enabled && !!id
  })
}

export const useCreateUser = () => {
  return useApiPost('/users')
}

export const useUpdateUser = (id: string) => {
  return useApiPut(`/users/${id}`)
}

export const useDeleteUser = (id: string) => {
  return useApiDelete(`/users/${id}`)
}

// 统一的用户操作hook
export const useUserOperation = (method: 'GET' | 'POST' | 'PUT' | 'DELETE', userId?: string) => {
  const url = userId ? `/users/${userId}` : '/users'
  return useApiMutation(method, url)
}

// ===== 文章管理模块 =====

export const useArticles = (params?: { 
  page?: number; 
  pageSize?: number; 
  category?: string; 
  status?: 'draft' | 'published' 
}) => {
  return useApiPagination('/articles', params)
}

export const useArticle = (id: string, options?: { enabled?: boolean }) => {
  return useConditionalQuery(!!id, 'GET', `/articles/${id}`, undefined, {
    enabled: options?.enabled && !!id
  })
}

export const useCreateArticle = () => {
  return useApiPost('/articles')
}

export const useUpdateArticle = (id: string) => {
  return useApiPut(`/articles/${id}`)
}

export const usePublishArticle = (id: string) => {
  return useApiPost(`/articles/${id}/publish`)
}

export const useDeleteArticle = (id: string) => {
  return useApiDelete(`/articles/${id}`)
}

// 统一的文章操作hook
export const useArticleOperation = (method: 'GET' | 'POST' | 'PUT' | 'DELETE', articleId?: string) => {
  const url = articleId ? `/articles/${articleId}` : '/articles'
  return useApiMutation(method, url)
}

// ===== 评论管理模块 =====

export const useComments = (articleId: string, params?: { page?: number; pageSize?: number }) => {
  return useApiPagination(`/articles/${articleId}/comments`, params)
}

export const useAddComment = (articleId: string) => {
  return useApiPost(`/articles/${articleId}/comments`)
}

export const useDeleteComment = (articleId: string, commentId: string) => {
  return useApiDelete(`/articles/${articleId}/comments/${commentId}`)
}

// ===== 文件上传模块 =====

export const useUploadAvatar = () => {
  return useApiPost('/upload/avatar')
}

export const useUploadArticleImage = () => {
  return useApiPost('/upload/article-image')
}

// ===== 系统设置模块 =====

export const useSystemSettings = () => {
  return useApiGet('/system/settings')
}

export const useUpdateSystemSettings = () => {
  return useApiPut('/system/settings')
}

// ===== 统计数据模块 =====

export const useDashboardStats = () => {
  return useApiGet('/dashboard/stats')
}

export const useUserStats = (params?: { startDate?: string; endDate?: string }) => {
  return useApiGet('/stats/users', params)
}

export const useArticleStats = (params?: { startDate?: string; endDate?: string }) => {
  return useApiGet('/stats/articles', params)
}

// ===== 高级用法示例 =====

// 条件查询示例
export const useUserIfLoggedIn = (userId?: string) => {
  return useConditionalQuery(!!userId, 'GET', `/users/${userId}`)
}