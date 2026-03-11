<!--
  多选题表单组件
  用于编辑多选题的题干、选项和答案
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
    <a-form-item label="正确答案（至少选择两个）" name="answer" required>
      <a-checkbox-group v-model:value="formData.answer.correctOptions">
        <a-checkbox
          v-for="option in formData.options"
          :key="option.label"
          :value="option.label"
        >
          {{ option.label }}
        </a-checkbox>
      </a-checkbox-group>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import RichTextEditor from '../RichTextEditor.vue'
import type { MultipleChoiceData } from '../../types/question'

interface Props {
  modelValue?: MultipleChoiceData
  readonly?: boolean
}

interface Emits {
  (e: 'update:modelValue', data: MultipleChoiceData): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({
    type: 'multiple',
    stem: '',
    options: [
      { label: 'A', content: '' },
      { label: 'B', content: '' },
      { label: 'C', content: '' },
      { label: 'D', content: '' }
    ],
    answer: { correctOptions: ['A', 'B'] }
  })
})

const emit = defineEmits<Emits>()

// 内部状态
const formData = ref<MultipleChoiceData>({
  type: 'multiple',
  stem: props.modelValue?.stem || '',
  options: props.modelValue?.options || [
    { label: 'A', content: '' },
    { label: 'B', content: '' },
    { label: 'C', content: '' },
    { label: 'D', content: '' }
  ],
  answer: props.modelValue?.answer || { correctOptions: ['A', 'B'] }
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

  const relabelMap = new Map<string, string>()
  formData.value.options = formData.value.options.map((option, optionIndex) => {
    const nextLabel = String.fromCharCode(65 + optionIndex)
    relabelMap.set(option.label, nextLabel)
    return {
      ...option,
      label: nextLabel
    }
  })

  // 从正确答案中移除已删除选项，并同步重排后的标签
  formData.value.answer.correctOptions = formData.value.answer.correctOptions
    .filter(label => label !== removedLabel)
    .map(label => relabelMap.get(label) || label)

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
        type: 'multiple',
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
