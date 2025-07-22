# MobileTable 移动端表格组件

一个专为移动端设计的表格组件，支持第一列单元格行合并功能。

## 特性

- 📱 移动端优化设计
- 🔗 支持第一列行合并
- 🎨 自定义单元格内容
- 📊 响应式布局
- 🎯 TypeScript 支持

## 基础用法

```vue
<template>
  <MobileTable 
    :columns="columns" 
    :dataSource="tableData"
    :mergeFirstColumn="true"
  />
</template>

<script setup>
import MobileTable from './MobileTable.vue'

const columns = [
  {
    title: '计划类别',
    dataIndex: 'category',
    key: 'category',
    width: '25%'
  },
  {
    title: '分类',
    dataIndex: 'type',
    key: 'type',
    width: '35%'
  },
  {
    title: '单价',
    dataIndex: 'price',
    key: 'price',
    width: '20%'
  },
  {
    title: '人数',
    dataIndex: 'count',
    key: 'count',
    width: '20%'
  }
]

const tableData = [
  {
    category: '计划一',
    type: '【30-40】-男-一类职业-有',
    price: 120,
    count: 150
  },
  // 更多数据...
]
</script>
```

## 自定义单元格内容

```vue
<template>
  <MobileTable 
    :columns="columns" 
    :dataSource="tableData"
  >
    <template #price="{ text }">
      <span style="color: #ff4d4f; font-weight: bold;">¥{{ text }}</span>
    </template>
    <template #count="{ text }">
      <span style="color: #52c41a;">{{ text }}人</span>
    </template>
  </MobileTable>
</template>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns | 表格列的配置描述 | Column[] | [] |
| dataSource | 数据数组 | any[] | [] |
| showHeader | 是否显示表头 | boolean | true |
| mergeFirstColumn | 是否合并第一列相同内容的单元格 | boolean | true |

### Column

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 列头显示文字 | string | - |
| dataIndex | 列数据在数据项中对应的路径 | string | - |
| key | React 需要的 key，如果已经设置了唯一的 dataIndex，可以忽略这个属性 | string | - |
| width | 列宽度 | string | 'auto' |
| align | 设置列的对齐方式 | 'left' \| 'center' \| 'right' | 'center' |

### Slots

| 名称 | 说明 | 参数 |
| --- | --- | --- |
| [column.key] | 自定义单元格内容 | { record, text, index } |

## 行合并逻辑

当 `mergeFirstColumn` 为 `true` 时，组件会自动检测第一列中相邻且内容相同的单元格，并将它们合并显示。合并逻辑：

1. 扫描第一列数据，找出连续相同的值
2. 将第一个单元格设置为合并单元格，高度为合并行数 × 单行高度
3. 隐藏其他被合并的单元格

## 样式定制

组件使用 CSS 变量，可以通过覆盖以下变量来自定义样式：

```css
.mobile-table {
  --cell-padding: 12px 8px;
  --border-color: #e8e8e8;
  --header-bg: #fafafa;
  --text-color: #595959;
  --header-text-color: #262626;
}
```

## 注意事项

1. 行合并功能仅支持第一列
2. 合并基于相邻行的数据值完全相等
3. 移动端优化，建议列数不超过4列
4. 支持响应式设计，在小屏幕上会自动调整字体大小和间距