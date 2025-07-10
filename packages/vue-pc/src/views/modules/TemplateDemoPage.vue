<template>
  <div class="template-demo">
    <h2>模板渲染演示</h2>
    
    <!-- 锚点导航 -->
    <div class="anchor-nav">
      <div class="nav-title">快速导航：</div>
      <div class="nav-items">
        <button 
          v-for="(module, index) in modules" 
          :key="index"
          @click="scrollToCard(index)"
          class="nav-item"
          :class="{ active: activeIndex === index }"
        >
          {{ index + 1 }}
        </button>
      </div>
    </div>
    
    <!-- 使用v-for渲染多个模块 -->
    <div 
      v-for="(module, index) in modules" 
      :key="index"
      :ref="el => setCardRef(el, index)"
      :id="`card-${index}`"
      class="module-item"
    >
      <h3>{{ module.title }}</h3>
      <TemplateRenderer 
        :template="module.component"
        :data="module.data"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TemplateRenderer from './TemplateRenderer.vue';
import UserCard from './templates/UserCard.vue';
import ProductCard from './templates/ProductCard.vue';

// 模块配置数组
const modules = ref([
  {
    title: '用户卡片模板',
    component: UserCard,
    data: {
      name: '张三',
      email: 'zhangsan@example.com',
      avatar: 'https://example.com/avatar.jpg',
      department: '技术部'
    }
  },
  {
    title: '产品卡片模板',
    component: ProductCard,
    data: {
      name: 'iPhone 15',
      price: 5999,
      image: 'https://example.com/iphone.jpg',
      description: '最新款iPhone'
    }
  },
  {
    title: '另一个用户卡片',
    component: UserCard,
    data: {
      name: '李四',
      email: 'lisi@example.com',
      avatar: 'https://example.com/avatar2.jpg',
      department: '设计部'
    }
  }
]);

// 卡片引用数组
const cardRefs = ref<(HTMLElement | null)[]>([]);
// 当前激活的索引
const activeIndex = ref(0);

// 设置卡片引用
const setCardRef = (el: HTMLElement | null, index: number) => {
  if (el) {
    cardRefs.value[index] = el;
  }
};

// 滚动到指定卡片
const scrollToCard = (index: number) => {
  const targetCard = cardRefs.value[index];
  if (targetCard) {
    // 计算偏移量，考虑锚点导航的高度
    const navHeight = 80; // 锚点导航的大概高度
    const targetPosition = targetCard.offsetTop - navHeight;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
    
    activeIndex.value = index;
  }
};

</script>

<style scoped>
.template-demo {
  padding: 20px;
}

/* 锚点导航样式 */
.anchor-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-title {
  font-weight: 500;
  color: #666;
  font-size: 14px;
  white-space: nowrap;
}

.nav-items {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.nav-item {
  width: 40px;
  height: 40px;
  border: 2px solid #e8e8e8;
  border-radius: 50%;
  background: white;
  color: #666;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-item:hover {
  border-color: #1890ff;
  color: #1890ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

.nav-item.active {
  background: #1890ff;
  border-color: #1890ff;
  color: white;
  transform: scale(1.1);
  box-shadow: 0 4px 16px rgba(24, 144, 255, 0.4);
}

.module-item {
  margin-bottom: 24px;
  padding: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background: #fafafa;
  scroll-margin-top: 100px; /* 为滚动定位预留空间 */
}

.module-item h3 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 16px;
  font-weight: 500;
}
</style>