import { ref, onUnmounted } from 'vue'

type EventCallback = (...args: any[]) => void
type EventMap = Map<string, Set<EventCallback>>

// 全局事件总线
const globalEventBus: EventMap = new Map()

/**
 * 事件模块 - 极简实现
 * 支持事件注册、发送、自动清理
 */
export function useEvent() {
  // 当前组件注册的事件监听器
  const listeners = ref<Array<{ event: string; callback: EventCallback }>>([])

  /**
   * 注册事件监听
   */
  const on = (event: string, callback: EventCallback) => {
    if (!globalEventBus.has(event)) {
      globalEventBus.set(event, new Set())
    }
    globalEventBus.get(event)!.add(callback)
    listeners.value.push({ event, callback })
  }

  /**
   * 发送事件
   */
  const emit = (event: string, ...args: any[]) => {
    const callbacks = globalEventBus.get(event)
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(...args)
        } catch (error) {
          console.error(`Event '${event}' callback error:`, error)
        }
      })
    }
  }

  /**
   * 移除事件监听
   */
  const off = (event: string, callback?: EventCallback) => {
    const callbacks = globalEventBus.get(event)
    if (callbacks) {
      if (callback) {
        callbacks.delete(callback)
      } else {
        callbacks.clear()
      }
    }
  }

  /**
   * 一次性事件监听
   */
  const once = (event: string, callback: EventCallback) => {
    const onceCallback = (...args: any[]) => {
      callback(...args)
      off(event, onceCallback)
    }
    on(event, onceCallback)
  }

  // 组件卸载时自动清理事件监听
  onUnmounted(() => {
    listeners.value.forEach(({ event, callback }) => {
      off(event, callback)
    })
    listeners.value = []
  })

  return {
    on,
    emit,
    off,
    once
  }
}

// 全局事件工具函数
export const globalEvent = {
  emit: (event: string, ...args: any[]) => {
    const callbacks = globalEventBus.get(event)
    if (callbacks) {
      callbacks.forEach(callback => callback(...args))
    }
  },
  clear: () => {
    globalEventBus.clear()
  }
}