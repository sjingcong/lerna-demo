export interface TabItem {
  id: string;
  title: string;
  content: string;
}

export interface TabDetailModuleData {
  tabs: TabItem[];
  activeTab: string;
}

export const tabDetail = {
  defaultValue: {
    tabs: [
      {
        id: '1',
        title: '选中页签',
        content: ''
      }
    ],
    activeTab: '1'
  } as TabDetailModuleData,
  
  processor(globalData: any, updateData: any) {
    // 从全局数据中获取Tab详情的数据
    const moduleData: TabDetailModuleData = {
      tabs: globalData?.tabDetail?.tabs || [
        {
          id: '1',
          title: '选中页签',
          content: ''
        }
      ],
      activeTab: globalData?.tabDetail?.activeTab || '1'
    };
    
    // 更新模块数据
    updateData(moduleData);
  }
};