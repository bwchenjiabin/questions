<!--
  难度选择器组件
  提供难度等级和难度方法选择功能
-->
<template>
  <a-space direction="vertical" :size="12" style="width: 100%">
    <a-form-item label="难度等级" name="difficultyLevel">
      <a-select
        v-model:value="internalLevel"
        placeholder="请选择难度等级"
        :loading="isLoadingLevels"
        @change="handleLevelChange"
      >
        <a-select-option
          v-for="level in difficultyLevels"
          :key="level.id"
          :value="level.value"
        >
          {{ level.name }}
        </a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item label="难度方法" name="difficultyMethod">
      <a-select
        v-model:value="internalMethod"
        placeholder="请选择难度方法（可选）"
        allow-clear
        @change="handleMethodChange"
      >
        <a-select-option value="calculation">计算</a-select-option>
        <a-select-option value="program">程序</a-select-option>
        <a-select-option value="auto-reasoning">自动推理</a-select-option>
        <a-select-option value="manual">人工评估</a-select-option>
      </a-select>
    </a-form-item>
  </a-space>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useMetadataStore } from '../stores/metadataStore'
import type { DifficultyConfig } from '../types/metadata'

/**
 * 组件属性
 */
interface Props {
  modelValue?: DifficultyConfig
}

/**
 * 组件事件
 */
interface Emits {
  (e: 'update:modelValue', value: DifficultyConfig): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({ level: 'medium' })
})

const emit = defineEmits<Emits>()

// 使用元数据 Store
const metadataStore = useMetadataStore()

// 内部状态
const internalLevel = ref<'easy' | 'medium' | 'hard'>(props.modelValue?.level || 'medium')
const internalMethod = ref<string | undefined>(props.modelValue?.method)

// 计算属性
const difficultyLevels = computed(() => metadataStore.difficultyLevels)
const isLoadingLevels = computed(() => metadataStore.isLoading('difficultyLevels'))

/**
 * 处理难度等级变化
 */
const handleLevelChange = () => {
  emitUpdate()
}

/**
 * 处理难度方法变化
 */
const handleMethodChange = () => {
  emitUpdate()
}

/**
 * 发送更新事件
 */
const emitUpdate = () => {
  emit('update:modelValue', {
    level: internalLevel.value,
    method: internalMethod.value
  })
}

/**
 * 监听外部值变化
 */
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      internalLevel.value = newValue.level || 'medium'
      internalMethod.value = newValue.method
    }
  },
  { deep: true }
)

/**
 * 组件挂载时加载难度等级数据
 */
onMounted(async () => {
  try {
    await metadataStore.fetchDifficultyLevels()
  } catch (error) {
    console.error('加载难度等级失败:', error)
  }
})
</script>
