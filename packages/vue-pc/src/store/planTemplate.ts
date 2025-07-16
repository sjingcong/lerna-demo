import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'
import type { ITemplateConfig } from '@/views/modules/types'

// 模板数据类型定义
interface CoverData {
  companyName: string
  year: string
  serviceManager: string
  phone: string
  email: string
}

interface CatalogItem {
  title: string
  page: number
}

interface CatalogData {
  catalogList: CatalogItem[]
}

interface ContentSection {
  id: number
  title: string
  content: string
}

interface ContentData {
  title: string
  content: string
  sections: ContentSection[]
}

interface ChartDataItem {
  name: string
  value: number
}

interface ChartData {
  chartType: string
  title: string
  data: ChartDataItem[]
  options: Record<string, any>
}

// 模板数据联合类型
type TemplateData = CoverData | CatalogData | ContentData | ChartData

// 模板初始化函数类型
type TemplateInitFunc = () => TemplateData

interface PlanTemplateState {
  // 当前选中的模板
  currentTemplate: ITemplateConfig | null
  // 模板列表
  templates: ITemplateConfig[]
  // 当前模板的数据
  templateData: Record<string, TemplateData>
  // 计划书标题
  planTitle: string
  // 计划书描述
  planDescription: string
  // 是否正在编辑
  isEditing: boolean
  // 保存状态
  isSaving: boolean
}

// 默认模板列表
const defaultTemplateList: ITemplateConfig[] = [
  {
    templateKey: 'cover',
    templateName: '封面',
    templateDesc: '封面模板，用于展示企业保障计划书信息',
    templateComponent: 'Cover',
    templateAttrs: [
      {
        attrKey: 'companyName',
        attrName: '企业名称',
        editComponentType: 'Input'
      },
      {
        attrKey: 'year',
        attrName: '年份',
        editComponentType: 'Input'
      },
      {
        attrKey: 'serviceManager',
        attrName: '服务经理',
        editComponentType: 'Input'
      },
      {
        attrKey: 'phone',
        attrName: '联系电话',
        editComponentType: 'Input'
      },
      {
        attrKey: 'email',
        attrName: '电子邮箱',
        editComponentType: 'Input'
      }
    ],
    defaultValue: {
      companyName: '请输入企业名称',
      year: new Date().getFullYear().toString(),
      serviceManager: '请输入服务经理姓名',
      phone: '请输入联系电话',
      email: '请输入电子邮箱'
    }
  },
  {
    templateKey: 'catalog',
    templateName: '目录',
    templateDesc: '目录模板，用于展示目录列表',
    templateComponent: 'Catalog',
    templateAttrs: [
      {
        attrKey: 'catalogList',
        attrName: '目录列表',
        editComponentType: null
      }
    ],
    defaultValue: {
      catalogList: []
    }
  }
]

// 模板初始化函数映射
const templateInitFuncMap: Record<string, () => any> = {
  cover: () => ({
    companyName: '示例科技有限公司',
    year: new Date().getFullYear().toString(),
    serviceManager: '张经理',
    phone: '138-0000-0000',
    email: 'service@example.com'
  }),
  catalog: () => ({
    catalogList: [
      { title: '第一章 项目概述', page: 1 },
      { title: '第二章 需求分析', page: 5 },
      { title: '第三章 技术方案', page: 12 },
      { title: '第四章 实施计划', page: 20 },
      { title: '第五章 风险评估', page: 28 },
      { title: '第六章 总结与展望', page: 35 }
    ]
  }),
  content: () => ({
    title: '项目内容',
    content: '这里是项目的详细内容描述...',
    sections: [
      { id: 1, title: '背景介绍', content: '项目背景相关内容' },
      { id: 2, title: '目标设定', content: '项目目标相关内容' },
      { id: 3, title: '实施方案', content: '具体实施方案内容' }
    ]
  }),
  chart: () => ({
    chartType: 'bar',
    title: '数据图表',
    data: [
      { name: 'Q1', value: 120 },
      { name: 'Q2', value: 200 },
      { name: 'Q3', value: 150 },
      { name: 'Q4', value: 180 }
    ],
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  })
}

export const usePlanTemplateStore = defineStore('planTemplate', () => {
  // 状态
  const state = reactive<PlanTemplateState>({
    currentTemplate: null,
    templates: [...defaultTemplateList],
    templateData: {},
    planTitle: '',
    planDescription: '',
    isEditing: false,
    isSaving: false
  })

  // Actions
  /**
   * 根据templateKey初始化模板数据
   * @param templateKey 模板键值
   */
  const initTemplateData = (templateKey: string) => {
    const initFunc = templateInitFuncMap[templateKey]
    if (initFunc) {
      const mockData = initFunc()
      state.templateData = {
        ...state.templateData,
        [templateKey]: mockData
      }
    } else {
      console.warn(`No init function found for template: ${templateKey}`)
    }
  }

  /**
   * 批量初始化所有模板数据
   */
  const initAllTemplateData = () => {
    Object.keys(templateInitFuncMap).forEach(templateKey => {
      initTemplateData(templateKey)
    })
  }

  /**
   * 检查模板数据是否已初始化
   * @param templateKey 模板键值
   */
  const isTemplateDataInitialized = (templateKey: string): boolean => {
    return !!state.templateData[templateKey]
  }

  // 兼容性方法（保持向后兼容）
  const initCoverData = () => initTemplateData('cover')
  const initCatalogData = () => initTemplateData('catalog')

  return {
    // 暴露状态
    ...toRefs(state),
    // 暴露新的通用方法
    initTemplateData,
    initAllTemplateData,
    isTemplateDataInitialized,
    // 暴露兼容性方法
    initCoverData,
    initCatalogData
  }
}, {
  // 持久化配置
  persist: {
    key: 'plan-template-store',
    storage: localStorage
  }
})