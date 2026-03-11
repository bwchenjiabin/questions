/**
 * 元数据类型定义
 * 包含课程联动、知识点、标签、难度配置等相关类型
 */

/**
 * 课程联动值
 * 用于课程、年级、学期、单元的级联选择
 */
export interface CourseLinkageValue {
  courseId?: string
  gradeId?: string
  semesterId?: string
  unitId?: string
}

/**
 * 知识点
 * 树形结构的知识点数据
 */
export interface KnowledgePoint {
  id: string
  name: string
  parentId?: string
  children?: KnowledgePoint[]
}

/**
 * 标签
 * 用于显示已选的知识点或课程标准
 */
export interface Tag {
  id: string
  label: string
  type: 'knowledgePoint' | 'courseStandard'
  color?: string
}

/**
 * 难度配置
 * 包含难度等级和难度方法
 */
export interface DifficultyConfig {
  level: 'easy' | 'medium' | 'hard'
  method?: string
}

/**
 * 课程
 */
export interface Course {
  id: string
  name: string
}

/**
 * 年级
 */
export interface Grade {
  id: string
  name: string
  courseId: string
}

/**
 * 学期
 */
export interface Semester {
  id: string
  name: string
  gradeId: string
}

/**
 * 单元
 */
export interface Unit {
  id: string
  name: string
  semesterId: string
}

/**
 * 课程标准
 */
export interface CourseStandard {
  id: string
  name: string
  description?: string
}

/**
 * 难度等级选项
 */
export interface DifficultyLevel {
  id: string
  name: string
  value: 'easy' | 'medium' | 'hard'
}

/**
 * 分类
 */
export interface Category {
  id: string
  name: string
  parentId?: string
  children?: Category[]
}

/**
 * 题型选项
 */
export interface QuestionTypeOption {
  id: string
  name: string
  value: 'single' | 'multiple' | 'fillBlank' | 'judgement' | 'essay' | 'composite'
}

/**
 * 知识点筛选条件
 */
export interface KnowledgePointFilter {
  textbookId?: string
  courseId?: string
  gradeId?: string
  keyword?: string
}
