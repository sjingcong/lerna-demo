export interface PhoneFieldProps {
  modelValue?: string
  label?: string
  placeholder?: string
  required?: boolean
  readonly?: boolean
  disabled?: boolean
  clearable?: boolean
  name?: string
  rules?: Array<any>
  enableBuiltInValidation?: boolean
  trigger?: 'onBlur' | 'onChange'
}

export interface PhoneFieldEmits {
  'update:modelValue': [value: string]
  'input': [value: string]
  'blur': [event: Event]
  'focus': [event: Event]
}

export interface PhoneFieldExpose {
  isValid: boolean
  carrier: string
  value: string
  getCarrier: () => string
}

export interface CarrierInfo {
  name: string
  segments: string[]
}
// van-form 校验规则类型
export interface VantRule {
  required?: boolean
  message?: string
  validator?: (value: any) => boolean | Promise<boolean>
  pattern?: RegExp
  trigger?: 'onBlur' | 'onChange'
}

export const CARRIERS: Record<string, string[]> = {
  '中国移动': ['134', '135', '136', '137', '138', '139', '147', '150', '151', '152', '157', '158', '159', '172', '178', '182', '183', '184', '187', '188', '195', '198'],
  '中国联通': ['130', '131', '132', '145', '155', '156', '166', '171', '175', '176', '185', '186', '196'],
  '中国电信': ['133', '149', '153', '173', '174', '177', '180', '181', '189', '191', '193', '199']
}