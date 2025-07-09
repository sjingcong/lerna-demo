<template>
  <div id="app">
    <nav class="navbar">
      <router-link to="/" class="nav-link">首页</router-link>
      <router-link to="/about" class="nav-link">关于</router-link>
    </nav>
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
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  text-align: center;
}

.nav-link {
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