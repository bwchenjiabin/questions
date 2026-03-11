<!--
  问答题表单组件
  用于编辑问答题的题干和参考答案
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

    <!-- 参考答案 -->
    <a-form-item label="参考答案" name="referenceAnswer" required>
      <RichTextEditor
        v-model="formData.answer.referenceAnswer"
        placeholder="请输入参考答案"
      />
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import RichTextEditor from '../RichTextEditor.vue'
import type { EssayData } from '../../types/question'

interface Props {
  modelValue?: EssayData
  readonly?: boolean
}

interface Emits {
  (e: 'update:modelValue', data: EssayData): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({
    type: 'essay',
    stem: '',
    answer: { referenceAnswer: '' }
  })
})

const emit = defineEmits<Emits>()

// 内部状态
const formData = ref<EssayData>({
  type: 'essay',
  stem: props.modelValue?.stem || '',
  answer: props.modelValue?.answer || { referenceAnswer: '' }
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
        type: 'essay',
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
