// 模板渲染系统的核心类型定义

// 模板基础接口
export interface ITemplate {
  id: string;
  name: string;
  version: string;
  description?: string;
  props?: Record<string, any>;
  events?: Record<string, Function>;
}

// 模板数据接口
export interface ITemplateData {
  [key: string]: any;
}

// 模板配置接口
export interface ITemplateConfig {
  id: string;
  component: any; // Vue组件或懒加载函数
  props?: Record<string, any>;
  defaultData?: Record<string, any>;
}

// 渲染器配置接口
export interface IRendererConfig {
  templateId: string;
  data: Record<string, any>;
  props?: Record<string, any>;
  events?: Record<string, Function>;
}

// 模板注册器接口
export interface ITemplateRegistry {
  register(config: ITemplateConfig): void;
  get(templateId: string): ITemplateConfig | undefined;
  has(templateId: string): boolean;
  getAll(): ITemplateConfig[];
}

// 错误类型
export enum TemplateErrorType {
  NOT_FOUND = 'TEMPLATE_NOT_FOUND',
  LOAD_FAILED = 'TEMPLATE_LOAD_FAILED',
  RENDER_FAILED = 'TEMPLATE_RENDER_FAILED'
}

// 错误接口
export interface ITemplateError {
  type: TemplateErrorType;
  message: string;
  templateId?: string;
  originalError?: Error;
}

// 事件类型
export interface ITemplateEvent {
  type: string;
  data?: any;
  templateId: string;
  timestamp: number;
}