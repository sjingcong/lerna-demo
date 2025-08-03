<template>
  <div class="certification-field">
    <div class="certification-field-content">
      <!-- 证件类型选择器 -->
      <div class="certification-type-section">
        <CertificationTypeSelector
          v-model="currentCertificationType"
          :disabled="disabled"
          :readonly="readonly"
          :supported-types="supportedTypes"
          @update:model-value="handleTypeChange"
        />
      </div>

      <!-- 证件号码输入框 -->
      <div class="certification-input-section">
        <CertificationInput
          v-model="currentCertificationValue"
          :type="currentCertificationType"
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
        />
      </div>
    </div>

    <!-- 标签显示 -->
    <div
      v-if="label"
      class="certification-field-label"
    >
      {{ label }}
      <span
        v-if="required"
        class="required-mark"
      >
        *
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import CertificationTypeSelector from './components/CertificationTypeSelector.vue';
  import CertificationInput from './components/CertificationInput.vue';
  import { CertificationType, CertificationValidateMap } from './constants';

  // 定义Props
  interface CertificationFieldProps {
    modelValue?: string;
    certType?: CertificationType;
    label?: string;
    placeholder?: string;
    required?: boolean;
    readonly?: boolean;
    disabled?: boolean;
    clearable?: boolean;
    name?: string;
    rules?: any[];
    enableBuiltInValidation?: boolean;
    trigger?: 'onChange' | 'onBlur';
    supportedTypes?: CertificationType[];
  }

  // Props
  const props = withDefaults(defineProps<CertificationFieldProps>(), {
    modelValue: '',
    certType: CertificationType.ID_CARD,
    label: '证件信息',
    placeholder: '',
    required: false,
    readonly: false,
    disabled: false,
    clearable: true,
    name: 'certification',
    rules: () => [],
    enableBuiltInValidation: true,
    trigger: 'onBlur',
    supportedTypes: () => Object.values(CertificationType),
  });

  // 定义Emits
  interface CertificationFieldEmits {
    (e: 'update:modelValue', value: string): void;
    (e: 'update:certType', type: CertificationType): void;
    (e: 'input', value: string): void;
    (e: 'blur', event: Event): void;
    (e: 'focus', event: Event): void;
    (e: 'certification-parsed', info: any): void;
  }

  // Emits
  const emit = defineEmits<CertificationFieldEmits>();

  // 响应式数据
  const currentCertificationType = ref<CertificationType>(props.certType);
  const currentCertificationValue = ref<string>(props.modelValue);

  // 监听外部值变化
  watch(
    () => props.modelValue,
    (newValue) => {
      if (newValue !== currentCertificationValue.value) {
        currentCertificationValue.value = newValue;
      }
    }
  );

  watch(
    () => props.certType,
    (newType) => {
      if (newType !== currentCertificationType.value) {
        currentCertificationType.value = newType;
      }
    }
  );

  // 输入框验证规则（排除类型相关的规则，由CertificationInput处理）
  const inputRules = computed(() => {
    return props.rules.filter((rule) => {
      // 过滤掉可能与证件类型冲突的规则
      return !rule.pattern || typeof rule.pattern === 'string';
    });
  });

  // 事件处理方法
  const handleTypeChange = (type: CertificationType) => {
    currentCertificationType.value = type;
    // 清空当前值，因为类型改变了
    currentCertificationValue.value = '';
  };

  const handleValueChange = (value: string) => {
    currentCertificationValue.value = value;
  };

  const handleInput = (value: string) => {
    emit('input', value);
  };

  const handleBlur = (event: Event) => {
    const info = getCertificationInfo();
    if (info) {
      emit('certification-parsed', info);
    }
    emit('blur', event);
  };

  const handleFocus = (event: Event) => {
    emit('focus', event);
  };

  // 获取证件信息的方法
  const getCertificationInfo = () => {
    if (!currentCertificationValue.value || !currentCertificationType.value) {
      return null;
    }

    const validator = CertificationValidateMap[currentCertificationType.value];
    const isValid = currentCertificationValue.value?.trim?.()
      ? validator.validate(currentCertificationValue.value.trim())
      : false;

    try {
      const info =
        isValid && validator.parse
          ? validator.parse(currentCertificationValue.value)
          : {};
      return {
        type: currentCertificationType.value,
        value: currentCertificationValue.value,
        isValid,
        ...info,
      };
    } catch (error) {
      return {
        type: currentCertificationType.value,
        value: currentCertificationValue.value,
        isValid: false,
        error: error.message,
      };
    }
  };

  // 暴露给父组件的方法和属性
  defineExpose({
    value: currentCertificationValue,
    getCertificationInfo,
  });
</script>

<style scoped>
  .certification-field {
    width: 100%;
  }

  .certification-field-content {
    display: flex;
    gap: 8px;
    align-items: stretch;
  }

  .certification-type-section {
    flex: 0 0 auto;
    min-width: 100px;
  }

  .certification-input-section {
    flex: 1;
    min-width: 0;
  }

  .certification-field-label {
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
    .certification-field-content {
      flex-direction: column;
      gap: 12px;
    }

    .certification-type-section {
      min-width: auto;
    }
  }
</style>
