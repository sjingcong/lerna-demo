# ModularCraft

一个基于 Vue3 + Pinia 的极简模块化页面构建系统，支持事件驱动的模块间通信、统一的状态管理、动态页面组装和渲染。

## 🚀 特性

- **🎯 极简设计**: 化繁为简，核心功能精炼
- **📦 模块化**: 支持独立开发、测试和部署
- **🔄 事件驱动**: 模块间松耦合通信
- **🗃️ 统一状态**: 集成 Pinia，每个模块独立 Store
- **🎨 动态渲染**: 支持多种布局模式
- **🔧 TypeScript**: 完整的类型支持

## 📁 目录结构

```
ModularCraft/
├── core/                 # 核心模块
│   ├── useEvent.ts      # 事件系统
│   ├── useStore.ts      # Store管理
│   ├── useComposer.ts   # 页面组装
│   ├── useRenderer.ts   # 渲染引擎
│   └── index.ts         # 统一导出
├── types/               # 类型定义
│   └── index.ts
├── examples/            # 示例代码
│   ├── HelloModule.vue  # 示例模块
│   ├── helloStore.ts    # 示例Store
│   └── ExamplePage.vue  # 示例页面
├── modules/             # 业务模块目录
├── index.ts             # 主入口
└── README.md           # 文档
```

## 🛠️ 核心模块

### 1. 事件模块 (useEvent)

提供模块间通信能力：

```typescript
import { useEvent } from './core'

const { on, emit, off, once } = useEvent()

// 监听事件
on('user:login', (user) => {
  console.log('用户登录:', user)
})

// 发送事件
emit('user:login', { id: 1, name: 'John' })

// 一次性监听
once('app:init', () => {
  console.log('应用初始化完成')
})
```

### 2. Store模块 (useStore)

集成 Pinia 的状态管理：

```typescript
import { useStore, createModuleStore, registerModuleStore } from './core'

// 创建模块Store
const useUserStore = createModuleStore(
  'user',
  () => ({ name: '', email: '' }),
  {
    updateUser(user) {
      this.name = user.name
      this.email = user.email
    }
  }
)

// 注册Store
registerModuleStore('user', () => useUserStore)

// 使用Store
const userStore = useStore('user')
```

### 3. 页面组装模块 (useComposer)

处理模块配置和依赖：

```typescript
import { useComposer } from './core'

const { loadPage, registerComponent } = useComposer()

// 注册组件
registerComponent('UserProfile', UserProfileComponent)

// 加载页面
await loadPage({
  id: 'user-page',
  title: '用户页面',
  layout: 'grid',
  modules: [
    {
      id: 'user-profile',
      name: '用户资料',
      component: 'UserProfile',
      props: { userId: 123 },
      order: 1
    }
  ]
})
```

### 4. 渲染模块 (useRenderer)

动态渲染页面：

```typescript
import { useRenderer } from './core'

const { createPageRenderer } = useRenderer()

// 创建页面渲染器
const PageComponent = createPageRenderer(pageConfig)

// 在模板中使用
// <component :is="PageComponent" />
```

## 🎯 快速开始

### 1. 初始化系统

```typescript
import { createModularCraft } from './ModularCraft'
import MyModule from './MyModule.vue'
import { myStoreFactory } from './myStore'

const app = createModularCraft({
  components: {
    MyModule
  },
  stores: {
    myModule: myStoreFactory
  },
  styles: true // 注入默认样式
})
```

### 2. 创建模块组件

```vue
<template>
  <div class="my-module">
    <h2>{{ title }}</h2>
    <button @click="sendMessage">发送消息</button>
  </div>
</template>

<script setup>
import { useEvent, useStore } from '../core'

const props = defineProps(['moduleId', 'title'])
const { emit } = useEvent()
const store = useStore('myModule')

const sendMessage = () => {
  emit('my-module:message', 'Hello from ' + props.title)
}
</script>
```

### 3. 配置页面

```typescript
const pageConfig = {
  id: 'home-page',
  title: '首页',
  layout: 'flex',
  modules: [
    {
      id: 'header',
      name: '页头',
      component: 'HeaderModule',
      order: 1
    },
    {
      id: 'content',
      name: '内容',
      component: 'ContentModule',
      order: 2,
      dependencies: ['header']
    }
  ]
}
```

### 4. 渲染页面

```vue
<template>
  <div>
    <component :is="pageRenderer" />
  </div>
</template>

<script setup>
import { useRenderer } from './ModularCraft'

const { createPageRenderer } = useRenderer()
const pageRenderer = createPageRenderer(pageConfig)
</script>
```

## 🎨 布局模式

支持三种布局模式：

- **default**: 默认块级布局
- **grid**: CSS Grid 网格布局
- **flex**: Flexbox 弹性布局

## 📝 事件约定

### 系统事件

- `page:mounted` - 页面挂载
- `page:unmounted` - 页面卸载
- `module:mounted` - 模块挂载
- `module:unmounted` - 模块卸载

### 模块事件

- `module:{moduleId}:{eventName}` - 模块自定义事件

## 🔧 开发指南

### 模块开发规范

1. **Props 约定**：每个模块都会接收 `moduleId` 和 `moduleName` props
2. **事件命名**：使用 `模块名:事件名` 格式
3. **Store 命名**：与模块名保持一致
4. **组件注册**：使用 PascalCase 命名

### 最佳实践

1. **模块独立性**：每个模块应该能够独立运行
2. **事件解耦**：使用事件而非直接调用进行模块通信
3. **状态隔离**：每个模块使用独立的 Store
4. **错误处理**：在模块中处理自身的错误状态

## 🚀 示例运行

查看 `examples/ExamplePage.vue` 了解完整的使用示例。

## 📄 License

MIT License