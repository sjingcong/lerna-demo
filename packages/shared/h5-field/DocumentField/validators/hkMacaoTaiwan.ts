/**
 * 港澳台通行证校验器
 */

import type { CertificationValidator } from './types';
const reg1 = /^([HM]\d{8}|\d{8})$/;
/**
 * 港澳台通行证校验器实现
 */
class HkMacaoTaiwanValidator implements CertificationValidator {
  maxLength = 10;
  parse = undefined;
  format(value: string) {
    return value;
  }
  validate(value: string): boolean {
    if (reg1.test(value)) {
      return true;
    }
    return false;
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
        message: '请输入港澳台回乡证',
        trigger,
      },
      {
        pattern: reg1,
        message: '港澳台回乡证格式不正确',
        trigger,
      },
    ];
  }
}

export default new HkMacaoTaiwanValidator();
