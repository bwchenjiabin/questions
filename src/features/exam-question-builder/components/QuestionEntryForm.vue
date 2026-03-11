<template>
  <div class="question-entry-form">
    <div class="form-row">
      <label class="form-label">题干</label>
      <div class="form-content">
        <RichTextEditor
          v-if="type !== 'composite'"
          v-model:modelValue="localValue.stem"
          :rows="3"
          placeholder="题干，点此编辑(必填)"
        />
        <RichTextEditor
          v-else
          v-model:modelValue="compositeValue.mainStem"
          :rows="3"
          placeholder="主题干，点此编辑(必填)"
        />
      </div>
    </div>

    <template v-if="type === 'single' || type === 'multiple'">
      <div class="form-row">
        <label class="form-label">选项</label>
        <div class="form-content">
          <div class="options-panel">
            <div
              v-for="(option, index) in optionList"
              :key="`${option.label}-${index}`"
              class="option-row"
            >
              <span class="option-letter">{{ option.label }}.</span>
              <RichTextEditor
                v-model:modelValue="option.content"
                :rows="2"
                placeholder="请输入选项内容"
              />
              <div class="option-actions">
                <button class="icon-btn" :disabled="optionList.length <= 2" @click="removeOption(index)">
                  <MinusCircleOutlined />
                </button>
                <button class="icon-btn" :disabled="index === 0" @click="moveOption(index, 'up')">
                  <UpCircleOutlined />
                </button>
                <button class="icon-btn" :disabled="index === optionList.length - 1" @click="moveOption(index, 'down')">
                  <DownCircleOutlined />
                </button>
              </div>
            </div>
          </div>
          <a-button type="link" class="inline-action" @click="addOption">+ 添加选项</a-button>
        </div>
      </div>

      <div class="form-row">
        <label class="form-label">答案</label>
        <div class="form-content">
          <!-- 单选题：普通下拉选择 -->
          <a-select
            v-if="type === 'single'"
            :value="singleAnswer.correctOption"
            style="width: 100%"
            placeholder="请选择正确答案"
            :options="answerOptions"
            @change="handleSingleAnswerChange"
          />
          <!-- 多选题：多选下拉 -->
          <a-select
            v-else
            :value="multipleAnswer.correctOptions"
            mode="multiple"
            style="width: 100%"
            placeholder="请选择正确答案（可多选）"
            :options="answerOptions"
            @change="handleMultipleAnswerChange"
          />
        </div>
      </div>
    </template>

    <template v-else-if="type === 'fillBlank'">
      <div class="form-row">
        <label class="form-label">答案</label>
        <div class="form-content">
          <div class="blank-list">
            <div
              v-for="(blank, index) in fillBlankAnswer.blanks"
              :key="blank.index"
              class="blank-row"
            >
              <span class="blank-label">第{{ numberText(index + 1) }}空答案</span>
              <a-select
                v-model:value="blank.acceptedAnswers"
                mode="tags"
                :open="false"
                style="width: 100%"
                placeholder="点击输入答案"
              />
            </div>
          </div>
          <a-button type="link" class="inline-action" @click="addBlank">+ 添加一个空</a-button>
          <div class="checkbox-row">
            <a-checkbox v-model:checked="fillBlankAnswer.allowUnorderedAnswer">
              允许答案与参考答案顺序不一致
            </a-checkbox>
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="type === 'judgement'">
      <div class="form-row">
        <label class="form-label">答案</label>
        <div class="form-content judgement-row">
          <a-checkbox :checked="judgementAnswer.correct" @change="setJudgement(true)">正确</a-checkbox>
          <a-checkbox :checked="!judgementAnswer.correct" @change="setJudgement(false)">错误</a-checkbox>
        </div>
      </div>
    </template>

    <template v-else-if="type === 'essay'">
      <div class="form-row">
        <label class="form-label">答案</label>
        <div class="form-content">
          <RichTextEditor
            v-model:modelValue="essayAnswer.referenceAnswer"
            :rows="4"
            placeholder="参考答案，点此编辑(必填)"
          />
        </div>
      </div>
    </template>

    <template v-else-if="type === 'composite'">
      <div class="form-row">
        <label class="form-label">子试题</label>
        <div class="form-content">
          <div class="sub-question-list">
            <div
              v-for="(subQuestion, index) in compositeValue.subQuestions"
              :key="subQuestion.id"
              class="sub-question-card"
            >
              <div class="sub-question-header">
                <span>{{ index + 1 }}、{{ getSubQuestionLabel(subQuestion.type) }}</span>
                <a-select
                  v-model:value="subQuestion.type"
                  size="small"
                  style="width: 120px"
                  @change="changeSubQuestionType(index)"
                >
                  <a-select-option value="single">单选题</a-select-option>
                  <a-select-option value="multiple">多选题</a-select-option>
                  <a-select-option value="fillBlank">填空题</a-select-option>
                  <a-select-option value="judgement">判断题</a-select-option>
                  <a-select-option value="essay">问答题</a-select-option>
                </a-select>
              </div>

              <div class="sub-row">
                <span class="sub-label">题干</span>
                <RichTextEditor
                  v-model="subQuestion.data.stem"
                  :rows="2"
                  placeholder="题干，点此编辑(必填)"
                />
              </div>

              <template v-if="subQuestion.type === 'single' || subQuestion.type === 'multiple'">
                <div class="sub-row">
                  <span class="sub-label">选项</span>
                  <div class="sub-options">
                    <div
                      v-for="(option, optionIndex) in getSubOptions(subQuestion)"
                      :key="`${subQuestion.id}-${option.label}`"
                      class="option-row"
                    >
                      <span class="option-letter">{{ option.label }}.</span>
                      <RichTextEditor 
                        v-model="option.content" 
                        :rows="2"
                        placeholder="请输入选项内容" 
                      />
                      <div class="option-actions">
                        <button class="icon-btn" :disabled="getSubOptions(subQuestion).length <= 2" @click="removeSubOption(index, optionIndex)">
                          <MinusCircleOutlined />
                        </button>
                        <button class="icon-btn" :disabled="optionIndex === 0" @click="moveSubOption(index, optionIndex, 'up')">
                          <UpCircleOutlined />
                        </button>
                        <button class="icon-btn" :disabled="optionIndex === getSubOptions(subQuestion).length - 1" @click="moveSubOption(index, optionIndex, 'down')">
                          <DownCircleOutlined />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <a-button type="link" class="inline-action" @click="addSubOption(index)">+ 添加选项</a-button>
                <div class="sub-row">
                  <span class="sub-label">答案</span>
                  <div class="sub-answer-row">
                    <!-- 单选题：普通下拉选择 -->
                    <a-select
                      v-if="subQuestion.type === 'single'"
                      :value="(subQuestion.data.answer as any).correctOption"
                      style="width: 100%"
                      placeholder="请选择正确答案"
                      :options="getSubAnswerOptions(subQuestion)"
                      @change="(value: string) => handleSubSingleAnswerChange(index, value)"
                    />
                    <!-- 多选题：多选下拉 -->
                    <a-select
                      v-else
                      :value="(subQuestion.data.answer as any).correctOptions"
                      mode="multiple"
                      style="width: 100%"
                      placeholder="请选择正确答案（可多选）"
                      :options="getSubAnswerOptions(subQuestion)"
                      @change="(values: string[]) => handleSubMultipleAnswerChange(index, values)"
                    />
                  </div>
                </div>
              </template>

              <template v-else-if="subQuestion.type === 'fillBlank'">
                <div class="sub-row">
                  <span class="sub-label">答案</span>
                  <div class="blank-list">
                    <div
                      v-for="(blank, blankIndex) in (subQuestion.data.answer as any).blanks"
                      :key="`${subQuestion.id}-${blankIndex}`"
                      class="blank-row"
                    >
                      <span class="blank-label">第{{ numberText(Number(blankIndex) + 1) }}空</span>
                      <a-select
                        v-model:value="blank.acceptedAnswers"
                        mode="tags"
                        :open="false"
                        style="width: 100%"
                        placeholder="点击输入答案"
                      />
                    </div>
                  </div>
                </div>
              </template>

              <template v-else-if="subQuestion.type === 'judgement'">
                <div class="sub-row">
                  <span class="sub-label">答案</span>
                  <div class="judgement-row">
                    <a-checkbox :checked="(subQuestion.data.answer as any).correct" @change="setSubJudgement(index, true)">
                      正确
                    </a-checkbox>
                    <a-checkbox :checked="!(subQuestion.data.answer as any).correct" @change="setSubJudgement(index, false)">
                      错误
                    </a-checkbox>
                  </div>
                </div>
              </template>

              <template v-else-if="subQuestion.type === 'essay'">
                <div class="sub-row">
                  <span class="sub-label">答案</span>
                  <RichTextEditor
                    v-model="(subQuestion.data.answer as any).referenceAnswer"
                    :rows="3"
                    placeholder="参考答案，点此编辑(必填)"
                  />
                </div>
              </template>
            </div>
          </div>
          <a-button type="link" class="inline-action" @click="addSubQuestion">+ 添加子试题</a-button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { MinusCircleOutlined, UpCircleOutlined, DownCircleOutlined } from '@ant-design/icons-vue'
