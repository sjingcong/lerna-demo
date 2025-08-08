// 简单的数据转换工具
export const moduleDataTransformer = {
  // 验证输入数据
  validateInputData(data: any): boolean {
    return data && typeof data === 'object';
  },

  // 转换数据
  transform(data: any): any {
    return data || {};
  },

  // 获取转换统计
  getTransformStats(inputData: any, outputData: any): any {
    return {
      inputModules: Object.keys(inputData || {}).length,
      outputModules: Object.keys(outputData || {}).length,
      transformedAt: new Date().toISOString()
    };
  }
};