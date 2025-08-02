<template>
  <div class="document-type-selector">
    <div 
      class="selector-trigger"
      :class="{ disabled: disabled || readonly }"
      @click="handleClick"
    >
      <span class="selector-text">{{ selectedTypeText }}</span>
      <van-icon name="arrow-down" class="selector-icon" />
    </div>

    <!-- 证件类型选择弹框 -->
    <van-popup 
      v-model:show="showPicker" 
      destroy-on-close 
      round 
      position="bottom"
    >
      <van-picker 
        :model-value="[currentType]" 
        :columns="pickerColumns" 
        @cancel="showPicker = false" 
        @confirm="onConfirm"
        @change="onChange"
      />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { DocumentType, type DocumentTypeSelectorProps, type DocumentTypeSelectorEmits } from '../types';
  import { DOCUMENT_TYPE_OPTIONS, getDocumentTypeText, DEFAULT_SUPPORTED_TYPES } from '../constants';

  // Props
  const props = withDefaults(defineProps<DocumentTypeSelectorProps>(), {
    disabled: false,
    readonly: false,
    supportedTypes: () => DEFAULT_SUPPORTED_TYPES
  });

  // Emits
  const emit = defineEmits<DocumentTypeSelectorEmits>();

  // 响应式数据
  const showPicker = ref(false);
  const currentType = ref(props.modelValue);

  // 计算属性
  const selectedTypeText = computed(() => {
    return getDocumentTypeText(props.modelValue);
  });

  // 过滤支持的证件类型选项
  const filteredOptions = computed(() => {
    return DOCUMENT_TYPE_OPTIONS.filter(option => 
      props.supportedTypes.includes(option.value)
    );
  });

  // Picker 列数据
  const pickerColumns = computed(() => {
    return filteredOptions.value.map(option => ({
      text: option.text,
      value: option.value
    }));
  });

  // 处理点击事件
  const handleClick = () => {
    if (props.disabled || props.readonly) return;
    showPicker.value = true;
  };

  // 处理选择器变化
  const onChange = (values: any[]) => {
    currentType.value = values[0];
  };

  // 处理确认选择
  const onConfirm = (values: any[]) => {
    const selectedType = values[0] as DocumentType;
    emit('update:modelValue', selectedType);
    showPicker.value = false;
  };
</script>

<style scoped>
  .document-type-selector {
    display: inline-block;
    min-width: 100px;
  }

  .selector-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    background: #f7f8fa;
    border: 1px solid #ebedf0;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s;
    min-height: 44px;
    box-sizing: border-box;
  }

  .selector-trigger:hover {
    border-color: #1989fa;
  }

  .selector-trigger.disabled {
    background: #f5f5f5;
    color: #c8c9cc;
    cursor: not-allowed;
  }

  .selector-text {
    font-size: 14px;
    color: #323233;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .selector-icon {
    margin-left: 8px;
    color: #969799;
    font-size: 12px;
    transition: transform 0.3s;
  }

  .selector-trigger.disabled .selector-text,
  .selector-trigger.disabled .selector-icon {
    color: #c8c9cc;
  }
</style>