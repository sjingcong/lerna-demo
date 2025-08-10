import { TrackerConfig, TrackEvent, Plugin } from '../types';

export class Tracker {
  private config: TrackerConfig;
  private plugins: Map<string, Plugin> = new Map();
  private eventQueue: TrackEvent[] = [];
  private timer: number | null = null;

  constructor(config: TrackerConfig = {}) {
    this.config = {
      batchSize: 10,
      flushInterval: 5000,
      enableConsole: false,
      ...config
    };
    
    this.startTimer();
  }

  // 安装插件
  use(plugin: Plugin): this {
    if (this.plugins.has(plugin.name)) {
      console.warn(`⚠️ [LX Tracker] 插件 ${plugin.name} 已经安装过了`);
      return this;
    }
    
    this.plugins.set(plugin.name, plugin);
    plugin.install(this);
    
    if (this.config.enableConsole) {
      console.group(`🔌 [LX Tracker] 插件安装`);
      console.log(`✅ 插件名称: ${plugin.name}`);
      console.log(`📋 当前已安装插件:`, Array.from(this.plugins.keys()));
      console.log(`⚙️ 插件总数: ${this.plugins.size}`);
      console.groupEnd();
    }
    
    return this;
  }

  // 卸载插件
  unuse(pluginName: string): this {
    const plugin = this.plugins.get(pluginName);
    if (plugin) {
      if (plugin.uninstall) {
        plugin.uninstall();
      }
      this.plugins.delete(pluginName);
      
      if (this.config.enableConsole) {
        console.group(`🔌 [LX Tracker] 插件卸载`);
        console.log(`❌ 已卸载插件: ${pluginName}`);
        console.log(`📋 剩余已安装插件:`, Array.from(this.plugins.keys()));
        console.log(`⚙️ 插件总数: ${this.plugins.size}`);
        console.groupEnd();
      }
    } else {
      if (this.config.enableConsole) {
        console.warn(`⚠️ [LX Tracker] 插件 ${pluginName} 未找到，无法卸载`);
      }
    }
    
    return this;
  }

  // 记录事件
  track(type: string, data: Record<string, any> = {}): void {
    const event: TrackEvent = {
      type,
      data,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // 添加用户和会话信息
    if (this.config.userId) {
      event.data.userId = this.config.userId;
    }
    if (this.config.sessionId) {
      event.data.sessionId = this.config.sessionId;
    }
    if (this.config.extra) {
      Object.assign(event.data, this.config.extra);
    }

    this.eventQueue.push(event);
    
    if (this.config.enableConsole) {
      console.group(`🎯 [LX Tracker] ${type}`);
      console.log('📊 事件详情:', {
        类型: type,
        时间戳: new Date(event.timestamp).toLocaleString(),
        页面URL: event.url,
        数据: event.data
      });
      console.log('📈 队列状态:', {
        当前队列长度: this.eventQueue.length,
        批量上报阈值: this.config.batchSize,
        距离上报还需: (this.config.batchSize || 10) - this.eventQueue.length,
        下次定时上报: `${Math.ceil((this.config.flushInterval || 5000) / 1000)}秒后`
      });
      console.log('🔧 已安装插件:', Array.from(this.plugins.keys()));
      console.groupEnd();
    }

    // 检查是否需要立即上报
    if (this.eventQueue.length >= (this.config.batchSize || 10)) {
      this.flush();
    }
  }

  // 立即上报所有事件
  flush(): void {
    if (this.eventQueue.length === 0) {
      if (this.config.enableConsole) {
        console.log('📤 [LX Tracker] 队列为空，无需上报');
      }
      return;
    }

    const events = this.eventQueue.splice(0);
    
    if (this.config.enableConsole) {
      console.group('📤 [LX Tracker] 批量上报事件');
      console.log(`📊 上报事件数量: ${events.length}`);
      console.log('📋 事件列表:', events.map(e => ({
        类型: e.type,
        时间: new Date(e.timestamp).toLocaleString(),
        数据大小: JSON.stringify(e.data).length + ' 字符'
      })));
      console.log(`🌐 上报地址: ${this.config.endpoint || '未配置'}`);
      console.groupEnd();
    }
    
    this.send(events);
  }

  // 发送事件到服务器
  private send(events: TrackEvent[]): void {
    if (!this.config.endpoint) {
      if (this.config.enableConsole) {
        console.group('⚠️ [LX Tracker] 上报失败');
        console.warn('❌ 未配置上报地址 (endpoint)');
        console.log('📋 待上报事件:', events);
        console.log('💡 提示: 请在初始化时配置 endpoint 参数');
        console.groupEnd();
      }
      return;
    }

    // 使用 sendBeacon 或 fetch 发送数据
    const data = JSON.stringify({ events });
    const dataSize = new Blob([data]).size;
    
    if (this.config.enableConsole) {
      console.group('🚀 [LX Tracker] 发送数据');
      console.log(`📦 数据大小: ${dataSize} 字节`);
      console.log(`🔧 发送方式: ${navigator.sendBeacon ? 'sendBeacon' : 'fetch'}`);
      console.log('📄 发送内容:', { events });
    }
    
    if (navigator.sendBeacon) {
      const success = navigator.sendBeacon(this.config.endpoint, data);
      if (this.config.enableConsole) {
        console.log(`📡 sendBeacon 结果: ${success ? '✅ 成功' : '❌ 失败'}`);
        console.groupEnd();
      }
    } else {
      fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: data,
        keepalive: true
      })
      .then(response => {
        if (this.config.enableConsole) {
          console.log(`📡 fetch 响应: ${response.status} ${response.statusText}`);
          console.groupEnd();
        }
      })
      .catch(error => {
        if (this.config.enableConsole) {
          console.error('❌ 发送失败:', error);
          console.groupEnd();
        }
      });
    }
  }

  // 启动定时器
  private startTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
    
    this.timer = window.setInterval(() => {
      this.flush();
    }, this.config.flushInterval || 5000);
  }

  // 销毁实例
  destroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    
    // 卸载所有插件
    this.plugins.forEach((plugin, name) => {
      this.unuse(name);
    });
    
    // 上报剩余事件
    this.flush();
  }
}