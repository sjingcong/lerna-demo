<template>
  <a-modal title="导入" :open="visible" :confirm-loading="loading" @ok="handleImport" @cancel="handleCancel"
    width="600px">
    <div class="import-container">
      
      <div class="import-button-group">
        <FileUpload ref="fileUploadRef" v-model="fileList" label="上传附件" accept=".xlsx,.xls" :max-size="10" :max-count="1"
          upload-button-text="上传文件" hint="支持扩展名：.xlsx .xls" :before-upload="beforeUpload" @change="handleFileChange" />
        <a-button type="link" @click="downloadTemplate">
          下载导入模板
        </a-button>
      </div>

      <!-- 导入结果展示 -->
      <div v-if="importResult.total > 0" class="result-section">
        <a-divider>导入结果</a-divider>
        <div class="result-summary">
          <a-result :status="importResult.failed > 0 ? 'warning' : 'success'"
            :title="importResult.failed > 0 ? '导入完成（部分失败）' : '导入成功'">
            <template #extra>
              <a-statistic-group>
                <a-statistic title="总计" :value="importResult.total" suffix="条" />
                <a-statistic title="成功" :value="importResult.success" suffix="条" :value-style="{ color: '#52c41a' }" />
                <a-statistic title="失败" :value="importResult.failed" suffix="条" :value-style="{ color: '#ff4d4f' }" />
              </a-statistic-group>
            </template>
          </a-result>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="modal-footer">
        <a-button @click="handleCancel">
          {{ importResult.total > 0 ? '关闭' : '取消' }}
        </a-button>
        <a-button type="primary" :disabled="fileList.length === 0" :loading="loading"
          @click="handleImport">
          提交
        </a-button>
      </div>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { message } from 'ant-design-vue';
import type { UploadFile } from 'ant-design-vue';
import { importUsers } from '../api';
import FileUpload from '@/components/FileUpload/index.vue';
import type { FileUploadInstance } from '@/components/FileUpload/types';

interface Props {
  visible: boolean;
}

interface Emits {
  (e: 'update:visible', value: boolean): void;
  (e: 'success'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// 响应式数据
const loading = ref(false);
const fileList = ref<UploadFile[]>([]);
const fileUploadRef = ref<FileUploadInstance>();

// 导入结果
const importResult = reactive({
  total: 0,
  success: 0,
  failed: 0
});

// 文件上传前的检查
const beforeUpload = (file: File): boolean => {
  const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    file.type === 'application/vnd.ms-excel';

  if (!isExcel) {
    message.error('只能上传 Excel 文件！');
    return false;
  }

  return true;
};

// 文件变化处理
const handleFileChange = (files: UploadFile[]) => {
  fileList.value = files;
};

// 下载模板
const downloadTemplate = () => {
  // 模拟下载模板文件
  const link = document.createElement('a');
  link.href = '/templates/user-import-template.xlsx';
  link.download = '用户导入模板.xlsx';
  link.click();
  message.success('模板下载成功');
};

// 执行导入
const handleImport = async () => {
  if (fileList.value.length === 0) {
    message.warning('请先选择要导入的文件');
    return;
  }

  try {
    loading.value = true;
    const file = fileList.value[0].originFileObj as File;

    await importUsers(file);
    message.success('所有用户导入成功');

  } catch (error) {
    message.error('导入失败，请重试');
  } finally {
    loading.value = false;
  }
};

// 重置导入
const handleReset = () => {
  fileList.value = [];
  Object.assign(importResult, {
    total: 0,
    success: 0,
    failed: 0
  });
  fileUploadRef.value?.clearFiles();
};

// 取消操作
const handleCancel = () => {
  if (importResult.total > 0) {
    // 导入完成后关闭，触发刷新
    emit('success');
  }

  handleReset();
  emit('update:visible', false);
};
</script>

<style scoped lang="less">
.import-container {
  .import-alert {
    margin-bottom: 16px;
  }
  .import-button-group {
    display: flex;
    align-items: flex-start;
  }
  .template-download {
    margin-bottom: 16px;
    text-align: center;
  }

  .result-section {
    margin-top: 24px;

    .result-summary {
      text-align: center;
      margin-bottom: 24px;
    }

    .error-details {
      .error-alert {
        margin-bottom: 16px;
      }
    }
  }
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

:deep(.ant-statistic-group) {
  display: flex;
  justify-content: center;
  gap: 32px;
}
</style>