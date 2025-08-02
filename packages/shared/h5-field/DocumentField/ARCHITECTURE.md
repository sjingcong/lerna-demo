# DocumentField 组件架构说明

## 📋 概述

DocumentField 组件采用模块化架构设计，将每种证件类型的逻辑分离到独立的校验器文件中，提高了代码的可维护性、可扩展性和可测试性。

## 🏗️ 架构设计

### 核心设计原则

1. **单一职责**: 每个校验器只负责一种证件类型
2. **开闭原则**: 对扩展开放，对修改封闭
3. **接口隔离**: 统一的校验器接口
4. **依赖倒置**: 依赖抽象而非具体实现

### 目录结构

```
DocumentField/
├── index.vue                    # 主组件 - 组合各子组件
├── types.ts                     # 全局类型定义
├── constants.ts                 # 常量配置 - 从校验器动态生成
├── components/                  # UI 组件
│   ├── DocumentTypeSelector.vue # 证件类型选择器
│   └── DocumentInput.vue        # 证件输入框
├── validators/                  # 证件校验器（核心架构）
│   ├── index.ts                 # 统一导出所有校验器
│   ├── types.ts                 # 校验器接口和类型定义
│   ├── idCard.ts                # 身份证校验器实现
│   ├── passport.ts              # 护照校验器实现
│   └── hkMacaoTaiwan.ts         # 港澳台通行证校验器实现
├── utils/                       # 工具函数
│   └── validation.ts            # 校验逻辑统一入口
├── props.json                   # 组件属性配置
├── preview.vue                  # 组件预览示例
├── README.md                    # 使用文档
├── INSTALL.md                   # 依赖安装指南
└── ARCHITECTURE.md              # 架构说明文档
```

## 🔧 核心模块详解

### 1. 校验器接口 (`validators/types.ts`)

定义了统一的校验器接口，确保所有证件类型的实现保持一致：

```typescript
export interface DocumentValidator {
  config: DocumentConfig          // 证件配置信息
  validate(value: string): ValidationResult    // 校验方法
  parse(value: string): ParseResult           // 解析方法
  format?(value: string): string              // 格式化方法（可选）
}
```

### 2. 证件校验器实现

每个证件类型都有独立的校验器文件：

#### 身份证校验器 (`validators/idCard.ts`)
- **配置**: 18位格式、正则表达式、占位符等
- **校验**: 格式验证、校验码验证、地区代码验证、日期验证
- **解析**: 地区、出生日期、年龄、性别等信息
- **格式化**: 添加空格分隔（6位-8位-4位）
- **特性**: 优先使用 `id-validator` 库，回退到内置逻辑

#### 护照校验器 (`validators/passport.ts`)
- **配置**: 5-20位字母数字组合
- **校验**: 长度验证、字符验证、中国护照特殊格式验证
- **解析**: 护照类型、签发国家等信息
- **格式化**: 转换为大写字母

#### 港澳台通行证校验器 (`validators/hkMacaoTaiwan.ts`)
- **配置**: 9-11位字母+数字组合
- **校验**: 长度验证、格式验证、首位字母验证
- **解析**: 通行证类型、适用地区、签发年份等信息
- **格式化**: 转换为大写字母

### 3. 统一入口 (`utils/validation.ts`)

提供统一的校验、解析和格式化接口：

```typescript
// 根据证件类型获取对应的校验器
function getValidator(type: DocumentType): DocumentValidator

// 统一的校验接口
export function validateDocument(type: DocumentType, value: string): boolean

// 统一的解析接口
export async function parseDocumentInfo(type: DocumentType, value: string): Promise<DocumentInfo>

// 统一的格式化接口
export function formatDocument(type: DocumentType, value: string): string
```

### 4. 动态配置生成 (`constants.ts`)

从校验器动态生成配置，避免重复定义：

```typescript
// 从校验器获取配置
function createDocumentTypeOption(validator: DocumentValidator): DocumentTypeOption

// 动态生成配置数组
export const DOCUMENT_TYPE_OPTIONS: DocumentTypeOption[] = [
  createDocumentTypeOption(IdCardValidator),
  createDocumentTypeOption(PassportValidator),
  createDocumentTypeOption(HkMacaoTaiwanValidator)
]
```

## 🚀 扩展新证件类型

添加新的证件类型非常简单，只需要以下步骤：

### 1. 定义证件类型

在 `types.ts` 中添加新的枚举值：

```typescript
export enum DocumentType {
  ID_CARD = 'idcard',
  PASSPORT = 'passport',
  HK_MACAO_TAIWAN = 'hkmacaotaiwan',
  DRIVER_LICENSE = 'driverlicense'  // 新增
}
```

### 2. 创建校验器

创建 `validators/driverLicense.ts`：

```typescript
import type { DocumentValidator, ValidationResult, ParseResult, DocumentConfig } from './types'
import { DocumentType } from '../types'

export const DRIVER_LICENSE_CONFIG: DocumentConfig = {
  type: DocumentType.DRIVER_LICENSE,
  text: '驾驶证',
  placeholder: '请输入驾驶证号码',
  maxLength: 18,
  pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
}

class DriverLicenseValidator implements DocumentValidator {
  config = DRIVER_LICENSE_CONFIG

  validate(value: string): ValidationResult {
    // 实现校验逻辑
  }

  async parse(value: string): Promise<ParseResult> {
    // 实现解析逻辑
  }

  format(value: string): string {
    // 实现格式化逻辑
  }
}

export default new DriverLicenseValidator()
```

### 3. 注册校验器

在 `validators/index.ts` 中导出：

```typescript
export { default as DriverLicenseValidator } from './driverLicense'
```

在 `utils/validation.ts` 中添加映射：

```typescript
function getValidator(type: DocumentType): DocumentValidator {
  switch (type) {
    // ... 其他类型
    case DocumentType.DRIVER_LICENSE:
      return DriverLicenseValidator
    default:
      throw new Error(`Unsupported document type: ${type}`)
  }
}
```

在 `constants.ts` 中添加到配置数组：

```typescript
export const DOCUMENT_TYPE_OPTIONS: DocumentTypeOption[] = [
  // ... 其他校验器
  createDocumentTypeOption(DriverLicenseValidator)
]
```

## 🎯 架构优势

### 1. **高内聚低耦合**
- 每个校验器独立管理自己的逻辑
- 组件间通过接口通信，减少依赖

### 2. **易于维护**
- 修改某种证件类型的逻辑不影响其他类型
- 代码结构清晰，便于定位问题

### 3. **易于测试**
- 每个校验器可以独立测试
- 接口明确，便于编写单元测试

### 4. **易于扩展**
- 新增证件类型只需实现接口
- 不需要修改现有代码

### 5. **配置统一**
- 所有配置从校验器动态生成
- 避免重复定义和不一致问题

### 6. **向后兼容**
- 保持原有的 API 接口不变
- 现有使用方式无需修改

## 🔄 迁移指南

如果你正在使用旧版本的 DocumentField 组件，新架构完全向后兼容，无需修改现有代码。新架构的优势会自动生效：

- 更准确的身份证校验（如果安装了 `id-validator`）
- 更好的格式化显示
- 更详细的证件信息解析
- 更清晰的错误提示

## 📚 相关文档

- [使用文档](./README.md)
- [安装指南](./INSTALL.md)
- [组件预览](./preview.vue)
- [类型定义](./types.ts)