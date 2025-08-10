import { Plugin } from '../types';
import { Tracker } from './tracker';

export abstract class BasePlugin implements Plugin {
  abstract readonly name: string;
  protected tracker: Tracker | null = null;
  protected listeners: Array<{ target: any; event: string; handler: any }> = [];

  install(tracker: Tracker): void {
    this.tracker = tracker;
    this.init();
  }

  uninstall(): void {
    this.cleanup();
    this.removeAllListeners();
    this.tracker = null;
  }

  // 子类需要实现的初始化方法
  protected abstract init(): void;

  // 子类可选实现的清理方法
  protected cleanup(): void {
    // 默认空实现
  }

  // 添加事件监听器（自动管理）
  protected addEventListener(
    target: EventTarget | Window | Document,
    event: string,
    handler: EventListener,
    options?: boolean | AddEventListenerOptions
  ): void {
    target.addEventListener(event, handler, options);
    this.listeners.push({ target, event, handler });
  }

  // 移除所有事件监听器
  private removeAllListeners(): void {
    this.listeners.forEach(({ target, event, handler }) => {
      target.removeEventListener(event, handler);
    });
    this.listeners = [];
  }

  // 记录事件的便捷方法
  protected track(type: string, data: Record<string, any> = {}): void {
    if (this.tracker) {
      this.tracker.track(type, data);
    }
  }
}