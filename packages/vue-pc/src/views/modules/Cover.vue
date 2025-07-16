<template>
  <div class="cover-template">
    <div class="cover-container">
      <h1 class="cover-title">{{ title || '请输入标题' }}</h1>
      <div class="cover-decoration"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, watch } from 'vue'

interface Props {
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: ''
})

</script>

<style scoped>
.cover-template {
  width: 100%;
  height: 400px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.cover-container {
  text-align: center;
  color: white;
  z-index: 2;
}

.cover-title {
  font-size: 3rem;
  font-weight: bold;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
}

.cover-decoration {
  width: 100px;
  height: 4px;
  background: rgba(255, 255, 255, 0.8);
  margin: 20px auto 0;
  border-radius: 2px;
}

.cover-template::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

@media (max-width: 768px) {
  .cover-title {
    font-size: 2rem;
  }
  
  .cover-template {
    height: 300px;
  }
}
</style>