<template>
  <div class="question-editor">
    <section class="editor-section">
      <div class="section-header">
        <div class="section-title">题目录入</div>
        <a class="source-link">原始资料</a>
      </div>

      <div class="meta-row">
        <div class="meta-item">
          <span class="meta-label">编号：</span>
          <a-input v-model:value="formData.code" placeholder="请输入题目编号" />
        </div>
        <div class="meta-item type-item">
          <span class="meta-label">题目类型：</span>
          <QuestionTypeSelector
            v-model="formData.type"
            :has-unsaved-content="isDirty"
            @change="handleQuestionTypeChange"
          />
        </div>
      </div>

      <QuestionEntryForm
        v-model="formData.questionData"
        :type="formData.type"
      />
    </section>

    <section class="editor-section">
      <div class="section-title">关联</div>
      <AssociationPanel v-model="associationValue" />
    </section>

    <section class="editor-section">
      <div class="section-title">解题方法</div>
      <SolutionMethodPanel v-model="formData.solutionMethods" />
    </section>

    <section class="editor-section">
      <div class="section-title">分类维护</div>
      <CategoryMaintenancePanel v-model="formData.categories" />
    </section>

    <div v-if="showActions" class="editor-actions">
      <a-space>
        <a-button @click="handleCancel">取消</a-button>
        <a-button type="primary" :loading="isSaving" @click="submit">保存</a-button>
      </a-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import { useQuestionStore } from '../stores/questionStore'
import { useMetadataStore } from '../stores/metadataStore'
import QuestionTypeSelector from './QuestionTypeSelector.vue'
import QuestionEntryForm from './QuestionEntryForm.vue'
import AssociationPanel from './AssociationPanel.vue'
import SolutionMethodPanel from './SolutionMethodPanel.vue'
import CategoryMaintenancePanel from './CategoryMaintenancePanel.vue'
import type { Question, QuestionData, QuestionPayload, QuestionType } from '../types/question'

interface AssociationValue {
  courseId?: string
  gradeId?: string
  filterMode: 'chapter' | 'knowledge'
  knowledgePoints: string[]
}

interface EditorFormState {
  code: string
  type: QuestionType
  questionData: QuestionData
  association: AssociationValue
  solutionMethods: string[]
  categories: string[]
}

interface Props {
  questionId?: string
  initialData?: Partial<Question>
  showActions?: boolean
}

interface Emits {
  (e: 'save', question: Question): void
  (e: 'cancel'): void
  (e: 'validate', isValid: boolean): void
  (e: 'dirty-change', dirty: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true
})

const emit = defineEmits<Emits>()
const questionStore = useQuestionStore()
const metadataStore = useMetadataStore()

const isSaving = ref(false)
const isDirty = ref(false)
const initialized = ref(false)
const currentQuestionId = ref(props.questionId || '')
const initialSnapshot = ref('')

const createDefaultQuestionData = (type: QuestionType): QuestionData => {
  const defaults: Record<QuestionType, QuestionData> = {
    single: {
      type: 'single',
      stem: '',
      options: [
        { label: 'A', content: '' },
        { label: 'B', content: '' },
        { label: 'C', content: '' },
        { label: 'D', content: '' }
      ],
      answer: { correctOption: 'A' }
    } as QuestionData,
    multiple: {
      type: 'multiple',
      stem: '',
      options: [
        { label: 'A', content: '' },
        { label: 'B', content: '' },
        { label: 'C', content: '' },
        { label: 'D', content: '' }
      ],
      answer: { correctOptions: ['A', 'B'] }
    } as QuestionData,
    fillBlank: {
      type: 'fillBlank',
      stem: '',
      answer: {
        blanks: [],
        allowUnorderedAnswer: false
      }
    } as QuestionData,
    judgement: {
      type: 'judgement',
      stem: '',
      answer: { correct: true }
    } as QuestionData,
    essay: {
      type: 'essay',
      stem: '',
      answer: { referenceAnswer: '' }
    } as QuestionData,
    composite: {
      type: 'composite',
      stem: '',
      mainStem: '',
      subQuestions: [],
      answer: { subAnswers: [] }
    } as QuestionData
  }

  return JSON.parse(JSON.stringify(defaults[type]))
}

const createDefaultState = (): EditorFormState => ({
  code: '',
  type: 'single',
  questionData: createDefaultQuestionData('single'),
  association: {
    filterMode: 'chapter',
    knowledgePoints: []
  },
  solutionMethods: [],
  categories: []
})

const formData = ref<EditorFormState>(createDefaultState())

const associationValue = computed({
  get: () => formData.value.association,
  set: value => {
    formData.value.association = value
  }
})

