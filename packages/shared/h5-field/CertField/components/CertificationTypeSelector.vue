<template>
  <div class="certification-type-selector">
    <div
      class="selector-trigger"
      :class="{ disabled: disabled || readonly }"
      @click="handleClick"
    >
      <span class="selector-text">{{ displayText }}</span>
      <van-icon
        name="arrow-down"
        class="selector-icon"
      />
    </div>

    <!-- 证件类型选择弹框 -->
    <van-popup
      v-model:show="showPicker"
      destroy-on-close
      round
      position="bottom"
    >
      <van-picker
        :model-value="currentType"
        :columns="pickerColumns"
        @cancel="showPicker = false"
        @confirm="onConfirm"
        @change="onChange"
      />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import { CertType, CertOptions } from '../constants';

  // Props
  interface CertificationTypeSelectorProps {
    modelValue: CertType | '';
    disabled?: boolean;
    readonly?: boolean;
    supportedTypes?: CertType[];
  }

  // Emits
  interface CertificationTypeSelectorEmits {
    'update:modelValue': [value: CertType];
  }

  const props = withDefaults(defineProps<CertificationTypeSelectorProps>(), {
    disabled: false,
    readonly: false,
    supportedTypes: () => Object.values(CertType),
  });

  // Emits
  const emit = defineEmits<CertificationTypeSelectorEmits>();

  // 响应式数据
  const showPicker = ref(false);
  const currentType = ref([props.modelValue]);

  watch(
    () => props.modelValue,
    (newValue: any) => {
      currentType.value = [newValue];
    }
  );

  // 显示文本
  const displayText = computed(() => {
    const option = CertOptions.find((opt) => opt.value === props.modelValue);
    return option?.label || '请选择';
  });

  // 过滤支持的证件类型选项
  const filteredOptions = computed(() => {
    return CertOptions.filter((option) =>
      props.supportedTypes.includes(option.value)
    );
  });

  // Picker 列数据
  const pickerColumns = computed(() => {
    return filteredOptions.value.map((option) => ({
      text: option.label,
      value: option.value,
    }));
  });

  // 处理点击事件
  const handleClick = () => {
    if (props.disabled || props.readonly) return;
    showPicker.value = true;
  };

  // 处理选择器变化
  const onChange = (values: any[]) => {
    currentType.value = values;
  };

  // 处理确认选择
  const onConfirm = (values: any) => {
    const selectedType = values.selectedValues[0] as CertType;
    emit('update:modelValue', selectedType);
    showPicker.value = false;
  };
</script>

<style scoped>
  .certification-type-selector {
    display: inline-block;
  }

  .selector-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s;
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
