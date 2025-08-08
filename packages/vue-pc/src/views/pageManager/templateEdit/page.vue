<template>
  <CraftConfig
    ref="craftConfigRef"
    page-id="template-page"
    :module-processor-map="moduleProcessorMap"
    :onCreated="handleStoreReady"
  >
    <div class="page-container">
      <!-- 模块渲染区域 -->
      <div class="modules-container">
        <Render
          v-for="module in modules"
          :key="module.id"
          :module-data="module"
        />
      </div>
    </div>
  </CraftConfig>
</template>

<script setup lang="ts">
  import {
    Render,
    CraftConfig,
    CraftConfigExpose,
  } from '@giom/shared/modular-craft';
  import { modules } from './modules';
  import { moduleProcessorMap } from './modules/processor';
  import { ref } from 'vue';
  import { IStore } from '@giom/shared/modular-craft/useStore';

  // 定义props
  const props = defineProps<{
    status?: string;
  }>();

  // 定义事件
  const emit = defineEmits<{
    'data-change': [data: any];
  }>();
  const craftConfigRef = ref<CraftConfigExpose>();

  // 初始化页面数据
  const handleStoreReady = (store: IStore) => {
    // 初始化公共数据
    store.setCommonData({
      status: props.status,
    });

    // 初始化模块数据
    store.processAllModules({
      bannerEditor: {
        productName: '1231321',
        bannerImages: [],
        videoFiles: [],
        videoCoverImages: [],
      },
    });
  };

  defineExpose({
    validate: async () => {
      const validationResults =
        await craftConfigRef.value?.eventBus.validateAll();

      console.log('模块校验结果:', validationResults);
    },
  });
  // 移除onMounted，初始化逻辑已移到handleStoreReady中
</script>

<style scoped lang="less">
  .page-container {
    position: relative;
    min-height: 100vh;
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
