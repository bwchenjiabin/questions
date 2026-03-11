<template>
  <header class="bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-1400px mx-auto px-4 py-3">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center gap-3 cursor-pointer" @click="goHome">
          <h1 class="text-2xl font-bold text-blue-600">学科网</h1>
          <span class="text-sm text-gray-500">让教学与学习更有效</span>
        </div>
        
        <!-- 搜索框 -->
        <div class="flex-1 mx-8 max-w-600px">
          <div class="relative">
            <input 
              v-model="searchKeyword"
              type="text"
              placeholder="请输入关键词搜索资源" 
              class="w-full h-40px px-4 pr-100px border-2 border-blue-500 rounded-full text-sm focus:outline-none focus:border-blue-600 transition-colors"
              @keyup.enter="onSearch"
            />
            <button 
              @click="onSearch"
              class="absolute right-0 top-0 h-40px px-6 bg-blue-500 text-white rounded-r-full hover:bg-blue-600 transition-colors font-medium"
            >
              搜索
            </button>
          </div>
        </div>
        
        <!-- 右侧功能 -->
        <div class="flex items-center gap-3">
          <button class="px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors">
            登录
          </button>
          <button class="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors font-medium">
            注册
          </button>
          <button 
            @click="goToQuestionBuilder"
            class="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors font-medium"
          >
            小学数学入口
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const searchKeyword = ref('')

const onSearch = () => {
  console.log('搜索:', searchKeyword.value)
}

const goHome = () => {
  // 返回首页
  window.location.hash = '#/'
}

const goToQuestionBuilder = () => {
  // 导航到试题组卷系统
  window.location.hash = '#/question-builder'
}
</script>