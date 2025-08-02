<template>
  <van-field
    v-model="emailValue"
    :label="label"
    :placeholder="placeholder"
    :required="required"
    :readonly="readonly"
    :disabled="disabled"
    :clearable="clearable"
    :rules="mergedRules"
    :name="name"
    type="email"
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
      label: '邮箱',
      placeholder: '请输入邮箱地址',
      required: false,
      readonly: false,
      disabled: false,
      clearable: true,
      name: 'email',
      rules: () => [],
      enableBuiltInValidation: true,
      trigger: 'onBlur',
    }
  );

  const emit = defineEmits<{
    'update:modelValue': [value: string];
    input: [value: string];
    blur: [event: Event];
    focus: [event: Event];
  }>();

  const emailValue = ref(props.modelValue);

  // 邮箱正则表达式
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // 内置校验规则
  const builtInRules = [
    {
      required: props.required,
      message: '请输入邮箱地址',
      trigger: props.trigger,
    },
    {
      validator: (value: string) => {
        if (!value) return true; // 空值由required规则处理
        return emailRegex.test(value);
      },
      message: '请输入正确的邮箱格式',
      trigger: props.trigger,
    },
  ];

  // 合并校验规则
  const mergedRules = computed(() => {
    const rules = props.enableBuiltInValidation ? [...builtInRules] : [];
    return [...rules, ...props.rules];
  });

  // 计算属性：是否为有效邮箱
  const isValid = computed(() => {
    return emailValue.value ? emailRegex.test(emailValue.value) : false;
  });

  // 获取邮箱域名
  const getDomain = () => {
    if (!emailValue.value || !emailValue.value.includes('@')) {
      return '';
    }
    return emailValue.value.split('@')[1] || '';
  };

  // 计算属性：邮箱域名
  const domain = computed(() => getDomain());

  // 事件处理
  const handleInput = (value: string) => {
    // vant Field的@update:model-value事件传递字符串值
    emailValue.value = value;

    emit('update:modelValue', value);
    emit('input', value);
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
      emailValue.value = newValue || '';
    }
  );

  // 暴露方法给父组件
  defineExpose({
    value: computed(() => emailValue.value),
    isValid,
    domain,
    getDomain,
  });
</script>

<style scoped>
  /* 可以添加自定义样式 */
</style>