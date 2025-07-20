<template>
  <div class="image-list-demo">
    <div class="demo-header">
      <h1>ImageList 图片列表组件示例</h1>
      <p>一个功能完整的图片上传和管理组件，支持拖拽排序、预览、删除等功能</p>
    </div>

    <div class="demo-section">
      <h2>基础用法</h2>
      <p>最简单的使用方式，传入图片数据数组</p>
      <div class="demo-container">
        <ImageList
          v-model:value="basicImages"
          @change="onBasicChange"
          @upload="onUpload"
          @remove="onRemove"
          @sort="onSort"
        />
      </div>
      <div class="demo-code">
        <h4>当前数据:</h4>
        <pre>{{ JSON.stringify(basicImages, null, 2) }}</pre>
      </div>
    </div>

    <div class="demo-section">
      <h2>自定义配置</h2>
      <p>可以自定义最大数量、网格列数、图片尺寸等</p>
      <div class="config-panel">
        <a-row :gutter="16">
          <a-col :span="6">
            <label>最大数量:</label>
            <a-input-number v-model:value="config.maxCount" :min="1" :max="20" />
          </a-col>
          <a-col :span="6">
            <label>最大文件大小(MB):</label>
            <a-input-number v-model:value="config.maxSize" :min="1" :max="50" />
          </a-col>
          <a-col :span="6">
            <label>图片最小宽度:</label>
            <a-input-number v-model:value="config.itemMinWidth" :min="80" :max="300" />
          </a-col>
          <a-col :span="6">
            <label>图片最大宽度:</label>
            <a-input-number v-model:value="config.itemMaxWidth" :min="120" :max="400" />
          </a-col>
        </a-row>
        <a-row :gutter="16" style="margin-top: 16px;">
          <a-col :span="6">
            <a-checkbox v-model:checked="config.multiple">支持多选</a-checkbox>
          </a-col>
          <a-col :span="6">
            <a-checkbox v-model:checked="config.disabled">禁用状态</a-checkbox>
          </a-col>
          <a-col :span="6">
            <a-checkbox v-model:checked="config.showUpload">显示上传按钮</a-checkbox>
          </a-col>
        </a-row>
      </div>
      <div class="demo-container">
        <ImageList
          v-model:value="customImages"
          :max-count="config.maxCount"
          :max-size="config.maxSize"
          :item-min-width="config.itemMinWidth"
          :item-max-width="config.itemMaxWidth"
          :multiple="config.multiple"
          :disabled="config.disabled"
          :show-upload="config.showUpload"
          @change="onCustomChange"
        />
      </div>
    </div>

    <div class="demo-section">
      <h2>预设图片数据</h2>
      <p>演示不同宽高比的图片展示效果</p>
      <div class="preset-buttons">
        <a-button @click="loadPresetImages('landscape')">横向图片</a-button>
        <a-button @click="loadPresetImages('portrait')">纵向图片</a-button>
        <a-button @click="loadPresetImages('square')">正方形图片</a-button>
        <a-button @click="loadPresetImages('mixed')">混合比例</a-button>
        <a-button @click="clearImages" danger>清空图片</a-button>
      </div>
      <div class="demo-container">
        <ImageList
          v-model:value="presetImages"
          :max-count="12"
          @change="onPresetChange"
        />
      </div>
    </div>

    <div class="demo-section">
      <h2>事件监听</h2>
      <p>监听组件的各种事件</p>
      <div class="event-log">
        <h4>事件日志:</h4>
        <div class="log-container">
          <div
            v-for="(log, index) in eventLogs"
            :key="index"
            class="log-item"
            :class="log.type"
          >
            <span class="log-time">{{ log.time }}</span>
            <span class="log-event">{{ log.event }}</span>
            <span class="log-data">{{ log.data }}</span>
          </div>
        </div>
        <a-button @click="clearLogs" size="small">清空日志</a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import ImageList from '@giom/shared/components/ImageList.vue'

// 图片数据类型
interface ImageItem {
  url: string
  ratio: number
}

// 事件日志类型
interface EventLog {
  time: string
  event: string
  data: string
  type: 'info' | 'success' | 'warning' | 'error'
}

// 基础图片数据
const basicImages = ref<ImageItem[]>([
  {
    url: 'https://picsum.photos/400/300?random=1',
    ratio: 4/3
  },
  {
    url: 'https://picsum.photos/300/400?random=2',
    ratio: 3/4
  }
])

// 自定义配置图片数据
const customImages = ref<ImageItem[]>([])

// 预设图片数据
const presetImages = ref<ImageItem[]>([])

// 配置选项
const config = reactive({
  maxCount: 6,
  maxSize: 10,
  itemMinWidth: 120,
  itemMaxWidth: 200,
  multiple: true,
  disabled: false,
  showUpload: true
})

// 事件日志
const eventLogs = ref<EventLog[]>([])

// 添加事件日志
const addLog = (event: string, data: any, type: EventLog['type'] = 'info') => {
  const log: EventLog = {
    time: new Date().toLocaleTimeString(),
    event,
    data: typeof data === 'string' ? data : JSON.stringify(data),
    type
  }
  eventLogs.value.unshift(log)
  
  // 限制日志数量
  if (eventLogs.value.length > 50) {
    eventLogs.value = eventLogs.value.slice(0, 50)
  }
}

// 基础用法事件处理
const onBasicChange = (images: ImageItem[]) => {
  addLog('change', `图片数量: ${images.length}`, 'info')
}

