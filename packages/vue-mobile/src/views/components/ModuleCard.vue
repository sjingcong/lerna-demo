<template>
  <div class="module-card">
    <div class="module-header">
      <div class="module-icon" v-if="icon">
        <img :src="icon" alt="模块图标" />
      </div>
      <h3 class="module-title">{{ title }}</h3>
    </div>
    <div class="module-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
    default: '模块标题'
  },
  icon: {
    type: String,
    default: ''
  }
});
</script>

<style scoped>
.module-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
  overflow: hidden;
}

.module-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.module-icon {
  margin-right: 8px;
}

.module-icon img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.module-title {
  font-size: 16px;
  font-weight: 500;
  margin: 0;
  color: #323233;
}

.module-content {
  padding: 16px;
}
</style>