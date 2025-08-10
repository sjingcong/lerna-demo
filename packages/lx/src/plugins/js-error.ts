import { BasePlugin } from '../core/base-plugin';
import { JSErrorData } from '../types';

export class JSErrorPlugin extends BasePlugin {
  readonly name = 'js-error';

  protected init(): void {
    this.setupErrorHandlers();
  }

  private setupErrorHandlers(): void {
    // 监听全局JS错误
    this.addEventListener(window, 'error', (event: ErrorEvent) => {
      this.handleJSError(event);
    });

    // 监听Promise未捕获的拒绝
    this.addEventListener(window, 'unhandledrejection', (event: Event) => {
      this.handlePromiseError(event as PromiseRejectionEvent);
    });

    // 监听资源加载错误
    this.addEventListener(window, 'error', (event: Event) => {
      this.handleResourceError(event);
    }, true); // 使用捕获阶段
  }

  private handleJSError(event: ErrorEvent): void {
    const errorData: JSErrorData = {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack,
      errorType: 'js'
    };

    if (this.tracker && (this.tracker as any).config?.enableConsole) {
      console.group('🚨 [JS Error Plugin] JavaScript 错误');
      console.error('❌ 错误信息:', event.message);
      console.log('📍 错误位置:', {
        文件: event.filename || '未知',
        行号: event.lineno || 0,
        列号: event.colno || 0
      });
      if (event.error?.stack) {
        console.log('📚 错误堆栈:', event.error.stack);
      }
      console.groupEnd();
    }

    this.track('js-error', errorData);
  }

  private handlePromiseError(event: Event): void {
    const promiseEvent = event as PromiseRejectionEvent;
    const reason = promiseEvent.reason;
    let errorData: JSErrorData;

    if (reason instanceof Error) {
      errorData = {
        message: reason.message,
        filename: '',
        lineno: 0,
        colno: 0,
        stack: reason.stack,
        errorType: 'promise'
      };
    } else {
      errorData = {
        message: String(reason),
        filename: '',
        lineno: 0,
        colno: 0,
        errorType: 'promise'
      };
    }

    if (this.tracker && (this.tracker as any).config?.enableConsole) {
      console.group('🚨 [JS Error Plugin] Promise 拒绝');
      console.error('❌ 拒绝原因:', reason);
      console.log('🔍 错误类型:', reason instanceof Error ? 'Error 对象' : typeof reason);
      if (reason instanceof Error && reason.stack) {
        console.log('📚 错误堆栈:', reason.stack);
      }
      console.groupEnd();
    }

    this.track('promise-error', errorData);
  }

  private handleResourceError(event: Event): void {
    const target = event.target as HTMLElement;
    
    // 只处理资源加载错误（img, script, link等）
    if (target && target instanceof HTMLElement && (target as any).src) {
      const errorData: JSErrorData = {
        message: `Resource load error: ${(target as any).src}`,
        filename: (target as any).src || '',
        lineno: 0,
        colno: 0,
        errorType: 'resource'
      };

      if (this.tracker && (this.tracker as any).config?.enableConsole) {
        console.group('🚨 [JS Error Plugin] 资源加载错误');
        console.error('❌ 资源加载失败:', (target as any).src);
        console.log('🏷️ 元素标签:', target.tagName.toLowerCase());
        console.log('📍 元素属性:', {
          id: target.id || '无',
          className: target.className || '无',
          src: (target as any).src
        });
        console.groupEnd();
      }

      this.track('resource-error', errorData);
    }
  }
}