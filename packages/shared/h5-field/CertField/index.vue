<template>
  <van-field
    class="certtype-field"
    ref="fieldRef"
    :model-value="formattedValue.certType"
    :disabled="disabled"
    :readonly="readonly"
    :rules="mergedCertTypeRules"
    :name="certTypeName"
  ></van-field>
  <van-field
    ref="fieldRef"
    :model-value="formattedValue"
    :placeholder="currentPlaceholder"
    :disabled="disabled"
    :readonly="readonly"
    :clearable="clearable"
    :required="required"
    :rules="mergedCertValueRules"
    :name="certValueName"
    v-bind="$attrs"
  >
    <template #input>
      <div class="certification-field-content">
        <!-- 证件类型选择器 -->
        <div class="certification-type-section">
          <CertificationTypeSelector
            :model-value="currentCertType"
            :disabled="disabled"
            :readonly="readonly"
            :supported-types="supportedTypes"
            @update:model-value="handleTypeChange"
          />
        </div>

        <!-- 证件号码输入框 -->
        <div class="certification-input-section">
          <CertificationInput
            :model-value="currentCertValue"
            :type="currentCertType"
            :placeholder="currentPlaceholder"
            :disabled="disabled"
            :readonly="readonly"
            :clearable="false"
            :required="false"
            :rules="[]"
            :enable-built-in-validation="false"
            :trigger="trigger"
            @update:model-value="handleValueChange"
            @input="handleInput"
            @blur="handleInputBlur"
            @focus="handleInputFocus"
          />
        </div>
      </div>
    </template>
  </van-field>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import CertificationTypeSelector from './components/CertificationTypeSelector.vue';
  import CertificationInput from './components/CertificationInput.vue';
  import { CertType, CertValidateMap } from './constants';

  // 定义Props
  interface CertFieldProps {
    modelValue?: string;
    certType?: CertType;
    label?: string;
    placeholder?: string;
    required?: boolean;
    readonly?: boolean;
    disabled?: boolean;
    clearable?: boolean;
    certValueName?: string;
    certTypeName: string;
    rules?: any[];
    certTypeRules?: any[];
    enableBuiltInValidation?: boolean;
    trigger?: 'onChange' | 'onBlur' | 'onSubmit';
    supportedTypes?: CertType[];
  }

  // Props
  const props = withDefaults(defineProps<CertFieldProps>(), {
    modelValue: '',
    label: '证件信息',
    placeholder: '',
    required: false,
    readonly: false,
    disabled: false,
    clearable: true,
    name: '',
    rules: () => [],
    certTypeRules: () => [],
    enableBuiltInValidation: true,
    supportedTypes: () => [CertType.ID_CARD, CertType.PASSPORT],
  });

  // 定义Emits
  interface CertFieldEmits {
    'update:modelValue': [value: string];
    'update:certType': [type: CertType];
    input: [value: string];
    blur: [event: Event];
    focus: [event: Event];
    'certification-parsed': [info: any];
  }

  // Emits
  const emit = defineEmits<CertFieldEmits>();

  // 响应式数据
  const currentCertType = ref<CertType | ''>(props.certType || '');
  const currentCertValue = ref<string>(props.modelValue || '');
  const fieldRef = ref();

  const innerCertTypeRules = computed(() => {
    if (props.required) {
      return [
        {
          validator: function (value: any) {
            if (!value) {
              return '请选择证件类型';
            }
          },
        },
      ];
    }
    return [];
  });
  const innerCertValueRules = computed(() => {
    if (props.required) {
      return [
        {
          validator: function (value: any) {
            if (!value.certType) {
              return '请选择证件类型';
            }
            if (!value.certValue) {
              return '请输入证件号码';
            }
          },
        },
      ];
    }
    return [];
  });

  // 监听props变化
  watch(
    () => props.modelValue,
    (newValue) => {
      currentCertValue.value = newValue || '';
    }
  );

  watch(
    () => props.certType,
    (newType) => {
      currentCertType.value = newType || '';
    }
  );

  // 计算当前证件类型的校验器
  const currentValidator = computed(() => {
    return currentCertType.value
      ? CertValidateMap[currentCertType.value]
      : null;
  });

  const currentPlaceholder = computed(() => {
    return props.placeholder || '请输入证件号码';
  });

  // 内置校验规则
  const builtInRules = computed(() => {
    if (!props.enableBuiltInValidation || !currentValidator.value) return [];
    const rules = currentValidator.value.getRules();
    return rules.map((i) => {
      const rule = {
        ...i,
      };
      if (i.validator) {
        rule.validator = (value: any) => {
          return i.validator(value.certValue);
        };
      }
      return rule;
    });
  });

  // 合并验证规则
  const mergedCertValueRules = computed(() => {
    return [
      ...innerCertValueRules.value,
      ...builtInRules.value,
      ...props.rules,
    ].map((i) => {
      return {
        ...i,
        trigger: props.trigger,
      };
    });
  });

  const mergedCertTypeRules = computed(() => {
    return [...innerCertTypeRules.value, ...props.certTypeRules].map((i) => {
      return {
        ...i,
        trigger: props.trigger,
      };
    });
    return;
  });

  // 格式化显示值（用于van-field的v-model）
  const formattedValue = computed(() => {
    return {
      certType: currentCertType.value,
      certValue: currentCertValue.value,
    };
  });

  // 事件处理方法
  const handleTypeChange = (type: CertType) => {
    currentCertType.value = type;
    // 清空当前值，因为类型改变了
    currentCertValue.value = '';
    emit('update:certType', type);
    emit('update:modelValue', '');
  };

  const handleValueChange = (value: string) => {
    currentCertValue.value = value;
    emit('update:modelValue', value);
  };

  const handleInput = (value: string) => {
    emit('input', value);
  };

  const handleInputBlur = (event: Event) => {
    emit('blur', event);
    // 手动触发van-field的验证
    if (fieldRef.value && props.trigger === 'onBlur') {
      fieldRef.value.validate();
    }
  };

  const handleInputFocus = (event: Event) => {
    emit('focus', event);
  };

  // 获取证件信息的方法
  const getCertInfo = () => {
    if (!currentCertValue.value || !currentCertType.value) {
      return null;
    }

    const validator = CertValidateMap[currentCertType.value];
    const isValid = currentCertValue.value?.trim?.()
      ? validator.validate(currentCertValue.value.trim())
      : false;

    try {
      const info =
        isValid && validator.parse
          ? validator.parse(currentCertValue.value)
          : {};
      return {
        type: currentCertType.value,
        value: currentCertValue.value,
        isValid,
        ...info,
      };
    } catch (error) {
      return {
        type: currentCertType.value,
        value: currentCertValue.value,
        isValid: false,
      };
    }
  };

  // 暴露给父组件的方法和属性
  defineExpose({
    value: currentCertValue,
    getCertificationInfo: getCertInfo,
  });
</script>

<style scoped>
  .certtype-field {
    display: none;
  }
  .certification-field-content {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
  }

  .certification-type-section {
    flex-shrink: 0;
  }

  .certification-input-section {
    flex: 1;
  }

  .certification-input {
    width: 100%;
    border: none;
    outline: none;
    background: transparent;
    font-size: 14px;
    color: #323233;
  }

  .certification-input::placeholder {
    color: #c8c9cc;
  }

  .certification-input:disabled {
    color: #c8c9cc;
    cursor: not-allowed;
  }
</style>