import RichTextEditor from './RichTextEditor.vue'
import type {
  CompositeData,
  FillBlankData,
  MultipleChoiceData,
  Option,
  QuestionData,
  QuestionType,
  SingleChoiceData,
  SubQuestion
} from '../types/question'

interface Props {
  type: QuestionType
  modelValue: QuestionData
}

interface Emits {
  (e: 'update:modelValue', value: QuestionData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const createDefaultQuestionData = (type: QuestionType): QuestionData => {
  const defaultMap: Record<QuestionType, any> = {
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
      subQuestions: [
        {
          id: uuidv4(),
          order: 1,
          type: 'single',
          data: createSingleChoiceData()
        }
      ],
      answer: { subAnswers: [] }
    }
  }

  return JSON.parse(JSON.stringify(defaultMap[type]))
}

const createSingleChoiceData = (): any => ({
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

const createDataByType = (type: QuestionType): any => {
  if (type === 'single') {
    return createSingleChoiceData()
  }

  return createDefaultQuestionData(type)
}

const localValue = ref<any>(JSON.parse(JSON.stringify(props.modelValue || createDefaultQuestionData(props.type))))

// 标志位：防止循环更新
const isUpdatingFromParent = ref(false)

const relabelOptions = (options: Option[]) => options.map((item, index) => ({
  ...item,
  label: String.fromCharCode(65 + index)
}))

const optionList = computed({
  get: () => ((localValue.value as SingleChoiceData | MultipleChoiceData).options || []),
  set: value => {
    ;(localValue.value as SingleChoiceData | MultipleChoiceData).options = value
  }
})

// 转换选项格式供 a-select 使用
const answerOptions = computed(() => {
  return optionList.value.map(item => ({
    value: item.label,
    label: item.label
  }))
})

const singleAnswer = computed(() => (localValue.value as SingleChoiceData).answer)
const multipleAnswer = computed(() => (localValue.value as MultipleChoiceData).answer)
const fillBlankAnswer = computed(() => (localValue.value as FillBlankData).answer)
const judgementAnswer = computed(() => (localValue.value as any).answer)
const essayAnswer = computed(() => (localValue.value as any).answer)
const compositeValue = computed(() => localValue.value as CompositeData)

const emitChange = () => {
  if (isUpdatingFromParent.value) return // 如果正在从父组件更新，不触发 emit
  emit('update:modelValue', JSON.parse(JSON.stringify(localValue.value)))
}

const normalizeAnswersAfterOptionChange = () => {
  if (props.type === 'single') {
    if (!optionList.value.some(item => item.label === singleAnswer.value.correctOption)) {
      singleAnswer.value.correctOption = optionList.value[0]?.label || 'A'
    }
  }

  if (props.type === 'multiple') {
    multipleAnswer.value.correctOptions = multipleAnswer.value.correctOptions.filter(label =>
      optionList.value.some(item => item.label === label)
    )
  }
}

// 处理单选答案变化
const handleSingleAnswerChange = (value: string) => {
  singleAnswer.value.correctOption = value
  emitChange()
}

// 处理多选答案变化
const handleMultipleAnswerChange = (values: string[]) => {
  multipleAnswer.value.correctOptions = values
  emitChange()
}

const addOption = () => {
  optionList.value = relabelOptions([...optionList.value, { label: '', content: '' }])
  normalizeAnswersAfterOptionChange()
  emitChange()
}

const removeOption = (index: number) => {
  optionList.value = relabelOptions(optionList.value.filter((_, itemIndex) => itemIndex !== index))
  normalizeAnswersAfterOptionChange()
  emitChange()
}

const moveOption = (index: number, direction: 'up' | 'down') => {
  const targetIndex = direction === 'up' ? index - 1 : index + 1
  if (targetIndex < 0 || targetIndex >= optionList.value.length) {
    return
  }

  // 只交换内容，不改变 label
  const currentContent = optionList.value[index].content
  const targetContent = optionList.value[targetIndex].content
  
  optionList.value[index].content = targetContent
  optionList.value[targetIndex].content = currentContent
  
  // 不需要调用 normalizeAnswersAfterOptionChange，因为 label 没变
  emitChange()
}

const addBlank = () => {
  fillBlankAnswer.value.blanks.push({
    index: fillBlankAnswer.value.blanks.length,
    acceptedAnswers: []
  })
  emitChange()
}

const setJudgement = (value: boolean) => {
  judgementAnswer.value.correct = value
  emitChange()
}

const getSubQuestionLabel = (type: QuestionType) => {
  const typeMap: Record<QuestionType, string> = {
    single: '单选题',
    multiple: '多选题',
    fillBlank: '填空题',
    judgement: '判断题',
    essay: '问答题',
    composite: '组合题'
  }
  return typeMap[type]
}

const getSubOptions = (subQuestion: SubQuestion) => ((subQuestion.data as any).options || []) as Option[]

// 获取子题答案选项（供 a-select 使用）
const getSubAnswerOptions = (subQuestion: SubQuestion) => {
  return getSubOptions(subQuestion).map(item => ({
    value: item.label,
    label: item.label
  }))
}

const syncSubOptionAnswers = (subQuestion: SubQuestion) => {
  const options = getSubOptions(subQuestion)
  if (subQuestion.type === 'single') {
    if (!options.some(item => item.label === (subQuestion.data.answer as any).correctOption)) {
      ;(subQuestion.data.answer as any).correctOption = options[0]?.label || 'A'
    }
  }

  if (subQuestion.type === 'multiple') {
    ;(subQuestion.data.answer as any).correctOptions = ((subQuestion.data.answer as any).correctOptions || []).filter(
      (label: string) => options.some(item => item.label === label)
    )
  }
}

const addSubQuestion = () => {
  compositeValue.value.subQuestions.push({
    id: uuidv4(),
    order: compositeValue.value.subQuestions.length + 1,
    type: 'single',
    data: createSingleChoiceData()
  })
  emitChange()
}

const changeSubQuestionType = (index: number) => {
  const type = compositeValue.value.subQuestions[index].type
  compositeValue.value.subQuestions[index].data = createDataByType(type)
  emitChange()
}

// 处理子题单选答案变化
const handleSubSingleAnswerChange = (subQuestionIndex: number, value: string) => {
  const subQuestion = compositeValue.value.subQuestions[subQuestionIndex]
  ;(subQuestion.data.answer as any).correctOption = value
  emitChange()
}

// 处理子题多选答案变化
const handleSubMultipleAnswerChange = (subQuestionIndex: number, values: string[]) => {
  const subQuestion = compositeValue.value.subQuestions[subQuestionIndex]
  ;(subQuestion.data.answer as any).correctOptions = values
  emitChange()
}

const addSubOption = (subQuestionIndex: number) => {
  const subQuestion = compositeValue.value.subQuestions[subQuestionIndex]
  ;(subQuestion.data as any).options = relabelOptions([
    ...getSubOptions(subQuestion),
    { label: '', content: '' }
  ])
  syncSubOptionAnswers(subQuestion)
  emitChange()
}

const removeSubOption = (subQuestionIndex: number, optionIndex: number) => {
  const subQuestion = compositeValue.value.subQuestions[subQuestionIndex]
  ;(subQuestion.data as any).options = relabelOptions(
    getSubOptions(subQuestion).filter((_, index) => index !== optionIndex)
  )
  syncSubOptionAnswers(subQuestion)
  emitChange()
}

const moveSubOption = (subQuestionIndex: number, optionIndex: number, direction: 'up' | 'down') => {
  const subQuestion = compositeValue.value.subQuestions[subQuestionIndex]
  const options = getSubOptions(subQuestion)
  
  const targetIndex = direction === 'up' ? optionIndex - 1 : optionIndex + 1
  if (targetIndex < 0 || targetIndex >= options.length) {
    return
  }

  // 只交换内容，不改变 label
  const currentContent = options[optionIndex].content
  const targetContent = options[targetIndex].content
  
  options[optionIndex].content = targetContent
  options[targetIndex].content = currentContent
  
  // 不需要调用 syncSubOptionAnswers，因为 label 没变
  emitChange()
}

const setSubJudgement = (index: number, value: boolean) => {
  ;(compositeValue.value.subQuestions[index].data.answer as any).correct = value
  emitChange()
}

const numberText = (value: number) => {
  const list = ['一', '二', '三', '四', '五', '六']
  return list[value - 1] || String(value)
}

watch(
  () => props.modelValue,
  newValue => {
    const newValueStr = JSON.stringify(newValue || createDefaultQuestionData(props.type))
    const currentValueStr = JSON.stringify(localValue.value)
    // 只有当值真正不同时才更新，避免递归
    if (newValueStr !== currentValueStr) {
      isUpdatingFromParent.value = true
      localValue.value = JSON.parse(newValueStr)
      // 使用 nextTick 确保更新完成后再重置标志
      setTimeout(() => {
        isUpdatingFromParent.value = false
      }, 0)
    }
  },
  { deep: true }
)

watch(
  () => props.type,
  newValue => {
    if (localValue.value.type !== newValue) {
      localValue.value = createDefaultQuestionData(newValue)
      emitChange()
    }
  }
)

// 监听 localValue 变化，但使用标志位防止递归
watch(
  localValue,
  () => {
    if (!isUpdatingFromParent.value) {
      emitChange()
    }
  },
  { deep: true, flush: 'post' }
)
</script>

<style scoped>
.question-entry-form {
  padding-top: 8px;
}

.form-row,
.sub-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 18px;
}

.form-label,
.sub-label {
  width: 56px;
  color: #595959;
  line-height: 32px;
  flex-shrink: 0;
}

.form-content {
  flex: 1;
  min-width: 0;
}

.options-panel,
.sub-question-card {
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.option-row {
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr) 96px;
  gap: 12px;
  align-items: flex-start;
  padding: 12px 16px;
  border-bottom: 1px solid #f5f5f5;
}

.option-row:last-child {
  border-bottom: none;
}

.option-letter {
  color: #434343;
  line-height: 32px;
  margin-top: 4px;
}

.option-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 4px;
}

.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: #bfbfbf;
  cursor: pointer;
}

.icon-btn:hover:not(:disabled) {
  color: #13a8a8;
}

.icon-btn:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.inline-action {
  padding-left: 0;
  color: #13a8a8;
}

.blank-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.blank-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.blank-label {
  width: 92px;
  color: #595959;
  flex-shrink: 0;
}

.checkbox-row {
  margin-top: 12px;
}

.judgement-row {
  display: flex;
  gap: 16px;
  line-height: 32px;
}

.sub-question-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sub-question-card {
  padding: 16px;
  background: #fff;
}

.sub-question-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  font-weight: 600;
}

.sub-options {
  flex: 1;
}

.sub-answer-row {
  flex: 1;
  line-height: 32px;
}
</style>
