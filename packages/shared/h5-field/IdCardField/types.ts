import type { Ref } from 'vue';

// 使用 any 类型以兼容 vant 的校验规则
export type VantRule = any;

// 身份证信息类型
export interface IdCardInfo {
  isValid: boolean;
  region: string; // 地区码
  birthDate: string; // 出生日期 YYYY-MM-DD
  age: number; // 年龄
  gender: string; // 性别：男/女
}

// Props 类型定义
export interface IdCardFieldProps {
  modelValue?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  name?: string;
  rules?: VantRule[];
  enableBuiltInValidation?: boolean;
  trigger?: 'onChange' | 'onBlur';
  supportedLengths?: number[];
}

// Emits 类型定义
export interface IdCardFieldEmits {
  'update:modelValue': [value: string];
  input: [value: string];
  blur: [event: Event];
  focus: [event: Event];
  'id-parsed': [info: IdCardInfo];
}

// Expose 类型定义
export interface IdCardFieldExpose {
  value: Ref<string>;
  isValid: Ref<boolean>;
  idCardInfo: Ref<IdCardInfo>;
  getIdCardInfo: () => IdCardInfo;
}
