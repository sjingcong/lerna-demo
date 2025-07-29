# OrderList 订单列表模块

## 📁 文件结构

```
OrderList/
├── index.vue          # 订单列表主组件
├── store.ts          # Pinia状态管理
└── README.md         # 模块说明文档
```

## 🎯 功能特性

### 📱 UI组件
- **搜索功能**：使用 `van-search` 组件实现订单搜索
- **Tab切换**：使用 `van-tabs` 组件实现状态筛选
- **列表展示**：使用 `van-list` 组件实现订单列表
- **下拉刷新**：使用 `van-pull-refresh` 组件实现数据刷新
- **触底加载**：支持无限滚动加载更多数据

### 🔄 状态管理
- **Pinia Store**：集中管理订单列表状态
- **分Tab缓存**：每个Tab独立缓存数据，提升用户体验
- **搜索状态**：保持搜索关键词和结果
- **分页管理**：自动处理分页逻辑

## 📊 数据结构

### Order 订单接口
```typescript
interface Order {
  id: string                // 订单ID
  title: string            // 订单标题
  orderNo: string          // 订单号
  insuredPerson: string    // 投保人
  salesperson: string      // 业务员
  amount: string           // 订单金额
  status: OrderStatus      // 订单状态
  createTime?: string      // 创建时间
  updateTime?: string      // 更新时间
}
```

### OrderStatus 订单状态
```typescript
type OrderStatus = 'all' | 'pending' | 'completed' | 'reviewing'
```

## 🛠️ Store API

### 状态 (State)
- `activeTab`: 当前激活的Tab
- `searchValue`: 搜索关键词
- `orderListMap`: 按Tab分组的订单数据
- `loadingMap`: 各Tab的加载状态
- `refreshingMap`: 各Tab的刷新状态
- `paginationMap`: 各Tab的分页信息
- `tabConfigs`: Tab配置信息

### 计算属性 (Getters)
- `currentOrderList`: 当前Tab的订单列表
- `currentLoading`: 当前Tab的加载状态
- `currentRefreshing`: 当前Tab的刷新状态
- `currentPagination`: 当前Tab的分页信息
- `isFinished`: 是否已加载完成

### 方法 (Actions)
- `fetchOrderList(tab, page, isRefresh)`: 获取订单列表
- `switchTab(tab)`: 切换Tab
- `loadMore()`: 加载更多数据
- `refresh()`: 下拉刷新
- `search(keyword)`: 搜索订单
- `clearSearch()`: 清空搜索
- `handlePayment(order)`: 处理支付
- `updateOrderStatus(orderId, newStatus)`: 更新订单状态
- `init()`: 初始化数据
- `reset()`: 重置状态

## 🚀 使用方法

### 1. 在组件中使用Store
```vue
<script setup lang="ts">
import { useOrderListStore } from './store'

const orderStore = useOrderListStore()
const { 
  activeTab, 
  currentOrderList, 
  switchTab, 
  refresh 
} = orderStore
</script>
```

### 2. 路由配置
```typescript
// router/index.ts
{
  path: '/orders',
  name: 'OrderList',
  component: () => import('@/views/OrderList/index.vue')
}
```

### 3. 页面跳转
```typescript
// 跳转到订单列表
router.push('/orders')

// 跳转到特定Tab（可通过query参数）
router.push('/orders?tab=pending')
```

## 🎨 样式说明

### 主要样式类
- `.order-list-page`: 页面容器
- `.search-container`: 搜索框容器
- `.order-item`: 订单项容器
- `.order-header`: 订单头部
- `.order-details`: 订单详情
- `.order-footer`: 订单底部
- `.status-*`: 状态样式类

### 状态颜色
- `status-pending`: 待支付（橙色）
- `status-completed`: 已完成（绿色）
- `status-reviewing`: 审核中（蓝色）

## 🔧 扩展开发

### 添加新的订单状态
1. 在 `store.ts` 中更新 `OrderStatus` 类型
2. 在 `tabConfigs` 中添加新的Tab配置
3. 在样式中添加对应的状态样式类

### 自定义订单项样式
1. 修改 `.order-item` 相关样式
2. 可以通过插槽的方式自定义订单项内容

### 集成真实API
1. 替换 `store.ts` 中的模拟数据
2. 修改 `fetchOrderList` 方法调用真实API
3. 添加错误处理和loading状态

## 📱 移动端适配

- 使用 `vant` 组件库，天然支持移动端
- 响应式设计，适配不同屏幕尺寸
- 触摸友好的交互体验
- 支持下拉刷新和触底加载

## 🐛 常见问题

### Q: Tab切换时数据丢失？
A: Store会为每个Tab独立缓存数据，切换时不会丢失。如果出现数据丢失，检查是否正确使用了Store。

### Q: 搜索后切换Tab，搜索条件是否保持？
A: 是的，搜索条件会在所有Tab间保持，这是设计的预期行为。

### Q: 如何清空某个Tab的缓存？
A: 可以调用 `orderListMap.value[tab] = []` 来清空特定Tab的数据。

### Q: 如何禁用某个Tab？
A: 在 `tabConfigs` 中添加 `disabled` 属性，并在模板中绑定到 `van-tab` 组件。