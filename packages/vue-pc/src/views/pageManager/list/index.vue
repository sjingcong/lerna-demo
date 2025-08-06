<template>
  <div class="page-manager-list">
    <!-- 搜索区域 -->
    <SearchComponent />
    
    <!-- 列表区域 -->
    <TableComponent />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import SearchComponent from './components/search.vue'
import TableComponent from './components/table.vue'
import { usePageManagerListStore } from './store'

// 初始化store
const store = usePageManagerListStore()

// 页面加载时获取数据
onMounted(() => {
  store.fetchListData()
})
</script>

<style scoped>
.page-manager-list {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}
</style>