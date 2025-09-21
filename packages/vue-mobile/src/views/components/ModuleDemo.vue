<template>
  <div class="module-demo">
    <h2 class="page-title">模块组件示例</h2>
    
    <!-- 基本使用 -->
    <Module title="基本模块">
      <p>这是一个基本的模块，只设置了标题。</p>
    </Module>
    
    <!-- 带图标 -->
    <Module 
      title="带图标的模块" 
      icon="/icons/star.svg"
    >
      <p>这个模块带有图标。</p>
    </Module>
    
    <!-- 不同主题 -->
    <Module 
      title="浅色主题" 
      theme="light"
    >
      <p>这是浅色主题的模块（默认）。</p>
    </Module>
    
    <Module 
      title="深色主题" 
      theme="dark"
    >
      <p style="color: white">这是深色主题的模块。</p>
    </Module>
    
    <Module 
      title="主色调主题" 
      theme="primary"
    >
      <p style="color: white">这是主色调主题的模块。</p>
    </Module>
    
    <!-- 无边框 -->
    <Module 
      title="无边框模块" 
      :border="false"
    >
      <p>这个模块没有边框和阴影。</p>
    </Module>
    
    <!-- 无内边距 -->
    <Module 
      title="无内边距" 
      :noPadding="true"
    >
      <div style="background-color: #f2f3f5; padding: 16px;">
        <p>这个模块的内容区域没有默认内边距。</p>
      </div>
    </Module>
    
    <!-- 使用插槽 -->
    <Module>
      <template #header>
        <div style="display: flex; align-items: center;">
          <van-icon name="like" size="18" style="margin-right: 8px;" />
          <span>自定义头部</span>
        </div>
      </template>
      
      <p>这个模块使用了自定义头部插槽。</p>
    </Module>
    
    <!-- 额外内容插槽 -->
    <Module title="带额外操作">
      <template #extra>
        <van-button size="small" type="primary">操作</van-button>
      </template>
      
      <p>这个模块在标题旁边有额外的操作按钮。</p>
    </Module>
    
    <!-- 底部插槽 -->
    <Module title="带底部">
      <p>这个模块有底部区域。</p>
      
      <template #footer>
        <div style="display: flex; justify-content: flex-end;">
          <van-button size="small" style="margin-right: 8px;">取消</van-button>
          <van-button size="small" type="primary">确定</van-button>
        </div>
      </template>
    </Module>
    
    <!-- 复杂内容 -->
    <Module 
      title="订单信息" 
      icon="/icons/shopping-cart.svg"
    >
      <div class="order-info">
        <div class="info-item">
          <span class="label">订单编号:</span>
          <span class="value">ORD20230001</span>
        </div>
        <div class="info-item">
          <span class="label">下单时间:</span>
          <span class="value">2023-06-15 14:30</span>
        </div>
        <div class="info-item">
          <span class="label">支付状态:</span>
          <span class="value status-paid">已支付</span>
        </div>
      </div>
      
      <template #footer>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div class="total">总计: <span class="price">¥596.00</span></div>
          <van-button size="small" type="primary">查看详情</van-button>
        </div>
      </template>
    </Module>
  </div>
</template>

<script setup lang="ts">
import Module from './Module.vue';
import { Icon as VanIcon, Button as VanButton } from 'vant';
</script>

<style scoped>
.module-demo {
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

.order-info {
  width: 100%;
}

.info-item {
  display: flex;
  margin-bottom: 8px;
}

.label {
  width: 80px;
  color: #646566;
}

.value {
  flex: 1;
}

.status-paid {
  color: #07c160;
  font-weight: 500;
}

.total {
  font-weight: 500;
}

.price {
  color: #ee0a24;
  font-size: 16px;
}
</style>