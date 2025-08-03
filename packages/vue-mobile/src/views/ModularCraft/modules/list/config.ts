// List 模块数据类型
export interface ListModuleData {
  items: Array<{
    id: number;
    name: string;
  }>;
  total: number;
}
export const list = {
  defaultValue: {
    items: [],
    total: 0,
  },
  processor(globalData: any, updateData: any) {
    const moduleData: ListModuleData = {
      items: globalData.items || [],
      total: globalData.items?.length || 0,
    };
    updateData(moduleData);
  },
};
