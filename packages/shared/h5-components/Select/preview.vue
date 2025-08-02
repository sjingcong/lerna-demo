<template>
  <div class="select-preview">
    <Select
      :model-value="modelValue"
      v-bind="$attrs"
      @update:modelValue="handleModelUpdate"
      @change="handleChange"
    />
  </div>
</template>

<script setup>
  import { ref, computed, watch } from 'vue';
  import Select from './index.vue';

  // 定义props和emits
  const props = defineProps({
    modelValue: {
      type: [String, Number, Array],
      default: undefined,
    },
  });

  const emit = defineEmits(['update:modelValue', 'change']);

  // 最后变化事件
  const lastChangeEvent = ref('');

  // 事件处理
  const handleModelUpdate = (value) => {
    emit('update:modelValue', value);
    lastChangeEvent.value = `值变更为: ${JSON.stringify(value)} (${new Date().toLocaleTimeString()})`;
  };

  const handleChange = (value) => {
    emit('change', value);
  };

  // 显示值
  const displayValue = computed(() => {
    if (props.modelValue === undefined || props.modelValue === null) {
      return '未选择';
    }
    if (Array.isArray(props.modelValue)) {
      return props.modelValue.length > 0
        ? JSON.stringify(props.modelValue)
        : '[]';
    }
    return String(props.modelValue);
  });
</script>

<style scoped>
  .select-preview {
    padding: 1rem;
  }

  .interaction-result {
    margin-top: 1rem;
    padding: 0.75rem;
    background: #f8fafc;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
  }

  .result-item {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .result-item:last-child {
    margin-bottom: 0;
  }

  .label {
    font-weight: 500;
    color: #64748b;
    margin-right: 0.5rem;
    min-width: 80px;
  }

  .value {
    color: #1e293b;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    background: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    border: 1px solid #d1d5db;
    font-size: 0.875rem;
  }
</style>
