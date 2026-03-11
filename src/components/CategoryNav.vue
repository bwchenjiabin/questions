<template>
  <nav class="bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-1400px mx-auto px-4">
      <div class="flex items-center gap-1">
        <a 
          v-for="item in menuItems" 
          :key="item.key"
          href="#"
          class="relative px-4 py-3 text-sm text-gray-700 hover:text-blue-600 transition-colors duration-200"
          :class="{ 'text-blue-600 font-medium': selectedKey === item.key }"
          @click.prevent="selectedKey = item.key"
          @mouseenter="showSubmenu(item, $event)"
          @mouseleave="startHideSubmenu"
        >
          {{ item.label }}
          <div 
            v-if="selectedKey === item.key"
            class="absolute bottom-0 left-0 right-0 h-2px bg-blue-600"
          ></div>
        </a>
      </div>
    </div>
    
    <!-- 下拉子菜单 -->
    <transition name="fade">
      <div 
        v-if="activeSubmenu"
        class="absolute left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50"
        @mouseenter="keepSubmenu"
        @mouseleave="startHideSubmenu"
      >
        <div class="max-w-1400px mx-auto px-4 py-6">
          <div class="grid grid-cols-6 gap-4">
            <div v-for="(section, index) in activeSubmenu.sections" :key="index">
              <h4 class="text-sm font-medium text-gray-800 mb-3">{{ section.title }}</h4>
              <div class="space-y-2">
                <a 
                  v-for="link in section.links" 
                  :key="link"
                  href="#"
                  class="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {{ link }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const selectedKey = ref('home')
const activeSubmenu = ref(null)
let hideTimer = null

const menuItems = [
  { key: 'home', label: '首页' },
  { key: 'resource', label: '资源中心' },
  { key: 'exam', label: '题库' },
  { key: 'school', label: '网校' },
  { key: 'community', label: '社区' },
  { 
    key: 'chinese', 
    label: '语文',
    sections: [
      { title: '小学', links: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'] },
      { title: '初中', links: ['七年级', '八年级', '九年级', '中考'] },
      { title: '高中', links: ['高一', '高二', '高三', '高考'] },
      { title: '资源类型', links: ['教案', '课件', '试卷', '素材'] },
      { title: '专题', links: ['作文', '阅读', '古诗词', '文言文'] },
      { title: '热门', links: ['期中试卷', '期末试卷', '月考', '单元测试'] }
    ]
  },
  { 
    key: 'math', 
    label: '数学',
    sections: [
      { title: '小学', links: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'] },
      { title: '初中', links: ['七年级', '八年级', '九年级', '中考'] },
      { title: '高中', links: ['高一', '高二', '高三', '高考'] },
      { title: '资源类型', links: ['教案', '课件', '试卷', '知识点'] },
      { title: '专题', links: ['函数', '几何', '代数', '统计'] },
      { title: '热门', links: ['期中试卷', '期末试卷', '竞赛', '奥数'] }
    ]
  },
  { 
    key: 'english', 
    label: '英语',
    sections: [
      { title: '小学', links: ['三年级', '四年级', '五年级', '六年级'] },
      { title: '初中', links: ['七年级', '八年级', '九年级', '中考'] },
      { title: '高中', links: ['高一', '高二', '高三', '高考'] },
      { title: '资源类型', links: ['教案', '课件', '试卷', '听力'] },
      { title: '专题', links: ['语法', '词汇', '阅读', '写作'] },
      { title: '热门', links: ['听力训练', '完形填空', '作文', '口语'] }
    ]
  },
  { 
    key: 'physics', 
    label: '物理',
    sections: [
      { title: '初中', links: ['八年级', '九年级', '中考'] },
      { title: '高中', links: ['高一', '高二', '高三', '高考'] },
      { title: '资源类型', links: ['教案', '课件', '试卷', '实验'] },
      { title: '专题', links: ['力学', '电学', '光学', '热学'] },
      { title: '实验', links: ['演示实验', '学生实验', '实验视频'] },
      { title: '热门', links: ['公式大全', '竞赛', '解题技巧'] }
    ]
  },
  { 
    key: 'chemistry', 
    label: '化学',
    sections: [
      { title: '初中', links: ['九年级', '中考'] },
      { title: '高中', links: ['高一', '高二', '高三', '高考'] },
      { title: '资源类型', links: ['教案', '课件', '试卷', '实验'] },
      { title: '专题', links: ['元素', '化合物', '反应', '计算'] },
      { title: '实验', links: ['演示实验', '学生实验', '实验视频'] },
      { title: '热门', links: ['方程式', '竞赛', '实验技巧'] }
    ]
  },
  { 
    key: 'biology', 
    label: '生物',
    sections: [
      { title: '初中', links: ['七年级', '八年级', '中考'] },
      { title: '高中', links: ['高一', '高二', '高三', '高考'] },
      { title: '资源类型', links: ['教案', '课件', '试卷', '实验'] },
      { title: '专题', links: ['细胞', '遗传', '生态', '进化'] },
      { title: '实验', links: ['观察实验', '探究实验', '实验视频'] },
      { title: '热门', links: ['知识点', '竞赛', '解题方法'] }
    ]
  }
]

const showSubmenu = (item, event) => {
  clearTimeout(hideTimer)
  if (item.sections) {
    activeSubmenu.value = item
  }
}

const startHideSubmenu = () => {
  hideTimer = setTimeout(() => {
    activeSubmenu.value = null
  }, 200)
}

const keepSubmenu = () => {
  clearTimeout(hideTimer)
}
</script>

<style scoped>
nav {
  position: relative;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>