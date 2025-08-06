import httpInstance from '@/api';

// 获取状态选项
export function getStatusOptions(params?: any): Promise<any> {
  // 模拟API调用，返回mock数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { label: '初始化', value: 'initial' },
        { label: '审核中', value: 'processing' },
        { label: '生效中', value: 'completed' },
        { label: '已下架', value: 'failed' },
        { label: '已上架', value: 'published' },
      ]);
    }, 500);
  });
}

// 获取版本编号选项
export function getVersionOptions(params?: any): Promise<any> {
  // 模拟API调用，返回mock数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { label: 'BH001', value: 'BH001' },
        { label: 'BH002', value: 'BH002' },
        { label: 'BH003', value: 'BH003' },
        { label: 'BH004', value: 'BH004' },
        { label: 'BH005', value: 'BH005' },
      ]);
    }, 500);
  });
}

// 获取商品名称建议
export function getProductNameSuggestions(query: string): Promise<any> {
  console.log('获取商品名称建议');
  // 模拟API调用，返回mock数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          label: '商务商品名称1',
          value: '商务商品名称1',
          category: '商务保险',
        },
        {
          label: '商务商品名称2',
          value: '商务商品名称2',
          category: '商务保险',
        },
        {
          label: '商务商品名称3',
          value: '商务商品名称3',
          category: '商务保险',
        },
        {
          label: '商务商品名称4',
          value: '商务商品名称4',
          category: '商务保险',
        },
        {
          label: '商务商品名称5',
          value: '商务商品名称5',
          category: '商务保险',
        },
        {
          label: '企业保险产品A',
          value: '企业保险产品A',
          category: '企业保险',
        },
        {
          label: '企业保险产品B',
          value: '企业保险产品B',
          category: '企业保险',
        },
        { label: '个人健康险', value: '个人健康险', category: '健康保险' },
        { label: '团体意外险', value: '团体意外险', category: '意外保险' },
        { label: '财产保险产品', value: '财产保险产品', category: '财产保险' },
      ]);
    }, 1000);
  });
}

// 获取列表数据
export function getListData(params?: any): Promise<any> {
  // 模拟API调用，返回mock数据
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        list: [
          {
            id: '1',
            productName: '商务商品名称1',
            officialFactoryName: '团体生存保障法1',
            officialFactoryCode: 'TradeCode21',
            testDate: '有案',
            templateCode: 'BH001',
            createTime: '2025-10-10 10:00:00',
            status: 'initial',
            statusText: '初始化',
          },
          {
            id: '2',
            productName: '商务商品名称2',
            officialFactoryName: '团体生存保障法2',
            officialFactoryCode: 'TradeCode21',
            testDate: '健康险直销',
            templateCode: 'BH002',
            createTime: '2025-10-10 10:00:00',
            status: 'processing',
            statusText: '审核中',
          },
          {
            id: '3',
            productName: '商务商品名称3',
            officialFactoryName: '团体生存保障法3',
            officialFactoryCode: 'TradeCode21',
            testDate: '有案',
            templateCode: 'BH001',
            createTime: '2025-02-10 10:00:00',
            status: 'completed',
            statusText: '生效中',
          },
          {
            id: '4',
            productName: '商务商品名称4',
            officialFactoryName: '团体生存保障法4',
            officialFactoryCode: 'TradeCode21',
            testDate: '有案',
            templateCode: 'BH001',
            createTime: '2025-02-10 10:00:00',
            status: 'failed',
            statusText: '已下架',
          },
          {
            id: '5',
            productName: '商务商品名称5',
            officialFactoryName: '团体生存保障法5',
            officialFactoryCode: 'TradeCode21',
            testDate: '有案',
            templateCode: 'BH001',
            createTime: '2025-02-10 10:00:00',
            status: 'published',
            statusText: '已上架',
          },
        ],
        total: 5,
      });
    }, 1000);
  });
}
