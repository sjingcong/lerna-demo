import { Tracker, JSErrorPlugin, APIPlugin, ResourcePlugin } from './index';

// 创建埋点实例
const tracker = new Tracker({
  endpoint: 'https://api.example.com/track', // 上报接口
  batchSize: 5, // 批量上报数量
  flushInterval: 3000, // 3秒上报一次
  enableConsole: true, // 开启控制台日志
  userId: 'user123',
  sessionId: 'session456',
  extra: {
    appVersion: '1.0.0',
    platform: 'web'
  }
});

// 安装插件
tracker
  .use(new JSErrorPlugin()) // JS错误监控
  .use(new APIPlugin()) // API请求监控
  .use(new ResourcePlugin()); // 资源加载监控

// 手动埋点示例
tracker.track('page-view', {
  page: '/home',
  title: '首页'
});

tracker.track('button-click', {
  buttonId: 'submit-btn',
  buttonText: '提交'
});

tracker.track('user-action', {
  action: 'scroll',
  position: 100
});

// 页面卸载时清理
window.addEventListener('beforeunload', () => {
  tracker.destroy();
});

// 导出实例供全局使用
(window as any).tracker = tracker;

export default tracker;