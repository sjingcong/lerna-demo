<template>
  <div class="id-card-field-preview">
    <van-form ref="formRef">
      <IdCardField
        ref="idCardFieldRef"
        v-model="props.modelValue"
        v-bind="$attrs"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        @id-parsed="handleIdParsed"
      />
    </van-form>

    <!-- 身份证信息展示 -->
    <div
      class="preview-info"
      v-if="props.modelValue"
    >
      <div class="info-item">
        <span class="label">格式校验:</span>
        <span
          class="value"
          :class="{
            valid: parsedIdCardInfo.isValid,
            invalid: !parsedIdCardInfo.isValid,
          }"
        >
          {{ parsedIdCardInfo.isValid ? '✅ 有效' : '❌ 无效' }}
        </span>
      </div>
      <div
        class="info-item"
        v-if="parsedIdCardInfo.region"
      >
        <span class="label">地区码:</span>
        <span class="value">{{ parsedIdCardInfo.region }}</span>
      </div>
      <div
        class="info-item"
        v-if="parsedIdCardInfo.birthDate"
      >
        <span class="label">出生日期:</span>
        <span class="value">{{ parsedIdCardInfo.birthDate }}</span>
      </div>
      <div
        class="info-item"
        v-if="parsedIdCardInfo.age"
      >
        <span class="label">年龄:</span>
        <span class="value">{{ parsedIdCardInfo.age }}岁</span>
      </div>
      <div
        class="info-item"
        v-if="parsedIdCardInfo.gender"
      >
        <span class="label">性别:</span>
        <span class="value">{{ parsedIdCardInfo.gender }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { Form as VanForm } from 'vant';
  import IdCardField from './index.vue';
  import type { IdCardFieldExpose, IdCardInfo } from './types';

  // 定义props和emits
  const props = defineProps({
    modelValue: {
      type: String,
      default: undefined,
    },
  });
  const formRef = ref();
  const idCardFieldRef = ref<IdCardFieldExpose>();

  // 存储id-parsed事件返回的身份证信息
  const parsedIdCardInfo = ref<IdCardInfo>({
    isValid: false,
    region: '',
    birthDate: '',
    age: 0,
    gender: '',
  });

  const handleInput = (value: string) => {
    console.log('输入:', value);
    // 如果输入为空，重置信息
    if (!value) {
      parsedIdCardInfo.value = {
        isValid: false,
        region: '',
        birthDate: '',
        age: 0,
        gender: '',
      };
    }
  };

  const handleBlur = (event: Event) => {
    console.log('失焦:', event);
  };

  const handleFocus = (event: Event) => {
    console.log('聚焦:', event);
  };

  const handleIdParsed = (info: IdCardInfo) => {
    console.log('身份证解析完成事件:', info);
    console.log('性别：', info.gender);
    console.log('生日：', info.birthDate);
    console.log('年龄：', info.age);
    console.log('地区码：', info.region);

    // 更新展示的身份证信息
    parsedIdCardInfo.value = info;
  };
</script>

<style scoped>
  .id-card-field-preview {
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
  }

  .preview-info {
    margin-top: 16px;
    padding: 12px;
    background: white;
    border-radius: 6px;
    border: 1px solid #e1e5e9;
  }

  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 0;
  }

  .info-item:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 8px;
    padding-bottom: 8px;
  }

  .label {
    font-size: 14px;
    color: #666;
    font-weight: 500;
  }

  .value {
    font-size: 14px;
    color: #333;
  }

  .value.valid {
    color: #52c41a;
  }

  .value.invalid {
    color: #ff4d4f;
  }
</style>
