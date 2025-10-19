export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  PROCESS = 'process'
}

export enum ProcessStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  SUCCESS = 'success',
  FAILED = 'failed'
}

export interface ProcessStep {
  id: string
  name: string
  status: ProcessStatus
  result?: string
  detail?: string
}

export interface Message {
  id: string;
  content: string;
  type: MessageType;
  isUser: boolean;
  time: number;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  // 复杂问题处理流程相关
  processId?: string;
  processStatus?: ProcessStatus;
  stepsPreview?: ProcessStep[];
  linkPath?: string;
}