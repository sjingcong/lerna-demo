import httpInstance from '@/api/index'
import dayjs from 'dayjs'

/**
 * 获取渠道归属列表
 * @returns 渠道归属选项数据
 */
export const getChannelList = (): Promise<{ label: string; value: string }[]> => {
  // Mock数据
  const mockData = [
    { label: '直销渠道', value: 'direct_sales' },
    { label: '代理渠道', value: 'agent_channel' },
    { label: '银保渠道', value: 'bancassurance' },
    { label: '网销渠道', value: 'online_sales' },
    { label: '电销渠道', value: 'telemarketing' },
    { label: '经纪渠道', value: 'broker_channel' },
    { label: '团险渠道', value: 'group_insurance' }
  ]
  
  return Promise.resolve(mockData)
  // return httpInstance.get('/api/channel/list')
}

/**
 * 获取销售商品列表
 * @param channelAttribution 渠道归属
 * @returns 销售商品选项数据
 */
export const getSalesProductList = (channelAttribution: string): Promise<{ label: string; value: string }[]> => {
  // Mock数据 - 根据不同渠道返回不同的商品
  const productsByChannel: Record<string, { label: string; value: string }[]> = {
    direct_sales: [
      { label: '重疾险产品', value: 'critical_illness' },
      { label: '医疗险产品', value: 'medical_insurance' },
      { label: '寿险产品', value: 'life_insurance' },
      { label: '年金险产品', value: 'annuity_insurance' }
    ],
    agent_channel: [
      { label: '重疾险产品', value: 'critical_illness' },
      { label: '意外险产品', value: 'accident_insurance' },
      { label: '寿险产品', value: 'life_insurance' },
      { label: '财产险产品', value: 'property_insurance' }
    ],
    bancassurance: [
      { label: '年金险产品', value: 'annuity_insurance' },
      { label: '寿险产品', value: 'life_insurance' },
      { label: '医疗险产品', value: 'medical_insurance' }
    ],
    online_sales: [
      { label: '意外险产品', value: 'accident_insurance' },
      { label: '旅行险产品', value: 'travel_insurance' },
      { label: '宠物险产品', value: 'pet_insurance' },
      { label: '医疗险产品', value: 'medical_insurance' }
    ],
    telemarketing: [
      { label: '重疾险产品', value: 'critical_illness' },
      { label: '医疗险产品', value: 'medical_insurance' },
      { label: '意外险产品', value: 'accident_insurance' }
    ],
    broker_channel: [
      { label: '重疾险产品', value: 'critical_illness' },
      { label: '寿险产品', value: 'life_insurance' },
      { label: '年金险产品', value: 'annuity_insurance' },
      { label: '财产险产品', value: 'property_insurance' }
    ],
    group_insurance: [
      { label: '团体意外险', value: 'group_accident' },
      { label: '团体医疗险', value: 'group_medical' },
      { label: '雇主责任险', value: 'employer_liability' }
    ]
  }
  
  const mockData = productsByChannel[channelAttribution] || []
  
  // 模拟网络延迟
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData)
    }, 500)
  })
  // return httpInstance.get('/api/sales-product/list', { params: { channelAttribution } })
}

/**
 * 获取模板列表
 * @returns 模板选项数据
 */
export const getTemplateList = (): Promise<{ id: string; name: string; description: string }[]> => {
  // Mock数据
  const mockData = [
    {
      id: 'BH001',
      name: '标准保险产品模板',
      description: '适用于常规保险产品展示，包含基础信息、保障内容、投保流程等标准模块，支持多种产品类型的灵活配置'
    },
    {
      id: 'BH002',
      name: '高端医疗保险模板',
      description: '专为高端医疗保险设计，突出医疗网络、增值服务、理赔便利等特色功能，提供专业的医疗保障展示'
    },
    {
      id: 'BH003',
      name: '企业团险专用模板',
      description: '针对企业团体保险业务，支持批量投保、员工管理、保单统计等企业级功能，适合B端客户使用'
    },
    {
      id: 'BH004',
      name: '互联网保险模板',
      description: '专为线上销售优化，界面简洁现代，支持快速投保、在线支付、电子保单等互联网保险特色功能'
    },
    {
      id: 'BH005',
      name: '财产保险专用模板',
      description: '适用于车险、家财险等财产保险产品，包含风险评估、保费计算、理赔指引等专业功能模块'
    },
    {
      id: 'BH006',
      name: '年金保险模板',
      description: '专为年金、养老保险设计，突出收益演示、缴费规划、退休保障等核心功能，适合长期储蓄类产品'
    }
  ]
  
  // 模拟网络延迟
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData)
    }, 300)
  })
  // return httpInstance.get('/api/template/list')
}

/**
 * 获取页面配置详情
 * @param id 配置ID
 * @returns 页面配置详情数据
 */
export const getPageConfigDetail = (id: string): Promise<{
  salesProduct: string;
  channelAttribution: string;
  effectiveDate: any;
  description: string;
  selectedTemplate: string;
}> => {
  // Mock数据 - 根据不同ID返回不同的配置
  const mockConfigs: Record<string, any> = {
    '1': {
      salesProduct: 'critical_illness',
      channelAttribution: 'direct_sales',
      effectiveDate: dayjs('2025-12-15 14:30:00'),
      description: '重疾险产品直销渠道页面配置，主要用于线下门店销售展示，包含产品详情、保障范围、理赔流程等核心信息。',
      selectedTemplate: 'BH001'
    },
    '2': {
      salesProduct: 'medical_insurance',
      channelAttribution: 'online_sales',
      effectiveDate: dayjs('2025-12-20 09:00:00'),
      description: '医疗险产品网销渠道配置，适用于官网和APP端展示，重点突出保障内容和投保便利性。',
      selectedTemplate: 'BH002'
    },
    '3': {
      salesProduct: 'group_accident',
      channelAttribution: 'group_insurance',
      effectiveDate: dayjs('2025-12-25 16:00:00'),
      description: '团体意外险产品配置，专为企业客户设计，包含团体投保流程、保障方案定制等功能模块。',
      selectedTemplate: 'BH003'
    }
  }
  
  const mockData = mockConfigs[id] || {
    salesProduct: 'PROD001',
    channelAttribution: 'CHANNEL001',
    effectiveDate: '2024-01-15 10:30:00',
    description: '这是一个专为高端客户设计的保险产品页面配置，包含完整的产品介绍、保障范围、理赔流程等核心功能模块。页面采用响应式设计，支持多终端访问，提供优质的用户体验。',
    selectedTemplate: 'BH001'
  }
  
  // 模拟网络延迟
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData)
    }, 800)
  })
  // return httpInstance.get(`/api/page-config/${id}`)
}
