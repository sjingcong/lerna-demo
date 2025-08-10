import { BasePlugin } from '../core/base-plugin';
import { ResourceData } from '../types';

export class ResourcePlugin extends BasePlugin {
  readonly name = 'resource';
  private observer: PerformanceObserver | null = null;
  private processedResources = new Set<string>();

  protected init(): void {
    if (this.tracker && (this.tracker as any).config?.enableConsole) {
      console.group('📦 [Resource Plugin] 初始化资源监控');
      console.log('🚀 开始设置性能观察器');
    }
    this.setupPerformanceObserver();
    this.processExistingResources();
    if (this.tracker && (this.tracker as any).config?.enableConsole) {
      console.groupEnd();
    }
  }

  protected cleanup(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.processedResources.clear();
  }

  private setupPerformanceObserver(): void {
    if (!window.PerformanceObserver) {
      console.warn('PerformanceObserver not supported');
      return;
    }

    try {
      this.observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'resource') {
            this.processResourceEntry(entry as PerformanceResourceTiming);
          }
        });
      });

      this.observer.observe({ entryTypes: ['resource'] });
    } catch (e) {
      console.warn('Failed to setup PerformanceObserver:', e);
    }
  }

  private processExistingResources(): void {
    if (!window.performance || !window.performance.getEntriesByType) {
      return;
    }

    const resources = window.performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    resources.forEach((entry) => {
      this.processResourceEntry(entry);
    });
  }

  private processResourceEntry(entry: PerformanceResourceTiming): void {
    // 避免重复处理同一资源，只用URL作为key
    const resourceKey = entry.name;
    if (this.processedResources.has(resourceKey)) {
      return;
    }
    this.processedResources.add(resourceKey);

    const resourceData: ResourceData = {
      url: entry.name,
      type: this.getResourceType(entry),
      duration: entry.duration,
      size: entry.transferSize || entry.encodedBodySize || 0,
      status: entry.responseEnd > 0 ? 'success' : 'error'
    };

    // 只记录有意义的资源（排除data URL等）
    if (this.shouldTrackResource(entry.name)) {
      if (this.tracker && (this.tracker as any).config?.enableConsole) {
        console.group(`📦 [Resource Plugin] ${resourceData.type} 资源加载完成`);
        console.log('📍 资源地址:', resourceData.url);
        console.log('⏱️ 加载耗时:', `${resourceData.duration.toFixed(2)}ms`);
        console.log('📊 资源大小:', `${(resourceData.size / 1024).toFixed(2)}KB`);
        console.log('✅ 加载状态:', resourceData.status === 'success' ? '成功' : '失败');
        console.groupEnd();
      }
      this.track('resource-load', resourceData);
    }
  }

  private getResourceType(entry: PerformanceResourceTiming): string {
    // 根据initiatorType确定资源类型
    if (entry.initiatorType) {
      return entry.initiatorType;
    }

    // 根据URL扩展名推断类型
    const url = entry.name.toLowerCase();
    if (url.includes('.js')) return 'script';
    if (url.includes('.css')) return 'link';
    if (url.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) return 'img';
    if (url.match(/\.(woff|woff2|ttf|eot)$/)) return 'font';
    if (url.includes('.json')) return 'fetch';
    
    return 'other';
  }

  private shouldTrackResource(url: string): boolean {
    // 排除不需要监控的资源
    if (url.startsWith('data:')) return false;
    if (url.startsWith('blob:')) return false;
    if (url.includes('chrome-extension://')) return false;
    if (url.includes('moz-extension://')) return false;
    
    // 排除tracker自己的上报请求，避免循环监控
    if (this.tracker && (this.tracker as any).config?.endpoint) {
      const endpoint = (this.tracker as any).config.endpoint;
      if (url.includes(endpoint) || url.startsWith(endpoint)) {
        return false;
      }
    }
    
    return true;
  }
}