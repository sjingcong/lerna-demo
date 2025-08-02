/**
 * 外国人永久居留身份证校验器
 */

import type { DocumentValidator } from './types';

/**
 * 外国人永久居留身份证校验器实现
 */
class ForeignerPermanentResidentValidator implements DocumentValidator {
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
        message: '请输入证件号',
        trigger,
      },
      {
        pattern: /^[A-Z]{3}[0-9]{12}$/,
        message: '证件号格式不正确',
        trigger,
      },
    ];
  }
}

export default new ForeignerPermanentResidentValidator();
