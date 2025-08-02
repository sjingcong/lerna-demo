<template>
  <van-field
    v-model="idCardValue"
    :label="label"
    :placeholder="placeholder"
    :required="required"
    :readonly="readonly"
    :disabled="disabled"
    :clearable="clearable"
    :name="name"
    :rules="mergedRules"
    maxlength="18"
    @update:model-value="handleInput"
    @blur="handleBlur"
    @focus="handleFocus"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import type {
    IdCardFieldProps,
    IdCardFieldEmits,
    IdCardFieldExpose,
  } from './types';

  // Props
  const props = withDefaults(defineProps<IdCardFieldProps>(), {
    label: '身份证号码',
    placeholder: '请输入身份证号码',
    required: false,
    readonly: false,
    disabled: false,
    clearable: true,
    name: 'idCard',
    enableBuiltInValidation: true,
    trigger: 'onBlur',
    supportedLengths: () => [15, 18],
  });

  // Emits
  const emit = defineEmits<IdCardFieldEmits>();

  // 响应式数据
  const idCardValue = ref(props.modelValue || '');

  // 监听外部值变化
  watch(
    () => props.modelValue,
    (newValue) => {
      idCardValue.value = newValue || '';
    }
  );

  // 身份证号码正则表达式
  const ID_CARD_15_REGEX =
    /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
  const ID_CARD_18_REGEX =
    /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;

  // 校验码权重
  const WEIGHTS = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const CHECK_CODES = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

  // 身份证号码校验函数
  const validateIdCard = (value: string): boolean => {
    if (!value) return false;

    // 检查长度是否在支持的范围内
    if (!props.supportedLengths.includes(value.length)) {
      return false;
    }

    // 15位身份证校验
    if (value.length === 15 && props.supportedLengths.includes(15)) {
      return ID_CARD_15_REGEX.test(value);
    }

    // 18位身份证校验
    if (value.length === 18 && props.supportedLengths.includes(18)) {
      if (!ID_CARD_18_REGEX.test(value)) {
        return false;
      }

      // 校验码验证
      const body = value.slice(0, 17);
      const checkCode = value.slice(17).toUpperCase();

      let sum = 0;
      for (let i = 0; i < 17; i++) {
        sum += parseInt(body[i]) * WEIGHTS[i];
      }

      const expectedCheckCode = CHECK_CODES[sum % 11];
      return checkCode === expectedCheckCode;
    }

    return false;
  };

  // 获取身份证信息
  const getIdCardInfo = (value: string) => {
    if (!validateIdCard(value)) {
      return {
        isValid: false,
        region: '',
        birthDate: '',
        age: 0,
        gender: '',
      };
    }

    let year: string, month: string, day: string;

    if (value.length === 15) {
      // 15位身份证：年份只有2位，需要补充19
      year = '19' + value.slice(6, 8);
      month = value.slice(8, 10);
      day = value.slice(10, 12);
    } else {
      // 18位身份证
      year = value.slice(6, 10);
      month = value.slice(10, 12);
      day = value.slice(12, 14);
    }

    const birthDate = `${year}-${month}-${day}`;
    const currentYear = new Date().getFullYear();
    const age = currentYear - parseInt(year);

    // 性别判断
    let genderCode: string;
    if (value.length === 15) {
      genderCode = value.slice(14, 15);
    } else {
      genderCode = value.slice(16, 17);
    }
    const gender = parseInt(genderCode) % 2 === 1 ? '男' : '女';

    // 地区码（前6位）
    const region = value.slice(0, 6);

    return {
      isValid: true,
      region,
      birthDate,
      age,
      gender,
    };
  };

  // 计算属性
  const isValid = computed(() => validateIdCard(idCardValue.value));
  const idCardInfo = computed(() => getIdCardInfo(idCardValue.value));

  // 内置校验规则
  const builtInRules = computed(() => {
    const supportedLengthsText = props.supportedLengths.join('位或') + '位';
    return [
      {
        validator: (value: string) => {
          if (!value) return true; // 空值由 required 属性处理
          return validateIdCard(value);
        },
        trigger: props.trigger,
        message: `请输入正确的身份证号码（支持${supportedLengthsText}）`,
      },
    ];
  });

  // 合并校验规则
  const mergedRules = computed(() => {
    const rules = props.enableBuiltInValidation ? [...builtInRules.value] : [];
    const customRules = props.rules || [];

    // 处理触发时机设置，避免直接修改原对象
    const processedRules = rules.map((rule) => ({
      ...rule,
      trigger: rule.trigger || props.trigger,
    }));

    const processedCustomRules = customRules.map((rule) => ({
      ...rule,
      trigger: rule.trigger || props.trigger,
    }));

    return [...processedRules, ...processedCustomRules];
  });

  // 事件处理函数
  const handleInput = (value: string) => {
    // 只允许数字和X
    const filteredValue = value.replace(/[^0-9Xx]/g, '').toUpperCase();

    idCardValue.value = filteredValue;
    emit('update:modelValue', filteredValue);
    emit('input', filteredValue);

    // 每次输入变化时检查身份证有效性，如果有效则触发事件
    if (filteredValue && validateIdCard(filteredValue)) {
      const info = getIdCardInfo(filteredValue);
      emit('id-parsed', info);
    }
  };

  const handleBlur = (event: Event) => {
    emit('blur', event);
  };

  const handleFocus = (event: Event) => {
    emit('focus', event);
  };

  // 暴露的属性和方法
  defineExpose<IdCardFieldExpose>({
    value: idCardValue,
    isValid,
    idCardInfo,
    getIdCardInfo: () => getIdCardInfo(idCardValue.value),
  });
</script>

<style scoped>
  /* 组件样式 */
</style>