const createPayload = (): QuestionPayload => ({
  title: formData.value.questionData.stem?.slice(0, 30) || '未命名题目',
  code: formData.value.code,
  type: formData.value.type,
  courseLinkage: {
    courseId: formData.value.association.courseId,
    gradeId: formData.value.association.gradeId
  },
  knowledgePoints: [...formData.value.association.knowledgePoints],
  courseStandards: [],
  difficulty: { level: 'medium' },
  category: formData.value.categories[0] || '',
  categories: [...formData.value.categories],
  solutionMethods: [...formData.value.solutionMethods],
  data: JSON.parse(JSON.stringify(formData.value.questionData)),
  analysis: '',
  scoringCriteria: '',
  createdBy: 'current_user',
  status: 'draft'
})

const setSnapshot = () => {
  initialSnapshot.value = JSON.stringify(createPayload())
  isDirty.value = false
  emit('dirty-change', false)
}

const updateDirtyState = () => {
  if (!initialized.value) {
    return
  }
  const nextDirty = JSON.stringify(createPayload()) !== initialSnapshot.value
  if (nextDirty !== isDirty.value) {
    isDirty.value = nextDirty
    emit('dirty-change', nextDirty)
  }
}

const applyQuestion = (question?: Partial<Question> | null) => {
  const nextType = question?.type || 'single'
  formData.value = {
    code: question?.code || '',
    type: nextType,
    questionData: question?.data
      ? JSON.parse(JSON.stringify(question.data))
      : createDefaultQuestionData(nextType),
    association: {
      courseId: question?.courseLinkage?.courseId,
      gradeId: question?.courseLinkage?.gradeId,
      filterMode: 'chapter',
      knowledgePoints: [...(question?.knowledgePoints || [])]
    },
    solutionMethods: [...(question?.solutionMethods || [])],
    categories: [...(question?.categories || (question?.category ? [question.category] : []))]
  }
}

const validateForm = () => {
  const payload = createPayload()
  const hasStem = Boolean(payload.data.stem?.trim() || (payload.type === 'composite' && (payload.data as any).mainStem?.trim()))
  const hasKnowledge = payload.knowledgePoints.length > 0
  const hasCategory = (payload.categories?.length || 0) > 0 || Boolean(payload.category)
  const isValid = hasStem && hasKnowledge && hasCategory
  emit('validate', isValid)
  return isValid
}

const initializeMetadata = async () => {
  await Promise.all([
    metadataStore.fetchQuestionTypes(),
    metadataStore.fetchCourses(),
    metadataStore.fetchKnowledgePoints(),
    metadataStore.fetchCategories()
  ])
}

const loadEditorData = async () => {
  initialized.value = false
  try {
    await initializeMetadata()
    if (props.questionId) {
      currentQuestionId.value = props.questionId
      await questionStore.fetchQuestion(props.questionId)
      applyQuestion(questionStore.currentQuestion)
    } else if (props.initialData) {
      currentQuestionId.value = props.initialData.id || ''
      applyQuestion(props.initialData)
    } else {
      currentQuestionId.value = ''
      applyQuestion()
    }
    initialized.value = true
    setSnapshot()
    validateForm()
  } catch (error) {
    initialized.value = true
    message.error(questionStore.error || metadataStore.error || '初始化题目录入页失败')
  }
}

const handleQuestionTypeChange = (newType: QuestionType) => {
  formData.value.type = newType
  formData.value.questionData = createDefaultQuestionData(newType)
}

const submit = async () => {
  if (!validateForm()) {
    message.warning('请先完善题干、知识点和分类')
    return null
  }
  isSaving.value = true
  try {
    const payload = createPayload()
    const savedQuestion = currentQuestionId.value
      ? await questionStore.updateQuestion(currentQuestionId.value, payload)
      : await questionStore.saveQuestion(payload)
    currentQuestionId.value = savedQuestion.id
    applyQuestion(savedQuestion)
    setSnapshot()
    emit('save', savedQuestion)
    message.success('题目保存成功')
    return savedQuestion
  } catch (error) {
    message.error(questionStore.error || '题目保存失败')
    return null
  } finally {
    isSaving.value = false
  }
}

const handleCancel = () => {
  emit('cancel')
}

const resetEditor = async () => {
  await loadEditorData()
}

const startCreateQuestion = async () => {
  currentQuestionId.value = ''
  applyQuestion()
  initialized.value = true
  setSnapshot()
}

defineExpose({
  submit,
  resetEditor,
  startCreateQuestion,
  hasUnsavedChanges: computed(() => isDirty.value)
})

watch(
  () => props.questionId,
  async (newValue, oldValue) => {
    if (newValue !== oldValue) {
      await loadEditorData()
    }
  }
)

watch(
  formData,
  () => {
    updateDirtyState()
    validateForm()
  },
  { deep: true }
)

onMounted(async () => {
  await loadEditorData()
})
</script>

<style scoped>
.question-editor {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.editor-section {
  background: #fff;
  border-radius: 4px;
  padding: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-title {
  margin: 0;
  padding-left: 8px;
  border-left: 4px solid #13a8a8;
  font-size: 16px;
  font-weight: 600;
}

.source-link {
  color: #8c8c8c;
  font-size: 14px;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.type-item {
  flex: 1;
}

.meta-label {
  color: #595959;
  white-space: nowrap;
}

.editor-actions {
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 900px) {
  .meta-row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
