<template>
  <div class="certification-field-preview">
    <van-form ref="formRef">
      <CertificationField
        v-model="props.modelValue"
        v-model:cert-type="props.certType"
        v-bind="$attrs"
        @cert-parsed="handleCertificationParsed"
        @type-change="handleTypeChange"
        @blur="handleBlur"
        @focus="handleFocus"
      />
    </van-form>

    <div class="preview-info">
      <div class="info-item">
        <span class="label">当前值:</span>
        <span class="value">
          {{ JSON.stringify(props.modelValue, null, 2) }}
        </span>
      </div>
      <div
        v-if="parsedInfo"
        class="info-item"
      >
        <span class="label">解析信息:</span>
        <span class="value">{{ JSON.stringify(parsedInfo, null, 2) }}</span>
      </div>
      <div class="info-item">
        <span class="label">证件类型:</span>
        <span class="value">{{ props.certType || '未选择' }}</span>
      </div>
      <div class="info-item">
        <span class="label">证件号码:</span>
        <span class="value">{{ props.modelValue || '未输入' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { Form as VanForm } from 'vant';
  import CertificationField from './index.vue';

  // 定义props和emits
  const props = defineProps({
    modelValue: {
      type: String,
      default: '',
    },
    certType: {
      type: String,
      default: '',
    },
  });

  const formRef = ref();
  const certFieldRef = ref();
  const parsedInfo = ref<any | null>(null);

  const handleBlur = (event: Event) => {
    console.log('失焦:', event);
  };

  const handleFocus = (event: Event) => {
    console.log('聚焦:', event);
  };

  const handleCertificationParsed = (info: any) => {
    parsedInfo.value = info;
    console.log('证件解析结果:', info);
  };

  const handleTypeChange = (type: any) => {
    console.log('证件类型变化:', type);
  };

  onMounted(() => {
    // 获取CertificationField组件实例
    certFieldRef.value =
      formRef.value?.$el?.querySelector(
        '.van-field'
      )?.__vueParentComponent?.exposed;
  });
</script>

<style scoped>
  .certification-field-preview {
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
    word-break: break-all;
    max-width: 60%;
    text-align: right;
  }

  .value.valid {
    color: #52c41a;
  }

  .value.invalid {
    color: #ff4d4f;
  }
</style>
