<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-container {
  flex: 1;
  display: flex;
}

.content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.content.with-sidebar {
  margin-left: 280px;
}

@media (max-width: 768px) {
  .content.with-sidebar {
    margin-left: 0;
  }
}
</style>