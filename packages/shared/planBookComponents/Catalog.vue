<template>
  <ModuleContainer :back-image="props.data?.backImage">
    <div class="catalog-container">
      <div class="catalog-header">
        <h2 class="catalog-title">目录</h2>
      </div>
      <div class="catalog-content">
        <ul
          class="catalog-list"
          v-if="props.data?.catalogList && props.data.catalogList.length > 0"
        >
          <li
            v-for="(item, index) in props.data.catalogList"
            :key="index"
            class="catalog-item"
            @click="handleItemClick(item, index)"
          >
            <span class="catalog-number">{{ index + 1 }}.</span>
            <span class="catalog-text">
              {{ typeof item === 'string' ? item : item.title }}
            </span>
            <span class="catalog-dots"></span>
            <span
              v-if="typeof item === 'object' && item.page"
              class="catalog-page"
            >
              {{ item.page }}
            </span>
          </li>
        </ul>
        <div
          v-else
          class="catalog-empty"
        >
          <p>暂无目录内容</p>
          <p class="catalog-tip">请在编辑器中添加目录项</p>
        </div>
      </div>
    </div>
  </ModuleContainer>
</template>

<script setup lang="ts">
  import { defineProps, defineEmits, watch } from 'vue';
  import type { IModule } from './types';
  import ModuleContainer from './ModuleContainer.vue';

  interface Props {
    data?: {
      catalogList?: (string | { title: string; page?: number })[];
      [key: string]: any;
    };
    config?: IModule;
  }

  const props = withDefaults(defineProps<Props>(), {
    data: () => ({}),
  });

  // 处理目录项点击事件
  const handleItemClick = (
    item: string | { title: string; page?: number },
    index: number
  ) => {
    console.log('Catalog item clicked:', { item, index });
    // 可以在这里添加跳转逻辑
  };
</script>

<style scoped>
  .catalog-container {
    margin: 0 auto;
    padding: 40px 20px;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    min-height: 400px;
  }

  .catalog-header {
    text-align: center;
    margin-bottom: 40px;
    position: relative;
  }

  .catalog-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #2c3e50;
    margin: 0;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    position: relative;
  }

  .catalog-title::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #3498db, #2980b9);
    border-radius: 2px;
  }

  .catalog-content {
    background: white;
    border-radius: 8px;
    padding: 30px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  }

  .catalog-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .catalog-item {
    display: flex;
    align-items: center;
    padding: 16px 0;
    border-bottom: 1px solid #e9ecef;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
  }

  .catalog-item:last-child {
    border-bottom: none;
  }

  .catalog-item:hover {
    background-color: #f8f9fa;
    transform: translateX(5px);
    padding-left: 10px;
    border-radius: 6px;
  }

  .catalog-number {
    font-weight: 600;
    color: #3498db;
    margin-right: 12px;
    min-width: 30px;
    font-size: 1.1rem;
  }

  .catalog-text {
    flex: 1;
    font-size: 1.1rem;
    color: #2c3e50;
    font-weight: 500;
    line-height: 1.5;
  }

  .catalog-dots {
    flex: 1;
    height: 1px;
    background-image: repeating-linear-gradient(
      to right,
      #bdc3c7 0,
      #bdc3c7 4px,
      transparent 4px,
      transparent 8px
    );
    margin: 0 15px;
    min-width: 50px;
  }

  .catalog-page {
    font-weight: 600;
    color: #7f8c8d;
    min-width: 30px;
    text-align: right;
    font-size: 1rem;
  }

  .catalog-empty {
    text-align: center;
    padding: 60px 20px;
    color: #7f8c8d;
  }

  .catalog-empty p {
    margin: 10px 0;
    font-size: 1.1rem;
  }

  .catalog-tip {
    font-size: 0.9rem;
    opacity: 0.8;
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .catalog-container {
      padding: 20px 15px;
      margin: 10px;
    }

    .catalog-title {
      font-size: 2rem;
    }

    .catalog-content {
      padding: 20px;
    }

    .catalog-item {
      padding: 12px 0;
    }

    .catalog-text {
      font-size: 1rem;
    }

    .catalog-dots {
      margin: 0 10px;
      min-width: 30px;
    }
  }

  /* 动画效果 */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .catalog-item {
    animation: fadeInUp 0.5s ease forwards;
  }

  .catalog-item:nth-child(1) {
    animation-delay: 0.1s;
  }

  .catalog-item:nth-child(2) {
    animation-delay: 0.2s;
  }

  .catalog-item:nth-child(3) {
    animation-delay: 0.3s;
  }

  .catalog-item:nth-child(4) {
    animation-delay: 0.4s;
  }

  .catalog-item:nth-child(5) {
    animation-delay: 0.5s;
  }
</style>
