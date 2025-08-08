export interface InsurancePlanItem {
  id: string;
  name: string;
  content: string;
}

export interface InsurancePlanModuleData {
  title: string;
  plans: InsurancePlanItem[];
}

export const insurancePlan = {
  defaultValue: {
    title: '',
    plans: []
  } as InsurancePlanModuleData,
  
  processor(globalData: any, updateData: any) {
    // 从全局数据中获取保障方案的数据
    const moduleData: InsurancePlanModuleData = {
      title: globalData?.insurancePlan?.title || '',
      plans: globalData?.insurancePlan?.plans || []
    };
    
    // 更新模块数据
    updateData(moduleData);
  }
};