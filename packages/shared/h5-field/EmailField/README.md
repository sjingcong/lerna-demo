# EmailField 邮箱输入组件

基于 `van-field` 封装的邮箱输入组件，配合 `van-form` 使用，提供完整的邮箱校验功能。

## 功能特性

- ✅ 基于 van-field，继承所有原生功能
- ✅ 配合 van-form 使用，支持表单统一校验
- ✅ 内置邮箱格式校验规则
- ✅ 支持自定义校验规则
- ✅ 邮箱域名识别功能
- ✅ 可选择启用/禁用内置校验
- ✅ TypeScript 完整支持

## 基础用法

```vue
<template>
  <van-form ref="formRef">
    <EmailField 
      v-model="email" 
      name="email"
      label="邮箱" 
      placeholder="请输入邮箱地址"
      required
    />
    <van-button type="primary" @click="onSubmit">提交</van-button>
  </van-form>
</template>

<script setup>
import { ref } from 'vue'
import { EmailField } from '@/components/h5-field'

const formRef = ref()
const email = ref('')

const onSubmit = () => {
  formRef.value.validate().then(() => {
    console.log('校验通过', email.value)
  }).catch(() => {
    console.log('校验失败')
  })
}
</script>
```

## 高级用法

### 禁用内置校验

```vue
<template>
  <van-form ref="formRef">
    <EmailField 
      v-model="email" 
      name="email"
      :enable-built-in-validation="false"
      :rules="customRules"
    />
  </van-form>
</template>

<script setup>
const customRules = [
  {
    required: true,
    message: '请输入邮箱地址'
  },
  {
    validator: (value) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
    message: '请输入正确的邮箱格式'
  }
]
</script>
```

### 添加自定义校验规则

```vue
<template>
  <van-form ref="formRef">
    <EmailField 
      v-model="email" 
      name="email"
      :rules="extraRules"
    />
  </van-form>
</template>

<script setup>
const extraRules = [
  {
    validator: (value) => {
      // 不允许使用临时邮箱域名
      const tempDomains = ['10minutemail.com', 'guerrillamail.com']
      const domain = value.split('@')[1]
      return !tempDomains.includes(domain)
    },
    message: '不支持临时邮箱'
  },
  {
    validator: async (value) => {
      // 异步校验邮箱是否已存在
      const exists = await checkEmailExists(value)
      return !exists
    },
    message: '邮箱已存在'
  }
]
</script>
```

### 自定义校验触发时机

通过 `trigger` 属性可以控制内置校验规则的触发时机：

- `onBlur`：失焦时校验（默认，用户体验更好）
- `onChange`：输入时实时校验（即时反馈）

```vue
<template>
  <van-form ref="formRef">
    <!-- 实时校验 -->
    <EmailField
      v-model="email"
      name="email"
      required
      trigger="onChange"
    />
    <van-button @click="handleSubmit">提交</van-button>
  </van-form>
</template>

<script setup>
import { ref } from 'vue'
import { EmailField } from '@shared/h5-field'

const email = ref('')
const formRef = ref()

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    console.log('校验通过', email.value)
  } catch (error) {
    console.log('校验失败', error)
  }
}
</script>
```

### 获取邮箱域名信息

```vue
<template>
  <van-form>
    <EmailField 
      ref="emailFieldRef"
      v-model="email" 
      name="email"
    />
    <div>邮箱域名: {{ domain }}</div>
    <div>格式有效: {{ isValid ? '是' : '否' }}</div>
  </van-form>
</template>

<script setup>
import { ref, computed } from 'vue'

const emailFieldRef = ref()
const email = ref('')

const domain = computed(() => {
  return emailFieldRef.value?.domain || ''
})

const isValid = computed(() => {
  return emailFieldRef.value?.isValid || false
})
</script>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| modelValue | 绑定值 | string | '' |
| label | 标签文本 | string | '邮箱' |
| placeholder | 占位符 | string | '请输入邮箱地址' |
| required | 是否必填 | boolean | false |
| readonly | 是否只读 | boolean | false |
| disabled | 是否禁用 | boolean | false |
| clearable | 是否显示清除按钮 | boolean | true |
| name | 字段名称（van-form 必需） | string | 'email' |
| rules | 自定义校验规则 | Array<VantRule> | [] |
| enableBuiltInValidation | 是否启用内置校验 | boolean | true |
| trigger | 校验触发时机 | 'onBlur' \| 'onChange' | 'onBlur' |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 值变化时触发 | (value: string) |
| input | 输入时触发 | (value: string) |
| blur | 失焦时触发 | (event: Event) |
| focus | 聚焦时触发 | (event: Event) |

### Expose

通过 ref 可以访问以下属性和方法：

| 属性/方法 | 说明 | 类型 |
|-----------|----- |------|
| isValid | 是否有效（基础格式校验） | ComputedRef<boolean> |
| domain | 邮箱域名 | ComputedRef<string> |
| value | 当前值 | ComputedRef<string> |
| getDomain | 获取邮箱域名 | () => string |

## 校验规则

### 内置校验规则

当 `enableBuiltInValidation` 为 `true`（默认）时，组件会自动添加以下校验规则：

1. **必填校验**：当 `required` 为 `true` 时生效
2. **格式校验**：使用标准邮箱正则表达式校验格式

### van-form 校验规则格式

组件使用标准的 van-form 校验规则格式：

```typescript
interface VantRule {
  required?: boolean
  message?: string
  validator?: (value: any) => boolean | Promise<boolean>
  pattern?: RegExp
  trigger?: 'onBlur' | 'onChange'
}
```

### 邮箱格式校验

内置的邮箱正则表达式：
```javascript
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
```

此正则表达式支持：
- 用户名部分：字母、数字、点号、下划线、百分号、加号、减号
- 域名部分：字母、数字、点号、减号
- 顶级域名：至少2个字母

### 常见邮箱域名

组件内置了常见邮箱域名列表，可用于域名提示或校验：

- gmail.com
- qq.com
- 163.com
- 126.com
- sina.com
- sohu.com
- hotmail.com
- yahoo.com
- outlook.com
- foxmail.com

### 自定义校验规则示例

```javascript
const customRules = [
  // 基础校验
  {
    required: true,
    message: '请输入邮箱地址'
  },
  // 正则校验
  {
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: '请输入正确的邮箱格式'
  },
  // 自定义校验函数
  {
    validator: (value) => {
      // 只允许企业邮箱
      const personalDomains = ['qq.com', '163.com', '126.com', 'gmail.com']
      const domain = value.split('@')[1]
      return !personalDomains.includes(domain)
    },
    message: '请使用企业邮箱'
  },
  // 异步校验
  {
    validator: async (value) => {
      const available = await checkEmailAvailable(value)
      return available
    },
    message: '邮箱已被占用'
  }
]
```

## 注意事项

1. **必须配合 van-form 使用**：组件依赖 van-form 的校验机制
2. **name 属性必需**：在 van-form 中使用时必须设置 `name` 属性
3. **校验时机**：校验时机由 van-form 和 rules 中的 `trigger` 属性控制
4. **内置校验**：默认启用内置校验，可通过 `enableBuiltInValidation` 关闭
5. **规则合并**：自定义 rules 会与内置校验规则合并
6. **域名识别**：组件会自动识别邮箱域名，可通过 `getDomain()` 方法获取
7. **基于 Vant**：组件基于 Vant 的 `van-field` 组件开发，继承其所有特性
8. **输入类型**：使用 `type="email"` 在移动端会调起邮箱键盘