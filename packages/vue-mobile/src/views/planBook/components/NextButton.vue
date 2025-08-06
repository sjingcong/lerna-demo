<template>
  <div class="next-button-container">
    <button
      class="next-button"
      @click="handleNext"
      :disabled="!hasNextModule"
    >
      下一步
    </button>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { usePlanTemplateStore } from '../../../stores/planTemplateStore';
  import type { IModule } from '@giom/shared/planBookComponents/types';

  // 使用router和store
  const router = useRouter();
  const store = usePlanTemplateStore();

  // 获取当前模块在列表中的索引
  const currentModuleIndex = computed(() => {
    if (!store.currentModule) return -1;
    return store.modules.findIndex(
      (module) => module.moduleCode === store.currentModule?.moduleCode
    );
  });

  // 检查是否有下一个模块
  const hasNextModule = computed(() => {
    return (
      currentModuleIndex.value >= 0 &&
      currentModuleIndex.value < store.modules.length - 1
    );
  });

  // 获取下一个模块
  const nextModule = computed(() => {
    if (hasNextModule.value) {
      return store.modules[currentModuleIndex.value + 1];
    }
    return null;
  });

  // 处理下一步按钮点击
  const handleNext = async () => {
    if (nextModule.value) {
      // 通过路由跳转到下一个模块
      await router.push({
        name: 'PlanBook', // 使用正确的路由名称
        params: {
          id: nextModule.value.moduleCode,
        },
      });
      // 发出事件通知父组件模块已切换
      emit('moduleChanged', nextModule.value);
    }
  };

  // 定义事件
  const emit = defineEmits<{
    moduleChanged: [module: IModule];
  }>();
</script>

<style scoped>
  /* 下一步按钮容器 */
  .next-button-container {
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px 20px;
    background: linear-gradient(
      to top,
      rgba(255, 255, 255, 1) 70%,
      rgba(255, 255, 255, 0)
    );
    backdrop-filter: blur(10px);
    z-index: 100;
  }

  /* 下一步按钮 */
  .next-button {
    width: 100%;
    height: 48px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 24px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  }

  .next-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }

  .next-button:active:not(:disabled) {
    transform: translateY(0);
  }

  .next-button:disabled {
    background: #e0e0e0;
    color: #999;
    cursor: not-allowed;
    box-shadow: none;
  }

  /* 移动端适配 */
  @media (max-width: 768px) {
    .next-button-container {
      padding: 12px 16px;
    }

    .next-button {
      height: 44px;
      font-size: 15px;
    }
  }
</style>
