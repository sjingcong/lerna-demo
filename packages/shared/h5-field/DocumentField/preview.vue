<template>
  <div class="document-field-preview">
    <div class="preview-section">
      <h3>基础用法</h3>
      <DocumentField
        v-model="basicValue"
        label="证件信息"
        @document-parsed="handleDocumentParsed"
        @type-change="handleTypeChange"
      />
      <div class="result-display">
        <p><strong>当前值:</strong> {{ JSON.stringify(basicValue, null, 2) }}</p>
        <p v-if="parsedInfo"><strong>解析信息:</strong> {{ JSON.stringify(parsedInfo, null, 2) }}</p>
      </div>
    </div>

    <div class="preview-section">
      <h3>必填状态</h3>
      <DocumentField
        v-model="requiredValue"
        label="证件信息"
        required
        :rules="requiredRules"
      />
    </div>

    <div class="preview-section">
      <h3>只读状态</h3>
      <DocumentField
        v-model="readonlyValue"
        label="证件信息"
        readonly
      />
    </div>

    <div class="preview-section">
      <h3>禁用状态</h3>
      <DocumentField
        v-model="disabledValue"
        label="证件信息"
        disabled
      />
    </div>

    <div class="preview-section">
      <h3>限制证件类型</h3>
      <DocumentField
        v-model="limitedValue"
        label="证件信息"
        :supported-types="['idcard', 'passport']"
      />
    </div>

    <div class="preview-section">
      <h3>自定义验证规则</h3>
      <DocumentField
        v-model="customValue"
        label="证件信息"
        :rules="customRules"
      />
    </div>

    <div class="preview-section">
      <h3>实时验证</h3>
      <DocumentField
        v-model="realtimeValue"
        label="证件信息"
        trigger="onChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import DocumentField from './index.vue';
  import type { DocumentValue, DocumentInfo, DocumentType } from './types';

  // 响应式数据
  const basicValue = ref<DocumentValue>({
    type: 'idcard' as DocumentType,
    value: ''
  });

  const requiredValue = ref<DocumentValue>({
    type: 'idcard' as DocumentType,
    value: ''
  });

  const readonlyValue = ref<DocumentValue>({
    type: 'idcard' as DocumentType,
    value: '110101199001011234'
  });

  const disabledValue = ref<DocumentValue>({
    type: 'passport' as DocumentType,
    value: 'G12345678'
  });

  const limitedValue = ref<DocumentValue>({
    type: 'idcard' as DocumentType,
    value: ''
  });

  const customValue = ref<DocumentValue>({
    type: 'idcard' as DocumentType,
    value: ''
  });

  const realtimeValue = ref<DocumentValue>({
    type: 'idcard' as DocumentType,
    value: ''
  });

  const parsedInfo = ref<DocumentInfo | null>(null);

  // 验证规则
  const requiredRules = [
    {
      required: true,
      message: '请输入证件信息',
      trigger: 'onBlur'
    }
  ];

  const customRules = [
    {
      validator: (value: string) => {
        if (value && value.length < 6) {
          return '证件号码长度不能少于6位';
        }
        return true;
      },
      message: '证件号码长度不能少于6位',
      trigger: 'onBlur'
    }
  ];

  // 事件处理
  const handleDocumentParsed = (info: DocumentInfo) => {
    parsedInfo.value = info;
    console.log('证件解析结果:', info);
  };

  const handleTypeChange = (type: DocumentType) => {
    console.log('证件类型变化:', type);
  };
</script>

<style scoped>
  .document-field-preview {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
  }

  .preview-section {
    margin-bottom: 40px;
    padding: 20px;
    border: 1px solid #ebedf0;
    border-radius: 8px;
    background: #fff;
  }

  .preview-section h3 {
    margin: 0 0 20px 0;
    font-size: 16px;
    font-weight: 600;
    color: #323233;
  }

  .result-display {
    margin-top: 16px;
    padding: 12px;
    background: #f7f8fa;
    border-radius: 6px;
    font-size: 12px;
    color: #646566;
  }

  .result-display p {
    margin: 8px 0;
    word-break: break-all;
  }

  .result-display strong {
    color: #323233;
  }
</style>