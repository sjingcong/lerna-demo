<template>
  <div class="about">
    <h1>关于页面</h1>
    <p>这是一个使用Vue 3 + TypeScript + Vite + Vue Router的示例应用。</p>
    <div class="navigation">
      <router-link to="/">返回首页</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// 这里可以添加页面逻辑
</script>

<style scoped>
.about {
  padding: 20px;
  text-align: center;
}

.navigation {
  margin-top: 20px;
}

.navigation a {
  color: #2c3e50;
  text-decoration: none;
  padding: 10px 20px;
  border: 1px solid #2c3e50;
  border-radius: 4px;
  margin: 0 10px;
}

.navigation a:hover {
  background-color: #2c3e50;
  color: white;
}
</style>