/**
 * 驾驶证校验器
 */

import type { DocumentValidator } from './types';

/**
 * 驾驶证校验器实现
 */
class DriverLicenseValidator implements DocumentValidator {
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
        message: '请输入驾驶证号码',
        trigger,
      },
      {
        pattern: /^\d{18}$/,
        message: '驾驶证号码格式不正确',
        trigger,
      },
    ];
  }
}

export default new DriverLicenseValidator();
