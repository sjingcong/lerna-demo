/**
 * 军人证校验器
 */

import type { CertificationValidator } from './types';
const reg1 = /^[A-Za-z]\d{8,14}$/;
/**
 * 军人证校验器实现
 */
class MilitaryIdValidator implements CertificationValidator {
  maxLength = 15;
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
        message: '请输入军人证号码',
        trigger,
      },
      {
        pattern: reg1,
        message: '军人证号码格式不正确',
        trigger,
      },
    ];
  }
}

export default new MilitaryIdValidator();
