<template>
  <div
    class="video-player"
    ref="playerContainer"
  >
    <video
      ref="videoElement"
      class="video-element"
      :src="src"
      :poster="poster"
      :muted="muted"
      :loop="loop"
      :autoplay="autoplay"
      :playsinline="true"
      :webkit-playsinline="true"
      :x5-playsinline="true"
      :x5-video-player-type="'h5'"
      :x5-video-player-fullscreen="false"
      @loadedmetadata="onLoadedMetadata"
      @timeupdate="onTimeUpdate"
      @ended="onEnded"
      @play="onPlay"
      @pause="onPause"
      @waiting="onWaiting"
      @canplay="onCanPlay"
      @click="togglePlay"
    ></video>

    <!-- 加载状态 -->
    <div
      v-if="loading"
      class="loading-overlay"
    >
      <div class="loading-spinner"></div>
    </div>

    <!-- 播放按钮覆盖层 -->
    <div
      v-if="showPlayButton"
      class="play-overlay"
      @click="togglePlay"
    >
      <div class="play-button">
        <svg
          viewBox="0 0 24 24"
          class="play-icon"
        >
          <path
            d="M8 5v14l11-7z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>

    <!-- 底部控制器 -->
    <div
      class="controls"
      :class="{ 'controls-visible': showControls }"
      @click.stop
    >
      <!-- 播放/暂停按钮 -->
      <button
        class="control-btn play-pause-btn"
        @click="togglePlay"
      >
        <svg
          v-if="!isPlaying"
          viewBox="0 0 24 24"
          class="control-icon"
        >
          <path
            d="M8 5v14l11-7z"
            fill="currentColor"
          />
        </svg>
        <svg
          v-else
          viewBox="0 0 24 24"
          class="control-icon"
        >
          <path
            d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"
            fill="currentColor"
          />
        </svg>
      </button>

      <!-- 当前时间 -->
      <span class="time-display">{{ formatTime(currentTime) }}</span>

      <!-- 进度条容器 -->
      <div
        class="progress-container"
        ref="progressContainer"
        @mousedown="onProgressMouseDown"
        @touchstart="onProgressTouchStart"
      >
        <div class="progress-track">
          <div
            class="progress-buffer"
            :style="{ width: bufferProgress + '%' }"
          ></div>
          <div
            class="progress-played"
            :style="{ width: playProgress + '%' }"
          ></div>
          <div
            class="progress-thumb"
            :style="{ left: playProgress + '%' }"
            :class="{ dragging: isDragging }"
          ></div>
        </div>
      </div>

      <!-- 总时长 -->
      <span class="time-display">{{ formatTime(duration) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';

  interface Props {
    src: string;
    poster?: string;
    autoplay?: boolean;
    loop?: boolean;
    muted?: boolean;
    controls?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    autoplay: false,
    loop: false,
    muted: false,
    controls: true,
  });

  const emit = defineEmits<{
    play: [];
    pause: [];
    ended: [];
    timeupdate: [currentTime: number];
    loadedmetadata: [duration: number];
  }>();

  // 引用
  const videoElement = ref<HTMLVideoElement>();
  const playerContainer = ref<HTMLDivElement>();
  const progressContainer = ref<HTMLDivElement>();

  // 状态
  const isPlaying = ref(false);
  const loading = ref(false);
  const currentTime = ref(0);
  const duration = ref(0);
  const buffered = ref(0);
  const showControls = ref(true);
  const isDragging = ref(false);
  const showPlayButton = ref(true);

  // 控制器显示/隐藏定时器
  let controlsTimer: NodeJS.Timeout | null = null;

  // 计算属性
  const playProgress = computed(() => {
    return duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0;
  });

  const bufferProgress = computed(() => {
    return duration.value > 0 ? (buffered.value / duration.value) * 100 : 0;
  });

  // 格式化时间
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // 播放/暂停切换
  const togglePlay = async () => {
    if (!videoElement.value) return;

    try {
      if (isPlaying.value) {
        videoElement.value.pause();
      } else {
        await videoElement.value.play();
      }
    } catch (error) {
      console.error('播放失败:', error);
    }
  };

  // 显示控制器
  const showControlsTemporarily = () => {
    showControls.value = true;

    if (controlsTimer) {
      clearTimeout(controlsTimer);
    }

    if (isPlaying.value) {
      controlsTimer = setTimeout(() => {
        showControls.value = false;
      }, 3000);
    }
  };

  // 进度条拖拽处理
  const updateProgress = (clientX: number) => {
    if (!progressContainer.value || !videoElement.value) return;

    const rect = progressContainer.value.getBoundingClientRect();
    const percent = Math.max(
      0,
      Math.min(1, (clientX - rect.left) / rect.width)
    );
    const newTime = percent * duration.value;

    videoElement.value.currentTime = newTime;
    currentTime.value = newTime;
  };

  const onProgressMouseDown = (e: MouseEvent) => {
    isDragging.value = true;
    updateProgress(e.clientX);

    const onMouseMove = (e: MouseEvent) => {
      updateProgress(e.clientX);
    };

    const onMouseUp = () => {
      isDragging.value = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const onProgressTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    isDragging.value = true;
    updateProgress(e.touches[0].clientX);

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      updateProgress(e.touches[0].clientX);
    };

    const onTouchEnd = () => {
      isDragging.value = false;
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };

    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);
  };

  // 视频事件处理
  const onLoadedMetadata = () => {
    if (videoElement.value) {
      duration.value = videoElement.value.duration;
      emit('loadedmetadata', duration.value);
    }
  };

  const onTimeUpdate = () => {
    if (videoElement.value) {
      currentTime.value = videoElement.value.currentTime;

      // 更新缓冲进度
      const bufferedRanges = videoElement.value.buffered;
      if (bufferedRanges.length > 0) {
        buffered.value = bufferedRanges.end(bufferedRanges.length - 1);
      }

      emit('timeupdate', currentTime.value);
    }
  };

  const onPlay = () => {
    isPlaying.value = true;
    showPlayButton.value = false;
    showControlsTemporarily();
    emit('play');
  };

  const onPause = () => {
    isPlaying.value = false;
    showPlayButton.value = true;
    showControls.value = true;
    if (controlsTimer) {
      clearTimeout(controlsTimer);
    }
    emit('pause');
  };

  const onEnded = () => {
    isPlaying.value = false;
    showPlayButton.value = true;
    showControls.value = true;
    emit('ended');
  };

  const onWaiting = () => {
    loading.value = true;
  };

  const onCanPlay = () => {
    loading.value = false;
  };

  // 点击视频区域显示/隐藏控制器
  const onPlayerClick = () => {
    if (isPlaying.value) {
      showControlsTemporarily();
    }
  };

  // 生命周期
  onMounted(() => {
    if (playerContainer.value) {
      playerContainer.value.addEventListener('click', onPlayerClick);
    }
  });

  onUnmounted(() => {
    if (controlsTimer) {
      clearTimeout(controlsTimer);
    }
    if (playerContainer.value) {
      playerContainer.value.removeEventListener('click', onPlayerClick);
    }
  });
