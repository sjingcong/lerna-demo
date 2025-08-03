/**
 * 证件解析结果
 */
export interface ParseResult {
  /** 是否解析成功 */
  success: boolean;
  info?: any;
  /** 错误信息 */
  errorMessage?: string;
}

/**
 * 证件校验器接口
 */
export interface CertificationValidator {
  /** 解析证件信息 */
  parse?(value: string): ParseResult;

  /** 格式化证件号码（可选） */
  format?(value: string): string;
  validate?(value: string): boolean;
  /** 获取van-form兼容的校验规则 */
  getRules(
    required: boolean,
    trigger?: 'onChange' | 'onBlur' | 'onSubmit'
  ): any[];
}
