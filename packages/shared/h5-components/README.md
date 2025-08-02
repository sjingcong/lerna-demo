# H5 组件库

这是一个移动端H5组件库，提供了一套完整的可视化配置系统。

## 特性

- 🎛️ **可视化配置**: 每个组件都有对应的props.json配置文件，支持可视化配置界面
- 📋 **代码生成**: 自动生成Vue组件使用代码，一键复制
- 📱 **移动端优化**: 专为移动端设计，支持触摸交互
- 🔧 **高度可定制**: 支持多种布局模式和自定义样式
- 📚 **完整文档**: 每个组件都有详细的MDX文档

## 组件列表

### Select 选择器组件

支持单选、多选，Grid和Scroll两种布局模式的选择器组件。

**特性:**
- 单选/多选模式
- Grid布局（支持1-5列）
- Scroll布局（支持固定宽度）
- 自适应宽度
- 自定义选项内容
- 禁用状态

## 组件配置系统

每个组件都包含以下文件：

```
ComponentName/
├── index.vue          # 组件主文件
├── types.ts           # TypeScript类型定义
├── props.json         # 组件属性配置
├── demo.vue           # 组件演示
└── README.md          # 组件说明文档
```

### props.json 配置格式

```json
{
  "componentName": "ComponentName",
  "componentTitle": "组件中文名称",
  "description": "组件描述",
  "props": [
    {
      "name": "propName",
      "title": "属性中文名",
      "type": "string | number | boolean | array",
      "required": true,
      "description": "属性描述",
      "default": "默认值",
      "control": "switch | radio | select | input",
      "options": [
        {"label": "显示文本", "value": "实际值"}
      ],
      "dependsOn": {
        "otherProp": "value"
      }
    }
  ],
  "events": [
    {
      "name": "eventName",
      "description": "事件描述",
      "params": "参数说明"
    }
  ],
  "slots": [
    {
      "name": "slotName",
      "description": "插槽描述",
      "params": "插槽参数"
    }
  ]
}
```

### 控件类型说明

- **switch**: 开关控件，用于boolean类型
- **radio**: 单选控件，用于枚举值选择
- **select**: 下拉选择控件，用于多选项选择
- **input**: 输入框控件，用于文本或数字输入

### 依赖关系

使用`dependsOn`可以设置属性的显示条件：

```json
{
  "name": "itemsPerRow",
  "dependsOn": {
    "layoutType": "grid"
  }
}
```

这表示`itemsPerRow`属性只有在`layoutType`为`grid`时才显示。

## 使用方法

### 1. 在项目中使用组件

```vue
<template>
  <Select 
    v-model="selectedValue" 
    :options="options" 
    layout-type="grid"
    :items-per-row="3"
    multiple
  />
</template>

<script setup>
import { ref } from 'vue';
import Select from '@/shared/h5-components/Select/index.vue';

const selectedValue = ref([]);
const options = [
  { label: '选项1', value: 'option1' },
  { label: '选项2', value: 'option2' },
  { label: '选项3', value: 'option3' }
];
</script>
```

### 2. 使用可视化配置

在文档系统中，每个组件都有可视化配置界面：

1. 打开组件文档页面
2. 在"组件属性配置"区域调整参数
3. 右侧实时预览生成的代码
4. 点击"复制代码"按钮获取完整代码

## 开发新组件

### 1. 创建组件目录

```bash
mkdir packages/shared/h5-components/NewComponent
```

### 2. 创建组件文件

- `index.vue`: 组件主文件
- `types.ts`: TypeScript类型定义
- `props.json`: 属性配置文件
- `demo.vue`: 演示文件

### 3. 创建文档

在`packages/doc/src/docs/h5component/`目录下创建对应的MDX文档。

### 4. 使用通用配置器

```mdx
import ComponentConfigurator from '../../components/ComponentConfigurator';
import propsConfig from '../../../shared/h5-components/NewComponent/props.json';

<ComponentConfigurator propsConfig={propsConfig} sampleData={sampleData} />
```

## 最佳实践

1. **组件设计**: 保持组件的单一职责，提供清晰的API
2. **类型定义**: 使用TypeScript提供完整的类型支持
3. **属性配置**: 在props.json中详细描述每个属性
4. **文档编写**: 提供完整的使用示例和API说明
5. **测试**: 在demo.vue中提供全面的功能演示

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License