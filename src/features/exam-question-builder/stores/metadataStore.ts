/**
 * 元数据状态管理 Store
 * 
 * 管理题型、课程联动、知识点、课程标准、难度等级、分类等元数据
 * 实现缓存机制，避免重复请求
 */

import { defineStore } from 'pinia'
import type {
  QuestionTypeOption,
  Course,
  Grade,
  Semester,
  Unit,
  KnowledgePoint,
  CourseStandard,
  DifficultyLevel,
  Category,
  KnowledgePointFilter
} from '../types/metadata'
import {
  fetchQuestionTypes as apiFetchQuestionTypes,
  fetchCourses as apiFetchCourses,
  fetchGrades as apiFetchGrades,
  fetchSemesters as apiFetchSemesters,
  fetchUnits as apiFetchUnits,
  fetchKnowledgePoints as apiFetchKnowledgePoints,
  fetchCourseStandards as apiFetchCourseStandards,
  fetchDifficultyLevels as apiFetchDifficultyLevels,
  fetchCategories as apiFetchCategories
} from '../services/api/metadata'

/**
 * 元数据 Store 状态接口
 */
interface MetadataState {
  /** 题型列表 */
  questionTypes: QuestionTypeOption[]
  /** 课程列表 */
  courses: Course[]
  /** 年级列表（按课程 ID 缓存） */
  grades: Record<string, Grade[]>
  /** 学期列表（按年级 ID 缓存） */
  semesters: Record<string, Semester[]>
  /** 单元列表（按学期 ID 缓存） */
  units: Record<string, Unit[]>
  /** 知识点列表（按筛选条件缓存） */
  knowledgePoints: Record<string, KnowledgePoint[]>
  /** 课程标准列表 */
  courseStandards: CourseStandard[]
  /** 难度等级列表 */
  difficultyLevels: DifficultyLevel[]
  /** 分类列表 */
  categories: Category[]
  /** 加载状态 */
  loading: Record<string, boolean>
  /** 错误信息 */
  error: string | null
}

/**
 * 元数据 Store
 */
