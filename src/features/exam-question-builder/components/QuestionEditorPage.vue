<template>
  <div class="question-editor-page">
    <div class="page-shell">
      <header class="page-header">
        <div>
          <h1>小学数学</h1>
        </div>

        <a-space wrap>
          <a-button @click="handleBack">返回首页</a-button>
          <a-button type="primary" :loading="saving" @click="saveQuestion">保存</a-button>
        </a-space>
      </header>

      <section class="panel">
        <div class="section-title">流程状态</div>
        <a-table
          :columns="workflowColumns"
          :data-source="workflowData"
          :pagination="false"
          size="small"
          row-key="step"
        />
      </section>

      <QuestionEditor
        ref="editorRef"
        :question-id="editingQuestionId"
        :show-actions="false"
        @save="handleEditorSave"
        @cancel="handleCancel"
        @dirty-change="handleDirtyChange"
      />

      <footer class="page-footer">
        <a-space>
          <a-button @click="handleCancel">取消</a-button>
          <a-button type="primary" :loading="saving" @click="saveQuestion">保存</a-button>
        </a-space>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import QuestionEditor from './QuestionEditor.vue'
import type { Question } from '../types/question'

interface Emits {
  (e: 'back'): void
  (e: 'cancel'): void
  (e: 'save', question: Question): void
}

interface EditorExpose {
  submit: () => Promise<Question | null>
  resetEditor: () => Promise<void>
  startCreateQuestion: () => Promise<void>
  hasUnsavedChanges: { value: boolean }
}

const emit = defineEmits<Emits>()

const editorRef = ref<EditorExpose | null>(null)
const editingQuestionId = ref<string>()
const saving = ref(false)
const hasUnsavedChanges = ref(false)
const lastSavedAt = ref('')

const workflowColumns = [
  { title: '步骤', dataIndex: 'step', key: 'step' },
  { title: '人员', dataIndex: 'person', key: 'person' },
  { title: '时间', dataIndex: 'time', key: 'time' }
]

const workflowData = computed(() => [
  {
    step: editingQuestionId.value ? '编辑' : '创建',
    person: '当前用户',
    time: lastSavedAt.value || '待保存'
  },
  {
    step: '审核',
    person: '待分配',
    time: editingQuestionId.value ? '保存后可发起' : '创建后可发起'
  },
  {
    step: '专审',
    person: '待分配',
    time: '待审核完成'
  }
])

const confirmDiscard = () => {
  if (!hasUnsavedChanges.value) {
    return true
  }

  return window.confirm('当前存在未保存内容，确定继续离开当前编辑吗？')
}

const handleDirtyChange = (dirty: boolean) => {
  hasUnsavedChanges.value = dirty
}

const saveQuestion = async () => {
  if (!editorRef.value) {
    return
  }

  saving.value = true
  const savedQuestion = await editorRef.value.submit()
  saving.value = false

  if (savedQuestion) {
    editingQuestionId.value = savedQuestion.id
    lastSavedAt.value = new Date().toLocaleString()
  }
}

const handleEditorSave = (question: Question) => {
  editingQuestionId.value = question.id
  lastSavedAt.value = new Date().toLocaleString()
  emit('save', question)
}

const handleCancel = async () => {
  if (!confirmDiscard()) {
    return
  }

  emit('cancel')
}

const handleBack = async () => {
  if (!confirmDiscard()) {
    return
  }

  emit('back')
}
</script>

<style scoped>
.question-editor-page {
  min-height: 100vh;
  background: #f5f7fa;
}

.page-shell {
  max-width: 1280px;
  margin: 0 auto;
  padding: 24px;
}

.page-header,
.panel,
.page-footer {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
}

.page-header,
.page-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
}

.panel {
  padding: 20px 24px;
  margin-top: 16px;
}

.section-title {
  margin-bottom: 16px;
  padding-left: 10px;
  border-left: 4px solid #13a8a8;
  font-size: 18px;
  font-weight: 600;
}

.page-footer {
  margin-top: 16px;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .page-shell {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
