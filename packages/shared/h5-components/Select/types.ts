export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
  width?: string | number
}

export type SelectLayoutType = 'grid' | 'scroll'

export interface SelectProps {
  /** 选项列表 */
  options: SelectOption[]
  /** 当前选中的值 */
  modelValue?: string | number | (string | number)[]
  /** 是否支持多选 */
  multiple?: boolean
  /** 布局类型 */
  layoutType?: SelectLayoutType
  /** 每行显示的选项数量（仅在 layoutType 为 'grid' 时生效） */
  itemsPerRow?: number
  /** 固定项目宽度（仅在 layoutType 为 'scroll' 时生效） */
  itemWidth?: string | number
  /** 是否禁用 */
  disabled?: boolean
}

export interface SelectEmits {
  (e: 'update:modelValue', value: string | number | (string | number)[]): void
  (e: 'change', value: string | number | (string | number)[]): void
}