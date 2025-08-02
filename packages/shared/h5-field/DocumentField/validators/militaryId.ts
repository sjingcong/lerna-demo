/**
 * 军人证校验器
 */

import type { DocumentValidator } from './types';

/**
 * 军人证校验器实现
 */
class MilitaryIdValidator implements DocumentValidator {
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
        message: '请输入军人证号码',
        trigger,
      },
      {
        pattern: /^[A-Za-z]\d{8,14}$/,
        message: '军人证号码格式不正确',
        trigger,
      },
    ];
  }
}

export default new MilitaryIdValidator();
