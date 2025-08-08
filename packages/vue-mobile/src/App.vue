<template>
  <div id="app">
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
