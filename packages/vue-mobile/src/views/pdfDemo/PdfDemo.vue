<template>
  <div class="pdf-demo">
    <div class="demo-header">
      <h2>PDF预览组件演示</h2>
      <div class="file-input-section">
        <input
          type="file"
          accept=".pdf"
          @change="handleFileChange"
          ref="fileInputRef"
          style="display: none"
        />
        <button @click="selectFile" class="upload-btn">
          选择PDF文件
        </button>
        <button @click="loadSamplePdf" class="sample-btn">
          加载示例PDF
        </button>
      </div>
    </div>

    <div class="pdf-viewer-container">
      <PdfViewer
        v-if="pdfSrc"
        :src="pdfSrc"
        :initial-page="1"
        :initial-scale="1"
        @loaded="onPdfLoaded"
        @page-change="onPageChange"
        @error="onPdfError"
      />
      <div v-else class="no-pdf">
        <p>请选择一个PDF文件或加载示例PDF</p>
      </div>
    </div>

    <!-- 状态信息 -->
    <div v-if="statusMessage" class="status-message" :class="statusType">
      {{ statusMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PdfViewer from '../../components/PdfViewer.vue'

const pdfSrc = ref('')
const fileInputRef = ref<HTMLInputElement>()
const statusMessage = ref('')
const statusType = ref<'success' | 'error' | 'info'>('info')

// 选择文件
const selectFile = () => {
  fileInputRef.value?.click()
}

// 处理文件选择
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file && file.type === 'application/pdf') {
    const reader = new FileReader()
    reader.onload = (e) => {
      pdfSrc.value = e.target?.result as string
      showStatus(`已加载文件: ${file.name}`, 'success')
    }
    reader.onerror = () => {
      showStatus('文件读取失败', 'error')
    }
    reader.readAsDataURL(file)
  } else {
    showStatus('请选择有效的PDF文件', 'error')
  }
}

// 加载示例PDF
const loadSamplePdf = () => {
  // 使用一个公开的PDF文件作为示例
  pdfSrc.value = 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf'
  showStatus('正在加载示例PDF...', 'info')
}

// PDF加载完成
const onPdfLoaded = (totalPages: number) => {
  showStatus(`PDF加载成功，共 ${totalPages} 页`, 'success')
}

// 页码变化
const onPageChange = (page: number) => {
  console.log('当前页码:', page)
}

// PDF错误
const onPdfError = (error: string) => {
  showStatus(error, 'error')
}

// 显示状态信息
const showStatus = (message: string, type: 'success' | 'error' | 'info') => {
  statusMessage.value = message
  statusType.value = type
  
  // 3秒后自动清除状态信息
  setTimeout(() => {
    statusMessage.value = ''
  }, 3000)
}
</script>

<style scoped>
.pdf-demo {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f8f9fa;
}

.demo-header {
  padding: 20px;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.demo-header h2 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 20px;
}

.file-input-section {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.upload-btn,
.sample-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-btn {
  background-color: #007bff;
  color: white;
}

.upload-btn:hover {
  background-color: #0056b3;
}

.sample-btn {
  background-color: #28a745;
  color: white;
}

.sample-btn:hover {
  background-color: #1e7e34;
}

.pdf-viewer-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.no-pdf {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #666;
  font-size: 16px;
}

.status-message {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  border-radius: 6px;
  color: white;
  font-size: 14px;
  z-index: 1000;
  animation: slideUp 0.3s ease-out;
}

.status-message.success {
  background-color: #28a745;
}

.status-message.error {
  background-color: #dc3545;
}

.status-message.info {
  background-color: #17a2b8;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .demo-header {
    padding: 15px;
  }
  
  .demo-header h2 {
    font-size: 18px;
    margin-bottom: 10px;
  }
  
  .file-input-section {
    gap: 8px;
  }
  
  .upload-btn,
  .sample-btn {
    padding: 6px 12px;
    font-size: 13px;
  }
  
  .no-pdf {
    font-size: 14px;
    padding: 20px;
    text-align: center;
  }
  
  .status-message {
    left: 10px;
    right: 10px;
    transform: none;
    font-size: 13px;
  }
}
</style>