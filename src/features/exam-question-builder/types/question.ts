/**
 * 题型枚举
 */
export type QuestionType = 'single' | 'multiple' | 'fillBlank' | 'judgement' | 'essay' | 'composite'

/**
 * 选项接口（用于单选题和多选题）
 */
export interface Option {
  label: string
  content: string
}

/**
 * 填空答案接口
 */
export interface BlankAnswer {
  index: number
  acceptedAnswers: string[]
  description?: string
}

/**
 * 子题接口（用于组合题）
 */
export interface SubQuestion {
  id: string
  order: number
  type: QuestionType
  data: QuestionData
}

/**
 * 题目数据基础接口
 */
export interface QuestionData {
  type: QuestionType
  stem: string
  answer: AnswerData
  analysis?: string
  scoringCriteria?: string
}

/**
 * 答案数据类型（联合类型）
 */
export type AnswerData =
  | SingleChoiceAnswer
  | MultipleChoiceAnswer
  | FillBlankAnswer
  | JudgementAnswer
  | EssayAnswer
  | CompositeAnswer

/**
 * 单选题数据接口
 */
export interface SingleChoiceData extends QuestionData {
  type: 'single'
  options: Option[]
  answer: SingleChoiceAnswer
}

/**
 * 单选题答案接口
 */
export interface SingleChoiceAnswer {
  correctOption: string
}

/**
 * 多选题数据接口
 */
export interface MultipleChoiceData extends QuestionData {
  type: 'multiple'
  options: Option[]
  answer: MultipleChoiceAnswer
}

/**
 * 多选题答案接口
 */
export interface MultipleChoiceAnswer {
  correctOptions: string[]
}

/**
 * 填空题数据接口
 */
export interface FillBlankData extends QuestionData {
  type: 'fillBlank'
  answer: FillBlankAnswer
}

/**
 * 填空题答案接口
 */
export interface FillBlankAnswer {
  blanks: BlankAnswer[]
  allowUnorderedAnswer?: boolean
}

/**
 * 判断题数据接口
 */
export interface JudgementData extends QuestionData {
  type: 'judgement'
  answer: JudgementAnswer
}

/**
 * 判断题答案接口
 */
export interface JudgementAnswer {
  correct: boolean
}

/**
 * 问答题数据接口
 */
export interface EssayData extends QuestionData {
  type: 'essay'
  answer: EssayAnswer
}

/**
 * 问答题答案接口
 */
export interface EssayAnswer {
  referenceAnswer: string
}

/**
 * 组合题数据接口
 */
export interface CompositeData extends QuestionData {
  type: 'composite'
  mainStem: string
  subQuestions: SubQuestion[]
  answer: CompositeAnswer
}

/**
 * 组合题答案接口（组合题的答案由子题的答案组成）
 */
export interface CompositeAnswer {
  subAnswers: AnswerData[]
}

/**
 * 完整题目接口
 */
export interface Question {
  id: string
  title?: string
  code?: string
  type: QuestionType
  courseLinkage: CourseLinkageValue
  knowledgePoints: string[]
  courseStandards: string[]
  difficulty: DifficultyConfig
  category: string
  categories?: string[]
  solutionMethods?: string[]
  data: QuestionData
  analysis?: string
  scoringCriteria?: string
  createdAt: string | Date
  updatedAt: string | Date
  createdBy: string
  status?: string
}

/**
 * 新建 / 更新题目时使用的载荷
 */
export type QuestionPayload = Omit<Question, 'id' | 'createdAt' | 'updatedAt'>

/**
 * 课程联动值接口（从 metadata.ts 导入，这里先定义以避免循环依赖）
 */
export interface CourseLinkageValue {
  courseId?: string
  gradeId?: string
  semesterId?: string
  unitId?: string
}

/**
 * 难度配置接口（从 metadata.ts 导入，这里先定义以避免循环依赖）
 */
export interface DifficultyConfig {
  level: 'easy' | 'medium' | 'hard'
  method?: string
}
