# DocumentField 证件输入框

专用于证件信息输入的表单组件，支持身份证、护照、港澳台通行证等多种证件类型的选择和输入验证。

## 特性

- 🎯 **多证件类型支持** - 支持身份证、护照、港澳台通行证
- 🔄 **双值绑定** - 同时管理证件类型和证件值
- ✅ **内置验证** - 提供各种证件类型的格式验证
- 📱 **移动端优化** - 基于 Vant 组件库，适配移动端
- 🧩 **组件化设计** - 证件类型选择器和输入框独立拆分
- 🎨 **高度可定制** - 支持自定义验证规则和样式

## 基础用法

```vue
<template>
  <DocumentField
    v-model="documentValue"
    label="证件信息"
    @document-parsed="handleDocumentParsed"
  />
</template>

<script setup>
import { ref } from 'vue'
import { DocumentField } from '@shared/h5-field/DocumentField'

const documentValue = ref({
  type: 'idcard',
  value: ''
})

const handleDocumentParsed = (info) => {
  console.log('解析结果:', info)
}
</script>
```

## 高级用法

### 限制证件类型

```vue
<DocumentField
  v-model="documentValue"
  label="证件信息"
  :supported-types="['idcard', 'passport']"
/>
```

### 自定义验证规则

```vue
<DocumentField
  v-model="documentValue"
  label="证件信息"
  :rules="[
    {
      validator: (value) => value.length >= 6,
      message: '证件号码长度不能少于6位'
    }
  ]"
/>
```

### 实时验证

```vue
<DocumentField
  v-model="documentValue"
  label="证件信息"
  trigger="onChange"
  :enable-built-in-validation="true"
/>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| modelValue | 绑定值 | `DocumentValue` | `{type: 'idcard', value: ''}` |
| label | 标签文本 | `string` | `'证件信息'` |
| placeholder | 占位符 | `string` | `''` |
| required | 是否必填 | `boolean` | `false` |
| readonly | 是否只读 | `boolean` | `false` |
| disabled | 是否禁用 | `boolean` | `false` |
| clearable | 是否可清空 | `boolean` | `true` |
| name | 表单项名称 | `string` | `'document'` |
| enableBuiltInValidation | 启用内置验证 | `boolean` | `true` |
| trigger | 验证触发时机 | `'onChange' \| 'onBlur'` | `'onBlur'` |
| supportedTypes | 支持的证件类型 | `DocumentType[]` | `['idcard', 'passport', 'hkmacaotaiwan']` |
| rules | 自定义验证规则 | `FieldRule[]` | `[]` |

### Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 值更新时触发 | `value: DocumentValue` |
| input | 输入时触发 | `value: DocumentValue` |
| blur | 失焦时触发 | `event: Event` |
| focus | 聚焦时触发 | `event: Event` |
| document-parsed | 证件信息解析完成时触发 | `info: DocumentInfo` |
| type-change | 证件类型变化时触发 | `type: DocumentType` |

### Methods

| 方法名 | 说明 | 参数 | 返回值 |
|--------|------|------|--------|
| getDocumentInfo | 获取当前证件信息 | - | `DocumentInfo` |

## 类型定义

### DocumentValue

```typescript
interface DocumentValue {
  type: DocumentType
  value: string
}
```

### DocumentType

```typescript
type DocumentType = 'idcard' | 'passport' | 'hkmacaotaiwan'
```

### DocumentInfo

```typescript
interface DocumentInfo {
  type: DocumentType
  value: string
  isValid: boolean
  // 身份证特有字段
  region?: string
  birthDate?: string
  age?: number
  gender?: 'male' | 'female'
  // 其他证件类型的扩展字段...
}
```

## 证件类型说明

### 身份证 (idcard)
- **格式**: 18位数字
- **验证**: 校验位验证、地区代码验证、出生日期验证
- **解析**: 可解析出地区、出生日期、年龄、性别等信息

### 护照 (passport)
- **格式**: 字母+数字组合，通常8-9位
- **验证**: 基本格式验证
- **解析**: 基础信息验证

### 港澳台通行证 (hkmacaotaiwan)
- **格式**: 字母+数字组合，通常8-10位
- **验证**: 基本格式验证
- **解析**: 基础信息验证

## 🏗️ 组件架构

```
DocumentField/
├── index.vue                    # 主组件
├── types.ts                     # 类型定义
├── constants.ts                 # 常量配置
├── components/                  # 子组件
│   ├── DocumentTypeSelector.vue # 证件类型选择器
│   └── DocumentInput.vue        # 证件输入框
├── validators/                  # 证件校验器（新架构）
│   ├── index.ts                 # 统一导出
│   ├── types.ts                 # 校验器类型定义
│   ├── idCard.ts                # 身份证校验器
│   ├── passport.ts              # 护照校验器
│   └── hkMacaoTaiwan.ts         # 港澳台通行证校验器
├── utils/                       # 工具函数
│   └── validation.ts            # 校验逻辑统一入口
├── props.json                   # 组件配置
├── preview.vue                  # 预览组件
├── README.md                    # 使用文档
└── INSTALL.md                   # 安装指南
```

### 🔧 新架构特点

**模块化设计**: 每种证件类型都有独立的校验器文件，包含：
- 证件配置（格式、长度、正则等）
- 校验逻辑（格式验证、业务规则验证）
- 信息解析（提取证件中的个人信息）
- 格式化功能（统一显示格式）

**统一接口**: 所有校验器都实现 `DocumentValidator` 接口，确保一致性

**易于扩展**: 新增证件类型只需：
1. 创建新的校验器文件
2. 在 `validators/index.ts` 中导出
3. 在 `utils/validation.ts` 中添加映射

## 依赖安装（推荐）

为了获得更准确的身份证校验，强烈建议安装 `id-validator` 开源库：

```bash
npm install id-validator --save
```

### 使用开源库的优势

- ✅ **更高准确性**: 经过大量测试验证的成熟算法
- ✅ **完整校验**: 支持校验码验证和地区代码验证
- ✅ **详细信息**: 提供完整的地区信息（基于GB2260标准）
- ✅ **持续维护**: 开源社区持续更新和维护
- ✅ **轻量级**: 压缩后仅3KB（不含地址库）

### 回退机制

如果未安装推荐的开源库，组件会自动回退到内置的基本校验逻辑，确保功能正常运行。

详细安装指南请参考：[INSTALL.md](./INSTALL.md)

## 注意事项

1. **双值绑定**: 该组件使用对象形式的 `v-model`，包含 `type` 和 `value` 两个字段
2. **验证时机**: 默认在失焦时验证，可通过 `trigger` 属性调整
3. **类型限制**: 可通过 `supportedTypes` 限制可选的证件类型
4. **扩展性**: 新增证件类型需要在 `constants.ts` 和 `validation.ts` 中添加相应配置
5. **依赖推荐**: 建议安装 `id-validator` 库以获得更好的校验体验

## 更新日志

### v1.0.0
- 初始版本
- 支持身份证、护照、港澳台通行证
- 提供完整的验证和解析功能
- 组件化设计，易于扩展