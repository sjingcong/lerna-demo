// 用户管理模块类型定义

export interface User {
  managerUm: string;      // UM账号
  managerName: string;    // 姓名
  phoneNumber: string;    // 手机号
  salesChannel: string[];   // 渠道归属
  enabled: 0 | 1;         // 是否生效
}

export type UserStatus = 'active' | 'effective' | 'expired';

export interface UserSearchForm {
  managerUm?: string;      // UM账号
  managerName?: string;          // 姓名
  salesChannel?: string[];  // 渠道归属
  enabled: 0 | 1;         // 是否生效
}

export interface UserListResponse {
  rows: User[];
  total: number;
}

export interface UserRequest {
  managerUm: string;
  managerName: string;
  phoneNumber: string;
  salesChannel: string[];
  enabled: 0 | 1;
}


// 状态选项
export interface StatusOption {
  label: string;
  value: UserStatus;
  color: string;
}

// 分页参数
export interface PaginationParams {
  current: number;
  pageSize: number;
}

// 表格列配置
export interface TableColumn {
  title: string;
  dataIndex: string;
  key: string;
  width?: number;
  slots?: {
    customRender?: string;
  };
}