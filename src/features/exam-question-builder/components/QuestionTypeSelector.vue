<template>
  <div class="question-type-selector">
    <a-radio-group
      v-model:value="selectedValue"
      button-style="solid"
      @change="handleChange"
      :disabled="disabled"
    >
      <a-radio-button
        v-for="type in questionTypes"
        :key="type.value"
        :value="type.value"
      >
        {{ type.name }}
      </a-radio-button>
    </a-radio-group>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useMetadataStore } from '../stores/metadataStore'
import type { QuestionType } from '../types/question'
import type { QuestionTypeOption } from '../types/metadata'

/**
 * QuestionTypeSelector 组件属性
 */
interface Props {
  /** 当前选中的题型 */
  modelValue: QuestionType
  /** 是否禁用 */
  disabled?: boolean
  /** 是否有未保存的内容（用于切换确认） */
  hasUnsavedContent?: boolean
}

/**
 * QuestionTypeSelector 组件事件
 */
interface Emits {
  (e: 'update:modelValue', type: QuestionType): void
  (e: 'change', type: QuestionType): void
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  hasUnsavedContent: false
})

const emit = defineEmits<Emits>()

// 元数据 Store
const metadataStore = useMetadataStore()
const selectedValue = ref<QuestionType>(props.modelValue)

/**
 * 题型列表
 */
const fallbackQuestionTypes: QuestionTypeOption[] = [
  { id: 'single', name: '单选', value: 'single' },
  { id: 'multiple', name: '多选', value: 'multiple' },
  { id: 'fillBlank', name: '填空', value: 'fillBlank' },
  { id: 'judgement', name: '判断', value: 'judgement' },
  { id: 'essay', name: '问答', value: 'essay' },
  { id: 'composite', name: '组合', value: 'composite' }
]

const questionTypes = computed(() => {
  return metadataStore.questionTypes.length > 0
    ? metadataStore.questionTypes
    : fallbackQuestionTypes
})

/**
 * 处理题型切换
 */
const handleChange = (e: any) => {
  const newType = e.target.value as QuestionType

  if (props.hasUnsavedContent && newType !== props.modelValue) {
    const confirmed = window.confirm('切换题型将清空当前未保存的内容，确定要继续吗？')
    if (!confirmed) {
      selectedValue.value = props.modelValue
      return
    }
  }

  emitChange(newType)
}

/**
 * 发出切换事件
 */
const emitChange = (type: QuestionType) => {
  emit('update:modelValue', type)
  emit('change', type)
}

/**
 * 组件挂载时加载题型列表
 */
onMounted(async () => {
  try {
    await metadataStore.fetchQuestionTypes()
  } catch (error) {
    console.error('Failed to fetch question types:', error)
  }
})

watch(
  () => props.modelValue,
  newValue => {
    selectedValue.value = newValue
  }
)
</script>

<style scoped>
.question-type-selector {
  width: 100%;
}
</style>
