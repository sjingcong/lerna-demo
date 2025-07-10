<template>
  <div class="file-upload">
    <a-upload
      :file-list="fileList"
      :before-upload="beforeUpload"
      :custom-request="customUpload"
      :show-upload-list="true"
      accept=".doc,.docx,.pdf"
      @remove="handleRemove"
    >
      <a-button>
        <template #icon><UploadOutlined /></template>
        上传附件
      </a-button>
    </a-upload>
    <div class="upload-tips">
      支持扩展名：.doc .docx .pdf，可重复点击上传，更盖数据
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import type { UploadFile, UploadProps } from 'ant-design-vue';

interface Props {
  modelValue?: string; // 文件key
}

interface Emits {
  'update:modelValue': [value: string];
  change: [fileKey: string, fileName: string];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const fileList = ref<UploadFile[]>([]);
const uploading = ref(false);

// 监听外部传入的值变化
watch(() => props.modelValue, (newVal) => {
  if (!newVal) {
    fileList.value = [];
  }
});

// 上传前校验
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const isValidType = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf'].includes(file.type!) ||
    file.name.toLowerCase().endsWith('.doc') ||
    file.name.toLowerCase().endsWith('.docx') ||
    file.name.toLowerCase().endsWith('.pdf');
  
  if (!isValidType) {
    message.error('只能上传 .doc .docx .pdf 格式的文件！');
    return false;
  }
  
  const isLt10M = file.size! / 1024 / 1024 < 10;
  if (!isLt10M) {
    message.error('文件大小不能超过 10MB！');
    return false;
  }
  
  return true;
};

// 自定义上传
const customUpload: UploadProps['customRequest'] = async (options) => {
  const { file, onSuccess, onError } = options;
  
  try {
    uploading.value = true;
    
    // 模拟文件上传接口调用
    const formData = new FormData();
    formData.append('file', file as File);
    
    // 这里应该调用实际的上传接口
    const response = await uploadFile(formData);
    
    if (response.success) {
      const fileKey = response.data.fileKey;
      const fileName = (file as File).name;
      
      // 更新文件列表
      fileList.value = [{
        uid: fileKey,
        name: fileName,
        status: 'done',
        response: response.data,
      }];
      
      // 触发事件
      emit('update:modelValue', fileKey);
      emit('change', fileKey, fileName);
      
      onSuccess?.(response.data);
      message.success('文件上传成功！');
    } else {
      throw new Error(response.message || '上传失败');
    }
  } catch (error) {
    console.error('文件上传失败:', error);
    onError?.(error as Error);
    message.error('文件上传失败，请重试！');
  } finally {
    uploading.value = false;
  }
};

// 模拟文件上传接口
const uploadFile = async (formData: FormData): Promise<any> => {
  // 模拟接口延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 模拟返回文件key
  return {
    success: true,
    data: {
      fileKey: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fileName: 'uploaded_file',
      fileUrl: 'https://example.com/files/uploaded_file'
    }
  };
};

// 移除文件
const handleRemove = () => {
  fileList.value = [];
  emit('update:modelValue', '');
  emit('change', '', '');
};
</script>

<style scoped>
.file-upload {
  width: 100%;
}

.upload-tips {
  margin-top: 8px;
  color: #8c8c8c;
  font-size: 12px;
}
</style>