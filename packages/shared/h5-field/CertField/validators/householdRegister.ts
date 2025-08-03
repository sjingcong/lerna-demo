/**
 * 户口本校验器
 */

import type { CertificationValidator } from './types';
const reg1 = /^\d{15,18}$/;
/**
 * 户口本校验器实现
 */
class HouseholdRegisterValidator implements CertificationValidator {
  maxLength = 18;
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
        message: '户口本编号格式不正确',
      },
    ];
  }
}

export default new HouseholdRegisterValidator();
