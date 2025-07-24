import httpInstance from '@/api/index'
import type { TemplateQueryParams, TemplateItem } from './types'

// 分页响应接口
export interface PageResponse<T> {
  list: T[]
  total: number
  pageNum: number
  pageSize: number
}

/**
 * 查询模板列表
 * @param params 查询参数
 * @returns 模板列表分页数据
 */
export const getTemplateList = (params: Partial<TemplateQueryParams>): Promise<PageResponse<TemplateItem>> => {
  // Mock数据
  const mockData: PageResponse<TemplateItem> = {
    list: [
      {
        id: '1',
        templateName: '营销活动模板',
        templateDesc: '适用于各种营销活动的通用模板',
        templageCover: 'https://via.placeholder.com/300x200/4CAF50/white?text=营销活动',
        templateTag: '营销',
        salesChannel: '线上',
        createTime: '2024-01-15'
      },
      {
        id: '2',
        templateName: '产品介绍模板',
        templateDesc: '专业的产品展示和介绍模板',
        templageCover: 'https://via.placeholder.com/300x200/2196F3/white?text=产品介绍',
        templateTag: '产品',
        salesChannel: '线下',
        createTime: '2024-01-12'
      },
      {
        id: '3',
        templateName: '企业宣传模板',
        templateDesc: '企业形象宣传和品牌推广模板',
        templageCover: 'https://via.placeholder.com/300x200/FF9800/white?text=企业宣传',
        templateTag: '宣传',
        salesChannel: '全渠道',
        createTime: '2024-01-10'
      },
      {
        id: '4',
        templateName: '节日祝福模板',
        templateDesc: '各种节日庆祝和祝福活动模板',
        templageCover: 'https://via.placeholder.com/300x200/E91E63/white?text=节日祝福',
        templateTag: '节日',
        salesChannel: '线上',
        createTime: '2024-01-08'
      },
      {
        id: '5',
        templateName: '教育培训模板',
        templateDesc: '在线教育和培训课程展示模板',
        templageCover: 'https://via.placeholder.com/300x200/9C27B0/white?text=教育培训',
        templateTag: '教育',
        salesChannel: '线上',
        createTime: '2024-01-05'
      },
      {
        id: '6',
        templateName: '招聘信息模板',
        templateDesc: '企业招聘和人才引进信息模板',
        templageCover: 'https://via.placeholder.com/300x200/607D8B/white?text=招聘信息',
        templateTag: '招聘',
        salesChannel: '全渠道',
        createTime: '2024-01-03'
      },
      {
        id: '7',
        templateName: '活动邀请模板',
        templateDesc: '各类活动邀请和报名信息模板',
        templageCover: 'https://via.placeholder.com/300x200/795548/white?text=活动邀请',
        templateTag: '邀请',
        salesChannel: '线下',
        createTime: '2023-12-28'
      },
      {
        id: '8',
        templateName: '新闻资讯模板',
        templateDesc: '企业新闻和行业资讯发布模板',
        templageCover: 'https://via.placeholder.com/300x200/FF5722/white?text=新闻资讯',
        templateTag: '新闻',
        salesChannel: '全渠道',
        createTime: '2023-12-25'
      }
    ],
    total: 8,
  }
  
  return Promise.resolve(mockData)
  // return httpInstance.get('/api/template/list', { params })
}

/**
 * 删除模板
 * @param id 模板ID
 * @returns 删除结果
 */
export const deleteTemplate = (id: string | number): Promise<any> => {
  return httpInstance.post(`/api/template`, {id})
}