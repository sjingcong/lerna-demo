/**
 * 护照校验器
 */

import type { CertificationValidator } from './types';
const reg1 = /^[0-9a-zA-Z]{7,13}$/;
/**
 * 中国护照校验器实现
 */
class PassportValidator implements CertificationValidator {
  maxLength = 13;
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
        message: '护照号码格式不正确',
      },
    ];
  }
}

export default new PassportValidator();
