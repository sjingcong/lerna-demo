export interface EmailFieldProps {
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

export interface EmailFieldEmits {
  'update:modelValue': [value: string]
  'input': [value: string]
  'blur': [event: Event]
  'focus': [event: Event]
}

export interface EmailFieldExpose {
  isValid: boolean
  domain: string
  value: string
  getDomain: () => string
}

// van-form 校验规则类型
export interface VantRule {
  required?: boolean
  message?: string
  validator?: (value: any) => boolean | Promise<boolean>
  pattern?: RegExp
  trigger?: 'onBlur' | 'onChange'
}

// 常见邮箱域名
export const COMMON_EMAIL_DOMAINS = [
  'gmail.com',
  'qq.com',
  '163.com',
  '126.com',
  'sina.com',
  'sohu.com',
  'hotmail.com',
  'yahoo.com',
  'outlook.com',
  'foxmail.com'
]