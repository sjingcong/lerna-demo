# PhoneField 手机号输入组件

基于 `van-field` 封装的手机号输入组件，配合 `van-form` 使用，提供完整的手机号校验功能。

## 功能特性

- ✅ 基于 van-field，继承所有原生功能
- ✅ 配合 van-form 使用，支持表单统一校验
- ✅ 内置手机号校验规则（长度、格式、号段）
- ✅ 支持自定义校验规则
- ✅ 运营商识别功能
- ✅ 实时数字过滤
- ✅ 可选择启用/禁用内置校验
- ✅ TypeScript 完整支持

## 基础用法

```vue
<template>
  <van-form ref="formRef">
    <PhoneField 
      v-model="phone" 
      name="phone"
      label="手机号" 
      placeholder="请输入手机号"
      required
    />
    <van-button type="primary" @click="onSubmit">提交</van-button>
  </van-form>
</template>

<script setup>
import { ref } from 'vue'
import { PhoneField } from '@/components/h5-field'

const formRef = ref()
const phone = ref('')

const onSubmit = () => {
  formRef.value.validate().then(() => {
    console.log('校验通过', phone.value)
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
    <PhoneField 
      v-model="phone" 
      name="phone"
      :enable-built-in-validation="false"
      :rules="customRules"
    />
  </van-form>
</template>

<script setup>
const customRules = [
  {
    required: true,
    message: '请输入手机号'
  },
  {
    validator: (value) => /^1[3-9]\d{9}$/.test(value),
    message: '请输入正确的手机号格式'
  }
]
</script>
```

### 添加自定义校验规则

```vue
<template>
  <van-form ref="formRef">
    <PhoneField 
      v-model="phone" 
      name="phone"
      :rules="extraRules"
    />
  </van-form>
</template>

<script setup>
const extraRules = [
  {
    validator: (value) => {
      // 不允许138号段
      return !value.startsWith('138')
    },
    message: '不支持138号段'
  },
  {
    validator: async (value) => {
      // 异步校验手机号是否已存在
      const exists = await checkPhoneExists(value)
      return !exists
    },
    message: '手机号已存在'
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
    <PhoneField
      v-model="phone"
      name="phone"
      required
      trigger="onChange"
    />
    <van-button @click="handleSubmit">提交</van-button>
  </van-form>
</template>

<script setup>
import { ref } from 'vue'
import { PhoneField } from '@shared/h5-field'

const phone = ref('')
const formRef = ref()

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    console.log('校验通过', phone.value)
  } catch (error) {
    console.log('校验失败', error)
  }
}
</script>
```

### 获取运营商信息

```vue
<template>
  <van-form>
    <PhoneField 
      ref="phoneFieldRef"
      v-model="phone" 
      name="phone"
    />
    <div>运营商: {{ carrier }}</div>
  </van-form>
</template>

<script setup>
import { ref, computed } from 'vue'

const phoneFieldRef = ref()
const phone = ref('')

const carrier = computed(() => {
  return phoneFieldRef.value?.carrier || ''
})
</script>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| modelValue | 绑定值 | string | '' |
| label | 标签文本 | string | '手机号' |
| placeholder | 占位符 | string | '请输入手机号' |
| required | 是否必填 | boolean | false |
| readonly | 是否只读 | boolean | false |
| disabled | 是否禁用 | boolean | false |
| clearable | 是否显示清除按钮 | boolean | true |
| name | 字段名称（van-form 必需） | string | 'phone' |
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
| carrier | 运营商信息 | ComputedRef<string> |
| value | 当前值 | ComputedRef<string> |
| getCarrier | 获取运营商信息 | () => string |

## 校验规则

### 内置校验规则

当 `enableBuiltInValidation` 为 `true`（默认）时，组件会自动添加以下校验规则：

1. **必填校验**：当 `required` 为 `true` 时生效
2. **长度校验**：必须为11位数字
3. **格式校验**：必须以1开头的11位数字
4. **号段校验**：支持中国移动、联通、电信的号段

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

### 支持的运营商号段

- **中国移动**: 134, 135, 136, 137, 138, 139, 147, 150, 151, 152, 157, 158, 159, 172, 178, 182, 183, 184, 187, 188, 195, 198
- **中国联通**: 130, 131, 132, 145, 155, 156, 166, 171, 175, 176, 185, 186, 196
- **中国电信**: 133, 149, 153, 173, 174, 177, 180, 181, 189, 191, 193, 199

### 自定义校验规则示例

```javascript
const customRules = [
  // 基础校验
  {
    required: true,
    message: '请输入手机号'
  },
  // 正则校验
  {
    pattern: /^1[3-9]\d{9}$/,
    message: '请输入正确的手机号格式'
  },
  // 自定义校验函数
  {
    validator: (value) => {
      return !value.startsWith('170')
    },
    message: '不支持170号段'
  },
  // 异步校验
  {
    validator: async (value) => {
      const available = await checkPhoneAvailable(value)
      return available
    },
    message: '号码已被占用'
  }
]
```

## 注意事项

1. **必须配合 van-form 使用**：组件依赖 van-form 的校验机制
2. **name 属性必需**：在 van-form 中使用时必须设置 `name` 属性
3. **校验时机**：校验时机由 van-form 和 rules 中的 `trigger` 属性控制
4. **内置校验**：默认启用内置校验，可通过 `enableBuiltInValidation` 关闭
5. **规则合并**：自定义 rules 会与内置校验规则合并
6. **运营商识别**：组件会自动识别运营商信息，可通过 `getCarrier()` 方法获取
7. **基于 Vant**：组件基于 Vant 的 `van-field` 组件开发，继承其所有特性