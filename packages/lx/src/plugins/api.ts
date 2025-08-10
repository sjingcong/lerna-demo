import { BasePlugin } from '../core/base-plugin';
import { APIData } from '../types';

export class APIPlugin extends BasePlugin {
  readonly name = 'api';
  private originalXHR: typeof XMLHttpRequest;
  private originalFetch: typeof fetch;

  protected init(): void {
    this.originalXHR = window.XMLHttpRequest;
    this.originalFetch = window.fetch;
    
    this.interceptXHR();
    this.interceptFetch();
  }

  protected cleanup(): void {
    // 恢复原始方法
    window.XMLHttpRequest = this.originalXHR;
    window.fetch = this.originalFetch;
  }

  private interceptXHR(): void {
    const self = this;
    
    window.XMLHttpRequest = function() {
      const xhr = new self.originalXHR();
      const startTime = Date.now();
      let method = '';
      let url = '';

      // 拦截open方法
      const originalOpen = xhr.open;
      xhr.open = function(m: string, u: string | URL, ...args: any[]) {
        method = m;
        url = u.toString();
        return originalOpen.apply(this, [m, u, ...args]);
      };

      // 拦截send方法
      const originalSend = xhr.send;
      xhr.send = function(body?: any) {
        const requestSize = body ? new Blob([body]).size : 0;
        
        if (self.tracker && (self.tracker as any).config?.enableConsole) {
          console.group(`🌐 [API Plugin] ${method} XHR 请求开始`);
          console.log('📍 请求地址:', url);
          console.log('⏰ 开始时间:', new Date(startTime).toLocaleTimeString());
          if (body) {
            console.log('📦 请求体:', body);
          }
        }
        
        // 监听状态变化
        xhr.addEventListener('loadend', () => {
          const duration = Date.now() - startTime;
          const responseSize = xhr.responseText ? new Blob([xhr.responseText]).size : 0;
          const success = xhr.status >= 200 && xhr.status < 300;
          
          if (self.tracker && (self.tracker as any).config?.enableConsole) {
            if (success) {
              console.log(`✅ 响应状态: ${xhr.status} ${xhr.statusText}`);
            } else {
              console.error(`❌ 响应状态: ${xhr.status} ${xhr.statusText}`);
            }
            console.log(`⏱️ 请求耗时: ${duration}ms`);
            console.log('📊 响应大小:', xhr.getResponseHeader('content-length') || responseSize + ' bytes');
            console.groupEnd();
          }
          
          const apiData: APIData = {
            url,
            method,
            status: xhr.status,
            duration,
            requestSize,
            responseSize
          };

          self.track('api-request', apiData);
        });

        return originalSend.apply(this, [body]);
      };

      return xhr;
    } as any;
  }

  private interceptFetch(): void {
    const self = this;
    
    window.fetch = function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
      const startTime = Date.now();
      const url = input instanceof Request ? input.url : input.toString();
      const method = (init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();
      
      let requestSize = 0;
      if (init?.body) {
        if (typeof init.body === 'string') {
          requestSize = new Blob([init.body]).size;
        } else if (init.body instanceof FormData || init.body instanceof URLSearchParams) {
          requestSize = new Blob([init.body.toString()]).size;
        }
      }

      if (self.tracker && (self.tracker as any).config?.enableConsole) {
        console.group(`🌐 [API Plugin] ${method} 请求开始`);
        console.log('📍 请求地址:', url);
        console.log('⏰ 开始时间:', new Date(startTime).toLocaleTimeString());
        if (init?.body) {
          console.log('📦 请求体:', init.body);
        }
        if (init?.headers) {
          console.log('📋 请求头:', init.headers);
        }
      }

      return self.originalFetch.apply(window, [input, init])
        .then(async (response) => {
          const duration = Date.now() - startTime;
          
          // 克隆响应以获取大小（避免消费原始响应）
          const clonedResponse = response.clone();
          let responseSize = 0;
          try {
            const text = await clonedResponse.text();
            responseSize = new Blob([text]).size;
          } catch (e) {
            // 忽略错误，某些响应可能无法读取
          }

          if (self.tracker && (self.tracker as any).config?.enableConsole) {
            console.log(`✅ 响应状态: ${response.status} ${response.statusText}`);
            console.log(`⏱️ 请求耗时: ${duration}ms`);
            console.log('📊 响应大小:', response.headers.get('content-length') || responseSize + ' bytes');
            console.groupEnd();
          }

          const apiData: APIData = {
            url,
            method,
            status: response.status,
            duration,
            requestSize,
            responseSize
          };

          self.track('api-request', apiData);
          return response;
        })
        .catch((error) => {
          const duration = Date.now() - startTime;
          
          if (self.tracker && (self.tracker as any).config?.enableConsole) {
            console.error(`❌ 请求失败: ${error instanceof Error ? error.message : String(error)}`);
            console.log(`⏱️ 失败耗时: ${duration}ms`);
            console.groupEnd();
          }
          
          const apiData: APIData = {
            url,
            method,
            status: 0, // 网络错误
            duration,
            requestSize
          };

          self.track('api-error', apiData);
          throw error;
        });
    };
  }
}