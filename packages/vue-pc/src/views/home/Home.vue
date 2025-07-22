<template>
  <div class="home">
    <h1>{{ msg }}</h1>
    
    <!-- 导航链接 -->
    <div class="navigation">
      <h2>页面导航</h2>
      <div class="nav-links">
        <router-link to="/about" class="nav-link">关于页面</router-link>
        <router-link to="/List" class="nav-link">列表页面</router-link>
        <router-link to="/template-demo" class="nav-link">模板演示</router-link>
        <router-link to="/image-list-demo" class="nav-link">图片列表组件演示</router-link>
      </div>
    </div>
    
    <!-- API调用示例 -->
    <div class="api-demo">
      <h2>API调用示例</h2>
      
      <!-- 加载状态 -->
      <div v-if="loading" class="loading">
        <p>加载中...</p>
      </div>
      
      <!-- 错误信息 -->
      <div v-if="error" class="error">
        <p>错误: {{ error }}</p>
      </div>
      
      <!-- 用户信息 -->
      <div class="user-info">
        <h3>用户信息</h3>
        <div v-if="userData">
          <pre>{{ JSON.stringify(userData, null, 2) }}</pre>
        </div>
        <div v-else>
          <p>暂无用户数据</p>
        </div>
        <button @click="fetchUser()">重新获取用户信息</button>
      </div>
      
      <!-- 列表数据 -->
      <div class="list-info">
        <h3>列表数据</h3>
        <div v-if="listData">
          <pre>{{ JSON.stringify(listData, null, 2) }}</pre>
        </div>
        <div v-else>
          <p>暂无列表数据</p>
        </div>
        <button @click="fetchList()">重新获取列表</button>
      </div>
    </div>

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
import { ref, onMounted } from 'vue'
import { useCounterStore } from '@/store/counter'
import { usePreload } from '@giom/shared/composables/usePreload'
import { getList, getUser, getCompany, getPosition } from '@/api/common'
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

// API调用相关的响应式数据
const listData = ref([])
const userData = ref(null)
const loading = ref(false)
const error = ref('')


// 调用getList接口
const fetchList = async () => {
  try {
    loading.value = true
    error.value = ''
    const response = await getList({ page: 1, size: 10 })
    listData.value = response
    console.log('List data:', response)
  } catch (err) {
    error.value = err instanceof Error ? err.message : '获取列表失败'
    console.log('获取列表失败:', err)
  } finally {
    loading.value = false
  }
}

// 调用getUser接口
const fetchUser = async (userId?: number) => {
  try {
    loading.value = true
    error.value = ''
    const response = await getUser(userId)
    userData.value = response
    console.log('User data:', response)
  } catch (err) {
    error.value = err instanceof Error ? err.message : '获取用户信息失败'
    console.log('获取用户信息失败:', err)
  } finally {
    loading.value = false
  }
}

// 调用getCompany接口
const fetchCompany = async () => {
  try {
    loading.value = true
    error.value = ''
    const response = await getCompany()
    console.log('Company data:', response)
  } catch (err) {
    error.value = err instanceof Error ? err.message : '获取公司信息失败'
    console.log('获取公司信息失败:', err)
  } finally {
    loading.value = false
  }
}

// 调用getPosition接口
const fetchPosition = async () => {
  try {
    loading.value = true
    error.value = ''
    const response = await getPosition()
    console.log('Position data:', response)
  } catch (err) {
    error.value = err instanceof Error ? err.message : '获取未知信息失败'
    console.log('获取未知信息失败:', err)
  } finally {
    loading.value = false
  }
}

// 组件挂载时调用接口
onMounted(() => {
  fetchList()
  setTimeout(() => {
    fetchCompany()
    fetchPosition()
  }, 1000)
  fetchUser() // 获取当前用户信息
})

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

.api-demo {
  margin-top: 30px;
  padding: 20px;
  border: 1px solid #e6f7ff;
  border-radius: 8px;
  background-color: #f6ffed;
}

.loading {
  color: #1890ff;
  font-weight: bold;
}

.error {
  color: #ff4d4f;
  background-color: #fff2f0;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
}

.user-info, .list-info {
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background-color: #fafafa;
}

.user-info h3, .list-info h3 {
  margin-top: 0;
  color: #262626;
}

.user-info pre, .list-info pre {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  max-height: 200px;
  overflow-y: auto;
}

.user-info button, .list-info button {
  margin-top: 10px;
  padding: 6px 12px;
  background: #52c41a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.user-info button:hover, .list-info button:hover {
  background: #389e0d;
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

.navigation {
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #e6f7ff;
  border-radius: 8px;
  background-color: #f0f9ff;
}

.navigation h2 {
  margin-top: 0;
  color: #1890ff;
}

.nav-links {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.nav-link {
  padding: 10px 20px;
  background: #1890ff;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-link:hover {
  background: #40a9ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(24, 144, 255, 0.3);
}

.nav-link.router-link-active {
  background: #722ed1;
}

.nav-link.router-link-active:hover {
  background: #9254de;
}
</style>