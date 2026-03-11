/**
 * 题目 API 服务
 * 
 * 提供题目的增删改查 API 接口
 */

import apiClient, { handleApiCall } from './client'
import type { Question } from '../../types/question'
import type { PaginatedResponse } from '../../types/api'
import { QUESTION_API } from './endpoints'

/**
 * 题目列表查询参数
 */
export interface QuestionListParams {
  /** 页码 */
  page?: number
  /** 每页大小 */
  pageSize?: number
  /** 题型筛选 */
  type?: string
  /** 难度筛选 */
  difficulty?: string
  /** 知识点筛选 */
  knowledgePoint?: string
  /** 课程筛选 */
  courseId?: string
  /** 分类筛选 */
  category?: string
  /** 搜索关键词 */
  keyword?: string
}

/**
 * 获取单个题目详情
 * @param id 题目 ID
 * @returns Promise<Question> 题目详情
 */
export async function fetchQuestion(id: string): Promise<Question> {
  return handleApiCall(async () => {
    const response = await apiClient.get<Question>(QUESTION_API.detail(id))
    return response.data
  })
}

/**
 * 获取题目列表
 * @param params 查询参数
 * @returns Promise<PaginatedResponse<Question>> 分页的题目列表
 */
export async function fetchQuestionList(params?: QuestionListParams): Promise<PaginatedResponse<Question>> {
  return handleApiCall(async () => {
    const response = await apiClient.get<PaginatedResponse<Question>>(QUESTION_API.list, {
      params
    })
    return response.data
  })
}

/**
 * 保存新题目
 * @param question 题目数据
 * @returns Promise<Question> 保存后的题目（包含生成的 ID）
 */
export async function saveQuestion(question: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>): Promise<Question> {
  return handleApiCall(async () => {
    const response = await apiClient.post<Question>(QUESTION_API.create, question)
    return response.data
  })
}

/**
 * 更新题目
 * @param id 题目 ID
 * @param data 要更新的题目数据
 * @returns Promise<Question> 更新后的题目
 */
export async function updateQuestion(id: string, data: Partial<Question>): Promise<Question> {
  return handleApiCall(async () => {
    const response = await apiClient.put<Question>(QUESTION_API.update(id), data)
    return response.data
  })
}

/**
 * 删除题目
 * @param id 题目 ID
 * @returns Promise<void>
 */
export async function deleteQuestion(id: string): Promise<void> {
  return handleApiCall(async () => {
    await apiClient.delete(QUESTION_API.remove(id))
  })
}
