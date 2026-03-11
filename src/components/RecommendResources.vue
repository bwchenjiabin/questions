<template>
  <a-card class="mb-4" title="推荐资源">
    <a-row :gutter="[16, 16]">
      <a-col :span="6" v-for="resource in recommendResources" :key="resource.id">
        <a-card hoverable>
          <div class="h-40 bg-gray-200 flex items-center justify-center mb-3">
            <span class="text-gray-500">{{ resource.type }}</span>
          </div>
          <h3 class="font-medium text-sm mb-2">{{ resource.title }}</h3>
          <p class="text-xs text-gray-500 mb-2">{{ resource.version }}</p>
          <div class="flex justify-between items-center">
            <span class="text-blue-600 text-sm">{{ resource.price }}</span>
            <a-button type="primary" size="small">下载</a-button>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </a-card>
</template>

<script setup>
import { useResourceStore } from '../store/resources'

const resourceStore = useResourceStore()
const recommendResources = resourceStore.getRecommendResources
</script>