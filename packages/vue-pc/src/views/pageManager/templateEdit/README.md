# 页面模板管理 - 模块化架构

基于 ModularCraft 理念实现的模块化页面构建系统，支持通过配置化方式快速组装页面。

## 🏗️ 架构设计

### 核心理念
- **模块化组件**: 将页面拆分为独立的功能模块
- **配置驱动**: 通过配置文件定义模块行为和数据结构
- **数据解耦**: 统一的数据总线管理模块间的数据流转
- **可复用性**: 模块可在不同页面间复用

### 目录结构
```
template/
├── page.vue              # 页面主文件
├── store.ts              # 状态管理
├── example.vue           # 使用示例
├── README.md            # 文档说明
└── modules/             # 模块目录
    ├── index.ts         # 模块注册
    ├── processor.ts     # 数据处理器
    └── banner-editor/   # Banner编辑器模块
        ├── index.vue    # 模块组件
        └── config.ts    # 模块配置
```

## 🚀 快速开始

### 1. 基础使用
```vue
<template>
  <PageTemplate />
</template>

<script setup>
import PageTemplate from './page.vue';
</script>
```

### 2. 查看示例
访问 `example.vue` 查看完整的使用示例，包括：
- 数据加载和清空
- 调试信息展示
- 模块交互演示

## 📦 模块开发

### 创建新模块

1. **创建模块目录**
```bash
mkdir modules/your-module
```

2. **创建模块组件** (`modules/your-module/index.vue`)
```vue
<template>
  <div class="your-module">
    <!-- 模块内容 -->
  </div>
</template>

<script setup lang="ts">
import { useModuleStore } from '../../store';
import type { YourModuleData } from './config';

const { data: moduleData, update: updateModuleData } = useModuleStore<YourModuleData>('your-module');
</script>
```

3. **创建模块配置** (`modules/your-module/config.ts`)
```typescript
export interface YourModuleData {
  // 定义模块数据类型
}

export const yourModule = {
  defaultValue: {
    // 默认数据
  },
  processor(globalData: any, updateData: any) {
    // 数据处理逻辑
    const moduleData = {
      // 从全局数据提取模块数据
    };
    updateData(moduleData);
  },
};

export default yourModule;
```

4. **注册模块**
在 `modules/index.ts` 中添加：
```typescript
import YourModule from './your-module/index.vue';

export const modules = [
  // ... 其他模块
  {
    id: 'your-module',
    component: YourModule,
  },
];
```

在 `modules/processor.ts` 中添加：
```typescript
import yourModule from './your-module/config';

export const moduleProcessorMap = {
  // ... 其他处理器
  'your-module': yourModule,
};
```

## 🎯 现有模块

### Banner编辑器模块
- **模块ID**: `banner-editor`
- **功能**: 销售商品Banner位编辑
- **特性**:
  - 商品名称输入
  - Banner图片上传（最多3张）
  - 视频文件上传（最多1个）
  - 视频封面上传（最多1张）
  - 实时预览
  - 表单验证

## 🔧 状态管理

### 页面级Store
```typescript
const pageStore = usePageStore();

// 设置全局数据
pageStore.setGlobalData(data);

// 控制加载状态
pageStore.startLoading();
pageStore.stopLoading();
```

### 模块级Store
```typescript
const { data, update } = useModuleStore<ModuleDataType>('module-id');

// 读取模块数据
console.log(data.value);

// 更新模块数据
update(newData);
```

## 📋 数据流转

1. **全局数据设置**: 通过 `pageStore.setGlobalData()` 设置页面级数据
2. **数据处理**: 自动调用各模块的 `processor` 函数处理数据
3. **模块更新**: 处理后的数据更新到对应模块的 store
4. **响应式更新**: 模块组件自动响应数据变化

## 🎨 样式规范

### 模块样式结构
```less
.module-name {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;

  .module-header {
    // 模块头部样式
  }

  .module-content {
    // 模块内容样式
  }
}
```

### 响应式设计
所有模块都应支持移动端适配，使用媒体查询：
```less
@media (max-width: 768px) {
  // 移动端样式
}
```

## 🔍 调试工具

### 开发模式调试
在 `example.vue` 中提供了调试面板，可以：
- 查看全局数据状态
- 查看各模块数据状态
- 加载测试数据
- 清空所有数据

### 控制台调试
```javascript
// 获取页面store实例
const store = usePageStore();

// 查看当前状态
console.log('全局数据:', store.globalData);
console.log('模块数据:', store.moduleDataMap);
```

## 🚀 部署说明

### 生产环境优化
1. 移除调试相关代码
2. 优化模块懒加载
3. 压缩静态资源
4. 配置CDN加速

### 性能监控
建议添加性能监控点：
- 模块加载时间
- 数据处理耗时
- 用户交互响应时间

## 📝 开发规范

### 代码规范
- 使用 TypeScript 进行类型约束
- 遵循 Vue 3 Composition API 最佳实践
- 统一的错误处理机制
- 完善的注释文档

### 测试规范
- 单元测试覆盖核心逻辑
- 集成测试验证模块交互
- E2E测试保证用户体验

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交代码变更
4. 发起 Pull Request

## 📄 许可证

MIT License