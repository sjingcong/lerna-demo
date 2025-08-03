/**
 * 外国人永久居留身份证校验器
 */

import type { CertificationValidator } from './types';
const reg1 = /^[A-Z]{3}[0-9]{12}$/;
/**
 * 外国人永久居留身份证校验器实现
 */
class ForeignerPermanentResidentValidator implements CertificationValidator {
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
        message: '证件号格式不正确',
      },
    ];
  }
}

export default new ForeignerPermanentResidentValidator();
