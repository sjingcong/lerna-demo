<template>
  <van-field
    v-model="inputValue"
    :placeholder="currentPlaceholder"
    :disabled="disabled"
    :readonly="readonly"
    :clearable="clearable"
    :maxlength="currentMaxlength"
    :rules="mergedRules"
    @update:model-value="handleInput"
    @blur="handleBlur"
    @focus="handleFocus"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import {
    CertificationType,
    CertificationOptions,
    CertificationValidateMap,
  } from '../constants';

  // Props
  interface CertificationInputProps {
    modelValue?: string;
    type: CertificationType;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    clearable?: boolean;
    required?: boolean;
    rules?: any[];
    enableBuiltInValidation?: boolean;
    trigger?: 'onChange' | 'onBlur';
  }

  // Emits
  interface CertificationInputEmits {
    'update:modelValue': [value: string];
    input: [value: string];
    blur: [event: Event];
    focus: [event: Event];
  }

  // Props
  const props = withDefaults(defineProps<CertificationInputProps>(), {
    placeholder: '请输入证件号码',
    disabled: false,
    readonly: false,
    clearable: true,
    rules: () => [],
    enableBuiltInValidation: true,
    trigger: 'onBlur',
  });

  // Emits
  const emit = defineEmits<CertificationInputEmits>();

  // 响应式数据
  const inputValue = ref(props.modelValue || '');

  // 监听外部值变化
  watch(
    () => props.modelValue,
    (newValue) => {
      if (newValue !== inputValue.value) {
        inputValue.value = newValue || '';
      }
    }
  );

  // 监听证件类型变化，清空输入值
  watch(
    () => props.type,
    () => {
      inputValue.value = '';
      emit('update:modelValue', '');
    }
  );

  // 计算属性
  const currentTypeOption = computed(() => {
    return CertificationOptions.find((option) => option.value === props.type);
  });

  const currentValidator = computed(() => {
    return CertificationValidateMap[props.type];
  });

  const currentPlaceholder = computed(() => {
    return props.placeholder || '请输入证件号码';
  });

  const currentMaxlength = computed(() => {
    return currentValidator.value?.maxLength || undefined;
  });

  // 内置校验规则
  const builtInRules = computed(() => {
    if (!props.enableBuiltInValidation || !currentValidator.value) return [];
    return currentValidator.value.getRules(props.required, props.trigger);
  });

  // 合并验证规则
  const mergedRules = computed(() => {
    return [...builtInRules.value, ...props.rules];
  });

  // 处理输入事件
  const handleInput = (value: string) => {
    let formattedValue = value;

    // 如果有格式化方法，则进行格式化
    if (currentValidator.value?.format) {
      formattedValue = currentValidator.value.format(value);
    }

    inputValue.value = formattedValue;
    emit('update:modelValue', formattedValue);
    emit('input', formattedValue);
  };

  // 处理失焦事件
  const handleBlur = (event: Event) => {
    emit('blur', event);
  };

  // 处理聚焦事件
  const handleFocus = (event: Event) => {
    emit('focus', event);
  };
</script>

<style scoped>
  /* 组件样式继承自 van-field，无需额外样式 */
</style>
