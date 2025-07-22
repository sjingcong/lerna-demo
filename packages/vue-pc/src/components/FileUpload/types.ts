import type { UploadFile } from 'ant-design-vue';

export interface FileUploadProps {
  // 基础配置
  label?: string;
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

export interface FileUploadEmits {
  (e: 'update:modelValue', files: UploadFile[]): void;
  (e: 'change', files: UploadFile[]): void;
  (e: 'upload-success', response: any, file: UploadFile): void;
  (e: 'upload-error', error: any, file: UploadFile): void;
}

export interface FileUploadInstance {
  clearFiles: () => void;
  getFiles: () => UploadFile[];
  addFile: (file: UploadFile) => void;
}