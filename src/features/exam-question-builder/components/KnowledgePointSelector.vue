<!--
  知识点选择器组件
  提供树形结构的知识点选择功能，支持搜索和教材筛选
-->
<template>
  <div>
    <a-button @click="showModal">
      选择知识点
    </a-button>

    <a-modal
      v-model:open="visible"
      title="选择知识点"
      width="600px"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-space direction="vertical" :size="12" style="width: 100%">
        <!-- 教材筛选 -->
        <a-select
          v-model:value="selectedTextbook"
          placeholder="选择教材筛选（可选）"
          allow-clear
          style="width: 100%"
          @change="handleTextbookChange"
        >
          <a-select-option value="textbook1">人教版</a-select-option>
          <a-select-option value="textbook2">北师大版</a-select-option>
          <a-select-option value="textbook3">苏教版</a-select-option>
        </a-select>

        <!-- 搜索框 -->
        <a-input-search
          v-model:value="searchKeyword"
          placeholder="搜索知识点"
          @search="handleSearch"
        />

        <!-- 树形结构 -->
        <a-spin :spinning="isLoading">
          <a-tree
            v-if="filteredTreeData.length > 0"
            v-model:checkedKeys="selectedKeys"
            v-model:expandedKeys="expandedKeys"
            checkable
            :tree-data="filteredTreeData"
            :field-names="{ title: 'name', key: 'id', children: 'children' }"
            style="max-height: 400px; overflow-y: auto"
          />
          <a-empty v-else description="暂无知识点数据" />
        </a-spin>
      </a-space>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useMetadataStore } from '../stores/metadataStore'
import type { KnowledgePoint } from '../types/metadata'

/**
 * 组件属性
 */
interface Props {
  modelValue?: string[]
  textbookFilter?: string
  multiple?: boolean
}

/**
 * 组件事件
 */
interface Emits {
  (e: 'update:modelValue', ids: string[]): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  multiple: true
})

const emit = defineEmits<Emits>()

// 使用元数据 Store
const metadataStore = useMetadataStore()

// 内部状态
const visible = ref(false)
const selectedKeys = ref<string[]>([...props.modelValue])
const expandedKeys = ref<string[]>([])
const searchKeyword = ref('')
const selectedTextbook = ref<string | undefined>(props.textbookFilter)

// 计算属性
const knowledgePoints = computed(() => {
  const cacheKey = selectedTextbook.value 
    ? JSON.stringify({ textbookId: selectedTextbook.value })
    : 'default'
  return metadataStore.knowledgePoints[cacheKey] || []
})

const isLoading = computed(() => {
  const cacheKey = selectedTextbook.value 
    ? `knowledgePoints-${JSON.stringify({ textbookId: selectedTextbook.value })}`
    : 'knowledgePoints-default'
  return metadataStore.isLoading(cacheKey)
})

/**
 * 过滤树形数据（根据搜索关键词）
 */
const filteredTreeData = computed(() => {
  if (!searchKeyword.value) {
    return knowledgePoints.value
  }

  const keyword = searchKeyword.value.toLowerCase()
  
  const filterTree = (nodes: KnowledgePoint[]): KnowledgePoint[] => {
    return nodes.reduce((acc: KnowledgePoint[], node) => {
      const matchesKeyword = node.name.toLowerCase().includes(keyword)
      const filteredChildren = node.children ? filterTree(node.children) : []
      
      if (matchesKeyword || filteredChildren.length > 0) {
        acc.push({
          ...node,
          children: filteredChildren.length > 0 ? filteredChildren : node.children
        })
      }
      
      return acc
    }, [])
  }

  return filterTree(knowledgePoints.value)
})

/**
 * 显示弹窗
 */
const showModal = async () => {
  visible.value = true
  await loadKnowledgePoints()
}

/**
 * 加载知识点数据
 */
const loadKnowledgePoints = async () => {
  try {
    const filter = selectedTextbook.value 
      ? { textbookId: selectedTextbook.value }
      : undefined
    await metadataStore.fetchKnowledgePoints(filter)
  } catch (error) {
    console.error('加载知识点失败:', error)
  }
}

/**
 * 处理教材筛选变化
 */
const handleTextbookChange = async () => {
  await loadKnowledgePoints()
}

/**
 * 处理搜索
 */
const handleSearch = () => {
  // 搜索时自动展开所有匹配的节点
  if (searchKeyword.value) {
    const expandAll = (nodes: KnowledgePoint[]): string[] => {
      return nodes.reduce((acc: string[], node) => {
        acc.push(node.id)
        if (node.children) {
          acc.push(...expandAll(node.children))
        }
        return acc
      }, [])
    }
    expandedKeys.value = expandAll(filteredTreeData.value)
  } else {
    expandedKeys.value = []
  }
}

/**
 * 确认选择
 */
const handleOk = () => {
  emit('update:modelValue', selectedKeys.value)
  visible.value = false
}

/**
 * 取消选择
 */
const handleCancel = () => {
  // 恢复到原始选择
  selectedKeys.value = [...props.modelValue]
  visible.value = false
}

/**
 * 监听外部值变化
 */
watch(
  () => props.modelValue,
  (newValue) => {
    selectedKeys.value = [...newValue]
  },
  { deep: true }
)

/**
 * 监听教材筛选属性变化
 */
watch(
  () => props.textbookFilter,
  (newValue) => {
    selectedTextbook.value = newValue
  }
)
</script>
