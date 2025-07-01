<template>
  <div id="app">
    <HelloWorld msg="Welcome to Vue App A!" />
  </div>
</template>

<script setup lang="ts">
// 确保HelloWorld组件文件存在于正确路径
import HelloWorld from '@/components/HelloWorld.vue'
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>