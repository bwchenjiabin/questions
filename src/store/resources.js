import { defineStore } from 'pinia'

export const useResourceStore = defineStore('resources', {
  state: () => ({
    recommendResources: [
      {
        id: 1,
        title: '高中数学教案 函数性质专题',
        type: '教案',
        version: '人教版 必修一',
        price: '免费',
        downloadCount: 1234
      },
      {
        id: 2,
        title: '初中英语课件 时态专题',
        type: '课件',
        version: '外研版 七年级',
        price: '免费',
        downloadCount: 987
      },
      {
        id: 3,
        title: '小学语文试题 阅读理解专项',
        type: '试题',
        version: '部编版 三年级',
        price: '免费',
        downloadCount: 2345
      },
      {
        id: 4,
        title: '高中物理实验视频教程',
        type: '视频',
        version: '人教版 选修',
        price: '5.00',
        downloadCount: 1890
      }
    ],
    latestResources: [
      {
        id: 1,
        title: '2024年高考语文模拟试题',
        type: '试题',
        version: '全国卷',
        date: '2024-06-01',
        downloadCount: 3456,
        description: '包含作文、阅读理解、古诗文等全题型，适合高考复习使用'
      },
      {
        id: 2,
        title: '高中物理实验视频教程',
        type: '视频',
        version: '人教版',
        date: '2024-05-28',
        downloadCount: 1890,
        description: '涵盖力学、电学、光学等重要实验，附带详细讲解'
      },
      {
        id: 3,
        title: '初中化学知识点总结',
        type: '总结',
        version: '沪教版',
        date: '2024-05-25',
        downloadCount: 2678,
        description: '整理了初中化学重要知识点，便于复习和记忆'
      },
      {
        id: 4,
        title: '小学数学应用题练习',
        type: '练习',
        version: '北师大版',
        date: '2024-05-20',
        downloadCount: 4123,
        description: '包含各种类型的应用题，适合小学生练习提高'
      }
    ]
  }),
  getters: {
    getRecommendResources: (state) => state.recommendResources,
    getLatestResources: (state) => state.latestResources
  },
  actions: {
    addResource(resource) {
      this.latestResources.unshift(resource)
    }
  }
})