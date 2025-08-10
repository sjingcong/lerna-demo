// 埋点事件类型
export interface TrackEvent {
  type: string; // 事件类型
  data: Record<string, any>; // 事件数据
  timestamp: number; // 时间戳
  url: string; // 当前页面URL
  userAgent: string; // 用户代理
}

// 插件接口
export interface Plugin {
  name: string; // 插件名称
  install(tracker: any): void; // 安装插件
  uninstall?(): void; // 卸载插件（可选）
}

// 埋点配置
export interface TrackerConfig {
  endpoint?: string; // 上报接口地址
  batchSize?: number; // 批量上报数量
  flushInterval?: number; // 上报间隔（毫秒）
  enableConsole?: boolean; // 是否开启控制台输出
  userId?: string; // 用户ID
  sessionId?: string; // 会话ID
  extra?: Record<string, any>; // 额外参数
}

// JS错误事件数据
export interface JSErrorData {
  message: string;
  filename: string;
  lineno: number;
  colno: number;
  stack?: string;
  errorType: 'js' | 'promise' | 'resource';
}

// API请求事件数据
export interface APIData {
  url: string;
  method: string;
  status: number;
  duration: number;
  requestSize?: number;
  responseSize?: number;
}

// 资源加载事件数据
export interface ResourceData {
  url: string;
  type: string;
  duration: number;
  size?: number;
  status: 'success' | 'error';
}