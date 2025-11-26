// ===== API服务 =====
export { apiService } from './api'
export type {
  ApiAuthResponse,
  LoginRequest,
  LoginResponse,
  PaginationParams,
  ApiError,
  RequestMethod
} from './api'

// ===== 认证Hooks =====
export {
  // 基础认证Hooks
  useLogin,
  useLogout,
  useCurrentUser,
  useRefreshToken,
  
  // 高级认证Hooks
  useConditionalCurrentUser,
  useAutoRefreshToken,
  useAuthStatus,
  
  // 类型
  type AuthHookOptions,
  type LogoutOptions,
  type CurrentUserOptions
} from './auth-hooks'

// ===== React-Query Hooks =====
export {
  // 核心Hooks
  useApiQuery,
  useApiMutation,
  
  // 便捷Hooks
  useApiGet,
  useApiPost,
  useApiPut,
  useApiDelete,
  useApiPatch,
  useApiPagination,
  
  // 高级Hooks
  useDynamicApi,
  useBatchOperation,
  useConditionalQuery,
  useFileUpload,
  useInfiniteQuery,
  
  // 类型
  type QueryHookOptions,
  type MutationHookOptions
} from './http-hooks'

// ===== 业务API Hooks =====
export {
  // 用户管理
  useUsers,
  useUser,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useUserOperation,
  
  // 文章管理
  useArticles,
  useArticle,
  useCreateArticle,
  useUpdateArticle,
  usePublishArticle,
  useDeleteArticle,
  useArticleOperation,
  
  // 评论管理
  useComments,
  useAddComment,
  useDeleteComment,
  
  // 文件上传
  useUploadAvatar,
  useUploadArticleImage,
  
  // 系统设置
  useSystemSettings,
  useUpdateSystemSettings,
  
  // 统计数据
  useDashboardStats,
  useUserStats,
  useArticleStats,
  
  // 高级用法
  useUserIfLoggedIn
} from './api-hooks'

// ===== 工具函数 =====
export { createApiUrl } from './api'