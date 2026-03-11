<template>
  <a-space direction="vertical" :size="12" style="width: 100%">
    <!-- 课程选择 -->
    <a-form-item label="课程" :required="true">
      <a-spin :spinning="isLoadingCourses">
        <a-select
          v-model:value="localValue.courseId"
          placeholder="请选择课程"
          :options="courseOptions"
          @change="handleCourseChange"
          allow-clear
        />
      </a-spin>
    </a-form-item>

    <!-- 年级选择 -->
    <a-form-item label="年级">
      <a-spin :spinning="isLoadingGrades">
        <a-select
          v-model:value="localValue.gradeId"
          placeholder="请先选择课程"
          :options="gradeOptions"
          :disabled="!localValue.courseId"
          @change="handleGradeChange"
          allow-clear
        />
      </a-spin>
    </a-form-item>

    <!-- 学期选择 -->
    <a-form-item label="学期">
      <a-spin :spinning="isLoadingSemesters">
        <a-select
          v-model:value="localValue.semesterId"
          placeholder="请先选择年级"
          :options="semesterOptions"
          :disabled="!localValue.gradeId"
          @change="handleSemesterChange"
          allow-clear
        />
      </a-spin>
    </a-form-item>

    <!-- 单元选择 -->
    <a-form-item label="单元">
      <a-spin :spinning="isLoadingUnits">
        <a-select
          v-model:value="localValue.unitId"
          placeholder="请先选择学期"
          :options="unitOptions"
          :disabled="!localValue.semesterId"
          @change="handleUnitChange"
          allow-clear
        />
      </a-spin>
    </a-form-item>
  </a-space>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useMetadataStore } from '../stores/metadataStore'
import type { CourseLinkageValue } from '../types/metadata'

/**
 * CourseLinkage 组件属性
 */
interface Props {
  modelValue: CourseLinkageValue
}

/**
 * CourseLinkage 组件事件
 */
interface Emits {
  (e: 'update:modelValue', value: CourseLinkageValue): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const metadataStore = useMetadataStore()

// 本地值，用于双向绑定
const localValue = ref<CourseLinkageValue>({ ...props.modelValue })

// 加载状态
const isLoadingCourses = computed(() => metadataStore.isLoading('courses'))
const isLoadingGrades = computed(() => 
  localValue.value.courseId ? metadataStore.isLoading(`grades-${localValue.value.courseId}`) : false
)
const isLoadingSemesters = computed(() => 
  localValue.value.gradeId ? metadataStore.isLoading(`semesters-${localValue.value.gradeId}`) : false
)
const isLoadingUnits = computed(() => 
  localValue.value.semesterId ? metadataStore.isLoading(`units-${localValue.value.semesterId}`) : false
)

// 选项数据
const courseOptions = computed(() => 
  metadataStore.courses.map(course => ({
    label: course.name,
    value: course.id
  }))
)

const gradeOptions = computed(() => {
  if (!localValue.value.courseId) return []
  return metadataStore.getGradesByCourse(localValue.value.courseId).map(grade => ({
    label: grade.name,
    value: grade.id
  }))
})

const semesterOptions = computed(() => {
  if (!localValue.value.gradeId) return []
  return metadataStore.getSemestersByGrade(localValue.value.gradeId).map(semester => ({
    label: semester.name,
    value: semester.id
  }))
})

const unitOptions = computed(() => {
  if (!localValue.value.semesterId) return []
  return metadataStore.getUnitsBySemester(localValue.value.semesterId).map(unit => ({
    label: unit.name,
    value: unit.id
  }))
})

/**
 * 处理课程变化
 * 清空下级选项并加载年级列表
 */
const handleCourseChange = async (courseId: string | undefined) => {
  // 更新课程ID并清空下级选项
  localValue.value.courseId = courseId
  localValue.value.gradeId = undefined
  localValue.value.semesterId = undefined
  localValue.value.unitId = undefined
  
  // 触发更新
  emit('update:modelValue', { ...localValue.value })
  
  // 如果选择了课程，加载年级列表
  if (courseId) {
    try {
      await metadataStore.fetchGrades(courseId)
    } catch (error) {
      console.error('加载年级列表失败:', error)
    }
  }
}

/**
 * 处理年级变化
 * 清空下级选项并加载学期列表
 */
const handleGradeChange = async (gradeId: string | undefined) => {
  // 更新年级ID并清空下级选项
  localValue.value.gradeId = gradeId
  localValue.value.semesterId = undefined
  localValue.value.unitId = undefined
  
  // 触发更新
  emit('update:modelValue', { ...localValue.value })
  
  // 如果选择了年级，加载学期列表
  if (gradeId) {
    try {
      await metadataStore.fetchSemesters(gradeId)
    } catch (error) {
      console.error('加载学期列表失败:', error)
    }
  }
}

/**
 * 处理学期变化
 * 清空下级选项并加载单元列表
 */
const handleSemesterChange = async (semesterId: string | undefined) => {
  // 更新学期ID并清空单元选项
  localValue.value.semesterId = semesterId
  localValue.value.unitId = undefined
  
  // 触发更新
  emit('update:modelValue', { ...localValue.value })
  
  // 如果选择了学期，加载单元列表
  if (semesterId) {
    try {
      await metadataStore.fetchUnits(semesterId)
    } catch (error) {
      console.error('加载单元列表失败:', error)
    }
  }
}

/**
 * 处理单元变化
 */
const handleUnitChange = () => {
  // 触发更新
  emit('update:modelValue', { ...localValue.value })
}

/**
 * 监听外部值变化，同步到本地值
 */
watch(
  () => props.modelValue,
  (newValue) => {
    localValue.value = { ...newValue }
  },
  { deep: true }
)

/**
 * 组件挂载时加载课程列表
 */
onMounted(async () => {
  try {
    await metadataStore.fetchCourses()
    
    // 如果有初始值，加载对应的下级数据
    if (localValue.value.courseId) {
      await metadataStore.fetchGrades(localValue.value.courseId)
    }
    if (localValue.value.gradeId) {
      await metadataStore.fetchSemesters(localValue.value.gradeId)
    }
    if (localValue.value.semesterId) {
      await metadataStore.fetchUnits(localValue.value.semesterId)
    }
  } catch (error) {
    console.error('加载课程数据失败:', error)
  }
})
</script>
