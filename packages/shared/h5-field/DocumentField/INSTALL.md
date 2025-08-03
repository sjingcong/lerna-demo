# CertificationField 安装指南

## 依赖安装

为了获得更好的身份证校验体验，建议安装以下开源库：

### 1. 安装 id-validator（推荐）

`id-validator` 是一个成熟的中国大陆身份证号码验证器，提供了完整的校验和信息解析功能。

```bash
npm install id-validator --save
```

#### 特性

- ✅ 支持15位和18位身份证号码
- ✅ 严格的校验码验证
- ✅ 地区代码验证（包含完整的GB2260地址库）
- ✅ 出生日期验证
- ✅ 详细信息解析（地区、出生日期、性别、年龄等）
- ✅ 3KB压缩后大小（不含地址库）
- ✅ 支持AMD/CMD/CommonJS/浏览器直接使用

#### 使用示例

```javascript
const IDValidator = require('id-validator');
const GB2260 = require('id-validator/src/GB2260');

// 创建验证器实例（带地址库）
const validator = new IDValidator(GB2260);

// 验证身份证号码
validator.isValid('110101199001011234'); // true/false

// 获取详细信息
const info = validator.getInfo('110101199001011234');
console.log(info);
/*
{
  addrCode: 110101,
  addr: '北京市东城区',
  birth: '1990-01-01',
  sex: 1, // 1为男，0为女
  checkBit: '4',
  length: 18
}
*/
```

### 2. 其他可选库

#### cn-validator

```bash
npm install cn-validator --save
```

支持身份证、营业执照、组织机构代码证的校验。

#### id-card-validator

```bash
npm install id-card-validator --save
```

专门用于身份证校验的轻量级库。

## 回退机制

如果没有安装推荐的开源库，CertificationField 组件会自动回退到内置的基本校验逻辑：

- ✅ 基本格式验证（正则表达式）
- ✅ 基本信息解析（地区、出生日期、性别）
- ⚠️ 无校验码验证
- ⚠️ 无详细地区信息

## 为什么推荐使用开源库？

### 1. 避免重复造轮子

身份证校验是一个复杂的业务逻辑，涉及：

- 复杂的校验码算法
- 完整的地区代码库（GB2260标准）
- 各种边界情况处理
- 15位和18位身份证的兼容性

### 2. 更高的准确性

开源库经过了大量的测试和实际项目验证，比自己实现的逻辑更加可靠。

### 3. 持续维护

开源库会持续更新地区代码库和修复bug，而自己维护这些数据成本很高。

### 4. 社区支持

遇到问题可以通过GitHub Issues获得社区支持。

## 性能对比

| 方案                  | 包大小 | 校验准确性 | 地区信息 | 维护成本 |
| --------------------- | ------ | ---------- | -------- | -------- |
| 自实现                | ~2KB   | 中等       | 基础     | 高       |
| id-validator          | ~3KB   | 高         | 完整     | 低       |
| id-validator + GB2260 | ~143KB | 高         | 详细     | 低       |

## 推荐配置

### 移动端项目（注重包大小）

```bash
npm install id-validator --save
# 不安装GB2260，使用基础地区信息
```

### PC端项目（注重功能完整性）

```bash
npm install id-validator --save
# 同时使用GB2260地址库获取详细地区信息
```

### 轻量级项目

```bash
# 不安装任何依赖，使用内置的基本校验
```

## 安装验证

安装完成后，可以通过以下方式验证是否正常工作：

```javascript
// 在浏览器控制台或Node.js中测试
try {
  const IDValidator = require('id-validator');
  const validator = new IDValidator();
  console.log(
    'id-validator 安装成功:',
    validator.isValid('110101199001011234')
  );
} catch (error) {
  console.log('id-validator 未安装，将使用基本校验');
}
```

## 常见问题

### Q: 为什么不直接内置这些库？

A: 为了保持组件的灵活性和包大小的可控性，让开发者根据项目需求选择合适的依赖。

### Q: 如果项目中已经有其他身份证校验库怎么办？

A: 可以修改 `validation.ts` 文件，替换为项目中已有的库。

### Q: 基本校验的准确性如何？

A: 基本校验只能验证格式和基本的日期有效性，无法验证校验码和详细的地区信息，准确性约为80%。

### Q: 是否支持其他国家的身份证？

A: 目前只支持中国大陆身份证，如需支持其他国家，可以扩展 `validation.ts` 文件。
