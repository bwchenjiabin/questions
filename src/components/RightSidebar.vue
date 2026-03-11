<template>
  <aside class="w-64">
    <!-- 热门标签 -->
    <a-card class="mb-4">
      <template #title>
        <h3 class="font-bold text-gray-800">热门标签</h3>
      </template>
      <div class="flex flex-wrap gap-2">
        <a-tag v-for="tag in hotTags" :key="tag" color="default" class="cursor-pointer">{{ tag }}</a-tag>
      </div>
    </a-card>
    
    <!-- 教学日历 -->
    <a-card class="mb-4">
      <template #title>
        <h3 class="font-bold text-gray-800">教学日历</h3>
      </template>
      <div class="text-center mb-3">
        <h4 class="font-medium text-gray-800">2024年6月</h4>
      </div>
      <div class="grid grid-cols-7 gap-1 text-center text-xs">
        <div class="text-gray-400">日</div>
        <div class="text-gray-400">一</div>
        <div class="text-gray-400">二</div>
        <div class="text-gray-400">三</div>
        <div class="text-gray-400">四</div>
        <div class="text-gray-400">五</div>
        <div class="text-gray-400">六</div>
        <div class="text-gray-400">26</div>
        <div class="text-gray-400">27</div>
        <div class="text-gray-400">28</div>
        <div class="text-gray-400">29</div>
        <div class="text-gray-400">30</div>
        <div class="bg-blue-600 text-white rounded">1</div>
        <div>2</div>
        <div>3</div>
        <div>4</div>
        <div>5</div>
        <div>6</div>
        <div>7</div>
        <div>8</div>
        <div>9</div>
        <div>10</div>
        <div>11</div>
        <div>12</div>
        <div>13</div>
        <div>14</div>
        <div>15</div>
        <div>16</div>
        <div>17</div>
        <div>18</div>
        <div>19</div>
        <div>20</div>
        <div>21</div>
        <div>22</div>
        <div>23</div>
        <div>24</div>
        <div>25</div>
        <div>26</div>
        <div>27</div>
        <div>28</div>
        <div>29</div>
        <div>30</div>
      </div>
    </a-card>
    
    <!-- AI教育社区 -->
    <a-card>
      <template #title>
        <div class="flex justify-between items-center">
          <h3 class="font-bold text-gray-800">AI教育社区</h3>
          <a href="#" class="text-blue-600 hover:underline text-sm">更多</a>
        </div>
      </template>
      <a-menu mode="vertical" :items="aiCommunityItems" class="border-0" />
    </a-card>
  </aside>
</template>

<script setup>
const hotTags = [
  '高考',
  '中考',
  '教案',
  '课件',
  '试题',
  '知识点',
  '复习',
  '练习',
  '同步',
  '月考'
]

const aiCommunityItems = [
  { key: '1', label: '[师生AI] 分别制作古代人物时空对话...' },
  { key: '2', label: '[师生AI] 校园欺凌现象探究，一个模...' },
  { key: '3', label: '[师生AI] 如何激发学生阅读兴趣，实现...' }
]
</script>

<style scoped>
.ant-card {
  margin-bottom: 16px;
}

.ant-menu-vertical .ant-menu-item {
  margin: 4px 0;
  height: auto;
  line-height: 1.5;
  padding: 8px 16px;
}
</style>