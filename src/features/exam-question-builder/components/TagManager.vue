<template>
  <div class="tag-manager">
    <a-space :size="8" wrap>
      <!-- 显示已选标签 -->
      <a-tag
        v-for="tag in tags"
        :key="tag.id"
        :color="getTagColor(tag.type)"
        :closable="!readonly"
        @close="handleRemove(tag.id)"
      >
        {{ tag.label }}
      </a-tag>

      <!-- 添加标签按钮 -->
      <a-button
        v-if="!readonly && canAddMore"
        type="dashed"
        size="small"
        @click="handleAdd"
      >
        <template #icon>
          <PlusOutlined />
        </template>
        添加
      </a-button>
    </a-space>

    <!-- 空状态提示 -->
    <div v-if="tags.length === 0 && !readonly" class="empty-hint">
      <span class="empty-text">暂无标签，点击添加按钮选择</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import type { Tag } from '../types/metadata'

/**
 * TagManager 组件属性
 */
interface Props {
  /** 标签列表 */
  tags: Tag[]
  /** 是否只读 */
  readonly?: boolean
  /** 最大标签数量 */
  maxTags?: number
}

/**
 * TagManager 组件事件
 */
interface Emits {
  (e: 'remove', tagId: string): void
  (e: 'add'): void
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
  maxTags: undefined
})

const emit = defineEmits<Emits>()

/**
 * 是否可以添加更多标签
 */
const canAddMore = computed(() => {
  if (props.maxTags === undefined) return true
  return props.tags.length < props.maxTags
})

/**
 * 获取标签颜色
 * 根据标签类型返回不同的颜色
 */
const getTagColor = (type: 'knowledgePoint' | 'courseStandard'): string => {
  const colorMap = {
    knowledgePoint: 'blue',
    courseStandard: 'green'
  }
  return colorMap[type]
}

/**
 * 处理删除标签
 */
const handleRemove = (tagId: string) => {
  emit('remove', tagId)
}

/**
 * 处理添加标签
 */
const handleAdd = () => {
  emit('add')
}
</script>

<style scoped>
.tag-manager {
  width: 100%;
  min-height: 32px;
}

.empty-hint {
  display: flex;
  align-items: center;
  min-height: 32px;
}

.empty-text {
  color: #bfbfbf;
  font-size: 14px;
}
</style>
