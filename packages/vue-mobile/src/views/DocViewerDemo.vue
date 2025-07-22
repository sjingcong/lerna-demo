<template>
  <div class="doc-viewer-demo">
    <div class="demo-content">
      <!-- 文件上传区域 -->
      <div class="upload-section">
        <div class="upload-area" @click="triggerFileInput">
          <div class="upload-icon">📄</div>
        </div>
        <input
          ref="fileInput"
          type="file"
          accept=".docx"
          @change="handleFileSelect"
          style="display: none;"
        />
      </div>

      <!-- Word预览组件 -->
        <DocViewer
          style="height: 600px;"
          :src="docSrc"
          :file-name="fileName"
          @rendered="onDocRendered"
          @error="onDocError"
        />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DocViewer from '../components/DocViewer.vue'

// 响应式数据
const fileInput = ref(null)
const docSrc = ref('https://501351981.github.io/vue-office/examples/dist/static/test-files/test.docx')
const fileName = ref('')
const fileSize = ref('')
const message = ref('')
const messageType = ref('info')

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value?.click()
}

// 处理文件选择
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (!file) return

  console.log('选择的文件:', file)

  // 验证文件类型
  if (!file.name.toLowerCase().endsWith('.docx')) {
    showMessage('请选择.docx格式的Word文档', 'error')
    return
  }

  // 验证文件大小（10MB限制）
  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    showMessage('文件大小不能超过10MB', 'error')
    return
  }

  // 读取文件
  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target.result
    console.log('文件读取完成，数据类型:', typeof result)
    console.log('文件数据长度:', result.length)
    
    docSrc.value = result
    fileName.value = file.name
    fileSize.value = formatFileSize(file.size)
    showMessage(`文档 "${file.name}" 上传成功`, 'success')
  }
  reader.onerror = () => {
    showMessage('文件读取失败', 'error')
  }
  reader.readAsArrayBuffer(file) // 读取为ArrayBuffer格式
}

// 加载示例文件
const loadSampleFile = () => {
  // 这里可以放置一个示例docx文件的base64数据
  // 或者从服务器获取示例文件
  showMessage('示例文档功能待实现，请上传本地Word文档', 'info')
}

// 清除文件
const clearFile = () => {
  docSrc.value = ''
  fileName.value = ''
  fileSize.value = ''
  message.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  showMessage('已清除文档', 'info')
}

// Word文档渲染成功回调
const onDocRendered = () => {
  console.log('Word文档渲染成功回调')
  showMessage('Word文档加载成功', 'success')
}

// Word文档渲染错误回调
const onDocError = (error) => {
  console.error('Word文档渲染错误回调:', error)
  showMessage('Word文档加载失败', 'error')
}

// 显示消息
const showMessage = (text, type = 'info') => {
  message.value = text
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 3000)
}

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style scoped>
.doc-viewer-demo {
  max-width: 1200px;
  margin: 0 auto;
}

.demo-header {
  text-align: center;
  margin-bottom: 30px;
}

.demo-header h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.demo-header p {
  color: #7f8c8d;
  font-size: 16px;
}

.demo-content {
  display: flex;
  flex-direction: column;
}


.upload-area:hover {
  border-color: #409eff;
  background-color: #f0f9ff;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.upload-text {
  font-size: 18px;
  color: #2c3e50;
  margin: 10px 0;
  font-weight: 500;
}

.upload-hint {
  font-size: 14px;
  color: #7f8c8d;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.sample-btn,
.clear-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.sample-btn {
  background-color: #409eff;
  color: white;
}

.sample-btn:hover {
  background-color: #337ecc;
}

.clear-btn {
  background-color: #f56c6c;
  color: white;
}

.clear-btn:hover:not(:disabled) {
  background-color: #e85656;
}

.clear-btn:disabled {
  background-color: #c0c4cc;
  cursor: not-allowed;
}

.file-info {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 15px;
}

.info-item {
  display: flex;
  margin-bottom: 8px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-label {
  font-weight: 500;
  color: #495057;
  min-width: 80px;
}

.info-value {
  color: #6c757d;
}

.preview-section {
  margin-top: 20px;
}

.message {
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 14px;
  margin-top: 10px;
}

.message.success {
  background-color: #f0f9ff;
  color: #0369a1;
  border: 1px solid #bae6fd;
}

.message.error {
  background-color: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.message.info {
  background-color: #f0f9ff;
  color: #0369a1;
  border: 1px solid #bae6fd;
}
</style>