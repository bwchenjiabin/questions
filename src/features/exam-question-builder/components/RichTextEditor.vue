<!--
  富文本编辑器组件
  默认显示简洁的输入框，点击后展开为富文本编辑器
-->
<template>
  <div class="rich-text-editor">
    <!-- 简洁模式：显示为普通输入框 -->
    <div
      v-if="!isEditing && !readonly"
      class="simple-input"
      @click="startEditing"
    >
      <div v-if="displayText" class="input-content" v-html="displayText"></div>
      <div v-else class="input-placeholder">{{ placeholder }}</div>
    </div>

    <!-- 编辑模式：显示富文本编辑器 -->
    <div v-if="isEditing || readonly" class="editor-container">
      <Toolbar
        v-if="!readonly"
        :editor="editorRef"
        :default-config="toolbarConfig"
        :mode="mode"
        class="editor-toolbar"
      />
      <Editor
        v-model="valueHtml"
        :default-config="editorConfig"
        :mode="mode"
        class="editor-content"
        :style="{ height: editorHeight }"
        @onCreated="handleCreated"
        @onChange="handleChange"
        @onBlur="handleEditorBlur"
      />
      <div v-if="!readonly" class="editor-actions">
        <a-button size="small" @click="cancelEditing">取消</a-button>
        <a-button size="small" type="primary" @click="confirmEditing">确定</a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount, shallowRef, computed } from 'vue'
// @ts-ignore
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import type { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import '@wangeditor/editor/dist/css/style.css'
// @ts-ignore
import formulaModule from '@wangeditor/plugin-formula'
// 导入 KaTeX 样式（公式插件依赖 KaTeX）
import 'katex/dist/katex.min.css'
import { Boot } from '@wangeditor/editor'

// 注册公式插件（只注册一次）
try {
  Boot.registerModule(formulaModule)
} catch (error) {
  // 插件可能已经注册过，忽略错误
}

/**
 * 组件属性
 */
interface Props {
  modelValue?: string
  placeholder?: string
  readonly?: boolean
  rows?: number
  maxlength?: number
  showCount?: boolean
}

/**
 * 组件事件
 */
interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
  (e: 'blur'): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '请输入内容',
  readonly: false,
  rows: 6,
  showCount: false
})

const emit = defineEmits<Emits>()

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef<IDomEditor>()

// 内容 HTML
const valueHtml = ref(props.modelValue || '')

// 编辑状态
const isEditing = ref(false)

// 临时内容（用于取消编辑时恢复）
const tempValue = ref('')

// 编辑器模式
const mode = 'default' // 或 'simple'

// 根据 rows 计算编辑器高度
const editorHeight = computed(() => {
  const lineHeight = 24 // 每行大约 24px
  const padding = 20 // 上下内边距
  return `${props.rows * lineHeight + padding}px`
})

// 显示文本（去除 HTML 标签用于预览）
const displayText = computed(() => {
  if (!valueHtml.value) return ''
  // 保留 HTML 格式用于预览
  return valueHtml.value
})

// 工具栏配置
const toolbarConfig: Partial<IToolbarConfig> = {
  toolbarKeys: [
    'bold',
    'italic',
    'underline',
    'through',
    'color',
    'bgColor',
    '|',
    'fontSize',
    'fontFamily',
    'lineHeight',
    '|',
    'bulletedList',
    'numberedList',
    'todo',
    '|',
    'emotion',
    'insertLink',
    'insertImage',
    'insertTable',
    'codeBlock',
    '|',
    'insertFormula', // 插入公式按钮
    'editFormula', // 编辑公式按钮
    '|',
    'undo',
    'redo',
    '|',
    'clearStyle'
  ]
}

