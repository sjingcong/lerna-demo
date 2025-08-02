<template>
  <van-field
    v-model="phoneValue"
    :label="label"
    :placeholder="placeholder"
    :required="required"
    :readonly="readonly"
    :disabled="disabled"
    :clearable="clearable"
    :rules="mergedRules"
    :name="name"
    type="tel"
    maxlength="11"
    @update:model-value="handleInput"
    @blur="handleBlur"
    @focus="handleFocus"
    v-bind="$attrs"
  >
    <template
      #left-icon
      v-if="$slots['left-icon']"
    >
      <slot name="left-icon"></slot>
    </template>
    <template
      #right-icon
      v-if="$slots['right-icon']"
    >
      <slot name="right-icon"></slot>
    </template>
  </van-field>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import { Field as VanField } from 'vant';

  const props = withDefaults(
    defineProps<{
      modelValue?: string;
      label?: string;
      placeholder?: string;
      required?: boolean;
      readonly?: boolean;
      disabled?: boolean;
      clearable?: boolean;
      name?: string;
      rules?: any[];
      enableBuiltInValidation?: boolean;
      trigger?: 'onBlur' | 'onChange';
    }>(),
    {
      modelValue: '',
      label: '手机号',
      placeholder: '请输入手机号',
      required: false,
      readonly: false,
      disabled: false,
      clearable: true,
      name: 'phone',
      rules: () => [],
      enableBuiltInValidation: true,
      trigger: 'onBlur',
    }
  );

  const emit = defineEmits<{
    'update:modelValue': [value: string];
    blur: [event: Event];
    focus: [event: Event];
  }>();

  const phoneValue = ref(props.modelValue);

  // 手机号正则表达式
  const phoneRegex = /^1[3-9]\d{9}$/;

  // 内置校验规则
  const builtInRules = [
    {
      required: props.required,
      message: '请输入手机号',
      trigger: props.trigger,
    },
    {
      validator: (value: string) => {
        if (!value) return true; // 空值由required规则处理
        return value.length === 11;
      },
      message: '手机号必须为11位数字',
      trigger: props.trigger,
    },
    {
      validator: (value: string) => {
        if (!value) return true;
        return phoneRegex.test(value);
      },
      message: '请输入正确的手机号格式',
      trigger: props.trigger,
    },
  ];

  // 合并校验规则
  const mergedRules = computed(() => {
    const rules = props.enableBuiltInValidation ? [...builtInRules] : [];
    return [...rules, ...props.rules];
  });

  // 事件处理
  const handleInput = (value: string) => {
    // vant Field的@update:model-value事件传递字符串值
    // 只允许输入数字
    const numericValue = value.replace(/\D/g, '');
    phoneValue.value = numericValue;

    emit('update:modelValue', numericValue);
  };

  const handleBlur = (event: Event) => {
    emit('blur', event);
  };

  const handleFocus = (event: Event) => {
    emit('focus', event);
  };

  // 监听外部值变化
  watch(
    () => props.modelValue,
    (newValue) => {
      phoneValue.value = newValue || '';
    }
  );

  // 暴露方法给父组件
  defineExpose({
    value: computed(() => phoneValue.value),
  });
</script>

<style scoped>
  /* 可以添加自定义样式 */
</style>
