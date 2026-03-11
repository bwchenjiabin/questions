<!--
  填空题表单组件
  用于编辑填空题的题干、填空位置和答案
-->
<template>
  <a-form layout="vertical">
    <!-- 题干 -->
    <a-form-item label="题干（用 _____ 标记填空位置）" name="stem" required>
      <RichTextEditor
        v-model="formData.stem"
        placeholder="请输入题干内容，用 _____ 标记填空位置"
      />
    </a-form-item>

    <!-- 填空答案 -->
    <a-form-item label="填空答案" required>
      <a-space direction="vertical" :size="12" style="width: 100%">
        <div
          v-for="(blank, index) in formData.answer.blanks"
          :key="index"
          class="blank-item"
        >
          <div class="blank-header">
            <span class="blank-number">第 {{ index + 1 }} 空</span>
            <a-button
              v-if="formData.answer.blanks.length > 1"
              type="text"
              danger
              size="small"
              @click="removeBlank(index)"
            >
              删除
            </a-button>
          </div>

          <a-space direction="vertical" :size="8" style="width: 100%">
            <div
              v-for="(answer, answerIndex) in blank.acceptedAnswers"
              :key="answerIndex"
              class="answer-input-group"
            >
              <a-input
                v-model:value="blank.acceptedAnswers[answerIndex]"
                :placeholder="`可接受答案 ${answerIndex + 1}`"
                style="flex: 1"
              />
              <a-button
                v-if="blank.acceptedAnswers.length > 1"
                type="text"
                danger
                size="small"
                @click="removeAnswer(index, answerIndex)"
              >
                删除
              </a-button>
            </div>

            <a-button
              type="dashed"
              size="small"
              block
              @click="addAnswer(index)"
            >
              + 添加可接受答案
            </a-button>
          </a-space>
        </div>

        <a-button type="dashed" block @click="addBlank">
          + 添加一个空
        </a-button>
      </a-space>
    </a-form-item>

    <!-- 允许答案顺序不一致 -->
    <a-form-item>
      <a-checkbox v-model:checked="formData.answer.allowUnorderedAnswer">
        允许答案与参考答案顺序不一致
      </a-checkbox>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import RichTextEditor from '../RichTextEditor.vue'
import type { FillBlankData } from '../../types/question'

interface Props {
  modelValue?: FillBlankData
  readonly?: boolean
}

interface Emits {
  (e: 'update:modelValue', data: FillBlankData): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({
    type: 'fillBlank',
    stem: '',
    answer: {
      blanks: [],
      allowUnorderedAnswer: false
    }
  })
})

const emit = defineEmits<Emits>()

// 内部状态
const formData = ref<FillBlankData>({
  type: 'fillBlank',
  stem: props.modelValue?.stem || '',
  answer: props.modelValue?.answer || {
    blanks: [],
    allowUnorderedAnswer: false
  }
})

/**
 * 添加填空
 */
const addBlank = () => {
  const newIndex = formData.value.answer.blanks.length
  formData.value.answer.blanks.push({
    index: newIndex,
    acceptedAnswers: []
  })
  emitUpdate()
}

/**
 * 删除填空
 */
const removeBlank = (index: number) => {
  formData.value.answer.blanks.splice(index, 1)
  
  // 重新编号
  formData.value.answer.blanks.forEach((blank, idx) => {
    blank.index = idx
  })
  
  emitUpdate()
}

/**
 * 添加可接受答案
 */
const addAnswer = (blankIndex: number) => {
  formData.value.answer.blanks[blankIndex].acceptedAnswers.push('')
  emitUpdate()
}

/**
 * 删除可接受答案
 */
const removeAnswer = (blankIndex: number, answerIndex: number) => {
  formData.value.answer.blanks[blankIndex].acceptedAnswers.splice(answerIndex, 1)
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
        type: 'fillBlank',
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

<style scoped>
.blank-item {
  padding: 12px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  background-color: #fafafa;
}

.blank-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.blank-number {
  font-weight: 500;
  color: #1890ff;
}

.answer-input-group {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
