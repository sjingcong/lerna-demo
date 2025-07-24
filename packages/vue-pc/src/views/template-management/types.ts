// 模板查询参数类型
export interface TemplateQueryParams {
  templateTag?: string // 模板标签
  templateName?: string // 模板名称
  creater?: string // 创建人
  createTimeRange?: [string, string] | null // 创建时间范围 [开始时间, 结束时间]
  pageNum: number // 页码
  pageSize: number // 每页数量
}

// 模板列表项类型
export interface TemplateItem {
  id: string // 模板ID
  templateName: string // 模板名称
  templateDesc: string // 模板描述
  templageCover: string // 封面
  templateTag: string // 模板标签
  salesChannel: string // 渠道
  createTime: string // 创建时间
}
