<template>
  <div class="example-container">
    <h2>证件字段组件使用示例</h2>

    <!-- 使用van-form的示例 -->
    <van-form ref="formRef">
      <CertificationField
        v-model="formData.certValue"
        v-model:cert-type="formData.certType"
        required
        trigger="onBlur"
        label="证件信息"
        certValueName="certValue"
        certTypeName="certType"
        @certification-parsed="onCertificationParsed"
      />

      <van-field
        v-model="formData.name"
        label="姓名"
        name="name"
        placeholder="请输入姓名"
        :rules="[{ required: true, message: '请输入姓名' }]"
      />

      <div style="margin: 16px">
        <van-button
          round
          block
          type="primary"
          @click="onSubmit"
        >
          提交
        </van-button>
      </div>
    </van-form>

    <!-- 显示表单数据 -->
    <div class="form-data">
      <h3>表单数据：</h3>
      <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
    </div>

    <!-- 显示解析的证件信息 -->
    <div
      v-if="certificationInfo"
      class="cert-info"
    >
      <h3>解析的证件信息：</h3>
      <pre>{{ JSON.stringify(certificationInfo, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import CertificationField from './index.vue';

  // 表单数据 - 注意这里是扁平结构
  const formData = reactive({
    certType1: '', // 证件类型
    certValue: '', // 证件号码
    name: '', // 姓名
  });

  // 表单引用
  const formRef = ref();

  // 解析的证件信息
  const certificationInfo = ref(null);

  // 提交表单
  const onSubmit = (values: any) => {
    console.log('当前表单数据:', formData);
    formRef.value
      .validate()
      .then((e) => {
        console.log(e);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // 证件信息解析回调
  const onCertificationParsed = (info: any) => {
    certificationInfo.value = info;
    console.log('解析的证件信息:', info);
  };
</script>

<style scoped>
  .example-container {
    padding: 20px;
    max-width: 600px;
    margin: 0 auto;
  }

  .form-data,
  .cert-info {
    margin-top: 20px;
    padding: 16px;
    background-color: #f5f5f5;
    border-radius: 8px;
  }

  .form-data h3,
  .cert-info h3 {
    margin-top: 0;
    margin-bottom: 12px;
    color: #333;
  }

  pre {
    margin: 0;
    font-size: 12px;
    line-height: 1.4;
    color: #666;
  }
</style>
