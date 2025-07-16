import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'
import type { Component } from 'vue'
import type { IModule } from '@/views/modules/types'
import Cover from '@/views/modules/Cover.vue'
import Catalog from '@/views/modules/Catalog.vue'



// 模板组件映射对象
export const TEMPLATE_COMPONENTS: Record<string, Component> = {
  cover: Cover,
  catalog: Catalog
}

// 获取模板组件的函数
export const getTemplateComponent = (componentName: string): Component | undefined => {
  return TEMPLATE_COMPONENTS[componentName]
}

interface PlanTemplateState {
  // 当前选中的模板
  currentTemplate: IModule | null
  // 模板列表
  templates: IModule[]
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
const defaultTemplateList: IModule[] = [
  {
    moduleCode: 'cover',
    moduleType: '封面',
    moduleName: '封面模板',
    backImage: '',
    editable: true,
    deletable: false,
    templateAttrs: [
      {
        attrKey: 'title',
        attrName: '标题',
        editComponentType: 'Input'
      }
    ],
    moduleValue: {
      title: '请输入标题'
    }
  },
  {
    moduleCode: 'catalog',
    moduleType: '目录',
    moduleName: '目录模板',
    backImage: '',
    editable: true,
    deletable: false,
    templateAttrs: [
      {
        attrKey: 'catalogList',
        attrName: '目录列表',
        editComponentType: null
      }
    ],
    moduleValue: {
      catalogList: []
    }
  }
]



export const usePlanTemplateStore = defineStore('planTemplate', () => {
  // 状态
  const state = reactive<PlanTemplateState>({
    currentTemplate: null,
    templates: [],
    templateData: {},
    planTitle: '',
    planDescription: '',
    isEditing: false,
    isSaving: false
  })

  /**
   * 从远程获取模板列表（暂时使用mock数据）
   */
  const getRemoteTemplates = async (): Promise<IModule[]> => {
    // 模拟远程模板数据
    const mockTemplates: IModule[] = [
      {
        moduleCode: 'cover',
        moduleType: '封面',
        moduleName: '封面模板',
        backImage: 'https://example.com/cover-bg.jpg',
        editable: true,
        deletable: false,
        templateAttrs: [
          {
            attrKey: 'title',
            attrName: '标题',
            editComponentType: ''
          },
          {
            attrKey: 'companyName',
            attrName: '公司名称',
            editComponentType: ''
          },
          {
            attrKey: 'year',
            attrName: '年份',
            editComponentType: ''
          }
        ],
        moduleValue: {
          title: '请输入标题',
          companyName: '请输入公司名称',
          year: new Date().getFullYear().toString()
        }
      },
      {
        moduleCode: 'catalog',
        moduleType: '目录',
        moduleName: '目录模板',
        backImage: 'https://example.com/catalog-bg.jpg',
        editable: true,
        deletable: false,
        templateAttrs: [
          {
            attrKey: 'catalogList',
            attrName: '目录列表',
            editComponentType: null
          }
        ],
        moduleValue: {
          catalogList: []
        }
      },
      {
        moduleCode: 'content',
        moduleType: '内容',
        moduleName: '内容模板',
        backImage: 'https://example.com/content-bg.jpg',
        editable: true,
        deletable: true,
        templateAttrs: [
          {
            attrKey: 'title',
            attrName: '标题',
            editComponentType: 'Input'
          },
          {
            attrKey: 'content',
            attrName: '内容',
            editComponentType: 'Input'
          }
        ],
        moduleValue: {
          title: '内容标题',
          content: '请输入内容'
        }
      }
    ]

    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 200))
    
    return mockTemplates
  }

  /**
   * 初始化模板列表
   */
  const initTemplates = async () => {
    try {
      const templates = await getRemoteTemplates()
      state.templates = templates
      console.log('Templates initialized successfully:', templates.length)
    } catch (error) {
      console.error('Failed to initialize templates:', error)
      // 降级处理：使用默认模板
      state.templates = [...defaultTemplateList]
    }
  }

  // Actions
  /**
   * 根据模块代码获取远程数据（暂时使用mock数据）
   * @param moduleCode 模块代码
   */
  const getRemoteDataByCode = async (moduleCode: string): Promise<any> => {
    // 模拟远程数据获取
    const mockRemoteData: Record<string, any> = {
      cover: {
        companyName: '远程科技有限公司',
        year: new Date().getFullYear().toString(),
        serviceManager: '李经理',
        phone: '139-0000-0000',
        email: 'remote@example.com',
        description: '这是从远程获取的封面数据'
      },
      catalog: {
        catalogList: [
          { title: '第一章 远程项目概述', page: 1 },
          { title: '第二章 远程需求分析', page: 6 },
          { title: '第三章 远程技术方案', page: 15 },
          { title: '第四章 远程实施计划', page: 25 }
        ],
      }
    }
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 100))
    
    return mockRemoteData[moduleCode] || {}
  }

  /**
   * 根据moduleCode初始化模板数据
   * @param moduleCode 模块代码
   */
  const initModuleValue = async (moduleCode: string) => {
    try {
      // 获取远程数据
      const remoteData = await getRemoteDataByCode(moduleCode)
      
      // 查找对应的模块配置
      const moduleConfig = state.templates.find(template => template.moduleCode === moduleCode)
      
      if (moduleConfig) {
        // 合并模块的默认值和远程数据
        const mergedData = {
          ...moduleConfig.moduleValue,
          ...remoteData
        }
        
        // 更新状态
        state.templateData = {
          ...state.templateData,
          [moduleCode]: mergedData
        }
      } else {
        console.warn(`No module config found for moduleCode: ${moduleCode}`)
      }
    } catch (error) {
      console.error(`Failed to initialize template data for ${moduleCode}:`, error)
      
      // 降级处理：使用模块默认值
      const moduleConfig = state.templates.find(template => template.moduleCode === moduleCode)
      if (moduleConfig) {
        state.templateData = {
          ...state.templateData,
          [moduleCode]: moduleConfig.moduleValue
        }
      }
    }
  }


  /**
   * 检查模板数据是否已初始化
   * @param templateKey 模板键值
   */
  const isTemplateDataInitialized = (templateKey: string): boolean => {
    return !!state.templateData[templateKey]
  }


 

  return {
    // 暴露状态
    ...toRefs(state),
    // 暴露模板管理方法
    initTemplates,
    // 暴露数据管理方法
    initModuleValue,
    isTemplateDataInitialized,

  }
}, {
  // 持久化配置
  persist: {
    key: 'plan-template-store',
    storage: localStorage
  }
})