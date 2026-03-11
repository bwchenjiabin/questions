/**
 * API 响应类型定义
 * 
 * 定义与后端 API 交互的响应数据结构
 */

/**
 * 标准 API 响应格式
 * @template T 响应数据的类型
 */
export interface ApiResponse<T> {
  /** 响应状态码 */
  code: number
  /** 响应消息 */
  message: string
  /** 响应数据 */
  data: T
}

/**
 * 分页响应格式
 * @template T 列表项的类型
 */
export interface PaginatedResponse<T> {
  /** 数据项列表 */
  items: T[]
  /** 总记录数 */
  total: number
  /** 当前页码 */
  page: number
  /** 每页大小 */
  pageSize: number
}

/**
 * API 错误类型枚举
 */
export enum ApiErrorType {
  /** 网络错误 */
  NetworkError = 'NETWORK_ERROR',
  /** 未授权 */
  Unauthorized = 'UNAUTHORIZED',
  /** 禁止访问 */
  Forbidden = 'FORBIDDEN',
  /** 资源未找到 */
  NotFound = 'NOT_FOUND',
  /** 验证错误 */
  ValidationError = 'VALIDATION_ERROR',
  /** 服务器错误 */
  ServerError = 'SERVER_ERROR',
  /** 未知错误 */
  Unknown = 'UNKNOWN'
}

/**
 * API 错误信息
 */
export interface ApiError {
  /** 错误类型 */
  type: ApiErrorType
  /** 错误消息 */
  message: string
  /** 错误详情（可选） */
  details?: any
}
