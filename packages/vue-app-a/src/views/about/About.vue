<template>
  <div class="about">
    <h1>关于页面 - 高级语法测试</h1>
    <p>这是一个使用Vue 3 + TypeScript + Vite + Vue Router的示例应用。</p>
    
    <!-- 显示测试结果 -->
    <div class="test-results">
      <h2>语法测试结果：</h2>
      <pre>{{ testResults }}</pre>
    </div>
    
    <div class="navigation">
      <router-link to="/">返回首页</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 1. 类型定义和接口
interface User {
  id: number
  name: string
  email?: string
  roles: string[]
}

type Status = 'loading' | 'success' | 'error'
type ApiResponse<T> = {
  data: T
  status: Status
  message?: string
}

// 2. 泛型类
class DataStore<T> {
  private items: T[] = []
  
  add(item: T): void {
    this.items.push(item)
  }
  
  getAll(): T[] {
    return [...this.items]
  }
  
  findById<K extends keyof T>(key: K, value: T[K]): T | undefined {
    return this.items.find(item => item[key] === value)
  }
}

// 3. 装饰器模式（如果启用了装饰器）
function logMethod(target: any, propertyName: string, descriptor: PropertyDescriptor) {
  const method = descriptor.value
  descriptor.value = function (...args: any[]) {
    console.log(`调用方法: ${propertyName}`, args)
    return method.apply(this, args)
  }
}

// 4. 响应式数据
const testResults = ref('')
const users = ref<User[]>([])
const currentStatus = ref<Status>('loading')

// 5. 计算属性使用高级语法
const processedData = computed(() => {
  // 使用可选链和空值合并
  return users.value?.map(user => ({
    ...user,
    displayName: user.name ?? 'Unknown',
    isAdmin: user.roles?.includes('admin') ?? false
  })) || []
})

// 6. 异步函数和Promise
const fetchUserData = async (): Promise<ApiResponse<User[]>> => {
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const mockUsers: User[] = [
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

// 7. 高级数组操作和函数式编程
const processArrayData = () => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  
  // 链式调用
  const result = numbers
    .filter(n => n % 2 === 0)
    .map(n => n ** 2)
    .reduce((acc, curr) => acc + curr, 0)
  
  // 使用 flatMap
  const nested = [[1, 2], [3, 4], [5, 6]]
  const flattened = nested.flatMap(arr => arr.map(n => n * 2))
  
  // 使用 Array.from 和生成器
  const generated = Array.from({ length: 5 }, (_, i) => i ** 2)
  
  return { result, flattened, generated }
}

// 8. 解构赋值和剩余参数
const destructuringExamples = () => {
  const obj = { a: 1, b: 2, c: 3, d: 4 }
  const { a, b, ...rest } = obj
  
  const arr = [1, 2, 3, 4, 5]
  const [first, second, ...remaining] = arr
  
  return { a, b, rest, first, second, remaining }
}

// 9. 模板字符串和标签模板
const templateStringExamples = () => {
  const name = 'Vue 3'
  const version = '3.4'
  
  // 普通模板字符串
  const message = `当前使用的是 ${name} 版本 ${version}`
  
  // 标签模板
  function highlight(strings: TemplateStringsArray, ...values: any[]) {
    return strings.reduce((result, string, i) => {
      const value = values[i] ? `<strong>${values[i]}</strong>` : ''
      return result + string + value
    }, '')
  }
  
  const highlighted = highlight`框架: ${name}, 版本: ${version}`
  
  return { message, highlighted }
}

// 10. Symbol 和 WeakMap
const symbolExamples = () => {
  const uniqueKey = Symbol('unique')
  const obj = {
    [uniqueKey]: 'secret value',
    normalKey: 'normal value'
  }
  
  const weakMap = new WeakMap()
  const keyObj = {}
  weakMap.set(keyObj, 'weak map value')
  
  return { uniqueKey, obj, weakMapValue: weakMap.get(keyObj) }
}

// 11. Proxy 和 Reflect
const proxyExamples = () => {
  const target = { name: 'Original', value: 42 }
  
  const proxy = new Proxy(target, {
    get(obj, prop) {
      console.log(`访问属性: ${String(prop)}`)
      return Reflect.get(obj, prop)
    },
    set(obj, prop, value) {
      console.log(`设置属性: ${String(prop)} = ${value}`)
      return Reflect.set(obj, prop, value)
    }
  })
  
  proxy.name = 'Modified'
  return { original: target, proxy }
}

// 12. 生成器函数
function* numberGenerator(max: number) {
  let current = 0
  while (current < max) {
    yield current++
  }
}

// 13. 异步生成器
async function* asyncNumberGenerator(max: number) {
  for (let i = 0; i < max; i++) {
    await new Promise(resolve => setTimeout(resolve, 100))
    yield i
  }
}

// 14. 类的高级特性
class AdvancedClass {
  // 私有字段
  #privateField = 'private'
  
  // 静态字段
  static staticField = 'static'
  
  // 公共字段
  public publicField = 'public'
  
  constructor(public readonly readonlyField: string) {}
  
  // Getter/Setter
  get computedValue() {
    return this.#privateField + this.publicField
  }
  
  set computedValue(value: string) {
    this.publicField = value
  }
  
  // 静态方法
  static createInstance(value: string) {
    return new AdvancedClass(value)
  }
  
  // 私有方法
  #privateMethod() {
    return 'private method result'
  }
  
  // 公共方法
  getPrivateResult() {
    return this.#privateMethod()
  }
}

