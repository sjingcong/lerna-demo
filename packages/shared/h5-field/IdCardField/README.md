# IdCardField 身份证输入框

基于 vant Field 组件封装的身份证号码输入框，支持15位和18位身份证号码的输入和校验。 <mcreference link="https://m.myjson.cn/idcard.html" index="1">1</mcreference> <mcreference link="https://juejin.cn/post/7044065410123038734" index="2">2</mcreference>

## 功能特性

- 🎯 **双格式支持**：同时支持15位（第一代）和18位（第二代）身份证号码
- 🔍 **智能校验**：内置身份证号码格式校验和校验码验证
- 📊 **信息解析**：自动解析身份证中的地区、出生日期、年龄、性别信息
- 🛡️ **输入过滤**：自动过滤非法字符，只允许数字和X
- 📱 **移动优化**：基于 vant 组件，完美适配移动端
- 🎨 **高度可定制**：支持自定义校验规则和触发时机
- 📋 **表单集成**：与 van-form 完美集成

## 基础用法

```vue
<template>
  <IdCardField
    v-model="idCard"
    label="身份证号码"
    placeholder="请输入身份证号码"
  />
</template>

<script setup>
import { ref } from 'vue';
import IdCardField from './IdCardField/index.vue';

const idCard = ref('');
</script>
```

## 高级用法

### 禁用内置校验

```vue
<template>
  <IdCardField
    v-model="idCard"
    :enable-built-in-validation="false"
    :rules="customRules"
  />
</template>

<script setup>
const customRules = [
  {
    validator: (value) => {
      // 自定义校验逻辑
      return value.length >= 15;
    },
    message: '身份证号码长度不正确'
  }
];
</script>
```

### 自定义校验触发时机

```vue
<template>
  <IdCardField
    v-model="idCard"
    trigger="onChange"
  />
</template>
```

### 获取身份证信息

```vue
<template>
  <IdCardField
    ref="idCardRef"
    v-model="idCard"
    @input="handleInput"
  />
  
  <div v-if="idCardInfo.isValid">
    <p>地区码：{{ idCardInfo.region }}</p>
    <p>出生日期：{{ idCardInfo.birthDate }}</p>
    <p>年龄：{{ idCardInfo.age }}岁</p>
    <p>性别：{{ idCardInfo.gender }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const idCardRef = ref();
const idCard = ref('');

const idCardInfo = computed(() => {
  return idCardRef.value?.getIdCardInfo() || {};
});

const handleInput = (value) => {
  console.log('身份证号码：', value);
  console.log('是否有效：', idCardRef.value?.isValid.value);
};
</script>
```

### 监听身份证有效性变化

```vue
<template>
  <IdCardField
    v-model="idCard"
    @id-parsed="handleIdParsed"
  />
</template>

<script setup>
import { ref } from 'vue';

const idCard = ref('');

const handleIdParsed = (info) => {
  console.log('身份证变为有效，信息：', info);
  console.log('性别：', info.gender);
  console.log('生日：', info.birthDate);
  console.log('年龄：', info.age);
  console.log('地区码：', info.region);
};
</script>
```

### 配置支持的身份证位数

