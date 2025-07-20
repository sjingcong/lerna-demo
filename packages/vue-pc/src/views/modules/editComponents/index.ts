import type { Component } from 'vue'
import SectionGroupHorizontal from './SectionGroupHorizontal.vue'
import SectionListVertical from './SectionListVertical.vue'
import BackImage from './BackImage.vue'
import ImageList from './ImageList.vue'

// 编辑组件映射
export const EDIT_COMPONENTS_MAP: Record<string, Component> = {
  SectionGroupHorizontal,
  SectionListVertical,
  BackImage,
  ImageList,
  // 可以在这里添加更多编辑组件
}

// 获取编辑组件
export function getEditComponent(editComponentType: string): Component | undefined {
  return EDIT_COMPONENTS_MAP[editComponentType]
}

// 检查是否存在编辑组件
export function hasEditComponent(editComponentType: string): boolean {
  return editComponentType in EDIT_COMPONENTS_MAP
}

// 获取所有可用的编辑组件类型
export function getAvailableEditComponentTypes(): string[] {
  return Object.keys(EDIT_COMPONENTS_MAP)
}

export default EDIT_COMPONENTS_MAP