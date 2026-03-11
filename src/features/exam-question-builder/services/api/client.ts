/**
 * API 客户端基础配置
 * 
 * 提供统一的 axios 实例配置、请求/响应拦截器和错误处理
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { ApiError, ApiErrorType, ApiResponse } from '../../types/api'
import { API_BASE_URL } from './endpoints'

/**
 * API 基础 URL
 * 可以通过环境变量配置
 */
const BASE_URL = API_BASE_URL

/**
 * 请求超时时间（毫秒）
 */
const TIMEOUT = 30000

/**
 * 创建 axios 实例
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
})

/**
 * 请求拦截器
 * 在请求发送前添加认证信息等
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 从 localStorage 或其他地方获取 token
    const token = localStorage.getItem('auth_token')
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 * 统一处理响应数据和错误
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any> | any>) => {
    // 处理后端标准响应格式 {success, message, code, result, timestamp}
    if (response.data && typeof response.data === 'object' && 'success' in response.data && 'result' in response.data) {
      // 如果请求成功，返回 result 字段的数据
      if (response.data.success) {
        response.data = response.data.result
      } else {
        // 如果请求失败，抛出错误
        throw new Error(response.data.message || '请求失败')
      }
    }

    return response
  },
  (error: AxiosError) => {
    // 将 axios 错误转换为 ApiError
    const apiError = parseApiError(error)
    return Promise.reject(apiError)
  }
)

/**
 * 解析 API 错误
 * 将 axios 错误转换为统一的 ApiError 格式
 */
function parseApiError(error: AxiosError): ApiError {
  // 网络错误（无响应）
  if (!error.response) {
    return {
      type: ApiErrorType.NetworkError,
      message: '网络连接失败，请检查网络设置',
      details: error.message
    }
  }

  const { status, data } = error.response

  // 根据 HTTP 状态码判断错误类型
  switch (status) {
    case 401:
      return {
        type: ApiErrorType.Unauthorized,
        message: '未授权，请重新登录',
        details: data
      }
    
    case 403:
      return {
        type: ApiErrorType.Forbidden,
        message: '没有权限访问该资源',
        details: data
      }
    
    case 404:
      return {
        type: ApiErrorType.NotFound,
        message: '请求的资源不存在',
        details: data
      }
    
    case 422:
      return {
        type: ApiErrorType.ValidationError,
        message: '数据验证失败',
        details: data
      }
    
    case 500:
    case 502:
    case 503:
    case 504:
      return {
        type: ApiErrorType.ServerError,
        message: '服务器错误，请稍后重试',
        details: data
      }
    
    default:
      return {
        type: ApiErrorType.Unknown,
        message: (data as any)?.message || '未知错误',
        details: data
      }
  }
}

/**
 * 统一的 API 调用处理函数
 * 包装 API 调用，提供统一的错误处理和日志记录
 * 
 * @template T API 返回数据的类型
 * @param apiCall API 调用函数
 * @returns Promise<T> 返回 API 数据
 * @throws ApiError 抛出统一格式的错误
 */
export async function handleApiCall<T>(apiCall: () => Promise<T>): Promise<T> {
  try {
    const result = await apiCall()
    return result
  } catch (error) {
    // 如果已经是 ApiError，直接抛出
    if (isApiError(error)) {
      logError(error)
      throw error
    }
    
    // 如果是 axios 错误，转换为 ApiError
    if (axios.isAxiosError(error)) {
      const apiError = parseApiError(error)
      logError(apiError)
      throw apiError
    }
    
    // 其他未知错误
    const unknownError: ApiError = {
      type: ApiErrorType.Unknown,
      message: '发生未知错误',
      details: error
    }
    logError(unknownError)
    throw unknownError
  }
}

/**
 * 判断是否为 ApiError
 */
function isApiError(error: any): error is ApiError {
  return error && typeof error === 'object' && 'type' in error && 'message' in error
}

/**
 * 记录错误日志
 * 在开发环境输出到控制台，生产环境可以发送到日志服务
 */
function logError(error: ApiError): void {
  if (import.meta.env.DEV) {
    console.error('[API Error]', {
      type: error.type,
      message: error.message,
      details: error.details,
      timestamp: new Date().toISOString()
    })
  }
  
  // 生产环境可以发送到日志服务
  // sendToLogService(error)
}

/**
 * 导出 axios 实例供其他模块使用
 */
export default apiClient

