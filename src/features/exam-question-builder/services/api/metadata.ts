/**
 * 元数据 API 服务
 * 
 * 提供获取题型、课程联动、知识点、课程标准、难度等级、分类等元数据的 API 接口
 */

import apiClient, { handleApiCall } from './client'
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
} from '../../types/metadata'
import { METADATA_API } from './endpoints'

/**
 * 获取题型列表
 * @returns Promise<QuestionTypeOption[]> 题型选项列表
 */
export async function fetchQuestionTypes(): Promise<QuestionTypeOption[]> {
  return handleApiCall(async () => {
    const response = await apiClient.get<QuestionTypeOption[]>(METADATA_API.questionTypes)
    return response.data
  })
}

/**
 * 获取课程列表
 * @returns Promise<Course[]> 课程列表
 */
export async function fetchCourses(): Promise<Course[]> {
  return handleApiCall(async () => {
    const response = await apiClient.get<Course[]>(METADATA_API.courses)
    return response.data
  })
}

/**
 * 获取年级列表
 * @param courseId 课程 ID
 * @returns Promise<Grade[]> 年级列表
 */
export async function fetchGrades(courseId: string): Promise<Grade[]> {
  return handleApiCall(async () => {
    const response = await apiClient.get<Grade[]>(METADATA_API.grades, {
      params: { courseId }
    })
    return response.data
  })
}

/**
 * 获取学期列表
 * @param gradeId 年级 ID
 * @returns Promise<Semester[]> 学期列表
 */
export async function fetchSemesters(gradeId: string): Promise<Semester[]> {
  return handleApiCall(async () => {
    const response = await apiClient.get<Semester[]>(METADATA_API.semesters, {
      params: { gradeId }
    })
    return response.data
  })
}

/**
 * 获取章节列表
 * @param semesterId 学期 ID
 * @returns Promise<Unit[]> 章节列表
 */
export async function fetchUnits(semesterId: string): Promise<Unit[]> {
  return handleApiCall(async () => {
    const response = await apiClient.get<Unit[]>(METADATA_API.units, {
      params: { semesterId }
    })
    return response.data
  })
}

/**
 * 获取知识点树形数据
 * @param filter 筛选条件（可选）
 * @returns Promise<KnowledgePoint[]> 知识点树形列表
 */
export async function fetchKnowledgePoints(filter?: KnowledgePointFilter): Promise<KnowledgePoint[]> {
  return handleApiCall(async () => {
    const response = await apiClient.get<KnowledgePoint[]>(METADATA_API.knowledgePoints, {
      params: filter
    })
    return response.data
  })
}

/**
 * 获取课程标准列表
 * @returns Promise<CourseStandard[]> 课程标准列表
 */
export async function fetchCourseStandards(): Promise<CourseStandard[]> {
  return handleApiCall(async () => {
    const response = await apiClient.get<CourseStandard[]>(METADATA_API.courseStandards)
    return response.data
  })
}

/**
 * 获取难度等级列表
 * @returns Promise<DifficultyLevel[]> 难度等级列表
 */
export async function fetchDifficultyLevels(): Promise<DifficultyLevel[]> {
  return handleApiCall(async () => {
    const response = await apiClient.get<DifficultyLevel[]>(METADATA_API.difficultyLevels)
    return response.data
  })
}

/**
 * 获取分类树形数据
 * @returns Promise<Category[]> 分类树形列表
 */
export async function fetchCategories(): Promise<Category[]> {
  return handleApiCall(async () => {
    const response = await apiClient.get<Category[]>(METADATA_API.categories)
    return response.data
  })
}

/**
 * 将后端返回的扁平数据转换为树形结构
 * @param rawNodes 后端返回的原始数据
 * @returns 转换后的树形数据
 */