```vue
<template>
  <!-- 只支持18位身份证 -->
  <IdCardField
    v-model="idCard18"
    :supported-lengths="[18]"
    label="18位身份证号码"
  />
  
  <!-- 只支持15位身份证 -->
  <IdCardField
    v-model="idCard15"
    :supported-lengths="[15]"
    label="15位身份证号码"
  />
  
  <!-- 默认支持15位和18位 -->
  <IdCardField
    v-model="idCardBoth"
    label="身份证号码"
  />
</template>

<script setup>
import { ref } from 'vue';

const idCard18 = ref('');
const idCard15 = ref('');
const idCardBoth = ref('');
</script>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| modelValue | 输入框的值 | string | '' |
| label | 输入框左侧文本 | string | '身份证号码' |
| placeholder | 占位提示文字 | string | '请输入身份证号码' |
| required | 是否为必填项 | boolean | false |
| readonly | 是否只读 | boolean | false |
| disabled | 是否禁用 | boolean | false |
| clearable | 是否启用清除图标 | boolean | true |
| name | 名称，提交表单时的标识符 | string | 'idCard' |
| rules | 表单校验规则 | any[] | [] |
| enableBuiltInValidation | 是否启用内置身份证格式校验 | boolean | true |
| trigger | 校验触发时机 | 'onChange' \| 'onBlur' \| string | 'onBlur' |
| supportedLengths | 支持的身份证位数 | number[] | [15, 18] |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 输入框内容变化时触发 | value: string |
| input | 输入框内容变化时触发 | value: string |
| blur | 输入框失去焦点时触发 | event: Event |
| focus | 输入框获得焦点时触发 | event: Event |
| id-parsed | 身份证号码变为有效时触发，抛出身份证信息 | info: IdCardInfo |

### Expose

| 名称 | 说明 | 类型 |
|------|------|------|
| value | 当前输入的身份证号码 | Ref\<string> |
| isValid | 身份证号码是否有效 | Ref\<boolean> |
| idCardInfo | 身份证信息对象 | Ref\<IdCardInfo> |
| getIdCardInfo | 获取身份证信息的方法 | () => IdCardInfo |

### IdCardInfo 类型

```typescript
interface IdCardInfo {
  isValid: boolean;    // 是否有效
  region: string;      // 地区码（前6位）
  birthDate: string;   // 出生日期 YYYY-MM-DD
  age: number;         // 年龄
  gender: string;      // 性别：男/女
}
```

## 校验规则

### 内置校验

组件内置了完整的身份证号码校验逻辑：

1. **15位身份证校验** <mcreference link="https://m.myjson.cn/idcard.html" index="1">1</mcreference>
   - 格式：地区码(6位) + 出生年月日(6位) + 顺序码(3位)
   - 年份：2位数字，自动补充"19"
   - 正则表达式：`/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/`

2. **18位身份证校验** <mcreference link="https://juejin.cn/post/7044065410123038734" index="2">2</mcreference>
   - 格式：地区码(6位) + 出生年月日(8位) + 顺序码(3位) + 校验码(1位)
   - 校验码：根据前17位数字通过特定算法计算得出
   - 支持校验码为X的情况
   - 正则表达式：`/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/`

### van-form 校验规则格式

```typescript
// 使用 any 类型以兼容 vant 的校验规则
type VantRule = any;
```

### 身份证格式说明

#### 15位身份证（第一代）
- **位数1-6**：地区码
- **位数7-12**：出生年月日（YYMMDD）
- **位数13-15**：顺序码（奇数为男性，偶数为女性）

#### 18位身份证（第二代） <mcreference link="http://gaj.jinhua.gov.cn/art/2023/12/7/art_1229180934_59014554.html" index="3">3</mcreference>
- **位数1-6**：地区码
- **位数7-14**：出生年月日（YYYYMMDD）
- **位数15-17**：顺序码（第17位奇数为男性，偶数为女性）
- **位数18**：校验码（0-9或X）

### 校验码算法 <mcreference link="https://blog.csdn.net/cheney_888/article/details/97321739" index="5">5</mcreference>

18位身份证的校验码通过以下算法计算：

1. 将前17位数字分别乘以对应的加权因子：`[7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2]`
2. 将乘积求和
3. 用和除以11取余数
4. 根据余数对应校验码：`['1','0','X','9','8','7','6','5','4','3','2']`

### 自定义校验规则示例

```typescript
// 必填校验
const requiredRule: any = {
  required: true,
  message: '请输入身份证号码'
};

// 自定义格式校验
const customFormatRule: any = {
  validator: (value: string) => {
    if (!value) return true;
    return value.length === 15 || value.length === 18;
  },
  message: '身份证号码长度必须为15位或18位'
};

// 年龄限制校验
const ageRule: any = {
  validator: (value: string) => {
    if (!value) return true;
    const info = getIdCardInfo(value);
    return info.isValid && info.age >= 18;
  },
  message: '年龄必须满18岁'
};
```

## 使用注意事项

1. **输入过滤**：组件会自动过滤非数字和非X字符，确保输入的纯净性
2. **大小写处理**：校验码X会自动转换为大写
3. **校验时机**：默认在失去焦点时校验，可通过`trigger`属性自定义
4. **兼容性**：同时支持15位和18位身份证，满足不同用户需求
5. **性能优化**：校验逻辑经过优化，确保输入流畅性
6. **错误处理**：提供详细的错误提示信息，帮助用户正确输入