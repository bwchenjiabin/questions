<!--
  单选题表单组件
  用于编辑单选题的题干、选项和答案
-->
<template>
  <a-form layout="vertical">
    <!-- 题干 -->
    <a-form-item label="题干" name="stem" required>
      <RichTextEditor
        v-model="formData.stem"
        placeholder="请输入题干内容"
      />
    </a-form-item>

    <!-- 选项 -->
    <a-form-item label="选项" required>
      <a-space direction="vertical" :size="12" style="width: 100%">
        <div
          v-for="(option, index) in formData.options"
          :key="index"
          class="option-item"
        >
          <a-space style="width: 100%">
            <span class="option-label">{{ option.label }}.</span>
            <a-input
              v-model:value="option.content"
              placeholder="请输入选项内容"
              style="flex: 1"
            />
            <a-button
              v-if="formData.options.length > 2"
              type="text"
              danger
              @click="removeOption(index)"
            >
              删除
            </a-button>
          </a-space>
        </div>

        <a-button type="dashed" block @click="addOption">
          + 增加选项
        </a-button>
      </a-space>
    </a-form-item>

    <!-- 答案 -->
    <a-form-item label="正确答案" name="answer" required>
      <a-radio-group v-model:value="formData.answer.correctOption">
        <a-radio
          v-for="option in formData.options"
          :key="option.label"
          :value="option.label"
        >
          {{ option.label }}
        </a-radio>
      </a-radio-group>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import RichTextEditor from '../RichTextEditor.vue'
import type { SingleChoiceData } from '../../types/question'

interface Props {
  modelValue?: SingleChoiceData
  readonly?: boolean
}

interface Emits {
  (e: 'update:modelValue', data: SingleChoiceData): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({
    type: 'single',
    stem: '',
    options: [
      { label: 'A', content: '' },
      { label: 'B', content: '' },
      { label: 'C', content: '' },
      { label: 'D', content: '' }
    ],
    answer: { correctOption: 'A' }
  })
})

const emit = defineEmits<Emits>()

// 内部状态
const formData = ref<SingleChoiceData>({
  type: 'single',
  stem: props.modelValue?.stem || '',
  options: props.modelValue?.options || [
    { label: 'A', content: '' },
    { label: 'B', content: '' },
    { label: 'C', content: '' },
    { label: 'D', content: '' }
  ],
  answer: props.modelValue?.answer || { correctOption: 'A' }
})

/**
 * 添加选项
 */
const addOption = () => {
  const nextLabel = String.fromCharCode(65 + formData.value.options.length) // A=65
  formData.value.options.push({
    label: nextLabel,
    content: ''
  })
  emitUpdate()
}

/**
 * 删除选项
 */
const removeOption = (index: number) => {
  const removedLabel = formData.value.options[index].label
  formData.value.options.splice(index, 1)

  formData.value.options = formData.value.options.map((option, optionIndex) => ({
    ...option,
    label: String.fromCharCode(65 + optionIndex)
  }))

  // 如果删除的是正确答案，或者原答案已经不在选项中，回退到第一个选项
  if (
    formData.value.answer.correctOption === removedLabel ||
    !formData.value.options.some(option => option.label === formData.value.answer.correctOption)
  ) {
    formData.value.answer.correctOption = formData.value.options[0].label
  }

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
        type: 'single',
        stem: newValue.stem || '',
        options: newValue.options || formData.value.options,
        answer: newValue.answer || formData.value.answer
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
.option-item {
  padding: 8px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  background-color: #fafafa;
}
</style>
