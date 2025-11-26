# Mock API 使用指南

## 🚀 快速开始

Web应用已启用Mock API模式，无需后端服务器即可测试完整的前端功能。

## 📋 测试账号

| 用户名 | 密码 | 角色 | 说明 |
|--------|------|------|------|
| admin | 123456 | admin | 管理员账号 |
| user | 123456 | user | 普通用户账号 |
| test | 123456 | user | 测试用户账号 |

## 🔧 功能特性

### ✅ 已实现的Mock功能

1. **用户认证**
   - 登录/登出
   - Token生成和验证
   - 用户信息获取
   - Token刷新

2. **用户管理**
   - 获取用户列表
   - 获取单个用户
   - 创建用户
   - 更新用户
   - 删除用户

3. **数据持久化**
   - Mock数据存储在内存中
   - 登录状态保存在localStorage
   - 刷新页面后登录状态保持

## 🎮 使用方法

### 1. 登录测试

访问 `http://localhost:5173/login` 使用测试账号登录：

```typescript
// 示例：使用管理员账号登录
username: admin
password: 123456
```

### 2. API测试

访问 `http://localhost:5173/mock-test` 查看Mock API测试页面

### 3. 编程方式调用

```typescript
import { useLogin, useUsers } from '@fusion/shared'

// 登录
const login = useLogin()
login.mutate({ username: 'admin', password: '123456' })

// 获取用户列表
const { data: users } = useUsers()
```

## ⚙️ 配置选项

### 环境变量

在 `apps/web/.env.development` 中配置：

```bash
# 启用Mock API（默认true）
VITE_ENABLE_MOCK=true

# 真实API地址（mock关闭时使用）
VITE_API_BASE_URL=http://localhost:3001/api
```

### 切换到真实API

1. 设置环境变量：`VITE_ENABLE_MOCK=false`
2. 启动后端服务器
3. 重启前端应用

## 🔄 Mock vs 真实API

| 功能 | Mock | 真实API |
|------|------|---------|
| 登录验证 | ✅ | ✅ |
| Token管理 | ✅ | ✅ |
| 用户CRUD | ✅ | ✅ |
| 数据持久化 | ❌（内存） | ✅（数据库） |
| 网络延迟 | ✅（模拟） | ✅（真实） |
| 错误处理 | ✅ | ✅ |

## 🛠️ 开发指南

### 添加新的Mock API

1. 在 `packages/shared/src/http/mock-api.ts` 中添加方法：

```typescript
async getArticles(): Promise<ApiAuthResponse<Article[]>> {
  await this.delay(600)
  return {
    code: 200,
    data: mockArticles,
    message: '获取文章列表成功'
  }
}
```

2. 在 `api.ts` 中添加Mock支持：

```typescript
async getArticles(): Promise<ApiAuthResponse<Article[]>> {
  if (isMockMode()) {
    return mockApiService.getArticles()
  }
  const response = await this.client.get('/articles')
  return response.data
}
```

### 自定义Mock数据

修改 `mock-api.ts` 中的数据：

```typescript
const mockUsers = [
  {
    id: 1,
    username: 'custom_user',
    password: 'custom_pass',
    name: '自定义用户',
    role: 'admin'
  }
]
```

## 🔍 调试技巧

### 1. 查看网络请求

打开浏览器开发者工具 -> Network 标签页，可以看到：
- Mock请求不会发送真实网络请求
- 响应数据格式与真实API一致

### 2. 检查Token状态

在控制台中运行：

```javascript
// 查看当前token
localStorage.getItem('token')

// 查看用户信息
localStorage.getItem('user')
```

### 3. 模拟错误场景

修改 `mock-api.ts` 中的响应：

```typescript
// 模拟登录失败
if (credentials.username === 'error') {
  return {
    code: 500,
    data: null,
    message: '服务器内部错误'
  }
}
```

## 📝 注意事项

1. **数据不持久化**：Mock数据存储在内存中，刷新后重置
2. **Token格式**：Mock Token是base64编码的JSON，不是真实的JWT
3. **并发请求**：Mock API支持并发，但数据可能不一致
4. **文件上传**：Mock模式下的文件上传只是模拟，不会真实上传

## 🚀 部署说明

生产环境部署时：

1. 确保 `VITE_ENABLE_MOCK=false`
2. 配置正确的 `VITE_API_BASE_URL`
3. 移除或注释掉Mock相关的测试页面

## 🆘 故障排除

### 问题：登录后页面没有反应

**解决方案**：
1. 检查浏览器控制台是否有错误
2. 确认用户名密码正确
3. 清除localStorage后重试

### 问题：API请求失败

**解决方案**：
1. 确认 `VITE_ENABLE_MOCK=true`
2. 检查网络请求是否被拦截
3. 重启开发服务器

### 问题：Token过期

**解决方案**：
1. Mock Token有效期为24小时
2. 过期后需要重新登录
3. 可以修改代码延长有效期