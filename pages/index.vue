<template>
  <div class="container">
    <h1>玄武山佛祖灵签</h1>
    <div v-if="pending">加载中...</div>
    <div v-else class="grid">
      <NuxtLink 
        v-for="(item, index) in list" 
        :key="item.签号" 
        :to="`/${String(index + 1).padStart(2, '0')}`"
        class="card"
      >
        <div class="card-id">{{ item.签号 }}</div>
        <div class="card-title">{{ item.签名 }}</div>
        <div class="card-tag">{{ item.签文类型 }}</div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FortuneStickLite } from '~/types/lingqian'

const DATA_URL = 'https://cdn.jsdelivr.net/gh/LeoonLiang/xuanwu-fozu-lingqian@main/data-lite/all.json';

// 使用 useFetch 在构建时获取数据
const { data: list, pending } = await useFetch<FortuneStickLite[]>(DATA_URL, {
  // 缓存键，防止重复请求
  key: 'all-sticks' 
});
</script>

<style scoped>
.container { max-width: 800px; margin: 0 auto; padding: 20px; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 16px; }
.card { border: 1px solid #ddd; padding: 16px; border-radius: 8px; text-decoration: none; color: inherit; transition: all 0.2s; }
.card:hover { border-color: #42b883; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.card-id { font-size: 0.8em; color: #666; }
.card-title { font-weight: bold; margin: 8px 0; font-size: 1.2em; }
.card-tag { font-size: 0.8em; background: #f0f0f0; display: inline-block; padding: 2px 6px; border-radius: 4px; }
</style>
