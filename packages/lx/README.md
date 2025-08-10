# LX 前端埋点SDK

一个轻量级、可扩展的前端埋点SDK，采用插件化架构设计，支持多种埋点场景。

## 特性

- 🔌 **插件化架构** - 核心功能与埋点模块解耦，支持按需加载
- 📊 **多种埋点类型** - 支持JS错误、API请求、资源加载等监控
- 🚀 **高性能** - 批量上报、异步处理，不影响页面性能
- 🛡️ **兼容性强** - 支持IE11+，使用TypeScript开发
- ⚙️ **配置灵活** - 丰富的配置选项，满足不同场景需求

## 安装

```bash
npm install @your-org/lx
# 或
yarn add @your-org/lx
```

## 快速开始

```typescript
import { Tracker, JSErrorPlugin, APIPlugin, ResourcePlugin } from '@your-org/lx';

// 创建埋点实例
const tracker = new Tracker({
  endpoint: 'https://api.example.com/track',
  batchSize: 10,
  flushInterval: 5000,
  enableConsole: true
});

// 安装插件
tracker
  .use(new JSErrorPlugin())
  .use(new APIPlugin())
  .use(new ResourcePlugin());

// 手动埋点
tracker.track('page-view', {
  page: '/home',
  title: '首页'
});
```

## 配置选项

```typescript
interface TrackerConfig {
  endpoint?: string;        // 上报接口地址
  batchSize?: number;       // 批量上报数量，默认10
  flushInterval?: number;   // 上报间隔（毫秒），默认5000
  enableConsole?: boolean;  // 是否开启控制台输出，默认false
  userId?: string;          // 用户ID
  sessionId?: string;       // 会话ID
  extra?: Record<string, any>; // 额外参数
}
```

## 内置插件

### JSErrorPlugin - JS错误监控

自动捕获并上报：
- JavaScript运行时错误
- Promise未捕获的拒绝
- 资源加载错误

```typescript
tracker.use(new JSErrorPlugin());
```

### APIPlugin - API请求监控

自动监控：
- XMLHttpRequest请求
- Fetch API请求
- 请求耗时、状态码、数据大小等

```typescript
tracker.use(new APIPlugin());
```

### ResourcePlugin - 资源加载监控

基于Performance API监控：
- 静态资源加载性能
- 资源类型、大小、耗时等

```typescript
tracker.use(new ResourcePlugin());
```

## 自定义插件

```typescript
import { BasePlugin } from '@your-org/lx';

class CustomPlugin extends BasePlugin {
  readonly name = 'custom';

  protected init(): void {
    // 插件初始化逻辑
    this.addEventListener(window, 'click', this.handleClick.bind(this));
  }

  private handleClick(event: MouseEvent): void {
    this.track('click', {
      x: event.clientX,
      y: event.clientY,
      target: (event.target as Element)?.tagName
    });
  }

  protected cleanup(): void {
    // 插件清理逻辑（可选）
  }
}

// 使用自定义插件
tracker.use(new CustomPlugin());
```

## API文档

### Tracker

#### 方法

- `use(plugin: Plugin)` - 安装插件
- `unuse(pluginName: string)` - 卸载插件
- `track(type: string, data?: Record<string, any>)` - 记录事件
- `flush()` - 立即上报所有事件
- `destroy()` - 销毁实例

### BasePlugin

#### 抽象方法

- `name: string` - 插件名称
- `init(): void` - 插件初始化

#### 工具方法

- `addEventListener()` - 添加事件监听器（自动管理）
- `track()` - 记录事件的便捷方法
- `cleanup()` - 清理逻辑（可选实现）

## 事件数据格式

所有事件都包含以下基础字段：

```typescript
interface TrackEvent {
  type: string;           // 事件类型
  data: Record<string, any>; // 事件数据
  timestamp: number;      // 时间戳
  url: string;           // 当前页面URL
  userAgent: string;     // 用户代理
}
```

## 浏览器兼容性

- Chrome 49+
- Firefox 45+
- Safari 10+
- Edge 12+
- IE 11+

## 许可证

MIT License