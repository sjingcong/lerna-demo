// 其他配置项模块数据类型
export interface OtherSettingsModuleData {
  agreements: AgreementItem[];  // 协议列表
}

// 协议数据类型
export interface AgreementItem {
  id: string;           // 协议ID
  name: string;         // 协议名称
  checked: boolean;     // 是否勾选
  disabled: boolean;    // 是否禁用（置灰）
}

export const otherSettings = {
  defaultValue: {
    agreements: [
      {
        id: 'privacy',
        name: '个人信息授权书',
        checked: true,
        disabled: true
      },
      {
        id: 'privacy-policy',
        name: '隐私条款',
        checked: false,
        disabled: false
      },
      {
        id: 'product-manual',
        name: '产品说明书',
        checked: false,
        disabled: false
      },
      {
        id: 'insurance-manual',
        name: '投保说明书',
        checked: false,
        disabled: false
      },
      {
        id: 'software-agreement',
        name: '软件授权协议',
        checked: false,
        disabled: false
      }
    ]
  },
  processor(globalData: any, updateData: any) {
    // 从全局数据中获取其他配置项的数据
    const moduleData: OtherSettingsModuleData = {
      agreements: globalData?.otherSettings?.agreements || [
        {
          id: 'privacy',
          name: '个人信息授权书',
          checked: true,
          disabled: true
        },
        {
          id: 'privacy-policy',
          name: '隐私条款',
          checked: false,
          disabled: false
        },
        {
          id: 'product-manual',
          name: '产品说明书',
          checked: false,
          disabled: false
        },
        {
          id: 'insurance-manual',
          name: '投保说明书',
          checked: false,
          disabled: false
        },
        {
          id: 'software-agreement',
          name: '软件授权协议',
          checked: false,
          disabled: false
        }
      ]
    };
    
    // 更新模块数据
    updateData(moduleData);
  },
};

export default otherSettings;