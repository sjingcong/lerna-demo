# Select 单选/多选组件

一个功能强大的单选/多选组件，支持四种不同的布局样式，适用于移动端表单场景。

## 特性

- 🎯 支持单选和多选两种模式
- 🎨 提供四种布局样式
- 📱 移动端友好的交互体验
- 🔧 TypeScript 支持
- ⚡ 轻量级，无外部依赖

## 布局类型

### SelectLayoutType

```typescript
type SelectLayoutType = 'grid' | 'scroll'
```

- `grid`: 网格布局，支持换行，可设置每行固定个数或自适应宽度
- `scroll`: 滚动布局，不换行，支持水平滚动，可设置固定宽度或自适应宽度

### 1. grid - 网格布局
- **支持换行**
- 可设置每行显示的选项数量（itemsPerRow）
- 如果不设置 itemsPerRow，则宽度自适应
- 适用于选项数量较少且需要整齐排列的场景

### 2. scroll - 滚动布局
- **不支持换行**
- 支持水平滚动
- 默认宽度自适应
- 当设置了 itemWidth 时使用固定宽度
- 适用于选项数量较多的场景，节省垂直空间

## 基础用法

```vue
<template>
  <!-- Grid布局：固定列数 -->
  <Select
    v-model="value1"
    :options="options"
    layout-type="grid"
    :items-per-row="2"
  />
  
  <!-- Grid布局：自适应宽度 -->
  <Select
    v-model="value2"
    :options="options"
    layout-type="grid"
  />
  
  <!-- Scroll布局：自适应宽度 -->
  <Select
    v-model="value3"
    :options="options"
    layout-type="scroll"
  />
  
  <!-- Scroll布局：固定宽度 -->
  <Select
    v-model="value4"
    :options="options"
    layout-type="scroll"
    :item-width="120"
  />
</template>

<script setup>
import { ref } from 'vue'

const value1 = ref('')
const value2 = ref('')
const value3 = ref('')
const value4 = ref('')

const options = [
  { label: '选项1', value: '1' },
  { label: '选项2', value: '2' },
  { label: '选项3', value: '3' }
]
</script>
```

## 自定义选项内容

```vue
<template>
  <Select
    v-model="value"
    :options="options"
    layout-type="grid"
  >
    <template #option="{ option, selected, disabled }">
      <div class="custom-option">
        <span class="icon">{{ option.icon }}</span>
        <span>{{ option.label }}</span>
        <span v-if="selected" class="check">✓</span>
      </div>
    </template>
  </Select>
</template>

<script setup>
const options = [
  { label: '首页', value: 'home', icon: '🏠' },
  { label: '用户', value: 'user', icon: '👤' }
]
</script>
```

## 设置选项宽度

```vue
<template>
  <Select
    v-model="value"
    :options="options"
    layout-type="scroll"
  />
</template>

<script setup>
const options = [
  { label: '北京市', value: 'beijing', width: '120px' },
  { label: '上海市', value: 'shanghai', width: '120px' }
]
</script>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 | 必填 |
|------|------|------|--------|---------|
| options | 选项列表 | `SelectOption[]` | `[]` | 是 |
| modelValue | 当前选中的值 | `string \| number \| string[] \| number[]` | - | 否 |
| multiple | 是否支持多选 | `boolean` | `false` | 否 |
| layoutType | 布局类型 | `'grid' \| 'scroll'` | `'grid'` | 否 |
| itemsPerRow | 每行显示的选项数量（仅在 layoutType 为 'grid' 时生效，不设置则自适应） | `number` | `undefined` | 否 |
| itemWidth | 选项固定宽度（仅 scroll 布局有效，不设置则自适应） | `number` | `undefined` | 否 |
| disabled | 是否禁用 | `boolean` | `false` | 否 |
| placeholder | 占位符文本 | `string` | `'请选择'` | 否 |

### SelectOption

| 参数 | 说明 | 类型 | 必填 |
|------|------|------|---------|
| label | 选项显示文本 | `string` | 是 |
| value | 选项值 | `string \| number` | 是 |
| disabled | 是否禁用该选项 | `boolean` | 否 |
| width | 选项宽度，支持像素值或百分比 | `string \| number` | 否 |

### Events

| 事件名 | 说明 | 参数 |
|--------|------|------|
| update:modelValue | 值变化时触发 | `value: string \| number \| (string \| number)[]` |
| change | 值变化时触发 | `value: string \| number \| (string \| number)[]` |

### Slots

| 插槽名 | 说明 | 参数 |
|--------|------|------|
| option | 自定义选项内容 | { option: SelectOption, selected: boolean, disabled: boolean } |

## 样式定制

组件使用 CSS 变量，可以通过覆盖这些变量来定制样式：

```css
.select {
  --select-border-color: #e5e5e5;
  --select-border-color-active: #ff6b35;
  --select-bg-color: #fff;
  --select-bg-color-active: #fff5f2;
  --select-text-color: #333;
  --select-text-color-active: #ff6b35;
  --select-border-radius: 8px;
  --select-padding: 8px 16px;
  --select-gap: 12px;
}
```

## 注意事项

1. 在多选模式下，`modelValue` 应该是数组类型
2. 在单选模式下，`modelValue` 应该是字符串或数字类型
3. `itemsPerRow` 参数仅在 `layoutType` 为 `'grid'` 时生效
4. 滚动布局会自动隐藏滚动条，提供更好的移动端体验
5. 组件会自动处理响应式布局，在小屏幕设备上优化显示效果