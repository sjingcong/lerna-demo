<template>
  <div class="module-card-demo">
    <h2 class="page-title">模块卡片组件示例</h2>
    
    <!-- 基本使用 -->
    <ModuleCard title="基本信息">
      <div class="demo-content">
        <p>这是一个基本的模块卡片，只设置了标题。</p>
      </div>
    </ModuleCard>
    
    <!-- 带图标 -->
    <ModuleCard 
      title="用户信息" 
      icon="/icons/user.svg"
    >
      <div class="demo-content">
        <p><strong>姓名:</strong> 张三</p>
        <p><strong>电话:</strong> 13800138000</p>
        <p><strong>地址:</strong> 北京市朝阳区</p>
      </div>
    </ModuleCard>
    
    <!-- 订单信息 -->
    <ModuleCard 
      title="订单信息" 
      icon="/icons/shopping-cart.svg"
    >
      <div class="demo-content">
        <p><strong>订单编号:</strong> ORD20230001</p>
        <p><strong>下单时间:</strong> 2023-06-15 14:30</p>
        <p><strong>支付状态:</strong> <span class="status-paid">已支付</span></p>
      </div>
    </ModuleCard>
    
    <!-- 复杂内容 -->
    <ModuleCard 
      title="商品列表" 
      icon="/icons/star.svg"
    >
      <div class="product-list">
        <div class="product-item" v-for="(item, index) in products" :key="index">
          <div class="product-name">{{ item.name }}</div>
          <div class="product-price">¥{{ item.price }}</div>
          <div class="product-quantity">x{{ item.quantity }}</div>
        </div>
        <div class="total-row">
          <span>总计:</span>
          <span class="total-price">¥{{ totalPrice }}</span>
        </div>
      </div>
    </ModuleCard>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ModuleCard from './ModuleCard.vue';

// 示例数据
const products = [
  { name: '商品A', price: 99, quantity: 1 },
  { name: '商品B', price: 199, quantity: 2 },
  { name: '商品C', price: 59, quantity: 3 }
];

// 计算总价
const totalPrice = computed(() => {
  return products.reduce((sum, item) => sum + item.price * item.quantity, 0);
});
</script>

<style scoped>
.module-card-demo {
  padding: 16px;
  background-color: #f7f8fa;
  min-height: 100vh;
}

.page-title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 20px;
  color: #323233;
}

.demo-content {
  line-height: 1.6;
}

.status-paid {
  color: #07c160;
  font-weight: 500;
}

.product-list {
  width: 100%;
}

.product-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.product-name {
  flex: 2;
}

.product-price, .product-quantity {
  flex: 1;
  text-align: right;
}

.total-row {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  font-weight: bold;
}

.total-price {
  color: #ee0a24;
}
</style>