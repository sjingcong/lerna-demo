<template>
  <CraftConfig
    page-id="template-review-page"
    :module-processor-map="moduleProcessorMap"
    :onMounted="handleMounted"
  >
    <Render
      v-for="module in modules"
      :key="module.id"
      :module-data="module"
    />
  </CraftConfig>
</template>

<script setup lang="ts">
  import { Render, CraftConfig } from '@giom/shared/modular-craft';
  import { modules } from './modules';
  import { moduleProcessorMap } from './modules/processor';
  import { useTemplateDataReceiver } from '@/composables/useTemplateDataBridge';

  // 使用模板数据接收服务
  const { onDataChange } = useTemplateDataReceiver();

  const handleMounted = (store: any) => {
    onDataChange((data: any) => {
      console.log('Received template data:', data);

      // 如果有模块数据，更新模块数据
      if (data.moduleData) {
        // 根据需要更新模块数据
        Object.keys(data.moduleData).forEach((moduleId) => {
          store.setModuleData(moduleId, data.moduleData[moduleId]);
        });
      }
    });
  };
</script>

<style scoped lang="less">
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

  // 响应式设计
  @media (max-width: 768px) {
    .page-container {
      padding: 0;
    }

    .modules-container {
      padding: 0 16px 16px;
    }
  }
</style>
