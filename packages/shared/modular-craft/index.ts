// ModularCraft 核心模块统一导出

// 事件模块
export {
  useEvent,
  useEventBusProvider,
  EVENT_BUS_KEY,
  type ValidationResult,
  type ValidationFunction,
} from './useEvent';

// Store模块
export {
  useStore,
  useModuleData,
  useModuleStore,
  useCommonData,
  CRAFT_STORE_KEY,
  type ModuleData,
  type ModuleDataProcessor,
} from './useStore';

// 配置组件
export {
  default as CraftConfig,
  type CraftConfigExpose,
} from './CraftConfig.vue';

// 渲染组件
export { default as Render } from './Render.vue';

// 列表模块
export { default as ListModule } from './ListModule.vue';

// 选项卡模块
export { default as TabModule } from './TabModule.vue';
