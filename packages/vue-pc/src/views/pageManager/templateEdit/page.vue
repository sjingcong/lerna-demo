<template>
  <div class="page-container">
    <!-- 模块渲染区域 -->
    <div class="modules-container">
      <Render
        v-for="module in modules"
        :key="module.id"
        :module-data="module"
      />
    </div>

    <!-- 全局Loading -->
    <div
      v-if="isLoading"
      class="global-loading"
    >
      <a-spin size="large">
        <div class="loading-content">
          <div class="loading-text">页面加载中...</div>
        </div>
      </a-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, provide, watch } from 'vue';
  import { Render } from '@giom/shared/modular-craft';
  import { modules } from './modules';
  import { usePageStore, useModuleStore } from './store';
  import { storeToRefs } from 'pinia';
  
  // 定义事件
  const emit = defineEmits<{
    'data-change': [data: any]
  }>();

  // 页面store
  const pageStore = usePageStore();
  const { isLoading, globalData } = storeToRefs(pageStore);
  
  // 监听数据变化，发射事件给父组件
  watch(
    () => pageStore.$state,
    (newState) => {
      emit('data-change', {
        moduleData: newState.moduleData,
        timestamp: Date.now()
      });
    },
    { deep: true }
  );

  // 初始化页面数据
  const initializeData = () => {
    return {
      title: '页面模板管理系统',
      subtitle: '模块化页面构建演示',
      user: {
        name: '管理员',
        avatar: 'https://via.placeholder.com/40',
        role: 'admin',
      },
      // Banner编辑器的初始数据
      bannerEditor: {
        productName: '',
        bannerImages: [],
        videoFiles: [],
        videoCoverImages: [],
      },
      // 其他模块的初始数据可以在这里添加
    };
  };

  onMounted(() => {
    // 初始化全局数据
    const globalData = initializeData();
    pageStore.setGlobalData(globalData);

    // 模拟加载过程
    pageStore.startLoading();
    setTimeout(() => {
      pageStore.stopLoading();
    }, 1000);
  });
</script>

<style scoped lang="less">
  .page-container {
    position: relative;
    min-height: 100vh;
    background-color: #f5f5f5;
  }

  .page-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 40px 24px;
    text-align: center;
    margin-bottom: 24px;

    h1 {
      margin: 0 0 8px 0;
      font-size: 28px;
      font-weight: 600;
    }

    p {
      margin: 0;
      font-size: 16px;
      opacity: 0.9;
    }
  }

  .modules-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px 24px;
  }

  .global-loading {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    background-color: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;

    .loading-content {
      text-align: center;

      .loading-text {
        margin-top: 16px;
        font-size: 16px;
        color: #666;
      }
    }
  }

  // 响应式设计
  @media (max-width: 768px) {
    .page-header {
      padding: 24px 16px;

      h1 {
        font-size: 24px;
      }

      p {
        font-size: 14px;
      }
    }

    .modules-container {
      padding: 0 16px 16px;
    }
  }
</style>
