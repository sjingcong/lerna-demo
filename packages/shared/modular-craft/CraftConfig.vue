<template>
  <div class="craft-config-container">
    <slot />

    <!-- 全局Loading -->
    <div
      v-if="store.isLoading"
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
  import { onMounted, provide } from 'vue';
  import { useStore, CRAFT_STORE_KEY } from './useStore';
  import type { ModuleDataProcessor, IStore } from './useStore';
  import { useEventBusProvider } from './useEvent';

  export interface CraftConfigExpose {
    store: IStore;
    eventBus: typeof eventBus;
  }

  interface Props {
    pageId: string;
    moduleProcessorMap: Record<string, ModuleDataProcessor>;
    onMounted?: (store: IStore) => void;
    onCreated?: (store: IStore) => void;
  }

  const props = defineProps<Props>();

  // 创建store实例
  const store = useStore(props.pageId, props.moduleProcessorMap)();
  // 创建事件总线提供者，为子模块提供独立的事件总线实例
  const eventBus = useEventBusProvider();
  // 提供store实例
  provide(CRAFT_STORE_KEY, store);

  // 初始化全局数据
  if (props.onCreated) {
    props.onCreated(store);
  }

  defineExpose({
    store,
    eventBus,
  });

  onMounted(() => {
    props.onMounted?.(store);
  });
</script>

<style scoped lang="less">
  .craft-config-container {
    position: relative;
    min-height: 100vh;
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
</style>
