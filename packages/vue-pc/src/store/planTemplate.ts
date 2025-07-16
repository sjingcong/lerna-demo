import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'
import type { Component } from 'vue'
import type { IModule } from '@/views/modules/types'
import Cover from '@/views/modules/Cover.vue'
import Catalog from '@/views/modules/Catalog.vue'



// 模块组件映射对象
export const TEMPLATE_COMPONENTS: Record<string, Component> = {
  cover: Cover,
  catalog: Catalog
}

// 获取模块组件的函数
export const getTemplateComponent = (componentName: string): Component | undefined => {
  return TEMPLATE_COMPONENTS[componentName]
}

interface PlanTemplateState {
  // 当前选中的模块
  currentModule: IModule | null
  // 模块列表
  modules: IModule[]
  // 当前模块的数据
  moduleValueMap: Record<string, any>
  // 计划书标题
  planTitle: string
  // 计划书描述
  planDescription: string
  // 是否正在编辑
  isEditing: boolean
  // 保存状态
  isSaving: boolean
}



export const usePlanTemplateStore = defineStore('planTemplate', () => {
  // 状态
  const state = reactive<PlanTemplateState>({
    currentModule: null,
    modules: [],
    moduleValueMap: {},
    planTitle: '',
    planDescription: '',
    isEditing: false,
    isSaving: false
  })

  /**
   * 从远程获取模块列表（暂时使用mock数据）
   */
  const getRemoteModules = async (): Promise<IModule[]> => {
    // 模拟远程模块数据
    const mockTemplates: IModule[] = [
      {
        moduleCode: 'cover',
        moduleType: '封面',
        moduleName: '封面模块',
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
        moduleName: '目录模块',
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
        moduleName: '内容模块',
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
   * 初始化模块列表
   */
  const initModules = async () => {
    try {
      const modules = await getRemoteModules()
      state.modules = modules
      console.log('Templates initialized successfully:', modules.length)
    } catch (error) {
      console.error('Failed to initialize templates:', error)
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
   * 根据moduleCode初始化模块数据
   * @param moduleCode 模块代码
   */
  const initModuleValue = async (moduleCode: string) => {
    try {
      // 获取远程数据
      const remoteData = await getRemoteDataByCode(moduleCode)
      
      // 查找对应的模块配置
      const moduleConfig = state.modules.find(template => template.moduleCode === moduleCode)
      
      if (moduleConfig) {
        // 合并模块的默认值和远程数据
        const mergedData = {
          ...moduleConfig.moduleValue,
          ...remoteData
        }
        
        // 更新状态
        state.moduleValueMap = {
          ...state.moduleValueMap,
          [moduleCode]: mergedData
        }
      } else {
        console.warn(`No module config found for moduleCode: ${moduleCode}`)
      }
    } catch (error) {
      console.error(`Failed to initialize template data for ${moduleCode}:`, error)
      
      // 降级处理：使用模块默认值
      const moduleConfig = state.modules.find(template => template.moduleCode === moduleCode)
      if (moduleConfig) {
        state.moduleValueMap = {
          ...state.moduleValueMap,
          [moduleCode]: moduleConfig.moduleValue
        }
      }
    }
  }


  /**
   * 检查模块数据是否已初始化
   * @param templateKey 模块键值
   */
  const isModuleDataInitialized = (templateKey: string): boolean => {
    return !!state.moduleValueMap[templateKey]
  }

  /**
   * 设置当前选中的模块
   * @param module 要选中的模块
   */
  const setCurrentModule = async (module: IModule | null) => {
    state.currentModule = module
    
    // 如果选中了模块，自动初始化其数据
    if (module) {
      await initModuleValue(module.moduleCode)
    }
  }

  /**
   * 根据moduleCode选择模块
   * @param moduleCode 模块代码
   */
  const selectModuleByCode = async (moduleCode: string) => {
    const module = state.modules.find(m => m.moduleCode === moduleCode)
    if (module) {
      await setCurrentModule(module)
    } else {
      console.warn(`Module not found for code: ${moduleCode}`)
    }
  }

  return {
    // 暴露状态
    ...toRefs(state),
    // 暴露模块管理方法
    initModules,
    // 暴露数据管理方法
    initModuleValue,
    isModuleDataInitialized,
    // 暴露模块选择方法
    setCurrentModule,
    selectModuleByCode,
    getRemoteDataByCode
  }
}, {
  // 持久化配置
  persist: {
    key: 'plan-template-store',
    storage: localStorage
  }
})