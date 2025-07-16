import Cover from './Cover.vue'
import Catalog from './Catalog.vue'
import type { Component } from 'vue'

// 模板组件映射对象
export const TEMPLATE_COMPONENTS: Record<string, Component> = {
  Cover,
  Catalog
}

// 根据组件名获取对应的模板组件
export const getTemplateComponent = (componentName: string): Component | undefined => {
  return TEMPLATE_COMPONENTS[componentName]
}