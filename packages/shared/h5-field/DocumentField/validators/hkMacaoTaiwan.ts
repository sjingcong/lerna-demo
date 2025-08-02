/**
 * 港澳台通行证校验器
 */

import type { DocumentValidator } from './types';

/**
 * 港澳台通行证校验器实现
 */
class HkMacaoTaiwanValidator implements DocumentValidator {
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
        message: '请输入港澳台回乡证',
        trigger,
      },
      {
        pattern: /^([HM]\d{8}|\d{8})$/,
        message: '港澳台回乡证格式不正确',
        trigger,
      },
    ];
  }
}

export default new HkMacaoTaiwanValidator();
