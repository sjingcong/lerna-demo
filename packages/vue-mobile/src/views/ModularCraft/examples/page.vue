<template>
  <div class="page-container">
    <Render
      v-for="module in modules"
      :key="module.id"
      :module-data="module"
    />
    <!-- 全局Loading组件 -->
    <van-overlay
      v-if="isLoading"
      :show="true"
      class="global-loading"
      :style="{ backgroundColor: 'transparent' }"
    >
      <div class="loading-wrapper">
        <van-loading
          size="24px"
          type="spinner"
        ></van-loading>
      </div>
    </van-overlay>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, provide } from 'vue';
  import { Render } from '../core';
  import { modules } from '../modules';
  import { usePageStore } from './store';
  import { storeToRefs } from 'pinia';
  // 页面唯一标识
  const pageStore = usePageStore();

  const { isLoading } = storeToRefs(pageStore);

  // 初始化数据
  const initializeData = () => {
    return {
      title: 'ModularCraft 演示',
      subtitle: '模块化页面构建系统演示',
      user: {
        name: '张三',
        avatar: 'https://via.placeholder.com/40',
        role: 'admin',
      },
      items: [
        { id: 1, name: '任务一' },
        { id: 2, name: '任务二' },
        { id: 3, name: '任务三' },
        { id: 4, name: '任务三' },
        { id: 5, name: '任务三' },
        { id: 6, name: '任务三' },
        { id: 7, name: '任务三' },
        { id: 8, name: '任务三' },
        { id: 9, name: '任务三' },
        { id: 10, name: '任务三' },
        { id: 11, name: '任务三' },
      ],
    };
  };

  onMounted(() => {
    // 初始化数据
    const globalData = initializeData();
    pageStore.setGlobalData(globalData);
    pageStore.startLoading();
    setTimeout(() => {
      // pageStore.scrollToModule('list');
      pageStore.stopLoading();
    }, 3000);
  });
</script>

<style scoped>
  .page-container {
    position: relative;
  }

  .module-wrapper {
    width: 100%;
  }

  .example-page {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .page-header {
    text-align: center;
    margin-bottom: 30px;
  }

  .page-header h1 {
    color: #2c3e50;
    margin-bottom: 10px;
  }

  .page-header p {
    color: #7f8c8d;
    font-size: 16px;
  }

  .controls {
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
    flex-wrap: wrap;
  }

  .btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s;
  }

  .btn-primary {
    background-color: #3498db;
    color: white;
  }

  .btn-primary:hover {
    background-color: #2980b9;
  }

  .btn-secondary {
    background-color: #95a5a6;
    color: white;
  }

  .btn-secondary:hover {
    background-color: #7f8c8d;
  }

  .btn-info {
    background-color: #1abc9c;
    color: white;
  }

  .btn-info:hover {
    background-color: #16a085;
  }

  .btn-warning {
    background-color: #f39c12;
    color: white;
  }

  .btn-warning:hover {
    background-color: #e67e22;
  }

  .debug-info {
    margin-top: 40px;
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 8px;
  }

  .debug-section {
    margin-bottom: 20px;
  }

  .debug-section h4 {
    margin-bottom: 10px;
    color: #2c3e50;
  }

  .debug-section pre {
    background-color: #2c3e50;
    color: #ecf0f1;
    padding: 15px;
    border-radius: 4px;
    overflow-x: auto;
    font-size: 12px;
  }

  .debug-section ul {
    list-style-type: none;
    padding: 0;
  }

  .debug-section li {
    padding: 5px 10px;
    background-color: #ecf0f1;
    margin-bottom: 5px;
    border-radius: 4px;
  }

  /* 全局Loading样式 */
  .global-loading {
    z-index: 9999;
  }

  .loading-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
</style>
