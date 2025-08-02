<template>
  <div class="document-field">
    <div class="document-field-content">
      <!-- 证件类型选择器 -->
      <div class="document-type-section">
        <DocumentTypeSelector
          v-model="currentDocumentType"
          :disabled="disabled"
          :readonly="readonly"
          :supported-types="supportedTypes"
          @update:model-value="handleTypeChange"
        />
      </div>

      <!-- 证件号码输入框 -->
      <div class="document-input-section">
        <DocumentInput
          v-model="currentDocumentValue"
          :type="currentDocumentType"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :clearable="clearable"
          :rules="inputRules"
          :enable-built-in-validation="enableBuiltInValidation"
          :trigger="trigger"
          :name="name"
          @update:model-value="handleValueChange"
          @input="handleInput"
          @blur="handleBlur"
          @focus="handleFocus"
          @document-parsed="handleDocumentParsed"
        />
      </div>
    </div>

    <!-- 标签显示 -->
    <div v-if="label" class="document-field-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import DocumentTypeSelector from './components/DocumentTypeSelector.vue';
  import DocumentInput from './components/DocumentInput.vue';
  import {
    DocumentType,
    type DocumentFieldProps,
    type DocumentFieldEmits,
    type DocumentFieldExpose,
    type DocumentValue,
    type DocumentInfo
  } from './types';
  import { DEFAULT_DOCUMENT_TYPE, DEFAULT_SUPPORTED_TYPES } from './constants';

  // Props
  const props = withDefaults(defineProps<DocumentFieldProps>(), {
    label: '证件信息',
    placeholder: '',
    required: false,
    readonly: false,
    disabled: false,
    clearable: true,
    name: 'document',
    rules: () => [],
    enableBuiltInValidation: true,
    trigger: 'onBlur',
    supportedTypes: () => DEFAULT_SUPPORTED_TYPES
  });

  // Emits
  const emit = defineEmits<DocumentFieldEmits>();

  // 响应式数据
  const currentDocumentType = ref<DocumentType>(
    props.modelValue?.type || DEFAULT_DOCUMENT_TYPE
  );
  const currentDocumentValue = ref<string>(
    props.modelValue?.value || ''
  );
  const documentInfo = ref<DocumentInfo>({
    isValid: false,
    type: currentDocumentType.value,
    value: currentDocumentValue.value
  });

  // 监听外部值变化
  watch(
    () => props.modelValue,
    (newValue) => {
      if (newValue) {
        if (newValue.type !== currentDocumentType.value) {
          currentDocumentType.value = newValue.type;
        }
        if (newValue.value !== currentDocumentValue.value) {
          currentDocumentValue.value = newValue.value;
        }
      } else {
        currentDocumentType.value = DEFAULT_DOCUMENT_TYPE;
        currentDocumentValue.value = '';
      }
    },
    { deep: true }
  );

  // 计算属性
  const currentValue = computed<DocumentValue>(() => ({
    type: currentDocumentType.value,
    value: currentDocumentValue.value
  }));

  const isValid = computed(() => documentInfo.value.isValid);

  // 输入框验证规则（排除类型相关的规则，由DocumentInput处理）
  const inputRules = computed(() => {
    return props.rules.filter(rule => {
      // 过滤掉可能与证件类型冲突的规则
      return !rule.pattern || typeof rule.pattern === 'string';
    });
  });

  // 处理证件类型变化
  const handleTypeChange = (type: DocumentType) => {
    currentDocumentType.value = type;
    // 类型变化时清空证件值
    currentDocumentValue.value = '';
    
    const newValue: DocumentValue = {
      type,
      value: ''
    };
    
    emit('update:modelValue', newValue);
    emit('type-change', type);
  };

  // 处理证件值变化
  const handleValueChange = (value: string) => {
    currentDocumentValue.value = value;
    
    const newValue: DocumentValue = {
      type: currentDocumentType.value,
      value
    };
    
    emit('update:modelValue', newValue);
  };

  // 处理输入事件
  const handleInput = (value: string) => {
    const newValue: DocumentValue = {
      type: currentDocumentType.value,
      value
    };
    
    emit('input', newValue);
  };

  // 处理失焦事件
  const handleBlur = (event: Event) => {
    emit('blur', event);
  };

  // 处理聚焦事件
  const handleFocus = (event: Event) => {
    emit('focus', event);
  };

  // 处理证件解析事件
  const handleDocumentParsed = (info: DocumentInfo) => {
    documentInfo.value = info;
    emit('document-parsed', info);
  };

  // 获取证件信息
  const getDocumentInfo = (): DocumentInfo => {
    return documentInfo.value;
  };

  // 暴露给父组件的方法和属性
  defineExpose<DocumentFieldExpose>({
    value: currentValue,
    isValid,
    documentInfo,
    getDocumentInfo
  });
</script>

<style scoped>
  .document-field {
    width: 100%;
  }

  .document-field-content {
    display: flex;
    gap: 8px;
    align-items: stretch;
  }

  .document-type-section {
    flex: 0 0 auto;
    min-width: 100px;
  }

  .document-input-section {
    flex: 1;
    min-width: 0;
  }

  .document-field-label {
    font-size: 14px;
    color: #646566;
    margin-bottom: 8px;
    line-height: 1.4;
  }

  .required-mark {
    color: #ee0a24;
    margin-left: 2px;
  }

  /* 响应式设计 */
  @media (max-width: 480px) {
    .document-field-content {
      flex-direction: column;
      gap: 12px;
    }

    .document-type-section {
      min-width: auto;
    }
  }
</style>