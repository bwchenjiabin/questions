/**
 * 题目状态管理 Store
 * 
 * 管理题目的增删改查操作和编辑状态
 */

import { defineStore } from 'pinia'
import type { Question } from '../types/question'
import type { PaginatedResponse } from '../types/api'
import {
  fetchQuestion as apiFetchQuestion,
  fetchQuestionList as apiFetchQuestionList,
  saveQuestion as apiSaveQuestion,
  updateQuestion as apiUpdateQuestion,
  deleteQuestion as apiDeleteQuestion,
  type QuestionListParams
} from '../services/api/question'

/**
 * 题目 Store 状态接口
 */
interface QuestionState {
  /** 当前正在编辑的题目 */
  currentQuestion: Question | null
  /** 题目列表 */
  questionList: Question[]
  /** 列表总数 */
  total: number
  /** 当前页码 */
  currentPage: number
  /** 每页大小 */
  pageSize: number
  /** 加载状态 */
  loading: boolean
  /** 错误信息 */
  error: string | null
  /** 原始题目数据（用于检测是否有未保存的更改） */
  originalQuestion: Question | null
}

/**
 * 题目 Store
 */
export const useQuestionStore = defineStore('question', {
  state: (): QuestionState => ({
    currentQuestion: null,
    questionList: [],
    total: 0,
    currentPage: 1,
    pageSize: 10,
    loading: false,
    error: null,
    originalQuestion: null
  }),

  getters: {
    /**
     * 是否处于编辑模式
     * 当 currentQuestion 不为 null 且有 id 时，表示正在编辑已有题目
     */
    isEditing: (state): boolean => {
      return state.currentQuestion !== null && !!state.currentQuestion.id
    },

    /**
     * 是否有未保存的更改
     * 通过比较 currentQuestion 和 originalQuestion 来判断
     */
    hasUnsavedChanges: (state): boolean => {
      if (!state.currentQuestion) {
        return false
      }

      // 如果没有原始数据，说明是新建题目，只要有内容就算有更改
      if (!state.originalQuestion) {
        return true
      }

      // 比较当前数据和原始数据是否相同
      return JSON.stringify(state.currentQuestion) !== JSON.stringify(state.originalQuestion)
    }
  },

  actions: {
    /**
     * 获取单个题目详情
     * @param id 题目 ID
     */
    async fetchQuestion(id: string): Promise<void> {
      this.loading = true
      this.error = null

      try {
        const question = await apiFetchQuestion(id)
        this.currentQuestion = question
        // 保存原始数据的深拷贝，用于检测更改
        this.originalQuestion = JSON.parse(JSON.stringify(question))
      } catch (err) {
        this.error = err instanceof Error ? err.message : '获取题目失败'
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * 获取题目列表
     * @param params 查询参数
     */
    async fetchQuestionList(params?: QuestionListParams): Promise<void> {
      this.loading = true
      this.error = null

      try {
        const response: PaginatedResponse<Question> = await apiFetchQuestionList(params)
        this.questionList = response.items
        this.total = response.total
        this.currentPage = response.page
        this.pageSize = response.pageSize
      } catch (err) {
        this.error = err instanceof Error ? err.message : '获取题目列表失败'
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * 保存新题目
     * @param question 题目数据（不包含 id、createdAt、updatedAt）
     */
    async saveQuestion(question: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>): Promise<Question> {
      this.loading = true
      this.error = null

      try {
        const savedQuestion = await apiSaveQuestion(question)
        // 保存成功后，更新当前题目和原始题目
        this.currentQuestion = savedQuestion
        this.originalQuestion = JSON.parse(JSON.stringify(savedQuestion))
        
        // 如果列表中不存在该题目，添加到列表开头
        const existingIndex = this.questionList.findIndex(q => q.id === savedQuestion.id)
        if (existingIndex === -1) {
          this.questionList.unshift(savedQuestion)
          this.total += 1
        }

        return savedQuestion
      } catch (err) {
        this.error = err instanceof Error ? err.message : '保存题目失败'
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * 更新题目
     * @param id 题目 ID
     * @param data 要更新的题目数据
     */
    async updateQuestion(id: string, data: Partial<Question>): Promise<Question> {
      this.loading = true
      this.error = null

      try {
        const updatedQuestion = await apiUpdateQuestion(id, data)
        
        // 更新当前题目和原始题目
        this.currentQuestion = updatedQuestion
        this.originalQuestion = JSON.parse(JSON.stringify(updatedQuestion))
        
        // 更新列表中的题目
        const index = this.questionList.findIndex(q => q.id === id)
        if (index !== -1) {
          this.questionList[index] = updatedQuestion
        }

        return updatedQuestion
      } catch (err) {
        this.error = err instanceof Error ? err.message : '更新题目失败'
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * 删除题目
     * @param id 题目 ID
     */
    async deleteQuestion(id: string): Promise<void> {
      this.loading = true
      this.error = null

      try {
        await apiDeleteQuestion(id)
        
        // 从列表中移除该题目
        const index = this.questionList.findIndex(q => q.id === id)
        if (index !== -1) {
          this.questionList.splice(index, 1)
          this.total -= 1
        }

        // 如果删除的是当前正在编辑的题目，清空当前题目
        if (this.currentQuestion?.id === id) {
          this.currentQuestion = null
          this.originalQuestion = null
        }
      } catch (err) {
        this.error = err instanceof Error ? err.message : '删除题目失败'
        throw err
      } finally {
        this.loading = false
      }
    },

    /**
     * 设置当前题目（用于编辑）
     * @param question 题目数据
     */
    setCurrentQuestion(question: Question | null): void {
      this.currentQuestion = question
      this.originalQuestion = question ? JSON.parse(JSON.stringify(question)) : null
    },

    /**
     * 清空当前题目（用于取消编辑或创建新题目）
     */
    clearCurrentQuestion(): void {
      this.currentQuestion = null
      this.originalQuestion = null
    },

    /**
     * 清空错误信息
     */
    clearError(): void {
      this.error = null
    }
  }
})
