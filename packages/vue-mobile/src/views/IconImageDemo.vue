<template>
  <div class="icon-demo-container">
    <h1>IconImage 组件演示</h1>
    
    <div class="demo-section">
      <h2>基础用法</h2>
      <div class="demo-row">
        <div class="demo-item">
          <h3>首页图标 (32px)</h3>
          <IconImage src="/icons/home.svg" :size="32" />
        </div>
        <div class="demo-item">
          <h3>用户图标 (48px)</h3>
          <IconImage src="/icons/user.svg" :size="48" />
        </div>
        <div class="demo-item">
          <h3>设置图标 (64px)</h3>
          <IconImage src="/icons/settings.svg" :size="64" />
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h2>圆形图标</h2>
      <div class="demo-row">
        <div class="demo-item">
          <h3>圆形搜索图标</h3>
          <IconImage src="/icons/search.svg" :size="40" circle />
        </div>
        <div class="demo-item">
          <h3>圆形心形图标</h3>
          <IconImage src="/icons/heart.svg" :size="60" circle />
        </div>
        <div class="demo-item">
          <h3>圆形星星图标</h3>
          <IconImage src="/icons/star.svg" :size="80" circle />
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h2>自定义尺寸</h2>
      <div class="demo-row">
        <div class="demo-item">
          <h3>邮件图标 (100x60)</h3>
          <IconImage src="/icons/mail.svg" :width="100" :height="60" />
        </div>
        <div class="demo-item">
          <h3>购物车图标 (120x40)</h3>
          <IconImage src="/icons/shopping-cart.svg" :width="120" :height="40" />
        </div>
        <div class="demo-item">
          <h3>首页图标 (80x80)</h3>
          <IconImage src="/icons/home.svg" :width="80" :height="80" />
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h2>事件监听</h2>
      <div class="demo-row">
        <div class="demo-item">
          <h3>带事件监听的图标</h3>
          <IconImage 
            src="/icons/user.svg" 
            :size="50" 
            @load="handleLoad" 
            @error="handleError" 
          />
          <p class="event-log">{{ eventMessage }}</p>
        </div>
      </div>
    </div>

    <div class="demo-section">
      <h2>组合展示</h2>
      <div class="icon-grid">
        <IconImage src="/icons/home.svg" :size="24" />
        <IconImage src="/icons/user.svg" :size="32" circle />
        <IconImage src="/icons/search.svg" :size="40" />
        <IconImage src="/icons/heart.svg" :size="48" circle />
        <IconImage src="/icons/star.svg" :size="56" />
        <IconImage src="/icons/mail.svg" :size="64" circle />
        <IconImage src="/icons/shopping-cart.svg" :size="72" />
        <IconImage src="/icons/settings.svg" :size="80" circle />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import IconImage from '@/components/IconImage.vue'

const eventMessage = ref('等待事件触发...')

const handleLoad = () => {
  eventMessage.value = '图片加载成功！'
  setTimeout(() => {
    eventMessage.value = '等待事件触发...'
  }, 2000)
}

const handleError = () => {
  eventMessage.value = '图片加载失败！'
  setTimeout(() => {
    eventMessage.value = '等待事件触发...'
  }, 2000)
}
</script>

<style scoped>
.icon-demo-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}

.demo-section {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  background-color: #f8f9fa;
}

h2 {
  color: #34495e;
  margin-bottom: 20px;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
}

.demo-row {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: center;
}

.demo-item {
  text-align: center;
  padding: 15px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  min-width: 150px;
}

h3 {
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 15px;
  margin-top: 0;
}

.event-log {
  margin-top: 10px;
  font-size: 12px;
  color: #27ae60;
  font-weight: bold;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 20px;
  justify-items: center;
  align-items: center;
  padding: 20px;
  background-color: white;
  border-radius: 6px;
}

@media (max-width: 768px) {
  .demo-row {
    flex-direction: column;
    align-items: center;
  }
  
  .demo-item {
    min-width: 200px;
  }
  
  .icon-grid {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 15px;
  }
}
</style>