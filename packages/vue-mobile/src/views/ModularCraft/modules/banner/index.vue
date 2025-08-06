<template>
  <div class="banner-module">
    <van-swipe
      class="banner-swipe"
      :autoplay="autoplayEnabled ? 3000 : 0"
      :show-indicators="true"
      :loop="true"
      indicator-color="white"
      @change="onBannerChange"
    >
      <van-swipe-item
        v-for="banner in moduleData.banners"
        class="banner-item"
        @click="onBannerClick(banner)"
      >
        <div class="banner-content">
          <!-- 图片类型 -->
          <template v-if="banner.type === 'image'">
            <img
              :src="banner.image"
              alt=""
              class="banner-image"
            />
          </template>

          <!-- 视频类型 -->
          <template v-else-if="banner.type === 'video'">
            <VideoPlayer
              :src="banner.video!"
              :poster="banner.poster"
              :muted="true"
              :autoplay="false"
              class="banner-video"
              @play="onVideoPlay"
              @pause="onVideoPause"
            />
          </template>
        </div>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { Swipe as VanSwipe, SwipeItem as VanSwipeItem } from 'vant';
  import { useEvent } from '../../core';
  import { useModuleStore } from '../../examples/store';
  import { BannerModuleData } from './config';
  import VideoPlayer from './VideoPlayer.vue';

  // 控制轮播自动播放
  const autoplayEnabled = ref(true);

  // 使用模块数据 - 现在有精确的类型推断
  const { data: moduleData, update } =
    useModuleStore<BannerModuleData>('banner');

  // 使用事件系统
  const { emit } = useEvent();

  // 轮播图切换事件
  const onBannerChange = (index: number) => {
    const currentBanner = moduleData.value.banners[index];
    emit('banner:change', {
      index,
      banner: currentBanner,
    });
  };

  // 轮播图点击事件
  const onBannerClick = (banner: any) => {
    emit('banner:click', banner);

    // 如果有链接，则跳转
    if (banner.link && banner.link !== '#') {
      if (banner.link.startsWith('http')) {
        window.open(banner.link, '_blank');
      } else {
        // 内部路由跳转
        console.log('Navigate to:', banner.link);
      }
    }
  };

  // 视频播放事件处理
  const onVideoPlay = () => {
    // 停止轮播自动播放
    autoplayEnabled.value = false;
    emit('banner:video:play');
    console.log('视频开始播放，轮播已停止');
  };

  const onVideoPause = () => {
    // 恢复轮播自动播放
    autoplayEnabled.value = true;
    emit('banner:video:pause');
    console.log('视频暂停播放，轮播已恢复');
  };
</script>

<style scoped lang="less">
  // 变量定义
  @primary-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  @white-color: white;
  @text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  @meta-bg: #f8f9fa;
  @meta-text: #666;
  @mobile-breakpoint: 768px;

  .banner-module {
    margin-bottom: 20px;
    overflow: hidden;
    box-shadow: @primary-shadow;
  }

  .banner-item {
    cursor: pointer;
    position: relative;
    overflow: hidden;

    &:hover {
      .banner-image {
        transform: scale(1.05);
      }
    }
  }

  .banner-content {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .banner-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .banner-video {
    width: 100%;
    height: 100%;
  }

  .banner-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.3) 70%,
      rgba(0, 0, 0, 0.6) 100%
    );
    display: flex;
    align-items: flex-end;
    padding: 20px;
    pointer-events: none;

    &.video-overlay {
      background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0.2) 70%,
        rgba(0, 0, 0, 0.5) 100%
      );
    }
  }

  .banner-text {
    color: @white-color;
    text-shadow: @text-shadow;
  }

  .banner-title {
    margin: 0 0 5px 0;
    font-size: 20px;
    font-weight: 600;
    line-height: 1.2;
  }

  .banner-subtitle {
    margin: 0;
    font-size: 14px;
    opacity: 0.9;
    line-height: 1.3;
  }

  .banner-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    background-color: @meta-bg;
    font-size: 12px;
    color: @meta-text;
    border-radius: 0 0 12px 12px;
  }

  .banner-count {
    font-weight: 500;
  }

  .module-id {
    opacity: 0.7;
  }

  // 自定义指示器样式
  :deep(.van-swipe__indicator) {
    background-color: rgba(255, 255, 255, 0.5);

    &--active {
      background-color: @white-color;
    }
  }

  // 移动端适配
  @media (max-width: @mobile-breakpoint) {
    .banner-title {
      font-size: 18px;
    }

    .banner-subtitle {
      font-size: 13px;
    }

    .banner-overlay {
      padding: 15px;
    }
  }
</style>
