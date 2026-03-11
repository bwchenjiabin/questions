<template>
  <div class="question-list">
    <a-space direction="vertical" :size="12" style="width: 100%">
      <a-input-search
        v-model:value="searchKeyword"
        placeholder="搜索题干"
        allow-clear
        @search="handleSearch"
      />

      <a-space wrap style="width: 100%">
        <a-select
          v-model:value="filters.type"
          placeholder="题型"
          style="width: 110px"
          allow-clear
          @change="handleFilterChange"
        >
          <a-select-option value="single">单选</a-select-option>
          <a-select-option value="multiple">多选</a-select-option>
          <a-select-option value="fillBlank">填空</a-select-option>
          <a-select-option value="judgement">判断</a-select-option>
          <a-select-option value="essay">问答</a-select-option>
          <a-select-option value="composite">组合</a-select-option>
        </a-select>

        <a-select
          v-model:value="filters.difficulty"
          placeholder="难度"
          style="width: 110px"
          allow-clear
          @change="handleFilterChange"
        >
          <a-select-option value="easy">容易</a-select-option>
          <a-select-option value="medium">中等</a-select-option>
          <a-select-option value="hard">困难</a-select-option>
        </a-select>

        <a-select
          v-model:value="filters.knowledgePoint"
          placeholder="知识点"
          style="width: 130px"
          allow-clear
          @change="handleFilterChange"
        >
          <a-select-option
            v-for="kp in flatKnowledgePoints"
            :key="kp.id"
            :value="kp.id"
          >
            {{ kp.name }}
          </a-select-option>
        </a-select>

        <a-button @click="loadQuestions">刷新</a-button>
      </a-space>

      <a-spin :spinning="isLoading">
        <a-empty v-if="!questions.length" description="暂无题目数据" />

        <div v-else class="question-cards">
          <div
            v-for="item in questions"
            :key="item.id"
            class="question-card"
          >
            <div class="question-card-header">
              <a-space size="small">
                <a-tag :color="getQuestionTypeColor(item.type)">
                  {{ getQuestionTypeName(item.type) }}
                </a-tag>
                <a-tag :color="getDifficultyColor(item.difficulty.level)">
                  {{ getDifficultyName(item.difficulty.level) }}
                </a-tag>
              </a-space>

              <a-space size="small">
                <a-button type="link" size="small" @click="handleEdit(item)">编辑</a-button>
                <a-popconfirm
                  title="确定删除该题目吗？"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm="handleDelete(item.id)"
                >
                  <a-button type="link" size="small" danger>删除</a-button>
                </a-popconfirm>
              </a-space>
            </div>

            <div class="question-stem">
              {{ item.data?.stem || item.title || '暂无题干' }}
            </div>

            <div class="question-meta">
              <span>编号：{{ item.code || '未设置' }}</span>
              <span>更新时间：{{ formatTime(item.updatedAt) }}</span>
            </div>
          </div>
        </div>
      </a-spin>

      <a-pagination
        v-model:current="pagination.current"
        v-model:page-size="pagination.pageSize"
        size="small"
        :total="pagination.total"
        :show-size-changer="true"
        :show-less-items="true"
        @change="handlePaginationChange"
        @showSizeChange="handlePaginationChange"
      />
    </a-space>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { message } from 'ant-design-vue'
import { useQuestionStore } from '../stores/questionStore'
import { useMetadataStore } from '../stores/metadataStore'
import type { Question, QuestionType } from '../types/question'
import type { KnowledgePoint } from '../types/metadata'

interface Emits {
  (e: 'edit', question: Question): void
  (e: 'delete', id: string): void
}

const emit = defineEmits<Emits>()

const questionStore = useQuestionStore()
const metadataStore = useMetadataStore()

const isLoading = ref(false)
const searchKeyword = ref('')
const filters = ref({
  type: undefined as QuestionType | undefined,
  difficulty: undefined as string | undefined,
  knowledgePoint: undefined as string | undefined
})

const pagination = ref({
  current: 1,
  pageSize: 8,
  total: 0
})

const flattenTree = (nodes: KnowledgePoint[]): KnowledgePoint[] => {
  return nodes.flatMap(node => [node, ...(node.children ? flattenTree(node.children) : [])])
}

const questions = computed(() => questionStore.questionList)
const flatKnowledgePoints = computed(() => flattenTree(metadataStore.knowledgePoints.default || []))

const getQuestionTypeName = (type: QuestionType): string => {
  const nameMap: Record<QuestionType, string> = {
    single: '单选题',
    multiple: '多选题',
    fillBlank: '填空题',
    judgement: '判断题',
    essay: '问答题',
    composite: '组合题'
  }
  return nameMap[type]
}

const getQuestionTypeColor = (type: QuestionType): string => {
  const colorMap: Record<QuestionType, string> = {
    single: 'blue',
    multiple: 'green',
    fillBlank: 'orange',
    judgement: 'red',
    essay: 'purple',
    composite: 'cyan'
  }
  return colorMap[type]
}

const getDifficultyName = (level: string): string => {
  const nameMap: Record<string, string> = {
    easy: '容易',
    medium: '中等',
    hard: '困难'
  }
  return nameMap[level] || level
}

const getDifficultyColor = (level: string): string => {
  const colorMap: Record<string, string> = {
    easy: 'green',
    medium: 'orange',
    hard: 'red'
  }
  return colorMap[level] || 'default'
}

const formatTime = (value: string | Date) => {
  if (!value) {
    return '未知'
  }

  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '未知' : date.toLocaleString()
}

const loadQuestions = async () => {
  try {
    isLoading.value = true

    await Promise.all([
      questionStore.fetchQuestionList({
        page: pagination.value.current,
        pageSize: pagination.value.pageSize,
        type: filters.value.type,
        difficulty: filters.value.difficulty,
        knowledgePoint: filters.value.knowledgePoint,
        keyword: searchKeyword.value || undefined
      }),
      metadataStore.fetchKnowledgePoints()
    ])

    pagination.value.total = questionStore.total
  } catch (error) {
    message.error(questionStore.error || '加载题目列表失败')
  } finally {
    isLoading.value = false
  }
}

const handleFilterChange = () => {
  pagination.value.current = 1
  loadQuestions()
}

const handleSearch = () => {
  pagination.value.current = 1
  loadQuestions()
}

const handlePaginationChange = (page: number, pageSize: number) => {
  pagination.value.current = page
  pagination.value.pageSize = pageSize
  loadQuestions()
}

const handleEdit = (question: Question) => {
  emit('edit', question)
}

const handleDelete = async (id: string) => {
  try {
    await questionStore.deleteQuestion(id)
    message.success('题目已删除')
    emit('delete', id)

    if (questions.value.length === 1 && pagination.value.current > 1) {
      pagination.value.current -= 1
    }

    await loadQuestions()
  } catch (error) {
    message.error(questionStore.error || '删除题目失败')
  }
}

onMounted(async () => {
  await loadQuestions()
})
</script>

<style scoped>
.question-list {
  width: 100%;
}

.question-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 720px;
  overflow-y: auto;
}

.question-card {
  padding: 14px;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  background: #fafafa;
}

.question-card-header {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: flex-start;
}

.question-stem {
  margin-top: 8px;
  color: #262626;
  line-height: 1.6;
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.question-meta {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: #8c8c8c;
  font-size: 12px;
}
</style>
