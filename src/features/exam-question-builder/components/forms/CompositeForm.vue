<!--
  组合题表单组件
  用于编辑组合题的主题干和子题
-->
<template>
  <a-form layout="vertical">
    <!-- 主题干 -->
    <a-form-item label="主题干" name="mainStem" required>
      <RichTextEditor
        v-model="formData.mainStem"
        placeholder="请输入主题干内容"
      />
    </a-form-item>

    <!-- 子题 -->
    <a-form-item label="子题" required>
      <a-space direction="vertical" :size="12" style="width: 100%">
        <a-card
          v-for="(subQuestion, index) in formData.subQuestions"
          :key="subQuestion.id"
          :title="`第 ${index + 1} 题`"
          size="small"
          :bordered="true"
          class="sub-question-card"
        >
          <template #extra>
            <a-button
              v-if="formData.subQuestions.length > 1"
              type="text"
              danger
              size="small"
              @click="removeSubQuestion(index)"
            >
              删除
            </a-button>
          </template>

          <!-- 子题题型选择 -->
          <a-form-item label="题型" required>
            <a-select
              v-model:value="subQuestion.type"
              placeholder="请选择题型"
              @change="handleSubQuestionTypeChange(index)"
            >
              <a-select-option value="single">单选题</a-select-option>
              <a-select-option value="multiple">多选题</a-select-option>
              <a-select-option value="fillBlank">填空题</a-select-option>
              <a-select-option value="judgement">判断题</a-select-option>
              <a-select-option value="essay">问答题</a-select-option>
            </a-select>
          </a-form-item>

          <!-- 子题内容（根据题型动态加载） -->
          <component
            :is="getSubQuestionFormComponent(subQuestion.type)"
            v-model="subQuestion.data"
            @update:model-value="handleSubQuestionDataChange(index, $event)"
          />
        </a-card>

        <a-button type="dashed" block @click="addSubQuestion">
          + 添加子题
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import RichTextEditor from '../RichTextEditor.vue'
import SingleChoiceForm from './SingleChoiceForm.vue'
import MultipleChoiceForm from './MultipleChoiceForm.vue'
import FillBlankForm from './FillBlankForm.vue'
import JudgementForm from './JudgementForm.vue'
import EssayForm from './EssayForm.vue'
import type { CompositeData, QuestionType, QuestionData } from '../../types/question'

interface Props {
  modelValue?: CompositeData
  readonly?: boolean
}

interface Emits {
  (e: 'update:modelValue', data: CompositeData): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({
    type: 'composite',
    stem: '',
    mainStem: '',
    answer: { subAnswers: [] },
    subQuestions: [
      {
        id: uuidv4(),
        order: 1,
        type: 'single',
        data: {
          type: 'single',
          stem: '',
          options: [
            { label: 'A', content: '' },
            { label: 'B', content: '' },
            { label: 'C', content: '' },
            { label: 'D', content: '' }
          ],
          answer: { correctOption: 'A' }
        }
      }
    ]
  })
})

const emit = defineEmits<Emits>()

// 内部状态
const formData = ref<CompositeData>({
  type: 'composite',
  stem: props.modelValue?.stem || '',
  mainStem: props.modelValue?.mainStem || '',
  answer: props.modelValue?.answer || { subAnswers: [] },
  subQuestions: props.modelValue?.subQuestions || [
    {
      id: uuidv4(),
      order: 1,
      type: 'single',
      data: {
        type: 'single',
        stem: '',
        options: [
          { label: 'A', content: '' },
          { label: 'B', content: '' },
          { label: 'C', content: '' },
          { label: 'D', content: '' }
        ],
        answer: { correctOption: 'A' }
      }
    }
  ]
})

/**
 * 获取子题表单组件
 */
const getSubQuestionFormComponent = (type: QuestionType) => {
  const componentMap: Record<QuestionType, any> = {
    single: SingleChoiceForm,
    multiple: MultipleChoiceForm,
    fillBlank: FillBlankForm,
    judgement: JudgementForm,
    essay: EssayForm,
    composite: null // 不支持嵌套组合题
  }
  return componentMap[type]
}

/**
 * 创建默认的子题数据
 */
const createDefaultSubQuestionData = (type: QuestionType): QuestionData => {
  const dataMap: Record<QuestionType, QuestionData> = {
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
    },
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
    },
    fillBlank: {
      type: 'fillBlank',
      stem: '',
      answer: {
        blanks: [],
        allowUnorderedAnswer: false
      }
    },
    judgement: {
      type: 'judgement',
      stem: '',
      answer: { correct: true }
    },
    essay: {
      type: 'essay',
      stem: '',
      answer: { referenceAnswer: '' }
    },
    composite: {
      type: 'composite',
      stem: '',
      mainStem: '',
      subQuestions: [],
      answer: { subAnswers: [] }
    }
  }
  return dataMap[type]
}

/**
 * 添加子题
 */
const addSubQuestion = () => {
  const newOrder = formData.value.subQuestions.length + 1
  formData.value.subQuestions.push({
    id: uuidv4(),
    order: newOrder,
    type: 'single',
    data: createDefaultSubQuestionData('single')
  })
  emitUpdate()
}

/**
 * 删除子题
 */
const removeSubQuestion = (index: number) => {
  formData.value.subQuestions.splice(index, 1)
  
  // 重新编号
  formData.value.subQuestions.forEach((subQuestion, idx) => {
    subQuestion.order = idx + 1
  })
  
  emitUpdate()
}

/**
 * 处理子题题型变化
 */
const handleSubQuestionTypeChange = (index: number) => {
  const newType = formData.value.subQuestions[index].type
  formData.value.subQuestions[index].data = createDefaultSubQuestionData(newType)
  emitUpdate()
}

/**
 * 处理子题数据变化
 */
const handleSubQuestionDataChange = (index: number, data: QuestionData) => {
  formData.value.subQuestions[index].data = data
  emitUpdate()
}

/**
 * 发送更新事件
 */
const emitUpdate = () => {
  emit('update:modelValue', formData.value)
}

/**
 * 监听外部值变化
 */
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      formData.value = {
        type: 'composite',
        stem: newValue.stem || '',
        mainStem: newValue.mainStem || '',
        answer: newValue.answer || { subAnswers: [] },
        subQuestions: newValue.subQuestions || formData.value.subQuestions
      }
    }
  },
  { deep: true }
)

/**
 * 监听内部数据变化
 */
watch(
  () => formData.value,
  () => {
    emitUpdate()
  },
  { deep: true }
)
</script>

<style scoped>
.sub-question-card {
  margin-bottom: 12px;
}
</style>
