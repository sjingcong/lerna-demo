<template>
  <div class="excel-demo">
    <div class="demo-header">
      <h1>Excel预览演示</h1>
      <p>使用vue-office预览Excel文档</p>
    </div>

    <div class="demo-controls">
      <div class="file-input-group">
        <label for="file-input" class="file-input-label">
          选择Excel文件
        </label>
        <input
          id="file-input"
          type="file"
          accept=".xlsx,.xls"
          @change="handleFileSelect"
          class="file-input"
        />
      </div>
    </div>

    <div class="demo-viewer" v-if="excelSrc">
      <ExcelViewer
        style="height: 600px;"
        :src="excelSrc"
        @rendered="onExcelRendered"
        @error="onExcelError"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ExcelViewer from '@/components/ExcelViewer.vue'

// 响应式数据
const excelSrc = ref('')
const fileName = ref('')
const message = ref('')
const messageType = ref<'success' | 'error' | 'info'>('info')

// 示例文件映射
const sampleFiles = {
  sample1: {
    url: 'https://501351981.github.io/vue-office/examples/dist/static/test-files/test.xlsx',
    name: '示例表格1.xls'
  },
}

// 方法
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // 验证文件类型
  const allowedTypes = ['.xlsx', '.xls']
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
  
  if (!allowedTypes.includes(fileExtension)) {
    showMessage('请选择Excel文件（.xlsx或.xls格式）', 'error')
    return
  }
  
  // 验证文件大小（限制为10MB）
  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    showMessage('文件大小不能超过10MB', 'error')
    return
  }
  
  showMessage('正在读取文件...', 'info')
  
  // 读取文件为base64格式（@vue-office/excel支持的格式）
  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    console.log('文件读取完成，大小:', file.size, 'bytes')
    console.log('文件类型:', file.type)
    excelSrc.value = result
    fileName.value = file.name
    showMessage('文件读取成功，正在渲染...', 'info')
  }
  
  reader.onerror = () => {
    console.error('文件读取失败')
    showMessage('文件读取失败', 'error')
  }
  
  reader.readAsDataURL(file)
}

const loadSampleFile = (sampleKey: keyof typeof sampleFiles) => {
  const sample = sampleFiles[sampleKey]
  excelSrc.value = sample.url
  fileName.value = sample.name
  showMessage('正在加载示例文件...', 'info')
}

const onExcelRendered = () => {
  showMessage('Excel文档渲染完成', 'success')
}

const onExcelError = (error: string) => {
  showMessage(`Excel加载失败: ${error}`, 'error')
}



const showMessage = (text: string, type: 'success' | 'error' | 'info') => {
  message.value = text
  messageType.value = type
  
  // 3秒后自动清除消息
  setTimeout(() => {
    message.value = ''
  }, 3000)
}
</script>

<style scoped>
.excel-demo {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.demo-header {
  text-align: center;
  margin-bottom: 30px;
}

.demo-header h1 {
  color: #333;
  margin-bottom: 8px;
}

.demo-header p {
  color: #666;
  font-size: 16px;
}

.demo-controls {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.file-input-group {
  margin-bottom: 20px;
}

.file-input-label {
  display: inline-block;
  padding: 12px 24px;
  background: #007bff;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.file-input-label:hover {
  background: #0056b3;
}

.file-input {
  display: none;
}



.demo-urls h3 {
  margin-bottom: 12px;
  color: #333;
  font-size: 16px;
}

.url-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.sample-btn {
  padding: 10px 16px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.sample-btn:hover {
  background: #1e7e34;
}

.demo-viewer {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 20px;
}

.demo-info {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.info-card h3 {
  color: #333;
  margin-bottom: 16px;
}

.info-card ul {
  color: #666;
  line-height: 1.6;
}

.info-card li {
  margin-bottom: 8px;
}

.message {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 6px;
  color: white;
  font-size: 14px;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

.message.success {
  background: #28a745;
}

.message.error {
  background: #dc3545;
}

.message.info {
  background: #17a2b8;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .excel-demo {
    padding: 16px;
  }
  
  .demo-controls {
    padding: 16px;
  }
  
  .url-buttons {
    flex-direction: column;
  }
  
  .sample-btn {
    width: 100%;
  }
  
  .message {
    left: 16px;
    right: 16px;
    top: 16px;
  }
}
</style>