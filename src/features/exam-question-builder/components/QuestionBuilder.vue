<template>
  <div class="question-builder-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>小学数学</h1>
      <a-button type="primary">审核</a-button>
    </div>

    <!-- 流程状态 -->
    <section class="section">
      <h2 class="section-title">流程状态</h2>
      <a-table
        :columns="processColumns"
        :data-source="processData"
        :pagination="false"
        size="small"
      />
    </section>

    <!-- 题目录入 -->
    <section class="section">
      <h2 class="section-title">题目录入</h2>
      <div class="tabs-container">
        <a-tabs v-model:activeKey="activeQuestionTab">
          <a-tab-pane key="single" tab="单选">
            <QuestionEntryForm type="single" />
          </a-tab-pane>
          <a-tab-pane key="multiple" tab="多选">
            <QuestionEntryForm type="multiple" />
          </a-tab-pane>
          <a-tab-pane key="fillblank" tab="填空">
            <QuestionEntryForm type="fillblank" />
          </a-tab-pane>
          <a-tab-pane key="judgement" tab="判断">
            <QuestionEntryForm type="judgement" />
          </a-tab-pane>
          <a-tab-pane key="essay" tab="问答">
            <QuestionEntryForm type="essay" />
          </a-tab-pane>
          <a-tab-pane key="composite" tab="组合">
            <QuestionEntryForm type="composite" />
          </a-tab-pane>
        </a-tabs>
      </div>
    </section>

    <!-- 关联 -->
    <section class="section">
      <h2 class="section-title">关联</h2>
      <AssociationPanel />
    </section>

    <!-- 解题方法 -->
    <section class="section">
      <h2 class="section-title">解题方法</h2>
      <SolutionMethodPanel />
    </section>

    <!-- 分类维护 -->
    <section class="section">
      <h2 class="section-title">分类维护</h2>
      <CategoryMaintenancePanel />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import QuestionEntryForm from './QuestionEntryForm.vue'
import AssociationPanel from './AssociationPanel.vue'
import SolutionMethodPanel from './SolutionMethodPanel.vue'
import CategoryMaintenancePanel from './CategoryMaintenancePanel.vue'

const activeQuestionTab = ref('single')

const processColumns = [
  {
    title: '步骤',
    dataIndex: 'step',
    key: 'step'
  },
  {
    title: '人员',
    dataIndex: 'person',
    key: 'person'
  },
  {
    title: '时间',
    dataIndex: 'time',
    key: 'time'
  }
]

const processData = [
  {
    key: '1',
    step: '创建',
    person: '',
    time: ''
  },
  {
    key: '2',
    step: '审核',
    person: '',
    time: ''
  },
  {
    key: '3',
    step: '专审',
    person: '',
    time: ''
  }
]
</script>

<style scoped>
.question-builder-page {
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background: #fff;
  padding: 16px 24px;
  border-radius: 4px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.section {
  background: #fff;
  padding: 24px;
  margin-bottom: 24px;
  border-radius: 4px;
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  padding-left: 8px;
  border-left: 4px solid #1890ff;
}

.tabs-container {
  margin-top: 16px;
}
</style>
