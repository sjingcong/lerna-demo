// 编辑组件类型枚举
export type EditComponentType =
  | 'Input'
  | 'ImageList'
  | 'SectionGroupHorizontal'
  | 'SectionListVertical'
  | 'BackImage';

// 模块属性接口
export interface IModuleValueAttrs {
  attrKey: string;
  attrName: string;
  editComponentType: EditComponentType | '' | null;
}

// 模块配置接口
export interface IModule {
  moduleCode: string; // 模块code 模块的标识，前端维护一个code到组件的映射
  moduleCategory?: string; // 模块归属
  moduleType: string; // 模块类型 封面、目录、价目表、尾页等
  moduleName: string; // 模块名称
  editable: boolean; //是否可编辑
  deletable: boolean; // 是否可删除
  templateAttrs: IModuleValueAttrs[];
  // 模块默认值对象，key对应templateAttrs中的attrKey
  moduleValue?: Record<string, any>;
}
