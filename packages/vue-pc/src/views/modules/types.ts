// 编辑组件类型枚举
export type EditComponentType = 
  | 'Input'
  | 'ImageList';

// 模板属性接口
export interface ITemplateAttr {
  attrKey: string;
  attrName: string;
  editComponentType: EditComponentType | null;
}

// 模板配置接口
export interface ITemplateConfig {
  templateKey: string;
  templateName: string;
  templateDesc?: string;
  templateComponent: string;
  templateAttrs: ITemplateAttr[];
  // 模板默认值对象，key对应templateAttrs中的attrKey
  defaultValue?: Record<string, any>;
}