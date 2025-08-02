<template>
  <div class="email-field-preview">
    <van-form ref="formRef">
      <EmailField
        v-model="props.modelValue"
        v-bind="$attrs"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
    </van-form>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { Form as VanForm } from 'vant';
  import EmailField from './index.vue';

  // 定义props和emits
  const props = defineProps({
    modelValue: {
      type: String,
      default: undefined,
    },
  });
  const formRef = ref();
  const emailFieldRef = ref();

  const handleInput = (value: string) => {
    console.log('输入:', value);
  };

  const handleBlur = (event: Event) => {
    console.log('失焦:', event);
  };

  const handleFocus = (event: Event) => {
    console.log('聚焦:', event);
  };

  onMounted(() => {
    // 获取EmailField组件实例
    emailFieldRef.value =
      formRef.value?.$el?.querySelector(
        '.van-field'
      )?.__vueParentComponent?.exposed;
  });
</script>

<style scoped>
  .email-field-preview {
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
  }

  .preview-info {
    margin-top: 16px;
    padding: 12px;
    background: white;
    border-radius: 6px;
    border: 1px solid #e1e5e9;
  }

  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 0;
  }

  .info-item:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 8px;
    padding-bottom: 8px;
  }

  .label {
    font-size: 14px;
    color: #666;
    font-weight: 500;
  }

  .value {
    font-size: 14px;
    color: #333;
  }

  .value.valid {
    color: #52c41a;
  }

  .value.invalid {
    color: #ff4d4f;
  }
</style>
