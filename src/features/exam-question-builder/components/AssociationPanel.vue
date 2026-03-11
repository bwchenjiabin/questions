<template>
  <div class="association-panel">
    <div class="row">
      <span class="label">{{ selectedLabel }}：</span>
      <div class="content selected-box">
        <div class="selected-tags">
          <a-tag
            v-for="item in selectedTags"
            :key="item.id"
            closable
            color="cyan"
            @close="removeKnowledgePoint(item.id)"
          >
            {{ item.name }}
          </a-tag>
        </div>
      </div>
    </div>

    <div class="row">
      <span class="label">筛选条件：</span>
      <div class="content filter-actions">
        <a-button
          :type="localValue.filterMode === 'chapter' ? 'primary' : 'default'"
          @click="localValue.filterMode = 'chapter'"
        >
          章节
        </a-button>
        <a-button
          :type="localValue.filterMode === 'knowledge' ? 'primary' : 'default'"
          @click="localValue.filterMode = 'knowledge'"
        >
          知识点
        </a-button>
      </div>
    </div>

    <div class="row">
      <span class="label">{{ localValue.filterMode === 'chapter' ? '章节：' : '知识点：' }}</span>
      <div class="content">
        <div class="filter-bar">
          <div class="select-item">
            <span class="select-label">版本：</span>
            <a-select
              v-model:value="localValue.courseId"
              placeholder="选择版本"
              style="width: 320px"
              allow-clear
              @change="handleCourseChange"
            >
              <a-select-option v-for="item in versionOptions" :key="item.id" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </div>
          <div class="select-item">
            <span class="select-label">册别：</span>
            <a-select
              v-model:value="localValue.gradeId"
              placeholder="选择年级册别"
              style="width: 320px"
              allow-clear
            >
              <a-select-option v-for="item in editionOptions" :key="item.id" :value="item.id">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </div>
        </div>

        <div class="tree-panel">
          <a-spin :spinning="localValue.filterMode === 'chapter' ? isLoadingChapter : isLoadingKnowledge">
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
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, nextTick } from 'vue'
import { useMetadataStore } from '../stores/metadataStore'
import { fetchChapters, fetchKnowledgeTree, type ApiTreeNode } from '../services/api/metadata'
import type { Course, Grade } from '../types/metadata'

interface AssociationValue {
  courseId?: string
  gradeId?: string
  filterMode: 'chapter' | 'knowledge'
  knowledgePoints: string[]
}

interface Props {
  modelValue: AssociationValue
}

