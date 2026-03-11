<!--
  判断题表单组件
  用于编辑判断题的题干和答案
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

    <!-- 答案 -->
    <a-form-item label="正确答案" name="answer" required>
      <a-radio-group v-model:value="formData.answer.correct">
        <a-radio :value="true">正确</a-radio>
        <a-radio :value="false">错误</a-radio>
      </a-radio-group>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import RichTextEditor from '../RichTextEditor.vue'
import type { JudgementData } from '../../types/question'

interface Props {
  modelValue?: JudgementData
  readonly?: boolean
}

interface Emits {
  (e: 'update:modelValue', data: JudgementData): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({
    type: 'judgement',
    stem: '',
    answer: { correct: true }
  })
})

const emit = defineEmits<Emits>()

// 内部状态
const formData = ref<JudgementData>({
  type: 'judgement',
  stem: props.modelValue?.stem || '',
  answer: props.modelValue?.answer || { correct: true }
})

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
        type: 'judgement',
        stem: newValue.stem || '',
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
