/**
 * 统一的接口地址占位配置。
 *
 * 当前项目还没有接入真实后端，所以这里先使用假的域名和假的路径。
 * 后续只需要替换这里的 baseURL 或各接口路径即可。
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://192.168.5.116:8080/jeecg-boot'

export const QUESTION_API = {
  list: '/v1/questions',
  detail: (id: string) => `/v1/questions/${id}`,
  create: '/v1/questions',
  update: (id: string) => `/v1/questions/${id}`,
  remove: (id: string) => `/v1/questions/${id}`
} as const

export const METADATA_API = {
  questionTypes: '/v1/metadata/question-types',
  courses: '/v1/metadata/courses',//版本
  grades: '/v1/metadata/grades',//年级
  semesters: '/v1/metadata/semesters',//学期
  units: '/v1/metadata/units',//章节
  knowledgePoints: '/v1/metadata/knowledge-points',//知识点树形数据
  courseStandards: '/v1/metadata/course-standards',//课程标准
  difficultyLevels: '/v1/metadata/difficulty-levels',//难度等级 
  categories: '/v1/metadata/categories',//分类
  chapters: '/exam/qbExamTextBook/queryByType?id=1',//章节树形数据
  knowledgeTree: '/exam/qbExamTextBook/queryByType?id=1',//知识点树形数据
  solutionMethods: '/exam/qbExamTextBook/queryByType?id=2'//解题方法树形数据（使用知识点接口）
} as const
