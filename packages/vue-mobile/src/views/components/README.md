# 公共组件

这个目录包含了可在多个视图中重用的公共组件。

## ModuleCard 组件

`ModuleCard` 是一个通用的模块卡片组件，支持显示标题、图标和自定义内容。

### 属性

| 属性名 | 类型 | 必填 | 默认值 | 描述 |
| ------ | ---- | ---- | ------ | ---- |
| title | String | 是 | '模块标题' | 模块的标题 |
| icon | String | 否 | '' | 模块图标的URL地址 |

### 插槽

| 插槽名 | 描述 |
| ------ | ---- |
| default | 模块的主要内容 |

### 使用示例

```vue
<template>
  <ModuleCard title="个人信息" icon="/icons/user.svg">
    <div class="user-info">
      <p>姓名: 张三</p>
      <p>电话: 13800138000</p>
    </div>
  </ModuleCard>
</template>

<script setup>
import ModuleCard from '@/views/components/ModuleCard.vue';
</script>
```

## Module 组件

`Module` 是一个更加灵活的模块组件，支持多种主题、自定义头部、底部和额外操作区域。

### 属性

| 属性名 | 类型 | 必填 | 默认值 | 描述 |
| ------ | ---- | ---- | ------ | ---- |
| title | String | 否 | '' | 模块的标题 |
| icon | String | 否 | '' | 模块图标的URL地址 |
| theme | String | 否 | 'light' | 模块主题，可选值：'light', 'dark', 'primary' |
| border | Boolean | 否 | true | 是否显示边框和阴影 |
| noPadding | Boolean | 否 | false | 内容区域是否取消内边距 |

### 插槽

| 插槽名 | 描述 |
| ------ | ---- |
| default | 模块的主要内容 |
| header | 自定义头部区域，会覆盖默认的标题和图标 |
| extra | 头部区域右侧的额外内容 |
| footer | 底部区域内容 |

### 使用示例

```vue
<template>
  <!-- 基本使用 -->
  <Module title="订单信息" icon="/icons/shopping-cart.svg">
    <p>订单内容...</p>
  </Module>
  
  <!-- 使用主题 -->
  <Module title="重要通知" theme="primary">
    <p style="color: white">这是一条重要通知...</p>
  </Module>
  
  <!-- 使用额外操作区 -->
  <Module title="任务列表">
    <template #extra>
      <van-button size="small" type="primary">添加</van-button>
    </template>
    <p>任务内容...</p>
  </Module>
  
  <!-- 使用底部区域 -->
  <Module title="表单">
    <p>表单内容...</p>
    <template #footer>
      <div style="display: flex; justify-content: flex-end;">
        <van-button size="small" style="margin-right: 8px;">取消</van-button>
        <van-button size="small" type="primary">提交</van-button>
      </div>
    </template>
  </Module>
</template>

<script setup>
import Module from '@/views/components/Module.vue';
import { Button as VanButton } from 'vant';
</script>
```