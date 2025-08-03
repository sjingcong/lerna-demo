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
  getRules(): any[] {
    return [
      {
        validator(value: string) {
          if (reg1.test(value)) {
            return true;
          }
          return false;
        },
        message: '军人证号码格式不正确',
      },
    ];
  }
}

export default new MilitaryIdValidator();
