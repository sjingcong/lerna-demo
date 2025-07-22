<template>
  <div class="home">
    <!-- 导航链接 -->
    <div class="navigation">
      <h2>页面导航</h2>
      <div class="nav-links">
        <router-link to="/about" class="nav-link">关于页面</router-link>
        <router-link to="/List" class="nav-link">列表页面</router-link>
        <router-link to="/templatepage" class="nav-link">模板演示</router-link>
        <router-link to="/image-list-demo" class="nav-link">图片列表组件演示</router-link>
      </div>
    </div>
  
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.home {
  padding: 20px;
}

.api-demo {
  margin-top: 30px;
  padding: 20px;
  border: 1px solid #e6f7ff;
  border-radius: 8px;
  background-color: #f6ffed;
}

.loading {
  color: #1890ff;
  font-weight: bold;
}

.error {
  color: #ff4d4f;
  background-color: #fff2f0;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
}

.user-info, .list-info {
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background-color: #fafafa;
}

.user-info h3, .list-info h3 {
  margin-top: 0;
  color: #262626;
}

.user-info pre, .list-info pre {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  max-height: 200px;
  overflow-y: auto;
}

.user-info button, .list-info button {
  margin-top: 10px;
  padding: 6px 12px;
  background: #52c41a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.user-info button:hover, .list-info button:hover {
  background: #389e0d;
}

.pinia-demo {
  margin-top: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.buttons {
  margin: 15px 0;
}

.buttons button {
  margin-right: 10px;
  padding: 8px 16px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.buttons button:hover {
  background: #369870;
}

.input-section {
  margin-top: 15px;
}

.input-section input {
  padding: 8px;
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.input-section button {
  padding: 8px 16px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.navigation {
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #e6f7ff;
  border-radius: 8px;
  background-color: #f0f9ff;
}

.navigation h2 {
  margin-top: 0;
  color: #1890ff;
}

.nav-links {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.nav-link {
  padding: 10px 20px;
  background: #1890ff;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-link:hover {
  background: #40a9ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(24, 144, 255, 0.3);
}

.nav-link.router-link-active {
  background: #722ed1;
}

.nav-link.router-link-active:hover {
  background: #9254de;
}
</style>