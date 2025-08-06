<template>
  <div
    class="modular-craft-container"
    :id="moduleId"
  >
    <div
      v-for="module in moduleData?.children"
      :key="module.id"
      :id="module.id"
      :class="[`module-${module.id}`, 'modular-craft-module']"
      :data-module-id="module.id"
    >
      <Render :module-data="module" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { Component } from 'vue';
  import Render from './Render.vue';
  interface ModuleConfig {
    children?: ModuleConfig[];
    component: Component;
    id: string;
  }
  // 定义接口
  interface ModuleData {
    children?: ModuleConfig[];
    component: Component;
    id: string;
  }

  interface Props {
    moduleId?: string;
    moduleData?: ModuleData;
  }

  // 定义props
  const props = defineProps<Props>();
</script>

<style scoped>
  .modular-craft-container {
    width: 100%;
  }

  .modular-craft-module {
    position: relative;
  }

  /* 开发模式样式 */
  .modular-craft-module.dev-mode {
    border: 1px dashed #409eff;
    margin: 4px 0;
    position: relative;
  }

  .dev-module-info {
    position: absolute;
    top: 4px;
    right: 4px;
    z-index: 1000;
    opacity: 0.8;
    transition: all 0.3s ease;
    transform: translateY(0);
  }

  .dev-module-info:hover {
    opacity: 1;
    transform: translateY(-2px);
  }

  .dev-info-content {
    display: flex;
    align-items: center;
    gap: 4px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(8px);
    border-radius: 16px;
    padding: 6px 10px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow:
      0 4px 12px rgba(0, 0, 0, 0.15),
      0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }

  .dev-info-content:hover {
    box-shadow:
      0 8px 24px rgba(0, 0, 0, 0.2),
      0 4px 8px rgba(0, 0, 0, 0.15);
    transform: scale(1.02);
  }

  .module-id {
    font-size: 10px;
    color: #666;
    font-weight: 500;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 60px;
  }

  .dev-inspect-btn,
  .dev-scroll-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 12px;
    padding: 2px;
    border-radius: 4px;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
  }

  .dev-inspect-btn:hover,
  .dev-scroll-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
</style>
