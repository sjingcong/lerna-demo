<template>
  <div
    class="module-container"
    :style="{ minHeight }"
  >
    <!-- 背景图片 -->
    <img
      v-if="backImage?.url"
      :src="backImage.url"
      :style="backImage?.ratio ? { aspectRatio: backImage.ratio } : {}"
      class="background-image"
      alt="背景图"
    />

    <!-- 内容插槽 -->
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    backImage?: {
      url?: string;
      ratio?: number;
    };
    minHeight?: string;
  }

  withDefaults(defineProps<Props>(), {
    minHeight: '500px',
  });
</script>

<style scoped>
  .module-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 20px;
    margin: 0 auto;
    box-sizing: border-box;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .background-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    object-fit: cover;
    z-index: 0;
  }
</style>
