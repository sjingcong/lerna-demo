<template>
  <div class="doc-viewer">
    <!-- 加载状态覆盖层 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>正在加载Word文档...</p>
    </div>

    <!-- 错误状态覆盖层 -->
    <div v-if="error" class="error-overlay">
      <div class="error-icon">⚠️</div>
      <p class="error-message">{{ error }}</p>
    </div>

    <!-- 无文件提示 -->
    <div v-if="!src && !loading && !error" class="no-file-container">
      <p>请选择Word文档进行预览</p>
    </div>

    <!-- Word预览容器 -->
    <div ref="docContainer" class="doc-container"></div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import * as docx from 'docx-preview'

// Props
const props = defineProps({
  src: {
    type: [String, ArrayBuffer, Blob],
    default: null
  },
  fileName: {
    type: String,
    default: ''
  },
  options: {
    type: Object,
    default: () => ({
      className: 'docx',
      inWrapper: true,
      ignoreWidth: false,
      ignoreHeight: false,
      ignoreFonts: false,
      breakPages: true,
      ignoreLastRenderedPageBreak: true,
      experimental: false,
      trimXmlDeclaration: true,
      useBase64URL: false,
      renderChanges: false,
      renderHeaders: true,
      renderFooters: true,
      renderFootnotes: true,
      renderEndnotes: true,
      renderComments: false,
      debug: false
    })
  }
})

// Emits
const emit = defineEmits(['rendered', 'error'])

// 响应式数据
const loading = ref(false)
const error = ref('')
const docContainer = ref(null)
let loadingTimeout = null

// 设置加载超时
const setLoadingTimeout = () => {
  if (loadingTimeout) {
    clearTimeout(loadingTimeout)
  }
  loadingTimeout = setTimeout(() => {
    if (loading.value) {
      console.warn('Word文档加载超时')
      error.value = 'Word文档加载超时，请检查文件格式或网络连接'
      loading.value = false
    }
  }, 30000) // 30秒超时
}

// 清除加载超时
const clearLoadingTimeout = () => {
  if (loadingTimeout) {
    clearTimeout(loadingTimeout)
    loadingTimeout = null
  }
}

// 渲染Word文档
const renderDocument = async (src) => {
  if (!src || !docContainer.value) return

  try {
    loading.value = true
    error.value = ''
    setLoadingTimeout()

    // 清空容器
    docContainer.value.innerHTML = ''

    console.log('开始加载Word文档:', props.fileName)

    // 处理不同类型的src
    let documentData
    if (typeof src === 'string') {
      // 如果是URL，需要先获取数据
      const response = await fetch(src)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      documentData = await response.arrayBuffer()
    } else {
      // 如果是ArrayBuffer或Blob，直接使用
      documentData = src
    }

    // 使用docx-preview渲染文档
    await docx.renderAsync(
      documentData,
      docContainer.value,
      null, // styleContainer，使用bodyContainer
      props.options
    )

    console.log('Word文档渲染成功:', props.fileName)
    loading.value = false
    clearLoadingTimeout()
    emit('rendered')
  } catch (err) {
    console.error('Word文档渲染失败:', err)
    loading.value = false
    error.value = err?.message || 'Word文档加载失败，请检查文件格式'
    clearLoadingTimeout()
    emit('error', err)
  }
}

// 监听src变化
watch(() => props.src, async (newSrc) => {
  if (newSrc) {
    await nextTick()
    await renderDocument(newSrc)
  } else {
    loading.value = false
    error.value = ''
    clearLoadingTimeout()
    if (docContainer.value) {
      docContainer.value.innerHTML = ''
    }
  }
}, { immediate: true })

// 组件挂载时的处理
onMounted(async () => {
  if (props.src) {
    await nextTick()
    await renderDocument(props.src)
  }
})
</script>

<style scoped>
.doc-viewer {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.error-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin: 0;
  text-align: center;
  padding: 0 20px;
  line-height: 1.5;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #409eff;
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
  font-size: 14px;
  margin: 0;
}

.no-file-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #999;
  font-size: 16px;
}

.doc-container {
  width: 100%;
  height: 100%;
  background-color: white;
  border-radius: 8px;
  overflow: auto;
  padding: 10px;
  box-sizing: border-box;
}

/* docx-preview 样式优化 */
.doc-container :deep(.docx) {
  max-width: 100%;
  margin: 0;
  padding: 0;
  font-family: 'Times New Roman', serif;
  line-height: 1.6;
  color: #333;
}

.doc-container :deep(.docx-wrapper) {
  background-color: white;
  margin: 0;
  padding: 0;
  max-width: 100%;
  box-shadow: none;
  .docx {
    box-shadow: none;
  }
}

/* 重置docx内容的默认间距 */
.doc-container :deep(.docx *) {
  margin: 0;
  padding: 0;
}

/* 重新设置必要的间距 */
.doc-container :deep(.docx > *) {
  margin-bottom: 8px;
}

.doc-container :deep(.docx > *:last-child) {
  margin-bottom: 0;
}

/* 表格样式优化 */
.doc-container :deep(table) {
  width: 100%;
  max-width: 100%;
  border-collapse: collapse;
  margin: 6px 0 !important;
  font-size: 14px;
  overflow-x: auto;
  display: block;
  white-space: nowrap;
}

.doc-container :deep(td),
.doc-container :deep(th) {
  border: 1px solid #ddd;
  padding: 4px 6px !important;
  text-align: left;
  word-wrap: break-word;
  word-break: break-all;
  min-width: 50px;
}

.doc-container :deep(th) {
  background-color: #f5f5f5;
  font-weight: bold;
}

/* 图片样式优化 */
.doc-container :deep(img) {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 10px auto;
}

/* 段落样式优化 */
.doc-container :deep(p) {
  margin: 4px 0 !important;
  padding: 0 !important;
  word-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
}

/* 列表样式优化 */
.doc-container :deep(ul),
.doc-container :deep(ol) {
  margin: 6px 0 !important;
  padding: 0 0 0 20px !important;
}

.doc-container :deep(li) {
  margin: 2px 0 !important;
  padding: 0 !important;
  word-wrap: break-word;
}
</style>