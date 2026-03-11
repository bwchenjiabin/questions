<template>
  <div class="mb-4">
    <!-- 顶部导航标签 -->
    <div class="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
      <div class="bg-gray-50 border-b border-gray-200 px-4 py-2">
        <div class="flex items-center justify-between">
          <!-- 左侧：学段切换 -->
          <div class="flex items-center gap-2">
            <button 
              v-for="grade in grades" 
              :key="grade.key"
              @click="selectedGrade = grade.key"
              class="px-4 py-1.5 text-sm rounded transition-colors duration-200"
              :class="selectedGrade === grade.key ? 'bg-blue-500 text-white font-medium' : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600'"
            >
              {{ grade.label }}
            </button>
          </div>
          
          <!-- 右侧：快捷标签 -->
          <div class="flex flex-wrap gap-2">
            <span class="px-3 py-1 bg-white border border-gray-200 rounded text-sm hover:border-blue-500 hover:text-blue-600 cursor-pointer transition-colors">同步</span>
            <span class="px-3 py-1 bg-white border border-gray-200 rounded text-sm hover:border-blue-500 hover:text-blue-600 cursor-pointer transition-colors">中考</span>
            <span class="px-3 py-1 bg-white border border-gray-200 rounded text-sm hover:border-blue-500 hover:text-blue-600 cursor-pointer transition-colors">知识点</span>
            <span class="px-3 py-1 bg-white border border-gray-200 rounded text-sm hover:border-blue-500 hover:text-blue-600 cursor-pointer transition-colors">作业</span>
            <span class="px-3 py-1 bg-white border border-gray-200 rounded text-sm hover:border-blue-500 hover:text-blue-600 cursor-pointer transition-colors">试卷</span>
            <span class="px-3 py-1 bg-white border border-gray-200 rounded text-sm hover:border-blue-500 hover:text-blue-600 cursor-pointer transition-colors">作文</span>
            <span class="px-3 py-1 bg-red-50 border border-red-200 text-red-600 rounded text-sm hover:bg-red-100 cursor-pointer transition-colors">精品</span>
            <span class="px-3 py-1 bg-white border border-gray-200 rounded text-sm hover:border-blue-500 hover:text-blue-600 cursor-pointer transition-colors">名校</span>
            <span class="px-3 py-1 bg-white border border-gray-200 rounded text-sm hover:border-blue-500 hover:text-blue-600 cursor-pointer transition-colors">教辅</span>
            <span class="px-3 py-1 bg-red-50 border border-red-200 text-red-600 rounded text-sm hover:bg-red-100 cursor-pointer transition-colors">中职</span>
          </div>
        </div>
      </div>
      
      <!-- 轮播图和右侧内容区域 -->
      <div class="flex">
        <!-- 左侧：轮播图和课程卡片 -->
        <div class="flex-1 relative flex flex-col">
          <!-- 轮播图 -->
          <div class="carousel-container">
            <div class="carousel-slide" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
              <div class="slide h-320px bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center">
                <div class="text-center text-white px-8">
                  <h2 class="text-4xl font-bold mb-4">携手区域 共筑教育生态</h2>
                  <p class="text-xl">区域合作 共赢未来</p>
                </div>
              </div>
              <div class="slide h-320px bg-gradient-to-r from-yellow-300 to-orange-500 flex items-center justify-center">
                <div class="text-center text-white px-8">
                  <h2 class="text-4xl font-bold mb-2">好题汇编·备战中考</h2>
                  <h3 class="text-3xl font-bold mb-4">中考一模真题分类汇编</h3>
                  <p class="text-xl">聚焦常考考点及高频考点</p>
                </div>
              </div>
              <div class="slide h-320px bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center">
                <div class="text-center text-white px-8">
                  <h2 class="text-4xl font-bold mb-4">AI智能备课助手</h2>
                  <p class="text-xl mb-6">让备课更高效，让教学更精彩</p>
                  <button class="px-8 py-3 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors">免费体验</button>
                </div>
              </div>
            </div>
            
            <!-- 轮播指示器 -->
            <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              <button 
                v-for="(_, index) in 3" 
                :key="index"
                @click="currentSlide = index"
                class="w-8 h-2 rounded-full transition-colors"
                :class="currentSlide === index ? 'bg-white' : 'bg-white bg-opacity-50'"
              ></button>
            </div>
          </div>
          
          <!-- 课程卡片区域 -->
          <div class="relative bg-white border-t border-gray-200">
            <div class="carousel-container-bottom">
              <div class="carousel-slide-bottom" :style="{ transform: `translateX(-${currentBottomSlide * 100}%)` }">
                <!-- 第一组卡片 -->
                <div class="slide-bottom flex-shrink-0 w-full p-4">
                  <div class="grid grid-cols-3 gap-4">
                    <div class="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg cursor-pointer hover:shadow-md transition-shadow">
                      <h4 class="font-medium mb-1">2026年中考</h4>
                      <p class="text-sm text-gray-600">初中同步备课系列</p>
                    </div>
                    <div class="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg cursor-pointer hover:shadow-md transition-shadow">
                      <h4 class="font-medium mb-1">2026年中考</h4>
                      <p class="text-sm text-gray-600">一轮复习专题</p>
                    </div>
                    <div class="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg cursor-pointer hover:shadow-md transition-shadow">
                      <h4 class="font-medium mb-1">2025-2026学年</h4>
                      <p class="text-sm text-gray-600">初中同步备课精选</p>
                    </div>
                  </div>
                </div>
                
                <!-- 第二组卡片 -->
                <div class="slide-bottom flex-shrink-0 w-full p-4">
                  <div class="grid grid-cols-3 gap-4">
                    <div class="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg cursor-pointer hover:shadow-md transition-shadow">
                      <h4 class="font-medium mb-1">高考专题</h4>
                      <p class="text-sm text-gray-600">高中同步备课系列</p>
                    </div>
                    <div class="p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg cursor-pointer hover:shadow-md transition-shadow">
                      <h4 class="font-medium mb-1">期末冲刺</h4>
                      <p class="text-sm text-gray-600">期末复习资料</p>
                    </div>
                    <div class="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg cursor-pointer hover:shadow-md transition-shadow">
                      <h4 class="font-medium mb-1">名校试卷</h4>
                      <p class="text-sm text-gray-600">精选名校真题</p>
                    </div>
                  </div>
                </div>
                
                <!-- 第三组卡片 -->
                <div class="slide-bottom flex-shrink-0 w-full p-4">
                  <div class="grid grid-cols-3 gap-4">
                    <div class="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg cursor-pointer hover:shadow-md transition-shadow">
                      <h4 class="font-medium mb-1">竞赛辅导</h4>
                      <p class="text-sm text-gray-600">竞赛专项训练</p>
                    </div>
                    <div class="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg cursor-pointer hover:shadow-md transition-shadow">
                      <h4 class="font-medium mb-1">素质教育</h4>
                      <p class="text-sm text-gray-600">综合素质提升</p>
                    </div>
                    <div class="p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg cursor-pointer hover:shadow-md transition-shadow">
                      <h4 class="font-medium mb-1">在线课程</h4>
                      <p class="text-sm text-gray-600">名师在线辅导</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 左右切换按钮 -->
            <button 
              @click="prevBottomSlide"
              class="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full flex items-center justify-center shadow-md transition-all z-10"
            >
              <span class="text-gray-600 text-xl">‹</span>
            </button>
            <button 
              @click="nextBottomSlide"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full flex items-center justify-center shadow-md transition-all z-10"
            >
              <span class="text-gray-600 text-xl">›</span>
            </button>
            
            <!-- 指示器 -->
            <div class="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
              <button 
                v-for="(_, index) in 3" 
                :key="index"
                @click="currentBottomSlide = index"
                class="w-6 h-1.5 rounded-full transition-colors"
                :class="currentBottomSlide === index ? 'bg-blue-500' : 'bg-gray-300'"
              ></button>
            </div>
          </div>
        </div>
        
        <!-- 右侧：统计数据和快捷入口 -->
        <div class="w-280px flex-shrink-0 bg-gray-50 p-4 space-y-3 overflow-y-auto" >
          <!-- 官方赛事公告 -->
          <div class="bg-white rounded-lg shadow-sm p-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 flex-1 min-w-0">
                <span class="text-orange-500 text-base flex-shrink-0">🔊</span>
                <span class="text-xs text-gray-700 line-clamp-1">【官方赛事】2025年高县优质教育资源评选活动</span>
              </div>
              <a href="#" class="text-blue-600 hover:text-blue-700 text-xs whitespace-nowrap ml-2">更多 ›</a>
            </div>
          </div>
          
          <!-- 更新统计 -->
          <div class="bg-white rounded-lg shadow-sm p-3">
            <div class="grid grid-cols-2 gap-2">
              <div class="bg-gray-50 rounded-lg p-2 text-center">
                <div class="text-xs text-gray-600 mb-1">近24小时更新 (套)</div>
                <div class="text-xl font-bold text-red-500">12951</div>
              </div>
              <div class="bg-gray-50 rounded-lg p-2 text-center">
                <div class="text-xs text-gray-600 mb-1">近一周更新 (套)</div>
                <div class="text-xl font-bold text-red-500">104655</div>
              </div>
            </div>
          </div>
          
          <!-- 快捷入口 -->
          <div class="bg-white rounded-lg shadow-sm p-2">
            <div class="grid grid-cols-4 gap-1 mb-1">
              <a href="#" class="flex flex-col items-center gap-1 p-1 hover:bg-gray-50 rounded transition-colors">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-base">👤</div>
                <span class="text-xs text-gray-700 text-center leading-tight">名校实践</span>
              </a>
              <a href="#" class="flex flex-col items-center gap-1 p-1 hover:bg-gray-50 rounded transition-colors">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-base">📝</div>
                <span class="text-xs text-gray-700 text-center leading-tight">每日上新</span>
              </a>
              <a href="#" class="flex flex-col items-center gap-1 p-1 hover:bg-gray-50 rounded transition-colors">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-base">👥</div>
                <span class="text-xs text-gray-700 text-center leading-tight">免费专区</span>
              </a>
              <a href="#" class="flex flex-col items-center gap-1 p-1 hover:bg-gray-50 rounded transition-colors">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-base">✏️</div>
                <span class="text-xs text-gray-700 text-center leading-tight">上传奖励</span>
              </a>
            </div>
            
            <div class="grid grid-cols-4 gap-1">
              <a href="#" class="flex flex-col items-center gap-1 p-1 hover:bg-gray-50 rounded transition-colors">
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-base">🎯</div>
                <span class="text-xs text-gray-700 text-center leading-tight">学豆兑换</span>
              </a>
              <a href="#" class="flex flex-col items-center gap-1 p-1 hover:bg-gray-50 rounded transition-colors">
                <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-base">📄</div>
                <span class="text-xs text-gray-700 text-center leading-tight">有奖收卷</span>
              </a>
              <a href="#" class="flex flex-col items-center gap-1 p-1 hover:bg-gray-50 rounded transition-colors">
                <div class="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-base">💼</div>
                <span class="text-xs text-gray-700 text-center leading-tight">副业兼职</span>
              </a>
              <a href="#" class="flex flex-col items-center gap-1 p-1 hover:bg-gray-50 rounded transition-colors">
                <div class="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-base">👨‍🏫</div>
                <span class="text-xs text-gray-700 text-center leading-tight">教学案例</span>
              </a>
            </div>
          </div>
          
          <!-- 教学日历 -->
          <TeachingCalendar 
            :current-day="9"
            :days="calendarDays"
            :events="calendarEvents"
            @sign-in="handleSignIn"
            @day-select="handleDaySelect"
            @event-click="handleEventClick"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import TeachingCalendar from './TeachingCalendar.vue'