</script>

<style scoped lang="less">
  // 变量定义
  @black-color: #000;
  @white-color: #fff;
  @transition-duration: 0.3s;
  @mobile-breakpoint: 768px;

  // 混合
  .full-size() {
    width: 100%;
    height: 100%;
  }

  .absolute-overlay() {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .flex-center() {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .video-player {
    position: relative;
    .full-size();
    background: @black-color;
    overflow: hidden;

    * {
      touch-action: manipulation;
    }
  }

  .video-element {
    .full-size();
    object-fit: cover;
    display: block;

    &::-webkit-media-controls {
      display: none !important;
    }

    &::-webkit-media-controls-enclosure {
      display: none !important;
    }
  }

  .loading-overlay {
    .absolute-overlay();
    .flex-center();
    background: rgba(0, 0, 0, 0.3);
    z-index: 2;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top: 3px solid @white-color;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .play-overlay {
    .absolute-overlay();
    .flex-center();
    z-index: 3;
    cursor: pointer;
  }

  .play-button {
    width: 80px;
    height: 80px;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 50%;
    .flex-center();
    transition: all @transition-duration ease;

    &:hover {
      background: rgba(0, 0, 0, 0.8);
      transform: scale(1.1);
    }
  }

  .play-icon {
    width: 32px;
    height: 32px;
    color: @white-color;
    margin-left: 4px;
  }

  .controls {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
    padding: 20px 16px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 4;
    transform: translateY(100%);
    transition: transform @transition-duration ease;

    &-visible {
      transform: translateY(0);
    }
  }

  .control-btn {
    background: none;
    border: none;
    padding: 8px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.2s ease;
    flex-shrink: 0;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    &:active {
      background: rgba(255, 255, 255, 0.2);
    }
  }

  .control-icon {
    width: 20px;
    height: 20px;
    color: @white-color;
  }

  .time-display {
    color: @white-color;
    font-size: 12px;
    font-family: monospace;
    flex-shrink: 0;
    min-width: 40px;
  }

  .progress-container {
    flex: 1;
    height: 40px;
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 0 4px;

    &:hover {
      .progress-thumb {
        opacity: 1;
      }
    }
  }

  .progress-track {
    position: relative;
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
    overflow: hidden;
  }

  .progress-buffer {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: rgba(255, 255, 255, 0.5);
    transition: width 0.2s ease;
  }

  .progress-played {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: @white-color;
    transition: width 0.1s ease;
  }

  .progress-thumb {
    position: absolute;
    top: 50%;
    width: 12px;
    height: 12px;
    background: @white-color;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: opacity 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);

    &.dragging {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1.2);
    }
  }

  // 移动端适配
  @media (max-width: @mobile-breakpoint) {
    .controls {
      padding: 16px 12px 12px;
      gap: 8px;
    }

    .control-icon {
      width: 18px;
      height: 18px;
    }

    .time-display {
      font-size: 11px;
      min-width: 35px;
    }

    .progress-container {
      height: 44px;
      padding: 0 8px;
    }

    .progress-track {
      height: 6px;
    }

    .progress-thumb {
      width: 16px;
      height: 16px;
    }

    .play-button {
      width: 70px;
      height: 70px;
    }

    .play-icon {
      width: 28px;
      height: 28px;
    }
  }
</style>
