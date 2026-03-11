<template>
  <div class="bg-white rounded-lg shadow-sm p-2">
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-1">
        <h3 class="text-sm font-bold text-blue-600">教学日历</h3>
        <button class="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
          <span class="text-xs">📅</span>
        </button>
      </div>
      <button 
        @click="handleSignIn"
        class="px-2 py-0.5 bg-orange-500 text-white rounded-full text-xs hover:bg-orange-600 transition-colors"
      >
        签到
      </button>
    </div>
    
    <!-- 日历表头 -->
    <div class="grid grid-cols-7 gap-0.5 mb-1">
      <div 
        v-for="day in weekDays" 
        :key="day"
        class="text-center text-xs text-gray-500"
      >
        {{ day }}
      </div>
    </div>
    
    <!-- 日历日期 -->
    <div class="grid grid-cols-7 gap-0.5 mb-2">
      <div 
        v-for="day in calendarDays" 
        :key="day"
        class="aspect-square flex items-center justify-center text-xs rounded transition-colors cursor-pointer"
        :class="isToday(day) ? 'bg-blue-500 text-white font-bold' : 'text-gray-700 hover:bg-gray-100'"
        @click="selectDay(day)"
      >
        {{ day }}
      </div>
    </div>
    
    <!-- 日历事件 -->
    <div class="space-y-1">
      <div 
        v-for="event in events" 
        :key="event.id"
        class="flex items-center gap-1 p-1 bg-orange-50 rounded hover:bg-orange-100 transition-colors cursor-pointer"
        @click="handleEventClick(event)"
      >
        <span class="text-orange-500 text-xs">{{ event.icon }}</span>
        <span class="text-xs text-gray-700">{{ event.title }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  currentDay: {
    type: Number,
    default: 9
  },
  days: {
    type: Array,
    default: () => [9, 10, 11, 12, 13, 14, 15]
  },
  events: {
    type: Array,
    default: () => [
      { id: 1, icon: '📚', title: '学易金卷高考一模' },
      { id: 2, icon: '📚', title: '高中同步备课' }
    ]
  }
})

const emit = defineEmits(['sign-in', 'day-select', 'event-click'])

const weekDays = ['一', '二', '三', '四', '五', '六', '日']
const calendarDays = computed(() => props.days)

const isToday = (day) => {
  return day === props.currentDay
}

const handleSignIn = () => {
  emit('sign-in')
  console.log('签到成功')
}

const selectDay = (day) => {
  emit('day-select', day)
}

const handleEventClick = (event) => {
  emit('event-click', event)
}
</script>

<style scoped>
.aspect-square {
  aspect-ratio: 1 / 1;
}
</style>
