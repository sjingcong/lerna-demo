import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 使用 Composition API 风格
export const useCounterStore = defineStore('counter', () => {
  // 状态
  const count = ref(0)
  const name = ref('Pinia Store')

  // 计算属性
  const doubleCount = computed(() => count.value * 2)

  // 方法
  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  function reset() {
    count.value = 0
  }

  function updateName(newName: string) {
    name.value = newName
  }

  return {
    count,
    name,
    doubleCount,
    increment,
    decrement,
    reset,
    updateName
  }
})