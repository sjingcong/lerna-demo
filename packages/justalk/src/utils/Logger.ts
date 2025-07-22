/**
 * Logger Utility
 * 提供统一的日志记录功能
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export class Logger {
  private enabled: boolean;
  private level: LogLevel;
  private prefix: string;

  constructor(enabled: boolean = true, level: LogLevel = LogLevel.INFO, prefix: string = '[JusTalk MCP]') {
    this.enabled = enabled;
    this.level = level;
    this.prefix = prefix;
  }

  /**
   * 调试日志
   */
  public debug(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(this.formatMessage('DEBUG', message), ...args);
    }
  }

  /**
   * 信息日志
   */
  public info(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage('INFO', message), ...args);
    }
  }

  /**
   * 警告日志
   */
  public warn(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage('WARN', message), ...args);
    }
  }

  /**
   * 错误日志
   */
  public error(message: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.formatMessage('ERROR', message), ...args);
    }
  }

  /**
   * 判断是否应该记录日志
   */
  private shouldLog(level: LogLevel): boolean {
    return this.enabled && level >= this.level;
  }

  /**
   * 格式化日志消息
   */
  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `${this.prefix} [${timestamp}] [${level}] ${message}`;
  }

  /**
   * 设置日志级别
   */
  public setLevel(level: LogLevel): void {
    this.level = level;
  }

  /**
   * 启用/禁用日志
   */
  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * 创建子日志器
   */
  public createChild(prefix: string): Logger {
    return new Logger(this.enabled, this.level, `${this.prefix}:${prefix}`);
  }
}