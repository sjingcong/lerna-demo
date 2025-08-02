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
  import { DocumentType, type DocumentInputProps, type DocumentInputEmits, type DocumentInfo } from '../types';
  import { getDocumentTypeOption } from '../constants';
  import { parseDocumentInfo, formatDocument, getDocumentRules } from '../utils/validation';

  // Props
  const props = withDefaults(defineProps<DocumentInputProps>(), {
    placeholder: '请输入证件号码',
    disabled: false,
    readonly: false,
    clearable: true,
    rules: () => [],
    enableBuiltInValidation: true,
    trigger: 'onBlur'
  });

  // Emits
  const emit = defineEmits<DocumentInputEmits>();

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
    return getDocumentTypeOption(props.type);
  });

  const currentPlaceholder = computed(() => {
    return props.placeholder || currentTypeOption.value?.placeholder || '请输入证件号码';
  });

  const currentMaxlength = computed(() => {
    return currentTypeOption.value?.maxlength || 20;
  });

  // 内置验证规则
  const builtInRules = computed(() => {
    if (!props.type) return []
    
    const rules = getDocumentRules(props.type, 'onBlur')
    // 更新第一个规则的required状态
    if (rules.length > 0 && rules[0]) {
      rules[0].required = props.required
    }
    
    return rules
  });

  // 合并验证规则
  const mergedRules = computed(() => {
    return [...builtInRules.value, ...props.rules];
  });

  // 处理输入事件
  const handleInput = (value: string) => {
    // 格式化输入值
    const formattedValue = formatValue(value);
    
    inputValue.value = formattedValue;
    emit('update:modelValue', formattedValue);
    emit('input', formattedValue);

    // 实时验证和解析（如果启用）
    if (props.trigger === 'onChange') {
      validateAndParse(formattedValue);
    }
  };

  // 处理失焦事件
  const handleBlur = (event: Event) => {
    emit('blur', event);
    
    // 失焦时验证和解析
    if (props.trigger === 'onBlur') {
      validateAndParse(inputValue.value);
    }
  };

  // 处理聚焦事件
  const handleFocus = (event: Event) => {
    emit('focus', event);
  };

  // 验证和解析证件信息
  const validateAndParse = async (value: string) => {
    if (!value.trim()) return;

    const documentInfo = await parseDocumentInfo(props.type, value);
    emit('document-parsed', documentInfo);
  };

  // 格式化证件号码
  const formatValue = (value: string) => {
    return formatDocument(props.type, value);
  };
</script>

<style scoped>
  /* 组件样式继承自 van-field，无需额外样式 */
</style>