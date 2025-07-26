<template>
  <div class="image-module">
    <!-- 如果有图片列表，显示图片网格 -->
    <div
      v-if="props.data?.images && props.data.images.length > 0"
      class="images-grid"
    >
      <div
        v-for="(image, index) in props.data.images"
        :key="index"
        class="image-item"
        :style="{ aspectRatio: image.ratio || 1.5 }"
      >
        <img
          v-if="image.url"
          :src="image.url"
          :alt="image.alt || '图片'"
          class="image-content"
        />
      </div>
    </div>

    <!-- 如果没有图片，显示默认内容 -->
    <div
      v-else
      class="default-content"
    >
      <div class="content-section">
        <h2
          v-if="props.data?.title"
          class="module-title"
        >
          {{ props.data.title }}
        </h2>
        <p
          v-if="props.data?.description"
          class="module-description"
        >
          {{ props.data.description }}
        </p>
        <div class="empty-images">
          <i class="icon-image"></i>
          <p>暂无图片内容</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { defineProps } from 'vue';

  interface ImageItem {
    url: string;
    alt?: string;
    ratio?: number;
  }

  // 定义props
  const props = defineProps<{
    data?: {
      images?: ImageItem[];
      title?: string;
      description?: string;
    };
    config?: any;
  }>();
</script>

<style scoped>
  .image-module {
    width: 100%;
    min-height: 300px;
  }

  .image-item {
    position: relative;
    overflow: hidden;
  }

  .image-item:not(:last-child) {
    margin-bottom: 16px;
  }

  .image-content {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .content-section {
    text-align: center;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 40px;
  }

  .module-title {
    font-size: 28px;
    font-weight: 700;
    color: #2c3e50;
    margin: 0 0 16px 0;
    line-height: 1.3;
  }

  .module-description {
    font-size: 16px;
    color: #5a6c7d;
    line-height: 1.6;
    margin: 0 0 24px 0;
  }

  .empty-images {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    color: #909399;
    margin-top: 20px;
  }

  .empty-images .icon-image {
    width: 64px;
    height: 64px;
    background: currentColor;
    mask: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>')
      no-repeat center;
    mask-size: contain;
  }

  .empty-images p {
    margin: 0;
    font-size: 14px;
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .images-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .content-section {
      padding: 24px;
    }

    .module-title {
      font-size: 24px;
    }

    .module-description {
      font-size: 14px;
    }
  }

  @media (max-width: 480px) {
    .default-content {
      padding: 20px 16px;
    }

    .content-section {
      padding: 20px;
    }

    .module-title {
      font-size: 20px;
    }
  }
</style>