export const useMetadataStore = defineStore('metadata', {
  state: (): MetadataState => ({
    questionTypes: [],
    courses: [],
    grades: {},
    semesters: {},
    units: {},
    knowledgePoints: {},
    courseStandards: [],
    difficultyLevels: [],
    categories: [],
    loading: {},
    error: null
  }),

  getters: {
    /**
     * 获取指定课程的年级列表
     * @param state Store 状态
     * @returns 返回一个函数，接收课程 ID，返回年级列表
     */
    getGradesByCourse: (state) => {
      return (courseId: string): Grade[] => {
        return state.grades[courseId] || []
      }
    },

    /**
     * 获取指定年级的学期列表
     * @param state Store 状态
     * @returns 返回一个函数，接收年级 ID，返回学期列表
     */
    getSemestersByGrade: (state) => {
      return (gradeId: string): Semester[] => {
        return state.semesters[gradeId] || []
      }
    },

    /**
     * 获取指定学期的单元列表
     * @param state Store 状态
     * @returns 返回一个函数，接收学期 ID，返回单元列表
     */
    getUnitsBySemester: (state) => {
      return (semesterId: string): Unit[] => {
        return state.units[semesterId] || []
      }
    },

    /**
     * 检查指定资源是否正在加载
     * @param state Store 状态
     * @returns 返回一个函数，接收资源键，返回加载状态
     */
    isLoading: (state) => {
      return (key: string): boolean => {
        return state.loading[key] || false
      }
    }
  },

  actions: {
    /**
     * 设置加载状态
     * @param key 资源键
     * @param value 加载状态
     */
    setLoading(key: string, value: boolean): void {
      this.loading[key] = value
    },

    /**
     * 获取题型列表
     * 实现缓存：如果已有数据，直接返回，不重复请求
     */
    async fetchQuestionTypes(): Promise<void> {
      // 如果已有缓存数据，直接返回
      if (this.questionTypes.length > 0) {
        return
      }

      const loadingKey = 'questionTypes'
      this.setLoading(loadingKey, true)
      this.error = null

      try {
        this.questionTypes = await apiFetchQuestionTypes()
      } catch (err) {
        this.error = err instanceof Error ? err.message : '获取题型列表失败'
        throw err
      } finally {
        this.setLoading(loadingKey, false)
      }
    },

    /**
     * 获取课程列表
     * 实现缓存：如果已有数据，直接返回，不重复请求
     */
    async fetchCourses(): Promise<void> {
      // 如果已有缓存数据，直接返回
      if (this.courses.length > 0) {
        return
      }

      const loadingKey = 'courses'
      this.setLoading(loadingKey, true)
      this.error = null

      try {
        this.courses = await apiFetchCourses()
      } catch (err) {
        this.error = err instanceof Error ? err.message : '获取课程列表失败'
        throw err
      } finally {
        this.setLoading(loadingKey, false)
      }
    },

    /**
     * 获取年级列表
     * 实现缓存：按课程 ID 缓存，如果已有数据，直接返回，不重复请求
     * @param courseId 课程 ID
     */
    async fetchGrades(courseId: string): Promise<void> {
      // 如果已有缓存数据，直接返回
      if (this.grades[courseId]) {
        return
      }

      const loadingKey = `grades-${courseId}`
      this.setLoading(loadingKey, true)
      this.error = null

      try {
        const grades = await apiFetchGrades(courseId)
        this.grades[courseId] = grades
      } catch (err) {
        this.error = err instanceof Error ? err.message : '获取年级列表失败'
        throw err
      } finally {
        this.setLoading(loadingKey, false)
      }
    },

    /**
     * 获取学期列表
     * 实现缓存：按年级 ID 缓存，如果已有数据，直接返回，不重复请求
     * @param gradeId 年级 ID
     */
    async fetchSemesters(gradeId: string): Promise<void> {
      // 如果已有缓存数据，直接返回
      if (this.semesters[gradeId]) {
        return
      }

      const loadingKey = `semesters-${gradeId}`
      this.setLoading(loadingKey, true)
      this.error = null

      try {
        const semesters = await apiFetchSemesters(gradeId)
        this.semesters[gradeId] = semesters
      } catch (err) {
        this.error = err instanceof Error ? err.message : '获取学期列表失败'
        throw err
      } finally {
        this.setLoading(loadingKey, false)
      }
    },

    /**
     * 获取单元列表
     * 实现缓存：按学期 ID 缓存，如果已有数据，直接返回，不重复请求
     * @param semesterId 学期 ID
     */
    async fetchUnits(semesterId: string): Promise<void> {
      // 如果已有缓存数据，直接返回
      if (this.units[semesterId]) {
        return
      }

      const loadingKey = `units-${semesterId}`
      this.setLoading(loadingKey, true)
      this.error = null

      try {
        const units = await apiFetchUnits(semesterId)
        this.units[semesterId] = units
      } catch (err) {
        this.error = err instanceof Error ? err.message : '获取单元列表失败'
        throw err
      } finally {
        this.setLoading(loadingKey, false)
      }
    },

    /**
     * 获取知识点树形数据
     * 实现缓存：按筛选条件缓存，如果已有数据，直接返回，不重复请求
     * @param filter 筛选条件（可选）
     */
    async fetchKnowledgePoints(filter?: KnowledgePointFilter): Promise<void> {
      // 生成缓存键（基于筛选条件）
      const cacheKey = filter ? JSON.stringify(filter) : 'default'
      
      // 如果已有缓存数据，直接返回
      if (this.knowledgePoints[cacheKey]) {
        return
      }

      const loadingKey = `knowledgePoints-${cacheKey}`
      this.setLoading(loadingKey, true)
      this.error = null

      try {
        const knowledgePoints = await apiFetchKnowledgePoints(filter)
        this.knowledgePoints[cacheKey] = knowledgePoints
      } catch (err) {
        this.error = err instanceof Error ? err.message : '获取知识点列表失败'
        throw err
      } finally {
        this.setLoading(loadingKey, false)
      }
    },

    /**
     * 获取课程标准列表
     * 实现缓存：如果已有数据，直接返回，不重复请求
     */
    async fetchCourseStandards(): Promise<void> {
      // 如果已有缓存数据，直接返回
      if (this.courseStandards.length > 0) {
        return
      }

      const loadingKey = 'courseStandards'
      this.setLoading(loadingKey, true)
      this.error = null

      try {
        this.courseStandards = await apiFetchCourseStandards()
      } catch (err) {
        this.error = err instanceof Error ? err.message : '获取课程标准列表失败'
        throw err
      } finally {
        this.setLoading(loadingKey, false)
      }
    },

    /**
     * 获取难度等级列表
     * 实现缓存：如果已有数据，直接返回，不重复请求
     */
    async fetchDifficultyLevels(): Promise<void> {
      // 如果已有缓存数据，直接返回
      if (this.difficultyLevels.length > 0) {
        return
      }

      const loadingKey = 'difficultyLevels'
      this.setLoading(loadingKey, true)
      this.error = null

      try {
        this.difficultyLevels = await apiFetchDifficultyLevels()
      } catch (err) {
        this.error = err instanceof Error ? err.message : '获取难度等级列表失败'
        throw err
      } finally {
        this.setLoading(loadingKey, false)
      }
    },

    /**
     * 获取分类树形数据
     * 实现缓存：如果已有数据，直接返回，不重复请求
     */
    async fetchCategories(): Promise<void> {
      // 如果已有缓存数据，直接返回
      if (this.categories.length > 0) {
        return
      }

      const loadingKey = 'categories'
      this.setLoading(loadingKey, true)
      this.error = null

      try {
        this.categories = await apiFetchCategories()
      } catch (err) {
        this.error = err instanceof Error ? err.message : '获取分类列表失败'
        throw err
      } finally {
        this.setLoading(loadingKey, false)
      }
    },

    /**
     * 清空错误信息
     */
    clearError(): void {
      this.error = null
    },

    /**
     * 清空所有缓存数据（用于强制刷新）
     */
    clearCache(): void {
      this.questionTypes = []
      this.courses = []
      this.grades = {}
      this.semesters = {}
      this.units = {}
      this.knowledgePoints = {}
      this.courseStandards = []
      this.difficultyLevels = []
      this.categories = []
      this.loading = {}
      this.error = null
    },

    /**
     * 清空指定课程的年级缓存
     * @param courseId 课程 ID
     */
    clearGradesCache(courseId: string): void {
      delete this.grades[courseId]
    },

    /**
     * 清空指定年级的学期缓存
     * @param gradeId 年级 ID
     */
    clearSemestersCache(gradeId: string): void {
      delete this.semesters[gradeId]
    },

    /**
     * 清空指定学期的单元缓存
     * @param semesterId 学期 ID
     */
    clearUnitsCache(semesterId: string): void {
      delete this.units[semesterId]
    }
  }
})
