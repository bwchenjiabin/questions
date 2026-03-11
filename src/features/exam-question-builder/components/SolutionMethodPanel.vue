<template>
  <div class="solution-method-panel">
    <div class="row">
      <span class="label">已选方法：</span>
      <div class="content selected-box">
        <div class="selected-tags">
          <a-tag
            v-for="item in selectedTags"
            :key="item.id"
            closable
            color="cyan"
            @close="removeMethod(item.id)"
          >
            {{ item.name }}
          </a-tag>
        </div>
      </div>
    </div>

    <div class="row">
      <span class="label">方法：</span>
      <div class="content tree-panel">
        <a-spin :spinning="isLoading">
          <a-tree
            :key="treeRenderKey"
            :checkedKeys="treeCheckedKeys"
            checkable
            :tree-data="currentTreeData"
            :default-expanded-keys="defaultExpandedKeys"
            :check-strictly="false"
            :selectable="false"
            @check="handleTreeCheck"
          />
        </a-spin>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, nextTick } from 'vue'
import { fetchSolutionMethods, type ApiTreeNode } from '../services/api/metadata'

interface Props {
  modelValue: string[]
}

interface Emits {
  (e: 'update:modelValue', value: string[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

interface TreeNode {
  title: string
  key: string
  disabled?: boolean
  children?: TreeNode[]
}

// 接口数据状态
const apiData = ref<ApiTreeNode[]>([])
const isLoading = ref(false)
const forceUpdateKey = ref(0)
const isSyncing = ref(false) // 防止循环同步

const treeCheckedKeys = ref<string[]>([...(props.modelValue || [])])

// 转换接口数据为 Tree 组件格式
const convertApiDataToTreeData = (apiNodes: ApiTreeNode[]): TreeNode[] => {
  return apiNodes.map(node => ({
    title: node.title,
    key: node.key,
    disabled: !node.selectable,
    children: node.children ? convertApiDataToTreeData(node.children) : undefined
  }))
}

// 获取所有可展开的节点 key
const getExpandableKeys = (nodes: ApiTreeNode[]): string[] => {
  const keys: string[] = []
  const traverse = (items: ApiTreeNode[]) => {
    items.forEach(item => {
      if (item.children && item.children.length > 0) {
        keys.push(item.key)
        traverse(item.children)
      }
    })
  }
  traverse(nodes)
  return keys
}

const flattenTree = (nodes: TreeNode[]): TreeNode[] => {
  return nodes.flatMap(item => [item, ...(item.children ? flattenTree(item.children) : [])])
}

const currentTreeData = computed(() => {
  return convertApiDataToTreeData(apiData.value)
})

const defaultExpandedKeys = computed(() => {
  return getExpandableKeys(apiData.value).slice(0, 3) // 默认展开前3层
})

const treeRenderKey = computed(() => {
  return `methods-${forceUpdateKey.value}-${apiData.value.length}`
})

const selectedTags = computed(() => {
  const treeNodes = flattenTree(currentTreeData.value)
  const nameMap = new Map(treeNodes.map(item => [item.key, item]))

  return treeCheckedKeys.value
    .map(id => nameMap.get(id))
    .filter((item): item is TreeNode => Boolean(item))
    .map(item => ({
      id: item.key,
      name: item.title
    }))
})

// 接口调用函数
const fetchMethodData = async (): Promise<ApiTreeNode[]> => {
  isLoading.value = true
  try {
    return await fetchSolutionMethods()
  } catch (error) {
    console.error('获取解题方法数据失败:', error)
    // 返回空数组作为降级处理
    return []
  } finally {
    isLoading.value = false
  }
}

const removeMethod = (id: string) => {
  // 从 treeCheckedKeys 中移除
  treeCheckedKeys.value = treeCheckedKeys.value.filter(item => item !== id)
  
  // 强制更新 Tree 组件
  forceUpdateKey.value++
  
  // 同步到模型
  syncValue()
}

const handleTreeCheck = (checkedKeys: any) => {
  let newCheckedKeys: string[] = []
  
  // 处理 Ant Design Vue 的不同版本格式
  if (Array.isArray(checkedKeys)) {
    // 直接是数组格式
    newCheckedKeys = checkedKeys.map(String)
  } else if (checkedKeys && typeof checkedKeys === 'object') {
    // 对象格式，可能有 checked 属性
    if ('checked' in checkedKeys && Array.isArray(checkedKeys.checked)) {
      newCheckedKeys = checkedKeys.checked.map(String)
    } else if ('checkedKeys' in checkedKeys && Array.isArray(checkedKeys.checkedKeys)) {
      newCheckedKeys = checkedKeys.checkedKeys.map(String)
    }
  }
  
  // 直接更新
  treeCheckedKeys.value = [...newCheckedKeys]
  
  // 异步同步到模型
  nextTick(() => {
    syncValue()
  })
}

const syncValue = () => {
  if (isSyncing.value) return
  isSyncing.value = true
  
  try {
    emit('update:modelValue', [...treeCheckedKeys.value])
  } finally {
    isSyncing.value = false
  }
}

const loadTreeData = async () => {
  const data = await fetchMethodData()
  apiData.value = data
  
  // 数据加载完成后，验证并同步选中状态
  await nextTick()
  
  // 获取树中所有有效的 key
  const treeNodes = flattenTree(convertApiDataToTreeData(data))
  const validKeys = new Set(treeNodes.map(node => node.key))
  
  // 只保留树中存在的 key
  const filteredKeys = (props.modelValue || []).filter(key => validKeys.has(key))
  
  // 如果过滤后的 keys 与原始不同，说明有无效的 key，需要通知父组件
  if (filteredKeys.length !== (props.modelValue || []).length) {
    console.warn('解题方法: 检测到无效的选中项，已自动清理')
    treeCheckedKeys.value = filteredKeys
    syncValue()
  } else {
    treeCheckedKeys.value = [...filteredKeys]
  }
  
  forceUpdateKey.value++
}

watch(
  () => props.modelValue,
  async (newValue) => {
    if (isSyncing.value) return
    
    // 如果树数据还未加载，直接使用新值
    if (apiData.value.length === 0) {
      treeCheckedKeys.value = [...(newValue || [])]
      forceUpdateKey.value++
      return
    }
    
    await nextTick()
    
    // 验证新值中的 key 是否都在树中存在
    const treeNodes = flattenTree(currentTreeData.value)
    const validKeys = new Set(treeNodes.map(node => node.key))
    const filteredKeys = (newValue || []).filter(key => validKeys.has(key))
    
    // 如果有无效的 key，记录警告
    if (filteredKeys.length !== (newValue || []).length) {
      const invalidKeys = (newValue || []).filter(key => !validKeys.has(key))
      console.warn('解题方法: 接收到无效的选中项:', invalidKeys)
    }
    
    treeCheckedKeys.value = [...filteredKeys]
    forceUpdateKey.value++
  },
  { deep: true }
)

// 监听 treeCheckedKeys 变化
watch(
  treeCheckedKeys,
  () => {
    // 变化监听已移除调试信息
  },
  { deep: true }
)

// 监听 API 数据变化，确保选中状态正确同步
watch(
  () => apiData.value,
  async () => {
    if (isSyncing.value) return
    
    await nextTick()
    
    // 获取树中所有有效的 key
    const treeNodes = flattenTree(currentTreeData.value)
    const validKeys = new Set(treeNodes.map(node => node.key))
    
    // 只保留树中存在的 key
    const filteredKeys = treeCheckedKeys.value.filter(key => validKeys.has(key))
    
    if (filteredKeys.length !== treeCheckedKeys.value.length) {
      treeCheckedKeys.value = filteredKeys
      syncValue()
    }
    
    forceUpdateKey.value++
  },
  { deep: true }
)

onMounted(async () => {
  await loadTreeData()
})
</script>

<style scoped>
.solution-method-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.label {
  width: 86px;
  line-height: 32px;
  color: #595959;
  flex-shrink: 0;
}

.content {
  flex: 1;
}

.selected-box {
  min-height: 86px;
  border: 1px solid #d9d9d9;
  background: #fff;
  padding: 10px 12px;
}

.selected-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: flex-start;
}

.tree-panel {
  border: 1px solid #e8e8e8;
  min-height: 214px;
  padding: 12px 16px;
  background: #fff;
}

@media (max-width: 900px) {
  .row {
    flex-direction: column;
    gap: 8px;
  }

  .label {
    width: auto;
  }
}
</style>
