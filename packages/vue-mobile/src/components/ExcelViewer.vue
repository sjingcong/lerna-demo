<template>
  <div class="excel-viewer">
    <!-- Excel预览容器 -->
    <VueOfficeExcel v-if="src" :src="src" @rendered="onRendered" @error="onError" style="height: 100%;" />

    <!-- 加载状态覆盖层 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>正在加载Excel文档...</p>
    </div>

    <!-- 错误状态覆盖层 -->
    <div v-if="error" class="error-overlay">
      <div class="error-icon">⚠️</div>
      <p class="error-message">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import VueOfficeExcel from '@vue-office/excel'
import '@vue-office/excel/lib/index.css'

interface Props {
  src?: string // Excel文件URL或base64
}

interface Emits {
  rendered: []
  error: [error: string]
}

const props = withDefaults(defineProps<Props>(), {
})

const emit = defineEmits<Emits>()

// 响应式数据
const loading = ref(false)
const error = ref('')
let loadingTimeout: NodeJS.Timeout | null = null

// 方法
const onRendered = () => {
  console.log('Excel渲染完成')
  loading.value = false
  error.value = ''
  if (loadingTimeout) {
    clearTimeout(loadingTimeout)
    loadingTimeout = null
  }
  emit('rendered')
}

const onError = (err: any) => {
  console.error('Excel加载错误:', err)
  loading.value = false
  error.value = err?.message || err?.toString() || 'Excel文档加载失败'
  if (loadingTimeout) {
    clearTimeout(loadingTimeout)
    loadingTimeout = null
  }
  emit('error', error.value)
}

// 设置加载超时
const setLoadingTimeout = () => {
  if (loadingTimeout) {
    clearTimeout(loadingTimeout)
  }
  loadingTimeout = setTimeout(() => {
    if (loading.value) {
      console.warn('Excel加载超时')
      loading.value = false
      error.value = 'Excel文档加载超时，请检查文件格式或网络连接'
      emit('error', error.value)
    }
  }, 30000) // 30秒超时
}

// 监听src变化
watch(() => props.src, (newSrc) => {
  if (newSrc) {
    console.log('开始加载Excel文件:', newSrc.substring(0, 50) + '...')
    loading.value = true
    error.value = ''
    setLoadingTimeout()
  } else {
    loading.value = false
    if (loadingTimeout) {
      clearTimeout(loadingTimeout)
      loadingTimeout = null
    }
  }
}, { immediate: true })

// 生命周期
onMounted(() => {
  if (props.src) {
    loading.value = true
    setLoadingTimeout()
  }
})
</script>

<style scoped>
.excel-viewer {
  position: relative;
  height: 100vh;
  background: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Excel容器样式 */
.excel-container {
  height: 100%;
  background: #fff;
}

.no-file-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #999;
  font-size: 16px;
}

/* 加载状态覆盖层样式 */
.loading-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-overlay p {
  color: #666;
  font-size: 16px;
  margin: 0;
}

/* 错误状态覆盖层样式 */
.error-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 400px;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-message {
  color: #d32f2f;
  font-size: 16px;
  text-align: center;
  margin: 0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .loading-overlay,
  .error-overlay {
    padding: 30px 20px;
    margin: 0 20px;
  }
  
  .loading-overlay p,
  .error-message {
    font-size: 14px;
  }
  
  .no-file-container {
    font-size: 14px;
  }
}
</style>