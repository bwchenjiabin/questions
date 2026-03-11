<template>
  <div class="course-standard-selector">
    <a-button @click="showModal">
      选择课程标准
    </a-button>

    <a-modal
      v-model:open="visible"
      title="选择课程标准"
      width="720px"
      @ok="handleConfirm"
      @cancel="handleCancel"
    >
      <a-space direction="vertical" :size="12" style="width: 100%">
        <a-input-search
          v-model:value="keyword"
          placeholder="搜索课程标准"
          allow-clear
        />

        <a-spin :spinning="isLoading">
          <a-checkbox-group v-model:value="draftValue" style="width: 100%">
            <div class="standard-list">
              <label
                v-for="item in filteredItems"
                :key="item.id"
                class="standard-item"
              >
                <a-checkbox :value="item.id">
                  <div class="standard-content">
                    <div class="standard-name">{{ item.name }}</div>
                    <div v-if="item.description" class="standard-description">
                      {{ item.description }}
                    </div>
                  </div>
                </a-checkbox>
              </label>
            </div>
          </a-checkbox-group>

          <a-empty v-if="!filteredItems.length" description="暂无课程标准数据" />
        </a-spin>
      </a-space>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useMetadataStore } from '../stores/metadataStore'

interface Props {
  modelValue?: string[]
}

interface Emits {
  (e: 'update:modelValue', value: string[]): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => []
})

const emit = defineEmits<Emits>()
const metadataStore = useMetadataStore()

const visible = ref(false)
const keyword = ref('')
const draftValue = ref<string[]>([...props.modelValue])

const isLoading = computed(() => metadataStore.isLoading('courseStandards'))
const filteredItems = computed(() => {
  const normalizedKeyword = keyword.value.trim().toLowerCase()
  if (!normalizedKeyword) {
    return metadataStore.courseStandards
  }

  return metadataStore.courseStandards.filter(item => {
    const haystack = `${item.name} ${item.description || ''}`.toLowerCase()
    return haystack.includes(normalizedKeyword)
  })
})

const showModal = async () => {
  visible.value = true
  await metadataStore.fetchCourseStandards()
}

const handleConfirm = () => {
  emit('update:modelValue', [...draftValue.value])
  visible.value = false
}

const handleCancel = () => {
  draftValue.value = [...props.modelValue]
  visible.value = false
}

watch(
  () => props.modelValue,
  newValue => {
    draftValue.value = [...newValue]
  },
  { deep: true }
)
</script>

<style scoped>
.standard-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 420px;
  overflow-y: auto;
  padding-right: 4px;
}

.standard-item {
  display: block;
  padding: 12px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  background: #fafafa;
}

.standard-content {
  display: inline-flex;
  flex-direction: column;
  gap: 4px;
}

.standard-name {
  font-weight: 500;
  color: #1f1f1f;
}

.standard-description {
  color: #8c8c8c;
  font-size: 12px;
}
</style>
