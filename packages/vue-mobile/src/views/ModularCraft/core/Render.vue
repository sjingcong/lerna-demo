<template>
  <div
    class="modular-craft-container"
    :key="renderKey"
  >
    <div
      v-for="module in modules"
      :key="`${module.id}-${renderKey}`"
      :id="module.id"
      :class="[
        `module-${module.id}`,
        'modular-craft-module',
        { 'dev-mode': isDevMode },
      ]"
      :data-module-id="module.id"
    >
      <!-- 开发模式调试信息 -->
      <div
        v-if="isDevMode"
        class="dev-module-info"
      >
        <div class="dev-info-content">
          <span class="module-id">{{ module.id }}</span>
          <button
            @click="inspectModule(module)"
            class="dev-inspect-btn"
            title="检查模块"
          >
            🔍
          </button>
          <button
            @click="scrollToModule(module)"
            class="dev-scroll-btn"
            title="滚动到模块"
          >
            📍
          </button>
        </div>
      </div>

      <component
        :is="module.component"
        v-bind="{
          moduleId: module.id,
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import type { Component } from 'vue';
  import { usePageStore } from '../examples/store';

  // 定义接口
  interface ModuleConfig {
    id: string;
    component: Component;
  }

  interface Props {
    modules?: ModuleConfig[];
  }

  // 定义props
  const props = withDefaults(defineProps<Props>(), {
    modules: () => [],
  });

  const renderKey = ref(0);

  // 初始化页面store
  const pageStore = usePageStore();

  // 检测开发模式
  const isDevMode = computed(() => {
    return localStorage.getItem('modularcraftdevtools') === 'true';
  });

  /**
   * 强制重新渲染
   */
  const forceUpdate = () => {
    renderKey.value++;
  };

  /**
   * 检查模块
   */
  const inspectModule = (module: ModuleConfig) => {
    console.log('模块ID:', module.id);
    console.log('*****当前模块数据*****');
    console.log(JSON.stringify(pageStore.moduleData[module.id], null, 2));
    console.log('*****公共数据*****');
    console.log(JSON.stringify(pageStore.commonData, null, 2));
  };

  /**
   * 滚动到指定模块
   */
  const scrollToModule = (module: ModuleConfig) => {
    // 使用模块的data-module-id属性作为选择器
    const selector = `[data-module-id="${module.id}"]`;
    pageStore.scrollToModule(selector, {
      duration: 800,
      easing: 'ease-in-out',
      offset: -10,
    });
  };

  // 暴露方法给父组件
  defineExpose({
    forceUpdate,
  });
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
