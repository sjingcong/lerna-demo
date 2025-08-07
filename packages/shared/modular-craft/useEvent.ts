import { ref, onUnmounted } from 'vue';

type EventCallback = (...args: any[]) => void;
type EventMap = Map<string, Set<EventCallback>>;

// 全局事件总线
const globalEventBus: EventMap = new Map();

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
  // 当前组件注册的事件监听器
  const listeners = ref<Array<{ event: string; callback: EventCallback }>>([]);

  /**
   * 注册事件监听
   */
  const on = (event: string, callback: EventCallback) => {
    if (!globalEventBus.has(event)) {
      globalEventBus.set(event, new Set());
    }
    globalEventBus.get(event)!.add(callback);
    listeners.value.push({ event, callback });
  };

  /**
   * 发送事件
   */
  const emit = (event: string, ...args: any[]) => {
    const callbacks = globalEventBus.get(event);
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
    const callbacks = globalEventBus.get(event);
    if (callbacks) {
      if (callback) {
        callbacks.delete(callback);
      } else {
        callbacks.clear();
      }
    }
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

  // 组件卸载时自动清理事件监听
  onUnmounted(() => {
    listeners.value.forEach(({ event, callback }) => {
      off(event, callback);
    });
    listeners.value = [];
  });

  return {
    on,
    emit,
    off,
    once,
    scrollTo,
  };
}

// 全局事件工具函数
export const globalEvent = {
  emit: (event: string, ...args: any[]) => {
    const callbacks = globalEventBus.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(...args));
    }
  },
  clear: () => {
    globalEventBus.clear();
  },
  scrollTo,
};
