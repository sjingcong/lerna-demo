<template>
  <div id="app">
    <div class="navbar">
      <router-link to="/about" class="nav-link">关于</router-link>
      <router-link to="/pdf-demo" class="nav-link">PDF</router-link>
    </div>
    <router-view />
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
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-link:hover,
.nav-link.router-link-active {
  background-color: #2c3e50;
  color: white;
}
</style>