// 自定义配置事件处理
const onCustomChange = (images: ImageItem[]) => {
  addLog('custom change', `图片数量: ${images.length}`, 'info')
}

// 预设图片事件处理
const onPresetChange = (images: ImageItem[]) => {
  addLog('preset change', `图片数量: ${images.length}`, 'info')
}

// 上传事件处理
const onUpload = (file: File) => {
  addLog('upload', `文件名: ${file.name}, 大小: ${(file.size / 1024 / 1024).toFixed(2)}MB`, 'success')
}

// 删除事件处理
const onRemove = (item: ImageItem, index: number) => {
  addLog('remove', `删除第${index + 1}张图片`, 'warning')
}

// 排序事件处理
const onSort = (newList: ImageItem[]) => {
  addLog('sort', `重新排序，当前数量: ${newList.length}`, 'info')
}

// 加载预设图片
const loadPresetImages = (type: string) => {
  let images: ImageItem[] = []
  
  switch (type) {
    case 'landscape':
      images = [
        { url: 'https://picsum.photos/600/400?random=10', ratio: 1.5 },
        { url: 'https://picsum.photos/800/450?random=11', ratio: 16/9 },
        { url: 'https://picsum.photos/700/350?random=12', ratio: 2 },
        { url: 'https://picsum.photos/640/480?random=13', ratio: 4/3 }
      ]
      break
    case 'portrait':
      images = [
        { url: 'https://picsum.photos/300/500?random=20', ratio: 3/5 },
        { url: 'https://picsum.photos/400/600?random=21', ratio: 2/3 },
        { url: 'https://picsum.photos/350/700?random=22', ratio: 1/2 },
        { url: 'https://picsum.photos/450/800?random=23', ratio: 9/16 }
      ]
      break
    case 'square':
      images = [
        { url: 'https://picsum.photos/400/400?random=30', ratio: 1 },
        { url: 'https://picsum.photos/500/500?random=31', ratio: 1 },
        { url: 'https://picsum.photos/600/600?random=32', ratio: 1 },
        { url: 'https://picsum.photos/350/350?random=33', ratio: 1 }
      ]
      break
    case 'mixed':
      images = [
        { url: 'https://picsum.photos/600/400?random=40', ratio: 1.5 },
        { url: 'https://picsum.photos/300/500?random=41', ratio: 3/5 },
        { url: 'https://picsum.photos/400/400?random=42', ratio: 1 },
        { url: 'https://picsum.photos/800/450?random=43', ratio: 16/9 },
        { url: 'https://picsum.photos/350/700?random=44', ratio: 1/2 },
        { url: 'https://picsum.photos/500/500?random=45', ratio: 1 }
      ]
      break
  }
  
  presetImages.value = images
  addLog('load preset', `加载${type}类型图片，数量: ${images.length}`, 'success')
  message.success(`已加载${images.length}张${type}类型图片`)
}

// 清空图片
const clearImages = () => {
  presetImages.value = []
  addLog('clear', '清空所有图片', 'warning')
  message.success('已清空所有图片')
}

// 清空日志
const clearLogs = () => {
  eventLogs.value = []
  message.success('已清空事件日志')
}
</script>

<style scoped>
.image-list-demo {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.demo-header {
  text-align: center;
  margin-bottom: 48px;
}

.demo-header h1 {
  font-size: 32px;
  color: #1890ff;
  margin-bottom: 16px;
}

.demo-header p {
  font-size: 16px;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
}

.demo-section {
  margin-bottom: 48px;
  padding: 24px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background-color: white;
}

.demo-section h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 8px;
}

.demo-section p {
  color: #666;
  margin-bottom: 24px;
}

.demo-container {
  margin: 24px 0;
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  background-color: #fafafa;
}

.demo-code {
  margin-top: 16px;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 6px;
  border: 1px solid #e8e8e8;
}

.demo-code h4 {
  margin-bottom: 8px;
  color: #333;
}

.demo-code pre {
  margin: 0;
  font-size: 12px;
  color: #666;
  white-space: pre-wrap;
  word-break: break-all;
}

.config-panel {
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 6px;
  margin-bottom: 16px;
}

.config-panel label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
  color: #333;
}

.preset-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.event-log {
  margin-top: 16px;
}

.event-log h4 {
  margin-bottom: 12px;
  color: #333;
}

.log-container {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  background-color: white;
  margin-bottom: 12px;
}

.log-item {
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  gap: 12px;
  font-size: 12px;
  align-items: center;
}

.log-item:last-child {
  border-bottom: none;
}

.log-item.info {
  background-color: #f6ffed;
}

.log-item.success {
  background-color: #f6ffed;
}

.log-item.warning {
  background-color: #fffbe6;
}

.log-item.error {
  background-color: #fff2f0;
}

.log-time {
  color: #999;
  min-width: 80px;
}

.log-event {
  color: #1890ff;
  font-weight: 500;
  min-width: 100px;
}

.log-data {
  color: #666;
  flex: 1;
  word-break: break-all;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .image-list-demo {
    padding: 16px;
  }
  
  .demo-section {
    padding: 16px;
    margin-bottom: 24px;
  }
  
  .preset-buttons {
    flex-direction: column;
  }
  
  .config-panel .ant-row {
    flex-direction: column;
  }
  
  .config-panel .ant-col {
    margin-bottom: 12px;
  }
}
</style>