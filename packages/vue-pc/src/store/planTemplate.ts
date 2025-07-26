import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'
import type { Component } from 'vue'
import type { IModule } from '@giom/shared/planBookComponents/types'
import Cover from '@giom/shared/planBookComponents/Cover.vue'
import Catalog from '@giom/shared/planBookComponents/Catalog.vue'
import ServicePromise from '@giom/shared/planBookComponents/ServicePromise.vue'
import ImageModule from '@giom/shared/planBookComponents/ImageModule.vue'

// 模块组件映射对象
export const TEMPLATE_COMPONENTS: Record<string, Component> = {
  cover: Cover,
  catalog: Catalog,
  'service-promise': ServicePromise,
  'image-module': ImageModule
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
        editable: true,
        deletable: false,
        templateAttrs: [
          {
            attrKey: 'backImage',
            attrName: '背景图',
            editComponentType: 'BackImage'
          },
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
        moduleCode: 'service-promise',
        moduleType: '服务承诺',
        moduleName: '服务承诺模块',
        editable: true,
        deletable: true,
        templateAttrs: [
          {
            attrKey: 'backImage',
            attrName: '背景图',
            editComponentType: 'BackImage'
          },
          {
            attrKey: 'section1',
            attrName: '模块1',
            editComponentType: 'SectionGroupHorizontal'
          },
          {
            attrKey: 'section2',
            attrName: '模块2',
            editComponentType: 'SectionListVertical'
          }
        ],
        moduleValue: {
          section1: {
            title: '时效承诺',
            items: [
              {
                title: '承保时效',
                content: [
                  {
                    subTitle: '正常件',
                    subDesc: 'xxx个工作日完成承保出单'
                  },
                  {
                    subTitle: '问题件',
                    subDesc: 'xxx个工作日进行问题处理'
                  }
                ]
              },
              {
                title: '保全时效',
                content: [
                  {
                    subTitle: '正常件',
                    subDesc: 'xxx个工作日完成保全出单'
                  },
                  {
                    subTitle: '问题件',
                    subDesc: 'xxx个工作日进行问题处理'
                  }
                ]
              },
              {
                title: '理赔时效',
                content: [
                  {
                    subTitle: '正常件',
                    subDesc: 'xxx个工作日完成理赔出单'
                  },
                  {
                    subTitle: '问题件',
                    subDesc: 'xxx个工作日进行问题处理'
                  }
                ]
              }
            ]
          },
          section2: {
            title: '服务安排',
            items: [
              {
                title: '专属服务团队',
                description: 'XX名服务经理进行保单管理、安排健康活动、提供理赔报告等服务XX名服务经理进行保单查等服务、上门收单、理赔咨询等服务'
              },
              {
                title: '宣导服务',
                description: '提供现场宣导会、视频宣传、电子海报、服务手册等多渠道宣导支持使员工充分了解保险保障、医疗健康、理赔相关等保单问题'
              }
            ]
          }
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
      // pc场景禁用模块内部的编辑和删除功能
       modules.forEach(i => { i.editable = false; i.deletable = false })
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
      },
      'service-promise': {
        section1: {
          title: '时效承诺',
          items: [
            {
              title: '承保时效',
              content: [
                {
                  subTitle: '正常件',
                  subDesc: '3个工作日完成承保出单'
                },
                {
                  subTitle: '问题件',
                  subDesc: '5个工作日进行问题处理'
                }
              ]
            },
            {
              title: '保全时效',
              content: [
                {
                  subTitle: '正常件',
                  subDesc: '2个工作日完成保全出单'
                },
                {
                  subTitle: '问题件',
                  subDesc: '4个工作日进行问题处理'
                }
              ]
            },
            {
              title: '理赔时效',
              content: [
                {
                  subTitle: '正常件',
                  subDesc: '7个工作日完成理赔出单'
                },
                {
                  subTitle: '问题件',
                  subDesc: '10个工作日进行问题处理'
                }
              ]
            }
          ]
        },
        section2: {
          title: '服务安排',
          items: [
            {
              title: '专属服务团队',
              description: '5名服务经理进行保单管理、安排健康活动、提供理赔报告等服务，3名服务经理进行保单查询等服务、上门收单、理赔咨询等服务'
            },
            {
              title: '宣导服务',
              description: '提供现场宣导会、视频宣传、电子海报、服务手册等多渠道宣导支持，使员工充分了解保险保障、医疗健康、理赔相关等保单问题'
            }
          ]
        }
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

  /**
   * 更新模块配置
   * @param updatedModule 更新后的模块数据
   */
  const updateModule = async (updatedModule: IModule) => {
    try {
      // 查找并更新模块列表中的对应模块
      const moduleIndex = state.modules.findIndex(m => m.moduleCode === updatedModule.moduleCode)
      if (moduleIndex !== -1) {
        state.modules[moduleIndex] = { ...state.modules[moduleIndex], ...updatedModule }

        // 如果更新的是当前选中的模块，同时更新当前模块
        if (state.currentModule?.moduleCode === updatedModule.moduleCode) {
          state.currentModule = state.modules[moduleIndex]
        }

        console.log('Module updated successfully:', updatedModule.moduleCode)
      } else {
        console.warn(`Module not found for update: ${updatedModule.moduleCode}`)
      }
    } catch (error) {
      console.error('Failed to update module:', error)
      throw error
    }
  }

  /**
   * 更新模块的moduleValue
   * @param moduleCode 模块代码
   * @param moduleValue 新的模块值
   */
  const updateModuleValue = async (moduleCode: string, moduleValue: any) => {
    try {
      // 更新moduleValueMap
      state.moduleValueMap = {
        ...state.moduleValueMap,
        [moduleCode]: moduleValue
      }

      // 查找并更新模块列表中的对应模块
      const moduleIndex = state.modules.findIndex(m => m.moduleCode === moduleCode)
      if (moduleIndex !== -1) {
        state.modules[moduleIndex] = {
          ...state.modules[moduleIndex],
          moduleValue
        }

        // 如果更新的是当前选中的模块，同时更新当前模块
        if (state.currentModule?.moduleCode === moduleCode) {
          state.currentModule = {
            ...state.currentModule,
            moduleValue
          }
        }

        console.log('Module value updated successfully:', moduleCode)
      } else {
        console.warn(`Module not found for value update: ${moduleCode}`)
      }
    } catch (error) {
      console.error('Failed to update module value:', error)
      throw error
    }
  }

  /**
   * 更新模块属性值
   * @param moduleCode 模块代码
   * @param attrKey 属性键
   * @param attrValue 属性值
   */
  const updateModuleAttr = async (moduleCode: string, attrKey: string, attrValue: any) => {
    try {
      // 获取当前模块值
      const currentModuleValue = state.moduleValueMap[moduleCode] || {}

      // 更新特定属性
      const updatedModuleValue = {
        ...currentModuleValue,
        [attrKey]: attrValue
      }

      // 调用updateModuleValue方法
      await updateModuleValue(moduleCode, updatedModuleValue)

      console.log('Module attribute updated successfully:', { moduleCode, attrKey })
    } catch (error) {
      console.error('Failed to update module attribute:', error)
      throw error
    }
  }

  /**
   * 添加图片模块
   */
  const addImageModule = async () => {
    try {
      // 生成唯一的模块代码
      const timestamp = Date.now()
      const moduleCode = 'image-module'
      const uniqueId = `image-module-${timestamp}`

      // 创建图片模块配置
      const imageModule: IModule = {
        moduleCode,
        moduleType: '图片',
        moduleName: `图片模块_${timestamp}`,
        editable: true,
        deletable: true,
        templateAttrs: [
          {
            attrKey: 'images',
            attrName: '背景图',
            editComponentType: 'ImageList'
          },
        ],
        moduleValue: {
          images: [],
        }
      }

      // 添加到模块列表
      state.modules.push(imageModule)

      // 初始化模块数据
      state.moduleValueMap = {
        ...state.moduleValueMap,
        [moduleCode]: imageModule.moduleValue
      }

      console.log('Image module added successfully:', moduleCode)
      return imageModule
    } catch (error) {
      console.error('Failed to add image module:', error)
      throw error
    }
  }

  /**
   * 重新排序模块
   * @param newModules 新的模块顺序数组
   */
  const reorderModules = async (newModules: IModule[]) => {
    try {
      state.modules = [...newModules]
      console.log('Modules reordered successfully')
    } catch (error) {
      console.error('Failed to reorder modules:', error)
      throw error
    }
  }

  return {
    // 暴露状态
    ...toRefs(state),
    // 暴露模块管理方法
    initModules,
    updateModule,
    updateModuleValue,
    updateModuleAttr,
    addImageModule,
    reorderModules,
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