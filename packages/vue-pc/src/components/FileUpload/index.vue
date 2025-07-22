<template>
  <div class="file-upload-container">
    <!-- 上传按钮 -->
    <div class="upload-section">
      <div class="upload-controls">
        <a-upload
          :file-list="fileList"
          :before-upload="handleBeforeUpload"
          :remove="handleRemove"
          :accept="accept"
          :multiple="multiple"
          :show-upload-list="false"
          :disabled="disabled"
        >
          <a-button 
            type="primary" 
            :loading="uploading"
            :disabled="disabled"
            class="upload-button"
          >
            <template #icon>
              <upload-outlined />
            </template>
            {{ uploadButtonText }}
          </a-button>
        </a-upload>
      </div>
      
      <!-- 支持格式提示 -->
      <div class="upload-hint">
        {{ hint }}
      </div>
    </div>

    <!-- 已上传文件列表 -->
    <div v-if="fileList.length > 0" class="file-list">
      <div 
        v-for="(file, index) in fileList" 
        :key="file.uid || index"
        class="file-item"
      >
        <div class="file-icon">
          <file-excel-outlined v-if="isExcelFile(file)" />
          <file-text-outlined v-else-if="isTextFile(file)" />
          <file-pdf-outlined v-else-if="isPdfFile(file)" />
          <file-image-outlined v-else-if="isImageFile(file)" />
          <file-outlined v-else />
        </div>
        
        <div class="file-info">
          <div class="file-name" :title="file.name">{{ file.name }}</div>
          <div class="file-size">{{ formatFileSize(file.size || 0) }}</div>
        </div>
        
        <div class="file-actions">
          <a-button 
            type="text" 
            size="small" 
            danger 
            @click="handleRemoveFile(index)"
            :disabled="disabled"
          >
            <template #icon>
              <delete-outlined />
            </template>
          </a-button>
        </div>
      </div>
    </div>

    <!-- 上传进度 -->
    <div v-if="uploading" class="upload-progress">
      <a-progress :percent="uploadProgress" size="small" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { message } from 'ant-design-vue';
import { 
  UploadOutlined, 
  DeleteOutlined,
  FileExcelOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  FileImageOutlined,
  FileOutlined
} from '@ant-design/icons-vue';
import type { UploadFile } from 'ant-design-vue';

interface Props {
  // 基础配置
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // MB
  maxCount?: number;
  disabled?: boolean;
  
  // 按钮文本
  uploadButtonText?: string;
  
  // 提示信息
  hint?: string;
  
  // 文件列表
  modelValue?: UploadFile[];
  
  // 自定义验证
  beforeUpload?: (file: File) => boolean | Promise<boolean>;
  
  // 上传处理
  customUpload?: (file: File) => Promise<any>;
}

interface Emits {
  (e: 'update:modelValue', files: UploadFile[]): void;
  (e: 'change', files: UploadFile[]): void;
  (e: 'upload-success', response: any, file: UploadFile): void;
  (e: 'upload-error', error: any, file: UploadFile): void;
}

const props = withDefaults(defineProps<Props>(), {
  label: '上传附件',
  accept: '*',
  multiple: false,
  maxSize: 10,
  maxCount: 1,
  disabled: false,
  uploadButtonText: '上传文件',
  hint: '',
  modelValue: () => []
});

const emit = defineEmits<Emits>();

// 响应式数据
const fileList = ref<UploadFile[]>([]);
const uploading = ref(false);
const uploadProgress = ref(0);

// 避免循环更新的标志位
const isInternalUpdate = ref(false);

// 监听外部传入的文件列表
watch(
  () => props.modelValue,
  (newFiles) => {
    if (!isInternalUpdate.value) {
      fileList.value = [...newFiles];
    }
  },
  { immediate: true, deep: true }
);

// 监听内部文件列表变化
watch(
  fileList,
  (newFiles) => {
    isInternalUpdate.value = true;
    emit('update:modelValue', [...newFiles]);
    emit('change', [...newFiles]);
    nextTick(() => {
      isInternalUpdate.value = false;
    });
  },
  { deep: true }
);

// 计算属性
const canUploadMore = computed(() => {
  return fileList.value.length < props.maxCount;
});

