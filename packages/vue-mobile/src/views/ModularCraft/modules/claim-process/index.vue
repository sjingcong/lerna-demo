<template>
  <div
    class="product-module"
    :id="moduleId"
  >
    <RichTextPreview
      :content="content"
      custom-class="product-content"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { useModuleStore } from '../../examples/store';
  import { ProductModuleData } from './config';
  import RichTextPreview from '@giom/shared/h5-components/RichText/preview.vue';

  interface ProductProps {
    moduleId: string;
  }

  const props = defineProps<ProductProps>();

  // 使用模块数据
  const { data: moduleData } = useModuleStore<ProductModuleData>('product');

  // 计算属性
  const content = computed(() => moduleData.value?.content || '');
</script>

<style scoped lang="less">
  @primary-color: #1989fa;
  @border-color: #ebedf0;
  @text-color: #323233;
  @background-color: #f7f8fa;
  @white-color: #fff;
  @secondary-color: #969799;

  .product-module {
    padding: 20px 16px;
    background-color: @white-color;
    margin: 0 16px 20px 16px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .product-title {
      margin-bottom: 20px;
      padding-bottom: 12px;
      border-bottom: 2px solid @primary-color;

      h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        color: @primary-color;
      }
    }

    // RichTextPreview组件已包含完整的富文本样式
    // 如需自定义样式，可通过 :deep() 选择器覆盖
    :deep(.product-content) {
      // 可在此添加特定的样式覆盖
    }
  }

  // 移动端适配
  @media (max-width: 768px) {
    .product-module {
      margin: 0 12px 16px 12px;
      padding: 16px 12px;
    }
  }
</style>
