/**
 * 身份证校验器
 */

import type { CertificationValidator, ParseResult } from './types';
import Validator from 'id-validator';
/**
 * 尝试使用 id-validator 库进行校验
 */
const validateInstance = new Validator();
function tryIdValidator(value: string): { isValid: boolean; info?: any } {
  try {
    const isValid = validateInstance.isValid(value);
    const info = isValid ? validateInstance.getInfo(value) : null;
    return { isValid, info };
  } catch {
    return { isValid: false };
  }
}

/**
 * 身份证校验器实现
 */
class IdCardValidator implements CertificationValidator {
  maxLength = 18;
  format(value: string) {
    return value;
  }
  /**
   * 解析身份证信息
   */
  parse(value: string): ParseResult {
    try {
      // 优先使用 id-validator 库
      const idValidatorResult = tryIdValidator(value);
      if (idValidatorResult.isValid && idValidatorResult.info) {
        const info = idValidatorResult.info;
        return {
          success: true,
          info: {
            region: info.address,
            birthDate: info.birthday,
            age: info.age,
            gender: info.sex,
          },
        };
      }
      return {
        success: false,
        errorMessage: '身份证号码格式不正确',
      };
    } catch {
      // 忽略错误，使用回退逻辑
      return {
        success: false,
        errorMessage: '身份证号码格式不正确',
      };
    }
  }
  validate = (value: string) => Validator.isValid(value);
  /**
   * 获取van-form兼容的校验规则
   */
  getRules(): any[] {
    return [
      {
        validator: (value: string) => {
          if (!value) return true;

          // 直接使用 id-validator 库进行校验
          const result = tryIdValidator(value);
          return result.isValid;
        },
        message: '身份证号码格式不正确',
      },
    ];
  }
}

export default new IdCardValidator();