// 文件类型判断
const isExcelFile = (file: UploadFile) => {
  const name = file.name || '';
  return /\.(xlsx|xls)$/i.test(name);
};

const isTextFile = (file: UploadFile) => {
  const name = file.name || '';
  return /\.(txt|doc|docx)$/i.test(name);
};

const isPdfFile = (file: UploadFile) => {
  const name = file.name || '';
  return /\.pdf$/i.test(name);
};

const isImageFile = (file: UploadFile) => {
  const name = file.name || '';
  return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(name);
};

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 文件上传前检查
const handleBeforeUpload = async (file: UploadFile): Promise<boolean> => {
  // 检查文件数量
  if (!canUploadMore.value) {
    message.error(`最多只能上传 ${props.maxCount} 个文件`);
    return false;
  }

  // 检查文件大小
  const isLtMaxSize = (file.size || 0) / 1024 / 1024 < props.maxSize;
  if (!isLtMaxSize) {
    message.error(`文件大小不能超过 ${props.maxSize}MB`);
    return false;
  }

  // 自定义验证
  if (props.beforeUpload) {
    // UploadFile 的 originFileObj 属性包含原始的 File 对象
    const originalFile = file.originFileObj || (file as unknown as File);
    const result = await props.beforeUpload(originalFile);
    if (!result) {
      return false;
    }
  }

  // 所有验证都通过，手动添加到文件列表
  const newFile: UploadFile = {
    ...file,
    status: 'done'
  };

  // 如果有自定义上传处理
  if (props.customUpload) {
    try {
      uploading.value = true;
      uploadProgress.value = 0;
      
      // 模拟上传进度
      const progressInterval = setInterval(() => {
        if (uploadProgress.value < 90) {
          uploadProgress.value += 10;
        }
      }, 100);

      // UploadFile 的 originFileObj 属性包含原始的 File 对象
      const originalFile = file.originFileObj || (file as unknown as File);
      const response = await props.customUpload(originalFile);
      
      clearInterval(progressInterval);
      uploadProgress.value = 100;
      
      // 更新文件状态
      newFile.status = 'done';
      newFile.response = response;
      
      fileList.value.push(newFile);
      emit('upload-success', response, newFile);
      message.success('文件上传成功');
      
    } catch (error) {
      newFile.status = 'error';
      fileList.value.push(newFile);
      emit('upload-error', error, newFile);
      message.error('文件上传失败');
    } finally {
      uploading.value = false;
      uploadProgress.value = 0;
    }
  } else {
    // 没有自定义上传，直接添加到列表
    fileList.value.push(newFile);
  }

  // 始终返回 false 阻止默认上传行为
  return false;
};

// 移除文件
const handleRemove = (file: UploadFile) => {
  const index = fileList.value.findIndex(item => item.uid === file.uid);
  if (index > -1) {
    fileList.value.splice(index, 1);
  }
};

// 移除指定索引的文件
const handleRemoveFile = (index: number) => {
  fileList.value.splice(index, 1);
};

// 暴露方法
defineExpose({
  clearFiles: () => {
    fileList.value = [];
  },
  getFiles: () => fileList.value,
  addFile: (file: UploadFile) => {
    fileList.value.push(file);
  }
});
</script>

<style scoped lang="less">
.file-upload-container {
  .upload-section {
    .upload-label {
      font-size: 14px;
      color: #333;
      margin-bottom: 8px;
      font-weight: 500;
    }

    .upload-controls {
      display: flex;
      align-items: center;
      margin-bottom: 8px;

      .upload-button {
        min-width: 100px;
      }
    }

    .upload-hint {
      font-size: 12px;
      color: #666;
      line-height: 1.4;
    }
  }

  .file-list {
    margin-top: 16px;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    overflow: hidden;

    .file-item {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid #f0f0f0;
      transition: background-color 0.2s;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background-color: #fafafa;
      }

      .file-icon {
        margin-right: 12px;
        font-size: 16px;
        color: #1890ff;
      }

      .file-info {
        flex: 1;
        min-width: 0;

        .file-name {
          font-size: 14px;
          color: #333;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 2px;
        }

        .file-size {
          font-size: 12px;
          color: #999;
        }
      }

      .file-actions {
        margin-left: 12px;
      }
    }
  }

  .upload-progress {
    margin-top: 12px;
  }
}
</style>