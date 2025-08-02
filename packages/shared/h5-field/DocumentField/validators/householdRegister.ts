/**
 * 户口本校验器
 */

import type { DocumentValidator } from './types';

/**
 * 户口本校验器实现
 */
class HouseholdRegisterValidator implements DocumentValidator {
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
        message: '请输入户口本编号',
        trigger,
      },
      {
        pattern: /^\d{15,18}$/,
        message: '户口本编号格式不正确',
        trigger,
      },
    ];
  }
}

export default new HouseholdRegisterValidator();
