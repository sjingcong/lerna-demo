export { default as BasicConfigForm } from './BasicConfigForm.vue';

// 导出类型定义
export interface BasicConfigData {
  salesProduct: string;
  channelAttribution: string;
  effectiveDate: string;
  description: string;
  selectedTemplate: string;
}

export interface TemplateOption {
  id: string;
  name: string;
  description: string;
}