interface Emits {
  (e: 'update:modelValue', value: AssociationValue): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const metadataStore = useMetadataStore()

interface TreeNode {
  title: string
  key: string
  disabled?: boolean
  children?: TreeNode[]
}

const localValue = ref<AssociationValue>({
  courseId: props.modelValue?.courseId,
  gradeId: props.modelValue?.gradeId,
  filterMode: props.modelValue?.filterMode || 'chapter',
  knowledgePoints: [...(props.modelValue?.knowledgePoints || [])]
})

// 接口数据状态
const chapterApiData = ref<ApiTreeNode[]>([])
const knowledgeApiData = ref<ApiTreeNode[]>([])
const isLoadingChapter = ref(false)
const isLoadingKnowledge = ref(false)
const forceUpdateKey = ref(0)
const isSyncing = ref(false) // 防止循环同步

const flattenTree = (nodes: TreeNode[]): TreeNode[] => {
  return nodes.flatMap(item => [item, ...(item.children ? flattenTree(item.children) : [])])
}

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

// 接口调用函数
const fetchChapterData = async (courseId?: string, gradeId?: string): Promise<ApiTreeNode[]> => {
  isLoadingChapter.value = true
  try {
    const result = await fetchChapters(courseId, gradeId)
    return result
  } catch (error) {
    console.error('获取章节数据失败:', error)
    // 返回空数组作为降级处理
    return []
  } finally {
    isLoadingChapter.value = false
  }
}

const fetchKnowledgeData = async (courseId?: string, gradeId?: string): Promise<ApiTreeNode[]> => {
  isLoadingKnowledge.value = true
  try {
    const result = await fetchKnowledgeTree(courseId, gradeId)
    return result
  } catch (error) {
    console.error('获取知识点数据失败:', error)
    // 返回空数组作为降级处理
    return []
  } finally {
    isLoadingKnowledge.value = false
  }
}

const fallbackVersionOptions: Array<{ id: string; name: string }> = [
  { id: 'rjb', name: '人教版' },
  { id: 'bsd', name: '北师大版' },
  { id: 'suj', name: '苏教版' }
]

const fallbackEditionOptions: Array<{ id: string; name: string }> = [
  { id: 'grade1-1', name: '一年级上册' },
  { id: 'grade1-2', name: '一年级下册' },
  { id: 'grade2-1', name: '二年级上册' },
  { id: 'grade2-2', name: '二年级下册' }
]

const versionOptions = computed<Array<{ id: string; name: string }>>(() => {
  if (metadataStore.courses.length) {
    return metadataStore.courses.map((item: Course) => ({
      id: item.id,
      name: item.name
    }))
  }

  return fallbackVersionOptions
})

const editionOptions = computed<Array<{ id: string; name: string }>>(() => {
  if (localValue.value.courseId && metadataStore.getGradesByCourse(localValue.value.courseId).length) {
    return metadataStore.getGradesByCourse(localValue.value.courseId).map((item: Grade) => ({
      id: item.id,
      name: item.name
    }))
  }

  return fallbackEditionOptions
})

const currentTreeData = computed(() => {
  const apiData = localValue.value.filterMode === 'chapter' ? chapterApiData.value : knowledgeApiData.value
  return convertApiDataToTreeData(apiData)
})

const currentApiData = computed(() => {
  return localValue.value.filterMode === 'chapter' ? chapterApiData.value : knowledgeApiData.value
})

const chapterKeySet = computed(() => {
  const treeData = convertApiDataToTreeData(chapterApiData.value)
  return new Set(flattenTree(treeData).map(item => item.key))
})

const knowledgeKeySet = computed(() => {
  const treeData = convertApiDataToTreeData(knowledgeApiData.value)
  return new Set(flattenTree(treeData).map(item => item.key))
})

const chapterCheckedKeys = ref<string[]>([])
const knowledgeCheckedKeys = ref<string[]>([])
const treeCheckedKeys = ref<string[]>([])

// 添加 watch 来监听 treeCheckedKeys 的变化
watch(
  treeCheckedKeys,
  () => {
    // 变化监听已移除调试信息
  },
  { deep: true }
)

const selectedLabel = computed(() => {
  return localValue.value.filterMode === 'chapter' ? '已选章节' : '已选知识点'
})

const treeRenderKey = computed(() => {
  return `${localValue.value.filterMode}-${currentApiData.value.length}-${forceUpdateKey.value}`
})

const defaultExpandedKeys = computed(() => {
  return getExpandableKeys(currentApiData.value).slice(0, 3) // 默认展开前3层
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

const handleCourseChange = async (courseId?: string) => {
  localValue.value.courseId = courseId
  localValue.value.gradeId = undefined
  if (courseId) {
    await metadataStore.fetchGrades(courseId)
  }
  // 重新加载树形数据
  await loadTreeData()
}

const handleGradeChange = async () => {
  // 册别改变时重新加载树形数据
  await loadTreeData()
}

const loadTreeData = async () => {
  const { courseId, gradeId } = localValue.value
  
  // 保存当前选中的 keys
  const currentKeys = [...(localValue.value.knowledgePoints || [])]
  
  // 并行加载章节和知识点数据
  await Promise.all([
    fetchChapterData(courseId, gradeId).then(data => {
      chapterApiData.value = data
    }),
    fetchKnowledgeData(courseId, gradeId).then(data => {
      knowledgeApiData.value = data
    })
  ])
  
  // 等待 DOM 更新，确保 computed 值已更新
  await nextTick()
  
  // 数据加载完成后，重新分割和同步选中状态
  splitIncomingKeys(currentKeys)
  syncTreeFromMode()
}

const removeKnowledgePoint = (id: string) => {
  // 从 treeCheckedKeys 中移除
  treeCheckedKeys.value = treeCheckedKeys.value.filter(item => item !== id)
  
  // 强制更新 Tree 组件
  forceUpdateKey.value++
  
  // 同步到模型
  syncSelectionToModel()
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
  
  // 直接更新，不通过 v-model
  treeCheckedKeys.value = [...newCheckedKeys]
  
  // 同步到模型
  nextTick(() => {
    syncSelectionToModel()
  })
}

const syncSelectionToModel = () => {
  if (isSyncing.value) return
  isSyncing.value = true
  
  try {
    if (localValue.value.filterMode === 'chapter') {
      chapterCheckedKeys.value = [...treeCheckedKeys.value]
      localValue.value.knowledgePoints = [...chapterCheckedKeys.value]
    } else {
      knowledgeCheckedKeys.value = [...treeCheckedKeys.value]
      localValue.value.knowledgePoints = [...knowledgeCheckedKeys.value]
    }
  } finally {
    isSyncing.value = false
  }
}

const syncTreeFromMode = () => {
  if (isSyncing.value) return
  isSyncing.value = true
  
  try {
    treeCheckedKeys.value = localValue.value.filterMode === 'chapter'
      ? [...chapterCheckedKeys.value]
      : [...knowledgeCheckedKeys.value]
    localValue.value.knowledgePoints = [...treeCheckedKeys.value]
    
    // 强制更新 Tree 组件
    forceUpdateKey.value++
  } finally {
    isSyncing.value = false
  }
}

const splitIncomingKeys = (keys: string[]) => {
  chapterCheckedKeys.value = keys.filter(key => chapterKeySet.value.has(key))
  knowledgeCheckedKeys.value = keys.filter(key => knowledgeKeySet.value.has(key))
}

watch(
  () => props.modelValue,
  newValue => {
    splitIncomingKeys([...(newValue?.knowledgePoints || [])])
    localValue.value = {
      courseId: newValue?.courseId,
      gradeId: newValue?.gradeId,
      filterMode: newValue?.filterMode || 'chapter',
      knowledgePoints: [...(newValue?.knowledgePoints || [])]
    }
    syncTreeFromMode()
  },
  { deep: true }
)

watch(
  () => localValue.value.filterMode,
  async (newMode) => {
    // 确保对应模式的数据已加载
    const isLoading = newMode === 'chapter' ? isLoadingChapter.value : isLoadingKnowledge.value
    const hasData = newMode === 'chapter' ? chapterApiData.value.length > 0 : knowledgeApiData.value.length > 0
    
    // 如果数据未加载且不在加载中，先加载数据
    if (!hasData && !isLoading) {
      await loadTreeData()
    }
    
    // 等待加载完成后再同步
    await nextTick()
    syncTreeFromMode()
  }
)

// 监听册别变化
watch(
  () => localValue.value.gradeId,
  () => {
    handleGradeChange()
  }
)

// 监听 API 数据变化，确保选中状态正确同步
watch(
  [() => chapterApiData.value, () => knowledgeApiData.value],
  () => {
    nextTick(() => {
      splitIncomingKeys([...(localValue.value.knowledgePoints || [])])
      syncTreeFromMode()
    })
  },
  { deep: true }
)

watch(
  localValue,
  () => {
    emit('update:modelValue', {
      courseId: localValue.value.courseId,
      gradeId: localValue.value.gradeId,
      filterMode: localValue.value.filterMode,
      knowledgePoints: [...localValue.value.knowledgePoints]
    })
  },
  { deep: true }
)

onMounted(async () => {
  splitIncomingKeys([...(localValue.value.knowledgePoints || [])])
  
  await Promise.all([
    metadataStore.fetchCourses(),
    metadataStore.fetchKnowledgePoints(),
    loadTreeData()
  ])
  
  if (localValue.value.courseId) {
    await metadataStore.fetchGrades(localValue.value.courseId)
  }
  
  syncTreeFromMode()
})
</script>

<style scoped>
.association-panel {
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

.filter-actions {
  display: flex;
  gap: 8px;
}

.filter-bar {
  display: flex;
  gap: 48px;
  margin-bottom: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.select-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.select-label {
  color: #595959;
  white-space: nowrap;
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

  .filter-bar {
    gap: 12px;
  }

  .select-item {
    width: 100%;
  }
}
</style>
