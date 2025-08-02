export interface SpaceProps {
  /** 间距大小 */
  size?: 'small' | 'medium' | 'large' | number
  /** 排列方向 */
  direction?: 'horizontal' | 'vertical'
  /** 对齐方式 */
  align?: 'start' | 'center' | 'end' | 'baseline'
  /** 是否自动换行 */
  wrap?: boolean
  /** 项目列表 */
  items?: string[]
}

export type SpaceSize = 'small' | 'medium' | 'large' | number
export type SpaceDirection = 'horizontal' | 'vertical'
export type SpaceAlign = 'start' | 'center' | 'end' | 'baseline'