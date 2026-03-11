# API 服务层

本目录包含与后端 API 交互的所有服务模块。

## 文件结构

```
api/
├── client.ts       # API 客户端基础配置（axios 实例、拦截器、错误处理）
├── metadata.ts     # 元数据 API 服务（题型、课程、知识点等）
├── question.ts     # 题目 API 服务（CRUD 操作）
└── README.md       # 本文档
```

## API 客户端 (client.ts)

### 功能

- 提供配置好的 axios 实例
- 自动添加认证 token（从 localStorage 读取）
- 统一的请求/响应拦截器
- 统一的错误处理和转换
- 错误日志记录

### 使用方法

#### 1. 直接使用 axios 实例

```typescript
import apiClient from '@/features/exam-question-builder/services/api/client'

// GET 请求
const response = await apiClient.get('/questions')

// POST 请求
const response = await apiClient.post('/questions', {
  type: 'single',
  stem: '题干内容'
})

// PUT 请求
const response = await apiClient.put('/questions/123', {
  stem: '更新后的题干'
})

// DELETE 请求
const response = await apiClient.delete('/questions/123')
```

#### 2. 使用 handleApiCall 包装器（推荐）

`handleApiCall` 提供额外的错误处理和日志记录：

```typescript
import { handleApiCall } from '@/features/exam-question-builder/services/api/client'
import apiClient from '@/features/exam-question-builder/services/api/client'

// 包装 API 调用
const questions = await handleApiCall(async () => {
  return await apiClient.get('/questions')
})

// 处理错误
try {
  const result = await handleApiCall(async () => {
    return await apiClient.post('/questions', questionData)
  })
  console.log('保存成功', result)
} catch (error) {
  // error 是 ApiError 类型
  console.error('保存失败', error.type, error.message)
}
```

### 错误处理

所有 API 错误都会被转换为统一的 `ApiError` 格式：

```typescript
interface ApiError {
  type: ApiErrorType
  message: string
  details?: any
}

enum ApiErrorType {
  NetworkError = 'NETWORK_ERROR',      // 网络连接失败
  Unauthorized = 'UNAUTHORIZED',        // 未授权（401）
  Forbidden = 'FORBIDDEN',              // 禁止访问（403）
  NotFound = 'NOT_FOUND',               // 资源未找到（404）
  ValidationError = 'VALIDATION_ERROR', // 验证错误（422）
  ServerError = 'SERVER_ERROR',         // 服务器错误（500+）
  Unknown = 'UNKNOWN'                   // 未知错误
}
```

### 配置

#### 环境变量

在 `.env` 文件中配置 API 基础 URL：

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

如果未配置，默认使用 `/api`。

#### 认证 Token

API 客户端会自动从 `localStorage` 读取 `auth_token` 并添加到请求头：

```typescript
// 登录后保存 token
localStorage.setItem('auth_token', 'your-jwt-token')

// 登出时清除 token
localStorage.removeItem('auth_token')
```

### 响应拦截器

响应拦截器会自动处理标准的 `ApiResponse` 格式：

```typescript
// 后端返回
{
  code: 200,
  message: "success",
  data: { id: 1, name: "题目" }
}

// 拦截器自动提取 data 字段
// 你的代码中直接得到
{ id: 1, name: "题目" }
```

### 测试

API 客户端包含完整的单元测试，覆盖：

- 成功的 API 调用
- 各种 HTTP 错误状态码（401, 403, 404, 422, 500 等）
- 网络错误
- 未知错误

运行测试：

```bash
npm test -- src/features/exam-question-builder/__tests__/api-client.test.ts
```

## 最佳实践

1. **使用 handleApiCall 包装器**：提供更好的错误处理和日志记录
2. **类型安全**：为 API 响应定义 TypeScript 类型
3. **错误处理**：始终使用 try-catch 处理 API 调用
4. **避免重复代码**：将常用的 API 调用封装为独立的服务函数

## 示例：创建服务函数

```typescript
// services/api/question.ts
import { handleApiCall } from './client'
import apiClient from './client'
import { Question } from '../../types/question'

export async function fetchQuestion(id: string): Promise<Question> {
  return handleApiCall(async () => {
    return await apiClient.get<Question>(`/questions/${id}`)
  })
}

export async function saveQuestion(question: Question): Promise<Question> {
  return handleApiCall(async () => {
    return await apiClient.post<Question>('/questions', question)
  })
}
```

