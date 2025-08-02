/**
 * 出生证校验器
 */

import type { DocumentValidator } from './types';

/**
 * 出生证校验器实现
 */
class BirthCertificateValidator implements DocumentValidator {
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
        message: '请输入出生证编号',
        trigger,
      },
      {
        pattern: /^[A-Za-z]\d{9}$/,
        message: '出生证编号格式不正确',
        trigger,
      },
    ];
  }
}

export default new BirthCertificateValidator();