function convertRawDataToTreeData(rawNodes: ApiRawNode[]): ApiTreeNode[] {
  // 过滤掉已删除的数据
  const validNodes = rawNodes.filter(node => node.flag === 'NORMAL' && !node.deleteTime)
  
  // 创建节点映射
  const nodeMap = new Map<string, ApiTreeNode>()
  
  // 转换数据格式
  validNodes.forEach(rawNode => {
    const treeNode: ApiTreeNode = {
      key: rawNode.id,
      title: rawNode.name,
      type: rawNode.type === 1 ? 'CHAPTER' : 'KNOWLEDGE',
      path: rawNode.path,
      isLeaf: true, // 先设为 true，后面有子节点时会更新
      selectable: true, // 默认可选择
      children: []
    }
    nodeMap.set(rawNode.id, treeNode)
  })
  
  // 构建树形结构
  const rootNodes: ApiTreeNode[] = []
  
  validNodes.forEach(rawNode => {
    const treeNode = nodeMap.get(rawNode.id)
    if (!treeNode) return
    
    if (rawNode.parentId && nodeMap.has(rawNode.parentId)) {
      // 有父节点，添加到父节点的 children 中
      const parentNode = nodeMap.get(rawNode.parentId)!
      if (!parentNode.children) {
        parentNode.children = []
      }
      parentNode.children.push(treeNode)
      parentNode.isLeaf = false // 有子节点，不是叶子节点
      parentNode.selectable = false // 有子节点的通常不可选择
    } else {
      // 没有父节点，是根节点
      rootNodes.push(treeNode)
    }
  })
  
  // 按 orderColumn 排序
  const sortNodes = (nodes: ApiTreeNode[]) => {
    nodes.sort((a, b) => {
      const aRaw = validNodes.find(n => n.id === a.key)
      const bRaw = validNodes.find(n => n.id === b.key)
      return (aRaw?.orderColumn || 0) - (bRaw?.orderColumn || 0)
    })
    
    nodes.forEach(node => {
      if (node.children && node.children.length > 0) {
        sortNodes(node.children)
      }
    })
  }
  
  sortNodes(rootNodes)
  return rootNodes
}
/**
 * 获取章节树形数据
 * @param courseId 课程 ID（可选）
 * @param gradeId 年级 ID（可选）
 * @returns Promise<ApiTreeNode[]> 章节树形列表
 */
export async function fetchChapters(courseId?: string, gradeId?: string): Promise<ApiTreeNode[]> {
  return handleApiCall(async () => {
    const response = await apiClient.get<ApiRawNode[]>(METADATA_API.chapters, {
      params: { courseId, gradeId }
    })
    return convertRawDataToTreeData(response.data)
  })
}

/**
 * 获取知识点树形数据
 * @param courseId 课程 ID（可选）
 * @param gradeId 年级 ID（可选）
 * @returns Promise<ApiTreeNode[]> 知识点树形列表
 */
export async function fetchKnowledgeTree(courseId?: string, gradeId?: string): Promise<ApiTreeNode[]> {
  return handleApiCall(async () => {
    const response = await apiClient.get<ApiRawNode[]>(METADATA_API.knowledgeTree, {
      params: { courseId, gradeId }
    })
    return convertRawDataToTreeData(response.data)
  })
}

/**
 * 获取解题方法树形数据
 * @param courseId 课程 ID（可选）
 * @param gradeId 年级 ID（可选）
 * @returns Promise<ApiTreeNode[]> 解题方法树形列表
 */
export async function fetchSolutionMethods(courseId?: string, gradeId?: string): Promise<ApiTreeNode[]> {
  return handleApiCall(async () => {
    const response = await apiClient.get<ApiRawNode[]>(METADATA_API.solutionMethods, {
      params: { courseId, gradeId }
    })
    return convertRawDataToTreeData(response.data)
  })
}

// 定义 API 树形节点接口
export interface ApiTreeNode {
  key: string
  title: string
  type: 'CHAPTER' | 'KNOWLEDGE'
  path: string
  isLeaf: boolean
  selectable: boolean
  children?: ApiTreeNode[]
}

// 定义后端返回的原始数据接口
export interface ApiRawNode {
  id: string
  name: string
  description?: string
  path: string
  level: number
  type: number
  phaseId: string
  subjectId: string
  parentId?: string
  orderColumn: number
  flag: string
  knowledgePaths?: string
  createBy?: string
  createTime: string
  updateBy?: string
  updateTime: string
  deleteTime?: string
  deleteBy?: string
}
