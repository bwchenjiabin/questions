<template>
  <a-card class="mb-4" title="最新资源">
    <a-list :data-source="latestResources" item-layout="horizontal">
      <template #renderItem="{ item }">
        <a-list-item>
          <a-list-item-meta>
            <template #avatar>
              <a-avatar :size="64" shape="square" class="bg-gray-200">
                {{ item.type }}
              </a-avatar>
            </template>
            <template #title>
              <a href="#">{{ item.title }}</a>
            </template>
            <template #description>
              <div>
                <p class="text-xs mb-1">{{ item.description }}</p>
                <span class="text-xs text-gray-500 mr-3">{{ item.version }}</span>
                <span class="text-xs text-gray-500 mr-3">{{ item.date }}</span>
                <span class="text-xs text-gray-500">下载: {{ item.downloadCount }}</span>
              </div>
            </template>
          </a-list-item-meta>
          <template #actions>
            <a-button type="primary">下载</a-button>
          </template>
        </a-list-item>
      </template>
    </a-list>
  </a-card>
</template>

<script setup>
import { useResourceStore } from '../store/resources'

const resourceStore = useResourceStore()
const latestResources = resourceStore.getLatestResources
</script>