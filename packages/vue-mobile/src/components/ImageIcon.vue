<template>
  <div
    :class="['icon-image-wrapper', { circle: circle }]"
    :style="wrapperStyle"
  >
    <img
      :src="src"
      :alt="alt"
      :class="['icon-image', { 'icon-image--circle': circle }]"
      :style="imageStyle"
      @load="handleLoad"
      @error="handleError"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, defineProps, defineEmits } from 'vue';

  interface IconImageProps {
    /** 图片路径 */
    src: string;
    /** 图片描述 */
    alt?: string;
    /** 图标尺寸 */
    size?: string | number;
    /** 宽度 */
    width?: string | number;
    /** 高度 */
    height?: string | number;
    /** 是否圆形 */
    circle?: boolean;
    /** 自定义样式 */
    customStyle?: Record<string, any>;
  }

  const props = withDefaults(defineProps<IconImageProps>(), {
    alt: '图标',
    size: 24,
    circle: false,
  });

  const emit = defineEmits<{
    load: [event: Event];
    error: [event: Event];
  }>();

  // 计算样式
  const wrapperStyle = computed(() => {
    const size =
      typeof props.size === 'number' ? `${props.size}px` : props.size;
    const width = props.width
      ? typeof props.width === 'number'
        ? `${props.width}px`
        : props.width
      : size;
    const height = props.height
      ? typeof props.height === 'number'
        ? `${props.height}px`
        : props.height
      : size;

    return {
      width,
      height,
      ...props.customStyle,
    };
  });

  const imageStyle = computed(() => {
    return {
      width: '100%',
      height: '100%',
      objectFit: 'cover' as const,
    };
  });

  // 事件处理
  const handleLoad = (event: Event) => {
    emit('load', event);
  };

  const handleError = (event: Event) => {
    emit('error', event);
  };
</script>

<style scoped lang="less">
  .icon-image-wrapper {
    position: relative;
    display: inline-block;
    overflow: hidden;

    &.circle {
      border-radius: 50%;
    }
  }

  .icon-image {
    display: block;
    transition: all 0.3s ease;

    &--circle {
      border-radius: 50%;
    }

    &:hover {
      transform: scale(1.05);
    }
  }
</style>
