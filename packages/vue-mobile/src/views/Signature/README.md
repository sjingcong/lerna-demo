# 电子签名组件

基于 Canvas 的电子签名组件，支持轨迹识别和多种交互功能。

## 功能特性

### 🎨 基础功能
- ✅ 手写签名支持（触摸和鼠标）
- ✅ 实时绘制预览
- ✅ 签名清除功能
- ✅ 签名保存为图片

### 🎯 高级功能
- ✅ **轨迹识别**：记录签名过程中的所有轨迹点
- ✅ **笔触设置**：可调节笔触粗细（1-10px）
- ✅ **颜色选择**：12种预设颜色可选
- ✅ **签名预览**：实时预览签名效果
- ✅ **性能统计**：显示签名时长、速度等信息

### 📊 轨迹分析
- **轨迹点数**：记录签名过程中的所有坐标点
- **笔画数量**：自动识别笔画数量（基于时间间隔）
- **签名时长**：从开始到结束的总时间
- **平均速度**：计算签名的平均移动速度

## 技术实现

### 核心技术
- **Canvas 2D API**：用于绘制和渲染
- **Touch Events**：支持移动端触摸操作
- **Mouse Events**：支持桌面端鼠标操作
- **轨迹算法**：实时记录和分析签名轨迹

### 轨迹识别算法
```typescript
interface TrackPoint {
  x: number        // X坐标
  y: number        // Y坐标  
  timestamp: number // 时间戳
  pressure?: number // 压感（预留）
}
```

### 数据结构
- 实时记录每个轨迹点的坐标和时间戳
- 通过时间间隔（>200ms）自动识别笔画分割
- 计算总距离和平均速度进行性能分析

## 使用方法

### 路由配置
```typescript
// router/index.ts
{
  path: '/signature',
  name: 'Signature',
  component: () => import('@/views/Signature/index.vue')
}
```

### 页面跳转
```typescript
// 跳转到签名页面
this.$router.push('/signature')

// 或者传递参数
this.$router.push({
  name: 'Signature',
  query: {
    title: '订单签名',
    orderId: '12345'
  }
})
```

### 数据获取
签名完成后，会生成包含以下信息的数据：
```typescript
{
  image: string,        // Base64 格式的签名图片
  trackData: TrackPoint[], // 完整的轨迹数据
  trackInfo: {         // 轨迹统计信息
    points: number,    // 轨迹点数
    strokes: number,   // 笔画数
    duration: number,  // 签名时长(ms)
    avgSpeed: number   // 平均速度(px/ms)
  },
  timestamp: number    // 签名时间戳
}
```

## API 接口

### Props（预留扩展）
```typescript
interface SignatureProps {
  title?: string       // 页面标题
  readonly?: boolean   // 只读模式
  maxWidth?: number    // 最大画布宽度
  maxHeight?: number   // 最大画布高度
  strokeColor?: string // 默认笔触颜色
  strokeWidth?: number // 默认笔触粗细
}
```

### Events（预留扩展）
```typescript
// 签名完成事件
@signature-complete="handleSignature"

// 签名清除事件  
@signature-clear="handleClear"

// 轨迹更新事件
@track-update="handleTrackUpdate"
```

## 兼容性

- ✅ iOS Safari 12+
- ✅ Android Chrome 80+
- ✅ 微信内置浏览器
- ✅ 支付宝内置浏览器
- ✅ 现代桌面浏览器

## 性能优化

1. **Canvas 优化**
   - 使用 `devicePixelRatio` 适配高分辨率屏幕
   - 合理设置画布尺寸避免过度绘制

2. **事件优化**
   - 使用 `touch-action: none` 禁用默认手势
   - 合理节流轨迹点记录频率

3. **内存优化**
   - 及时清理轨迹数据
   - 避免大量轨迹点积累

## 扩展功能

### 可扩展特性
- [ ] 压感支持（需硬件支持）
- [ ] 签名模板匹配
- [ ] 笔迹特征提取
- [ ] 多人协同签名
- [ ] 签名加密存储
- [ ] 离线缓存支持

### 业务集成
- [ ] 与订单系统集成
- [ ] 与用户认证集成
- [ ] 与文档系统集成
- [ ] 审批流程集成