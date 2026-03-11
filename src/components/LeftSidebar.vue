<template>
  <aside class="relative w-230px flex-shrink-0">
    <!-- 同步备课资源 - 垂直菜单 -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
      <div class="bg-blue-500 text-white px-4 py-3 text-base font-medium">
        同步备课资源
      </div>
      
      <div class="relative">
        <div 
          v-for="(item, index) in menuItems" 
          :key="item.key"
          class="menu-item relative border-b border-gray-100 last:border-b-0 px-4 py-3 cursor-pointer transition-colors duration-200 text-sm text-gray-700"
          :class="{ 'bg-blue-50 text-blue-600': activeMenu === item.key }"
          @mouseenter="showPanel(item, index, $event)"
          @mouseleave="startHidePanel"
        >
          <div class="flex items-center justify-between">
            <span>{{ item.title }}</span>
            <span class="text-gray-400 text-xs">›</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 浮动面板 -->
    <transition name="slide-fade">
      <div 
        v-if="activePanel"
        class="floating-panel fixed bg-white rounded-lg shadow-xl z-1000 p-6"
        :style="panelStyle"
        @mouseenter="keepPanel"
        @mouseleave="startHidePanel"
      >
        <div class="mb-4">
          <h3 class="text-lg font-medium text-gray-800 mb-3">{{ activePanel.title }}</h3>
          <div class="flex flex-wrap gap-2">
            <a 
              v-for="tag in activePanel.tags" 
              :key="tag"
              href="#"
              class="px-3 py-1 bg-gray-100 hover:bg-blue-50 hover:text-blue-600 rounded text-sm transition-colors duration-200"
            >
              {{ tag }}
            </a>
          </div>
        </div>
        
        <div class="space-y-4">
          <div v-for="section in activePanel.sections" :key="section.title">
            <h4 class="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <span class="w-1 h-4 bg-blue-500 mr-2"></span>
              {{ section.title }}
            </h4>
            <div class="grid grid-cols-2 gap-2">
              <a 
                v-for="link in section.links" 
                :key="link"
                href="#"
                class="text-sm text-gray-600 hover:text-blue-600 hover:underline transition-colors duration-200"
              >
                {{ link }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </transition>
    
    <!-- 热门推荐 -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="bg-gradient-to-r from-orange-400 to-red-400 text-white px-4 py-3 text-base font-medium">
        热门推荐
      </div>
      <div class="p-4">
        <div 
          v-for="item in hotRecommendItems" 
          :key="item.key"
          class="py-2 border-b border-gray-100 last:border-b-0"
        >
          <a href="#" class="text-sm text-gray-700 hover:text-blue-600 transition-colors duration-200">
            {{ item.label }}
          </a>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeMenu = ref(null)
const activePanel = ref(null)
const panelPosition = ref({ top: 0, left: 0 })
let hideTimer = null

const menuItems = [
  {
    key: 'chinese',
    title: '语文',
    tags: ['小学语文', '初中语文', '高中语文', '语文素材', '作文指导'],
    sections: [
      {
        title: '按学段',
        links: ['小学同步备课', '初中同步备课', '高中同步备课', '中考专区', '高考专区']
      },
      {
        title: '按资源类型',
        links: ['教案', '课件', '试卷', '素材', '视频']
      }
    ]
  },
  {
    key: 'math',
    title: '数学',
    tags: ['小学数学', '初中数学', '高中数学', '奥数', '竞赛'],
    sections: [
      {
        title: '按学段',
        links: ['小学同步备课', '初中同步备课', '高中同步备课', '中考专区', '高考专区']
      },
      {
        title: '按资源类型',
        links: ['教案', '课件', '试卷', '知识点', '公式大全']
      }
    ]
  },
  {
    key: 'english',
    title: '英语',
    tags: ['小学英语', '初中英语', '高中英语', '听力', '语法'],
    sections: [
      {
        title: '按学段',
        links: ['小学同步备课', '初中同步备课', '高中同步备课', '中考专区', '高考专区']
      },
      {
        title: '按资源类型',
        links: ['教案', '课件', '试卷', '听力材料', '词汇']
      }
    ]
  },
  {
    key: 'physics',
    title: '物理',
    tags: ['初中物理', '高中物理', '实验', '竞赛'],
    sections: [
      {
        title: '按学段',
        links: ['初中同步备课', '高中同步备课', '中考专区', '高考专区']
      },
      {
        title: '按资源类型',
        links: ['教案', '课件', '试卷', '实验视频', '公式']
      }
    ]
  },
  {
    key: 'chemistry',
    title: '化学',
    tags: ['初中化学', '高中化学', '实验', '方程式'],
    sections: [
      {
        title: '按学段',
        links: ['初中同步备课', '高中同步备课', '中考专区', '高考专区']
      },
      {
        title: '按资源类型',
        links: ['教案', '课件', '试卷', '实验', '化学方程式']
      }
    ]
  },
  {
    key: 'biology',
    title: '生物',
    tags: ['初中生物', '高中生物', '实验', '竞赛'],
    sections: [
      {
        title: '按学段',
        links: ['初中同步备课', '高中同步备课', '中考专区', '高考专区']
      },
      {
        title: '按资源类型',
        links: ['教案', '课件', '试卷', '实验', '知识点']
      }
    ]
  },
  {
    key: 'politics',
    title: '道德与法治',
    tags: ['小学道法', '初中道法', '时事政治'],
    sections: [
      {
        title: '按学段',
        links: ['小学同步备课', '初中同步备课', '中考专区']
      },
      {
        title: '按资源类型',
        links: ['教案', '课件', '试卷', '时事热点']
      }
    ]
  },
  {
    key: 'history',
    title: '历史',
    tags: ['初中历史', '高中历史', '中国史', '世界史'],
    sections: [
      {
        title: '按学段',
        links: ['初中同步备课', '高中同步备课', '中考专区', '高考专区']
      },
      {
        title: '按资源类型',
        links: ['教案', '课件', '试卷', '历史资料']
      }
    ]
  }
]

const hotRecommendItems = [
  { key: '1', label: '2024年高考真题' },
  { key: '2', label: '初中数学知识点总结' },
  { key: '3', label: '高中物理公式大全' },
  { key: '4', label: '语文作文素材' },
  { key: '5', label: '英语听力练习' }
]

const showPanel = (item, index, event) => {
  clearTimeout(hideTimer)
  activeMenu.value = item.key
  activePanel.value = item
  
  // 计算面板位置
  const rect = event.currentTarget.getBoundingClientRect()
  panelPosition.value = {
    top: rect.top,
    left: rect.right + 10
  }
}

const startHidePanel = () => {
  hideTimer = setTimeout(() => {
    activeMenu.value = null
    activePanel.value = null
  }, 200)
}

const keepPanel = () => {
  clearTimeout(hideTimer)
}

const panelStyle = computed(() => ({
  top: `${panelPosition.value.top}px`,
  left: `${panelPosition.value.left}px`,
  width: '600px',
  maxHeight: '500px',
  overflowY: 'auto'
}))
</script>

<style scoped>
.menu-item:hover {
  background-color: #eff6ff;
  color: #2563eb;
}

.floating-panel {
  animation: slideIn 0.2s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.15s ease-in;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>