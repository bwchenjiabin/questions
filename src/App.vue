<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 - 仅在首页显示 -->
    <TopNav v-if="currentPage === 'home'" />
    
    <!-- 主内容区 -->
    <template v-if="currentPage === 'home'">
      <!-- 分类导航 -->
      <CategoryNav />
      
      <!-- 主内容区 -->
      <main class="max-w-1400px mx-auto px-4 py-4">
        <div class="flex gap-4">
          <!-- 左侧边栏 -->
          <LeftSidebar />
          
          <!-- 中间内容 -->
          <div class="flex-1 min-w-0">
            <!-- 轮播图 -->
            <Banner />
            
            <!-- 推荐资源 -->
            <RecommendResources />
            
            <!-- 最新资源 -->
            <LatestResources />
          </div>
        </div>
      </main>
      
      <!-- 页脚 -->
      <Footer />
      
      <!-- 悬浮工具栏 -->
      <XkwFeatures />
    </template>

    <!-- 试题编辑页面 - 独立页面，不显示 TopNav -->
    <template v-else-if="currentPage === 'question-builder'">
      <QuestionEditorPage
        @back="goHome"
        @cancel="goHome"
        @save="handleQuestionSave"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { message } from 'ant-design-vue'
import TopNav from './components/TopNav.vue'
import CategoryNav from './components/CategoryNav.vue'
import LeftSidebar from './components/LeftSidebar.vue'
import Banner from './components/Banner.vue'
import RecommendResources from './components/RecommendResources.vue'
import LatestResources from './components/LatestResources.vue'
import Footer from './components/Footer.vue'
import XkwFeatures from './components/XkwFeatures.vue'
import QuestionEditorPage from './features/exam-question-builder/components/QuestionEditorPage.vue'

const currentPage = ref('home')

// 监听 hash 变化
const handleHashChange = () => {
  const hash = window.location.hash.slice(1) || '/'
  
  if (hash === '/question-builder') {
    currentPage.value = 'question-builder'
  } else {
    currentPage.value = 'home'
  }
}

const goHome = () => {
  window.location.hash = '#/'
}

const handleQuestionSave = (question) => {
  console.log('题目已保存:', question)
  message.success('题目已保存')
}

onMounted(() => {
  // 初始化页面
  handleHashChange()
  
  // 监听 hash 变化
  window.addEventListener('hashchange', handleHashChange)
})

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', handleHashChange)
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  line-height: 1.5;
  color: #333;
  background-color: #f5f5f5;
}

html {
  scroll-behavior: smooth;
}

a {
  text-decoration: none;
  color: inherit;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
