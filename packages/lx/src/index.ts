// 前端埋点SDK - 插件化架构

export { Tracker } from './core/tracker';
export { BasePlugin } from './core/base-plugin';
export { JSErrorPlugin } from './plugins/js-error';
export { APIPlugin } from './plugins/api';
export { ResourcePlugin } from './plugins/resource';
export type { TrackerConfig, TrackEvent, Plugin } from './types';