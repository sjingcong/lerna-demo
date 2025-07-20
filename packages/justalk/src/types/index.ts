/**
 * JusTalk MCP Server Types
 * 定义所有核心数据结构和接口
 */

// 组件信息接口
export interface ComponentInfo {
  id: string;
  name: string;
  type: string;
  props: Record<string, any>;
  styles: Record<string, string>;
  children?: ComponentInfo[];
  sourceMap: SourceMapping;
}

// 源码映射信息
export interface SourceMapping {
  filePath: string;
  lineNumber: number;
  columnNumber: number;
  endLineNumber?: number;
  endColumnNumber?: number;
}

// 项目上下文
export interface ProjectContext {
  framework: string;           // React, Vue, Angular等
  componentLibrary: string;    // Ant Design, Element UI等
  styleFramework: string;      // Tailwind, Styled Components等
  projectRoot: string;         // 项目根目录
}

// 页面上下文
export interface PageContext {
  url: string;                 // 当前页面URL
  title: string;               // 页面标题
  viewport: {                  // 视口信息
    width: number;
    height: number;
  };
}

// 编辑上下文
export interface EditContext {
  instruction: string;         // 用户的原始指令
  component: ComponentInfo;    // 目标组件信息
  context: ProjectContext;     // 项目上下文
  pageContext: PageContext;    // 页面上下文
  timestamp: number;           // 请求时间戳
}

// MCP消息类型
export enum MessageType {
  COMPONENT_EDIT_REQUEST = 'component_edit_request',
  EDIT_COMPLETE = 'edit_complete',
  COMPONENT_CHANGED = 'component_changed',
  ERROR = 'error',
  RESPONSE = 'response'
}

// MCP消息基础结构
export interface MCPMessage {
  id: string;
  type: MessageType;
  payload: any;
  timestamp: number;
}

// 组件编辑请求
export interface ComponentEditRequest {
  instruction: string;
  component: ComponentInfo;
  context: ProjectContext;
  pageContext: PageContext;
}

// 编辑完成通知
export interface EditCompleteNotification {
  editId: string;
  success: boolean;
  message?: string;
  changes?: string[];
}

// 组件变更通知
export interface ComponentChangedNotification {
  componentId: string;
  changeType: 'added' | 'modified' | 'removed';
  component?: ComponentInfo;
}

// MCP响应
export interface MCPResponse {
  success: boolean;
  message?: string;
  data?: any;
}

// 服务器配置
export interface ServerConfig {
  port: number;
  host: string;
  corsOrigins: string[];
  maxConnections: number;
  enableLogging: boolean;
}

// 客户端连接信息
export interface ClientConnection {
  id: string;
  socket: any;
  connectedAt: Date;
  lastActivity: Date;
  metadata?: Record<string, any>;
}