// 15. 动态导入（注释掉，因为在组件中可能不适用）
// const dynamicImport = async () => {
//   const module = await import('./some-module')
//   return module.default
// }


// 17. 可选链和空值合并的复杂用法
const optionalChainingExamples = () => {
  const data: any = {
    user: {
      profile: {
        settings: {
          theme: 'dark'
        }
      }
    }
  }
  
  // 深层可选链
  const theme = data?.user?.profile?.settings?.theme ?? 'light'
  const nonExistent = data?.user?.profile?.preferences?.language ?? 'en'
  
  // 可选链调用
  const result = data?.user?.profile?.getSettings?.()
  
  return { theme, nonExistent, result }
}

// 18. 运行所有测试
const runAllTests = async () => {
  const results: any = {}
  
  // 基础测试
  results.arrayProcessing = processArrayData()
  results.destructuring = destructuringExamples()
  results.templateStrings = templateStringExamples()
  results.symbols = symbolExamples()
  results.proxy = proxyExamples()
  results.optionalChaining = optionalChainingExamples()
  
  // 生成器测试
  const generator = numberGenerator(5)
  results.generator = Array.from(generator)
  
  // 异步生成器测试
  const asyncGen = asyncNumberGenerator(3)
  const asyncResults = []
  for await (const value of asyncGen) {
    asyncResults.push(value)
  }
  results.asyncGenerator = asyncResults
  
  // 类测试
  const instance = AdvancedClass.createInstance('test')
  results.advancedClass = {
    staticField: AdvancedClass.staticField,
    computedValue: instance.computedValue,
    privateResult: instance.getPrivateResult(),
    readonlyField: instance.readonlyField
  }
  
  // 数据存储测试
  const userStore = new DataStore<User>()
  userStore.add({ id: 1, name: 'Test User', roles: ['user'] })
  results.dataStore = userStore.getAll()
  
  // API测试
  const apiResult = await fetchUserData()
  if (apiResult.status === 'success') {
    users.value = apiResult.data
  }
  results.apiCall = apiResult
  
  return results
}

// 组件挂载时运行测试
onMounted(async () => {
  currentStatus.value = 'loading'
  try {
    const results = await runAllTests()
    testResults.value = JSON.stringify(results, null, 2)
    currentStatus.value = 'success'
  } catch (error) {
    testResults.value = `错误: ${error}`
    currentStatus.value = 'error'
  }
})
</script>

<style scoped>
.about {
  display: flex;
  padding: 20px;
  text-align: center;
}

.test-results {
  margin: 20px 0;
  text-align: left;
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  max-height: 400px;
  overflow-y: auto;
}

.test-results pre {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.navigation {
  margin-top: 20px;
}

.navigation a {
  color: #2c3e50;
  text-decoration: none;
  padding: 10px 20px;
  border: 1px solid #2c3e50;
  border-radius: 4px;
  margin: 0 10px;
}

.navigation a:hover {
  background-color: #2c3e50;
  color: white;
}
</style>