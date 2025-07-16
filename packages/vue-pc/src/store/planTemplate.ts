import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'
import type { ITemplateConfig } from '@/views/modules/types'

interface PlanTemplateState {
  // 当前选中的模板
  currentTemplate: ITemplateConfig | null
  // 模板列表
  templates: ITemplateConfig[]
  // 当前模板的数据
  templateData: Record<string, any>
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
    templateName: '封面',
    templateDesc: '封面模板，用于展示标题信息',
    templateComponent: 'Cover',
    templateAttrs: [
      {
        attrKey: 'title',
        attrName: '标题',
        editComponentType: 'Input'
      }
    ],
    defaultValue: {
      title: '请输入标题'
    }
  },
  {
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
  const initCoverData = () => {
    // Mock封面初始数据
    const mockCoverData = {
      title: '我的计划书标题',
      subtitle: '副标题说明',
      author: '作者姓名',
      date: new Date().toLocaleDateString('zh-CN'),
      version: 'v1.0'
    }
    
    state.templateData = {
      ...state.templateData,
      cover: mockCoverData
    }
  }

  const initCatalogData = () => {
    // Mock目录初始数据
    const mockCatalogData = {
      catalogList: [
        { title: '第一章 项目概述', page: 1 },
        { title: '第二章 需求分析', page: 5 },
        { title: '第三章 技术方案', page: 12 },
        { title: '第四章 实施计划', page: 20 },
        { title: '第五章 风险评估', page: 28 },
        { title: '第六章 总结与展望', page: 35 }
      ]
    }
    
    state.templateData = {
      ...state.templateData,
      catalog: mockCatalogData
    }
  }

  return {
    // 暴露状态
    ...toRefs(state),
    // 暴露方法
    initCoverData,
    initCatalogData
  }
}, {


  // 持久化配置
  persist: {
    key: 'plan-template-store',
    storage: localStorage,
    paths: ['planTitle', 'planDescription', 'templateData', 'currentTemplate']
  }
})