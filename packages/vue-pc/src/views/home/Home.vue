<template>
  <div class="home">
    <h1>{{ msg }}</h1>
    
    <!-- Pinia Store 使用示例 -->
    <div class="pinia-demo">
      <h2>Pinia Store Demo</h2>
      <p>Store Name: {{ counterStore.name }}</p>
      <p>Count: {{ counterStore.count }}</p>
      <p>Double Count: {{ counterStore.doubleCount }}</p>
      
      <div class="buttons">
        <button @click="counterStore.increment()">+1</button>
        <button @click="counterStore.decrement()">-1</button>
        <button @click="counterStore.reset()">Reset</button>
      </div>
      
      <div class="input-section">
        <input 
          v-model="newName" 
          placeholder="输入新的store名称"
          @keyup.enter="updateStoreName"
        />
        <button @click="updateStoreName">更新名称</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCounterStore } from '@/stores/counter'
import { usePreload } from '@giom/shared/hooks/usePreload'
usePreload([
  {
    name: 'About页面',
    importer: () => import('@/views/about/About.vue'),
    delay: 1000
  }
])
defineProps<{
  msg?: string
}>()

// 使用store
const counterStore = useCounterStore()
const newName = ref('')
const fetchUserData = async (): Promise<any> => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const mockUsers: any[] = [
      { id: 1, name: 'Alice', email: 'alice@example.com', roles: ['user', 'admin'] },
      { id: 2, name: 'Bob', roles: ['user'] },
      { id: 3, name: 'Charlie', email: 'charlie@example.com', roles: ['user', 'moderator'] }
    ]
    
    return {
      data: mockUsers,
      status: 'success',
      message: 'Data fetched successfully'
    }
  } catch (error) {
    return {
      data: [],
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

fetchUserData()
function updateStoreName() {
  if (newName.value.trim()) {
    counterStore.updateName(newName.value)
    newName.value = ''
  }
}
</script>

<style scoped>
.home {
  padding: 20px;
}

.pinia-demo {
  margin-top: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.buttons {
  margin: 15px 0;
}

.buttons button {
  margin-right: 10px;
  padding: 8px 16px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.buttons button:hover {
  background: #369870;
}

.input-section {
  margin-top: 15px;
}

.input-section input {
  padding: 8px;
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.input-section button {
  padding: 8px 16px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>