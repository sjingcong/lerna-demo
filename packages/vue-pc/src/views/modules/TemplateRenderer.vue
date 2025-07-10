<template>
  <component 
    v-if="template" 
    :is="template" 
    :data="data"
    v-on="$attrs"
  />
  <div v-else class="no-template">
    未提供模板组件
  </div>
</template>

<script setup lang="ts">
// Props定义
interface Props {
  template: any; // Vue组件
  data?: Record<string, any>;
}

withDefaults(defineProps<Props>(), {
  data: () => ({})
});
</script>

<style scoped>
.no-template {
  padding: 20px;
  text-align: center;
  color: #999;
  border: 1px dashed #ddd;
  border-radius: 4px;
}
</style>