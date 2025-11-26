# HTTP模块文档

## 📁 文件结构

```
packages/shared/src/http/
├── api.ts          # 核心API服务类
├── http-hooks.ts   # React-Query hooks
├── api-hooks.ts    # 业务API hooks
├── index.ts        # 统一导出
├── env.d.ts        # 环境变量类型声明
└── README.md       # 本文档
```

## 🚀 快速开始

### 1. 基础用法

```typescript
import { useApiGet, useApiPost, useApiPut, useApiDelete } from '@fusion/shared'

// GET查询
const { data: users, isLoading } = useApiGet('/users')

// POST创建
const createUser = useApiPost('/users')
createUser.mutate({ name: 'John', email: 'john@example.com' })

// PUT更新
const updateUser = useApiPut('/users/123')
updateUser.mutate({ name: 'John Updated' })

// DELETE删除
const deleteUser = useApiDelete('/users/123')
deleteUser.mutate()
```

### 2. 统一请求方法

```typescript
import { useApiMutation } from '@fusion/shared'

// 使用统一方法
const userOperation = useApiMutation('POST', '/users')
userOperation.mutate({ name: 'John' })
```

### 3. 分页查询

```typescript
import { useApiPagination } from '@fusion/shared'

const { data: articles, isLoading, fetchNextPage } = useApiPagination('/articles', {
  page: 1,
  pageSize: 20,
  category: 'tech'
})
```

### 4. 条件查询

```typescript
import { useConditionalQuery } from '@fusion/shared'

const { data: user } = useConditionalQuery(
  !!userId,           // 条件
  'GET',             // 方法
  `/users/${userId}` // URL
)
```

### 5. 认证相关

```typescript
import { 
  useLogin, 
  useLogout, 
  useCurrentUser, 
  useAuthStatus 
} from '@fusion/shared'

// 登录
const login = useLogin({
  onSuccess: (data) => {
    console.log('登录成功', data.data.user)
  },
  onError: (error) => {
    console.error('登录失败', error)
  }
})
login.mutate({ username: 'admin', password: 'password' })

// 登出
const logout = useLogout({
  redirectUrl: '/login' // 自定义跳转地址
})
logout.mutate()

// 获取当前用户
const { data: currentUser, isLoading } = useCurrentUser()

// 认证状态检查
const { isAuthenticated, user, isLoading } = useAuthStatus()
```

### 6. 文件上传

```typescript
import { useFileUpload } from '@fusion/shared'

const uploadAvatar = useFileUpload('/upload/avatar')
uploadAvatar.mutate(file)
```

## 📋 业务API Hooks

### 认证管理

```typescript
import { 
  useLogin, 
  useLogout, 
  useCurrentUser, 
  useRefreshToken,
  useAuthStatus,
  useConditionalCurrentUser
} from '@fusion/shared'

// 登录
const login = useLogin({
  onSuccess: (data) => {
    // 登录成功后的处理
  }
})

// 登出
const logout = useLogout({
  redirectUrl: '/custom-login'
})

// 当前用户信息
const { data: currentUser, isLoading } = useCurrentUser()

// 刷新token
const refreshToken = useRefreshToken()

// 认证状态
const { isAuthenticated, user, token } = useAuthStatus()

// 条件性用户查询
const { data: user } = useConditionalCurrentUser(isAuthenticated)
```

### 用户管理

```typescript
import { 
  useUsers, 
  useUser, 
  useCreateUser, 
  useUpdateUser, 
  useDeleteUser 
} from '@fusion/shared'

// 获取用户列表
const { data: users } = useUsers({ page: 1, pageSize: 10 })

// 获取单个用户
const { data: user } = useUser('123')

// 创建用户
const createUser = useCreateUser()
createUser.mutate({ name: 'John' })

// 更新用户
const updateUser = useUpdateUser('123')
updateUser.mutate({ name: 'John Updated' })

// 删除用户
const deleteUser = useDeleteUser('123')
deleteUser.mutate()
```

### 文章管理

```typescript
import {
  useArticles,
  useArticle,
  useCreateArticle,
  useUpdateArticle,
  useDeleteArticle,
  usePublishArticle
} from '@fusion/shared'

// 获取文章列表
const { data: articles } = useArticles({ 
  page: 1, 
  pageSize: 20, 
  status: 'published' 
})

// 发布文章
const publishArticle = usePublishArticle('123')
publishArticle.mutate()
```

## ⚙️ 配置选项

### 查询选项

```typescript
const { data } = useApiGet('/users', {}, {
  staleTime: 5 * 60 * 1000,     // 5分钟
  enabled: true,                // 是否启用
  retry: 3,                     // 重试次数
  onSuccess: (data) => console.log(data),
  onError: (error) => console.error(error)
})
```

### 变更选项

```typescript
const createUser = useApiPost('/users', {
  onSuccess: (data, variables) => {
    console.log('用户创建成功', data)
  },
  onError: (error) => {
    console.error('创建失败', error)
  },
  invalidateQueries: ['get', 'pagination'] // 自动刷新的查询
})
```

## 🔧 高级用法

### 自定义查询键

```typescript
import { useQueryClient } from '@tanstack/react-query'

const queryClient = useQueryClient()

// 手动刷新查询
queryClient.invalidateQueries({ queryKey: ['get', '/users'] })

// 预设查询数据
queryClient.setQueryData(['get', '/users/123'], userData)
```

### 批量操作

```typescript
import { useBatchOperation } from '@fusion/shared'

const batchOperation = useBatchOperation()
batchOperation.mutate([
  { method: 'POST', url: '/users', data: { name: 'User1' } },
  { method: 'POST', url: '/users', data: { name: 'User2' } }
])
```

### 动态API调用

```typescript
import { useDynamicApi } from '@fusion/shared'

const dynamicRequest = useDynamicApi('GET', '/custom-endpoint')
dynamicRequest.mutate(params)
```

## 🛡️ 错误处理

所有API调用都包含统一的错误处理：

- 401错误：自动清除认证信息并跳转登录页
- 网络错误：自动重试（可配置）
- 业务错误：通过response.data.message获取错误信息

```typescript
const createUser = useApiPost('/users', {
  onError: (error) => {
    if (error.response?.status === 401) {
      // 处理认证错误
    } else if (error.response?.status === 400) {
      // 处理业务错误
      console.error(error.response.data.message)
    }
  }
})
```

## 🌍 环境配置

通过环境变量配置API基础URL：

```bash
# .env
VITE_API_BASE_URL=https://api.example.com
```

## 📝 类型定义

```typescript
// API响应格式
interface ApiAuthResponse<T> {
  code: number
  data: T
  message: string
}

// 分页参数
interface PaginationParams {
  page?: number
  pageSize?: number
}

// HTTP方法
type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
```

## 🔄 缓存策略

- **查询数据**：默认5分钟过期
- **分页数据**：默认2分钟过期
- **变更操作**：自动刷新相关查询
- **条件查询**：根据条件动态启用/禁用

## 📊 性能优化

- 使用React-Query的缓存机制减少重复请求
- 分页查询保持上一页数据提升用户体验
- 自动失效相关查询确保数据一致性
- 支持预加载和后台更新