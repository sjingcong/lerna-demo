/**
 * 出生证校验器
 */

import type { CertificationValidator } from './types';

const reg1 = /^[A-Za-z]\d{9}$/;
/**
 * 出生证校验器实现
 */
class BirthCertificationValidator implements CertificationValidator {
  maxLength = 10;
  format(value: string) {
    return value;
  }
  parse = undefined;
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
        message: '出生证编号格式不正确',
      },
    ];
  }
}

export default new BirthCertificationValidator();