const selectedGrade = ref('middle')
const currentSlide = ref(0)
const currentBottomSlide = ref(0)
let slideInterval = null

const grades = [
  { key: 'high', label: '高中' },
  { key: 'middle', label: '初中' },
  { key: 'primary', label: '小学' }
]

const calendarDays = [9, 10, 11, 12, 13, 14, 15]

const calendarEvents = [
  { id: 1, icon: '📚', title: '学易金卷高考一模' },
  { id: 2, icon: '📚', title: '高中同步备课' }
]

const startCarousel = () => {
  slideInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % 3
  }, 5000)
}

const stopCarousel = () => {
  if (slideInterval) {
    clearInterval(slideInterval)
  }
}

const nextBottomSlide = () => {
  currentBottomSlide.value = (currentBottomSlide.value + 1) % 3
}

const prevBottomSlide = () => {
  currentBottomSlide.value = (currentBottomSlide.value - 1 + 3) % 3
}

const handleSignIn = () => {
  console.log('签到成功')
}

const handleDaySelect = (day) => {
  console.log('选择日期:', day)
}

const handleEventClick = (event) => {
  console.log('点击事件:', event)
}

onMounted(() => {
  startCarousel()
})

onUnmounted(() => {
  stopCarousel()
})
</script>

<style scoped>
.carousel-container {
  position: relative;
  overflow: hidden;
}

.carousel-slide {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.slide {
  min-width: 100%;
  flex-shrink: 0;
}

.carousel-container-bottom {
  position: relative;
  overflow: hidden;
}

.carousel-slide-bottom {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.slide-bottom {
  min-width: 100%;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
