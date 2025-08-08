import {
  ref,
  onUnmounted,
  inject,
  provide,
  InjectionKey,
  onBeforeUnmount,
} from 'vue';

type EventCallback = (...args: any[]) => void;
type EventMap = Map<string, Set<EventCallback>>;

// 校验结果类型
export type ValidationResult = {
  moduleId: string;
  error: any;
} | void;

// 校验函数类型
export type ValidationFunction = () => Promise<ValidationResult>;

// 事件总线实例类型
interface EventBusInstance {
  eventBus: EventMap;
  validationRegistry: Map<string, ValidationFunction>;
}

// 注入键
export const EVENT_BUS_KEY: InjectionKey<EventBusInstance> = Symbol('eventBus');

// 创建事件总线实例
const createEventBusInstance = (): EventBusInstance => ({
  eventBus: new Map(),
  validationRegistry: new Map(),
});

/**
 * 滚动到指定元素
 * @param selector 选择器或元素ID
 * @param options 滚动选项
 */
export const scrollTo = (
  selector: string,
  options?: {
    duration?: number;
    easing?: string;
    offset?: number;
    behavior?: ScrollBehavior;
  }
) => {
  const defaultOptions = {
    duration: 500,
    offset: 0,
    behavior: 'smooth' as ScrollBehavior,
    ...options,
  };

  // 如果selector不是以#开头，则添加#前缀
  const targetSelector = selector.startsWith('#') ? selector : `#${selector}`;

  try {
    const element = document.querySelector(targetSelector);
    if (element) {
      element.scrollIntoView({
        behavior: defaultOptions.behavior,
        block: 'start',
      });
    } else {
      console.warn(`Element not found: ${targetSelector}`);
    }
  } catch (error) {
    console.error(`Failed to scroll to element: ${targetSelector}`, error);
  }
};

/**
 * 事件模块 - 极简实现
 * 支持事件注册、发送、自动清理
 */
export function useEvent() {
  // 注入事件总线实例，必须在useEventBusProvider的作用域内使用
  const instance = inject(EVENT_BUS_KEY);
  if (!instance) {
    throw new Error(
      'useEvent must be used within a component that has useEventBusProvider in its parent chain'
    );
  }
  const { eventBus, validationRegistry } = instance;

  // 当前组件注册的事件监听器
  const listeners = ref<Array<{ event: string; callback: EventCallback }>>([]);
  // 当前组件注册的校验函数
  const validations = ref<
    Array<{ moduleId: string; validationFn: ValidationFunction }>
  >([]);

  /**
   * 注册事件监听
   */
  const on = (event: string, callback: EventCallback) => {
    if (!eventBus.has(event)) {
      eventBus.set(event, new Set());
    }
    eventBus.get(event)!.add(callback);
    listeners.value.push({ event, callback });
  };

  /**
   * 发送事件
   */
  const emit = (event: string, ...args: any[]) => {
    const callbacks = eventBus.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(...args);
        } catch (error) {
          console.error(`Event '${event}' callback error:`, error);
        }
      });
    }
  };

  /**
   * 移除事件监听
   */
  const off = (event: string, callback?: EventCallback) => {
    const callbacks = eventBus.get(event);
    if (callbacks) {
      if (callback) {
        callbacks.delete(callback);
      } else {
        callbacks.clear();
      }
    }
  };

  /**
   * 注册模块校验函数
   */
  const registerValidation = (
    moduleId: string,
    validationFn: ValidationFunction
  ) => {
    validationRegistry.set(moduleId, validationFn);
    validations.value.push({ moduleId, validationFn });
  };

  /**
   * 一次性事件监听
   */
  const once = (event: string, callback: EventCallback) => {
    const onceCallback = (...args: any[]) => {
      callback(...args);
      off(event, onceCallback);
    };
    on(event, onceCallback);
  };

  // 组件卸载时自动清理事件监听和校验注册
  onUnmounted(() => {
    listeners.value.forEach(({ event, callback }) => {
      off(event, callback);
    });
    listeners.value = [];

    // 清理校验注册
    validations.value.forEach(({ moduleId }) => {
      validationRegistry.delete(moduleId);
    });
    validations.value = [];
  });

  return {
    on,
    emit,
    off,
    once,
    registerValidation,
    scrollTo,
  };
}

/**
 * 创建事件总线提供者
 * 在父组件中使用，为子组件提供独立的事件总线实例
 */
export const useEventBusProvider = () => {
  // 使用 ref 来持久化实例，避免组件重新渲染时创建新实例
  const instance = ref<EventBusInstance>();

  // 只在首次创建时初始化
  if (!instance.value) {
    instance.value = createEventBusInstance();
  }
  provide(EVENT_BUS_KEY, instance.value);

  // 组件卸载时清理实例
  onBeforeUnmount(() => {
    if (instance.value) {
      instance.value.eventBus.clear();
      instance.value.validationRegistry.clear();
    }
  });

  return {
    /**
     * 发送事件到当前实例
     */
    emit: (event: string, ...args: any[]) => {
      const callbacks = instance.value!.eventBus.get(event);
      if (callbacks) {
        callbacks.forEach((callback) => callback(...args));
      }
    },
    /**
     * 清空当前实例的所有事件和校验
     */
    clear: () => {
      instance.value!.eventBus.clear();
      instance.value!.validationRegistry.clear();
    },
    /**
     * 校验当前实例的所有已注册模块
     */
    validateAll: async (): Promise<ValidationResult[]> => {
      const results: ValidationResult[] = [];

      for (const [
        moduleId,
        validationFn,
      ] of instance.value!.validationRegistry.entries()) {
        try {
          await validationFn();
        } catch (error: any) {
          // 捕获错误并添加到结果中
          results.push({
            moduleId,
            error: error,
          });
        }
      }

      return results;
    },
    scrollTo,
  };
};
