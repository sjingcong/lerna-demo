/**
 * 护照校验器
 */

import type { DocumentValidator } from './types';

/**
 * 中国护照校验器实现
 */
class PassportValidator implements DocumentValidator {
  /**
   * 格式化护照号码（转为大写）
   */
  format(value: string): string {
    if (!value) return value;
    return value.toUpperCase();
  }

  /**
   * 获取van-form兼容的校验规则
   */
  getRules(
    required: boolean,
    trigger: 'onChange' | 'onBlur' | 'onSubmit'
  ): any[] {
    return [
      {
        required,
        message: '请输入中国护照号码',
        trigger,
      },
      {
        pattern: /^[0-9a-zA-Z]{7,13}$/,
        message: '护照号码格式不正确',
        trigger,
      },
    ];
  }
}

export default new PassportValidator();
