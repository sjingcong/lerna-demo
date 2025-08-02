<template>
  <div id="app">
    <div class="navbar">
      <router-link to="/about" class="nav-link">关于</router-link>
      <router-link to="/pdf-demo" class="nav-link">PDF</router-link>
      <router-link to="/excel-demo" class="nav-link">Excel</router-link>
      <router-link to="/doc-demo" class="nav-link">Word</router-link>
      <router-link to="/table-demo" class="nav-link">表格</router-link>
      <router-link to="/icon-demo" class="nav-link">图标</router-link>
      <router-link to="/protection" class="nav-link">保障方案</router-link>
      <router-link to="/select-demo" class="nav-link">选择组件</router-link>
    </div>
    <router-view :key="$route.fullPath" />
  </div>
</template>

<script setup lang="ts">
// 路由组件会自动渲染在router-view中
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.navbar {
  background-color: #f8f9fa;
  padding: 5px;
  border-bottom: 1px solid #dee2e6;
  text-align: center;
}

.nav-link {
  font-size: 12px;
  color: #2c3e50;
  text-decoration: none;
  padding: 2px 4px;
  margin: 0 8px;
  border-radius: 4px;
}

.nav-link:hover,
.nav-link.router-link-active {
  background-color: #2c3e50;
  color: white;
}
</style>