// 编辑器配置
const editorConfig: Partial<IEditorConfig> = {
  placeholder: props.placeholder,
  readOnly: props.readonly,
  // 配置悬浮菜单
  hoverbarKeys: {
    formula: {
      menuKeys: ['editFormula'] // 选中公式时显示编辑按钮
    }
  },
  MENU_CONF: {
    // 配置上传图片
    uploadImage: {
      // 自定义上传
      async customUpload(file: File, insertFn: any) {
        // 这里可以实现图片上传到服务器的逻辑
        // 暂时使用 base64
        const reader = new FileReader()
        reader.onload = (e) => {
          const base64 = e.target?.result as string
          insertFn(base64, file.name, base64)
        }
        reader.readAsDataURL(file)
      }
    }
  }
}

/**
 * 开始编辑
 */
const startEditing = () => {
  tempValue.value = valueHtml.value
  isEditing.value = true
}

/**
 * 确认编辑
 */
const confirmEditing = () => {
  isEditing.value = false
  emit('update:modelValue', valueHtml.value)
  emit('change', valueHtml.value)
  emit('blur')
}

/**
 * 取消编辑
 */
const cancelEditing = () => {
  valueHtml.value = tempValue.value
  isEditing.value = false
  emit('blur')
}

/**
 * 编辑器创建完成
 */
const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor
  // 自动聚焦
  setTimeout(() => {
    editor.focus()
  }, 100)
}

/**
 * 处理内容变化
 */
const handleChange = (editor: IDomEditor) => {
  const html = editor.getHtml()
  valueHtml.value = html
}

/**
 * 处理编辑器失焦
 */
const handleEditorBlur = () => {
  // 不自动关闭编辑器，需要用户点击确定或取消
}

/**
 * 监听外部值变化
 */
watch(
  () => props.modelValue,
  (newValue) => {
    // 只有当外部值与内部值不同时才更新
    if (newValue !== valueHtml.value) {
      valueHtml.value = newValue || ''
    }
  }
)

/**
 * 组件销毁时，销毁编辑器
 */
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
</script>

<style scoped>
.rich-text-editor {
  width: 100%;
}

/* 简洁输入框样式 */
.simple-input {
  min-height: 32px;
  padding: 4px 11px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background-color: #fff;
  cursor: text;
  transition: all 0.3s;
}

.simple-input:hover {
  border-color: #40a9ff;
}

.input-content {
  color: #262626;
  line-height: 1.5715;
  word-break: break-word;
  min-height: 22px;
}

/* 限制简洁模式下的显示高度 */
.input-content :deep(p) {
  margin: 0;
  line-height: 1.5715;
}

.input-content :deep(img) {
  max-width: 100%;
  height: auto;
}

.input-placeholder {
  color: #bfbfbf;
  line-height: 1.5715;
  user-select: none;
}

/* 编辑器容器 */
.editor-container {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  overflow: hidden;
  background-color: #fff;
}

.editor-container:focus-within {
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.editor-toolbar {
  border-bottom: 1px solid #e8e8e8;
  background-color: #fafafa;
}

.editor-content {
  overflow-y: auto;
}

/* 编辑器操作按钮 */
.editor-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 8px 12px;
  border-top: 1px solid #e8e8e8;
  background-color: #fafafa;
}

/* 覆盖编辑器默认样式 */
:deep(.w-e-text-container) {
  background-color: #fff;
}

:deep(.w-e-text-placeholder) {
  color: #bfbfbf;
  font-style: normal;
}

:deep(.w-e-toolbar) {
  background-color: #fafafa !important;
  border-bottom: 1px solid #e8e8e8 !important;
}

:deep(.w-e-bar-item button) {
  color: #595959;
}

:deep(.w-e-bar-item button:hover) {
  color: #13a8a8;
  background-color: #e6f7f7;
}

:deep(.w-e-bar-item-active button) {
  color: #13a8a8;
  background-color: #e6f7f7;
}

/* 简洁模式下的内容样式优化 */
:deep(.input-content) {
  max-height: 100px;
  overflow: hidden;
  position: relative;
}

:deep(.input-content::after) {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 20px;
  background: linear-gradient(to bottom, transparent, #fff);
  pointer-events: none;
}
</style>
