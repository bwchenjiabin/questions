<template>
  <div class="category-maintenance-panel">
    <div class="category-left">
      <div class="panel-header">分类</div>
      <div class="category-body">
        <section
          v-for="group in categoryGroups"
          :key="group.key"
          class="category-section"
        >
          <div class="section-header">{{ group.label }}</div>
          <a-checkbox-group
            :value="selectedByGroup[group.key]"
            @change="(value: unknown) => updateGroup(group.key, value as string[])"
          >
            <div class="options-grid">
              <a-checkbox
                v-for="item in group.items"
                :key="item.id"
                :value="item.id"
              >
                {{ item.name }}
              </a-checkbox>
            </div>
          </a-checkbox-group>
        </section>
      </div>
    </div>

    <div class="category-right">
      <div class="selected-header">
        <span>已选{{ selectedItems.length }}项</span>
        <a-button type="link" size="small" @click="clearAll">清除</a-button>
      </div>
      <div class="selected-body">
        <div
          v-for="item in selectedItems"
          :key="item.id"
          class="selected-item"
        >
          <span>{{ item.name }}</span>
          <button class="remove-btn" @click="removeItem(item.id)">×</button>
        </div>
        <div v-if="!selectedItems.length" class="empty-text">暂无已选分类</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string[]
}

interface Emits {
  (e: 'update:modelValue', value: string[]): void
}

interface CategoryOption {
  id: string
  name: string
}

interface CategoryGroup {
  key: string
  label: string
  items: CategoryOption[]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const categoryGroups: CategoryGroup[] = [
  {
    key: 'type',
    label: '题型',
    items: [
      { id: 'type-choice', name: '选择题' },
      { id: 'type-fill', name: '填空题' },
      { id: 'type-judge', name: '判断题' },
      { id: 'type-calc', name: '计算题' },
      { id: 'type-application', name: '应用题' }
    ]
  },
  {
    key: 'difficulty',
    label: '难度',
    items: [
      { id: 'difficulty-easy', name: '易' },
      { id: 'difficulty-normal-easy', name: '较易' },
      { id: 'difficulty-medium', name: '中档' }
    ]
  },
  {
    key: 'source',
    label: '来源',
    items: [
      { id: 'source-final-review', name: '小升初真题' },
      { id: 'source-school', name: '各校小升初' },
      { id: 'source-mock', name: '小升初模拟' },
      { id: 'source-review', name: '小升初复习' },
      { id: 'source-final', name: '期末考试' }
    ]
  }
]

const allOptions = computed(() => categoryGroups.flatMap(group => group.items))

const selectedByGroup = computed(() => {
  const groupMap = new Map<string, string>()
  categoryGroups.forEach(group => {
    group.items.forEach(item => {
      groupMap.set(item.id, group.key)
    })
  })

  return categoryGroups.reduce<Record<string, string[]>>((acc, group) => {
    acc[group.key] = props.modelValue.filter(id => groupMap.get(id) === group.key)
    return acc
  }, {})
})

const selectedItems = computed(() => {
  const optionMap = new Map(allOptions.value.map(item => [item.id, item]))
  return props.modelValue
    .map(id => optionMap.get(id))
    .filter((item): item is CategoryOption => Boolean(item))
})

const updateGroup = (groupKey: string, values: string[]) => {
  const group = categoryGroups.find(item => item.key === groupKey)
  if (!group) {
    return
  }

  const groupIds = new Set(group.items.map(item => item.id))
  const rest = props.modelValue.filter(id => !groupIds.has(id))
  emit('update:modelValue', [...rest, ...values])
}

const removeItem = (id: string) => {
  emit('update:modelValue', props.modelValue.filter(item => item !== id))
}

const clearAll = () => {
  emit('update:modelValue', [])
}
</script>

<style scoped>
.category-maintenance-panel {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px;
  gap: 20px;
}

.category-left,
.category-right {
  border: 1px solid #e8e8e8;
  background: #fff;
}

.panel-header,
.selected-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 42px;
  padding: 0 16px;
  background: #fafafa;
  color: #262626;
  font-weight: 600;
}

.category-body {
  padding: 14px 16px;
}

.category-section + .category-section {
  margin-top: 18px;
}

.section-header {
  height: 34px;
  line-height: 34px;
  padding: 0 14px;
  background: #fafafa;
  color: #595959;
  font-weight: 600;
  margin-bottom: 12px;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(120px, 1fr));
  gap: 14px 24px;
  padding: 0 4px;
}

.selected-body {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 240px;
}

.selected-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 34px;
  padding: 0 12px;
  background: #fafafa;
  color: #595959;
}

.remove-btn {
  border: none;
  background: transparent;
  color: #8c8c8c;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
}

.remove-btn:hover {
  color: #13a8a8;
}

.empty-text {
  color: #bfbfbf;
  padding: 8px 0;
}

@media (max-width: 960px) {
  .category-maintenance-panel {
    grid-template-columns: 1fr;
  }

  .options-grid {
    grid-template-columns: repeat(2, minmax(120px, 1fr));
  }
}
</style>
