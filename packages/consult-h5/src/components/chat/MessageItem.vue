<template>
  <div class="message-item" :class="{ 'user-message': message.isUser }">
    <div class="message-content" :class="message.type">
      <!-- 文本消息 -->
      <template v-if="message.type === MessageType.TEXT">
        <div class="text-content">{{ message.content }}</div>
      </template>
      
      <!-- 图片消息 -->
      <template v-else-if="message.type === MessageType.IMAGE">
        <div class="image-content">
          <van-image
            width="200"
            :src="message.content"
            @click="previewImage(message.content)"
          />
        </div>
      </template>
      
      <!-- 文件消息 -->
      <template v-else-if="message.type === MessageType.FILE">
        <div class="file-content">
          <van-cell :title="message.fileName" :label="formatFileSize(message.fileSize)" @click="downloadFile(message)" />
        </div>
      </template>

      <!-- 处理中卡片 -->
      <template v-else-if="message.type === MessageType.PROCESS">
        <div class="process-card">
          <div class="process-header">
            <van-icon name="clock" class="process-icon" />
            <div class="process-title">问题处理中</div>
          </div>
          <div class="process-tip">{{ message.content || '我们已收到您的问题，正在进行复杂问题处理。您可前往详情页查看进度和结果。' }}</div>
          <div class="process-actions">
            <van-button type="primary" size="small" @click="goDetail(message.processId)">查看处理详情</van-button>
          </div>
          <div class="process-preview" v-if="message.stepsPreview && message.stepsPreview.length">
            <div class="preview-item" v-for="(s, i) in message.stepsPreview" :key="s.id">
              <span class="step-name">{{ i + 1 }}. {{ s.name }}</span>
              <span class="step-status" :class="s.status">{{ renderStatusText(s.status) }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="message-time">{{ formatTime(message.time) }}</div>
  </div>
</template>

<script setup lang="ts">
import { Message, MessageType, ProcessStatus } from '../../types/chat'
import { ImagePreview } from 'vant'
import { useRouter } from 'vue-router'

defineProps<{
  message: Message
}>()
const router = useRouter()

// 格式化时间
const formatTime = (timestamp: number) => {
  const date = new Date(timestamp)
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

// 格式化文件大小
const formatFileSize = (size?: number) => {
  if (!size) return ''
  if (size < 1024) return size + 'B'
  if (size < 1024 * 1024) return (size / 1024).toFixed(2) + 'KB'
  return (size / 1024 / 1024).toFixed(2) + 'MB'
}

// 预览图片
const previewImage = (url: string) => {
  // 使用 Vant 函数式 ImagePreview 提升移动端预览体验
  ImagePreview([url])
}

// 下载文件
const downloadFile = (message: Message) => {
  if (message.fileUrl) {
    window.open(message.fileUrl)
  }
}

// 跳转处理详情
const goDetail = (processId?: string) => {
  if (!processId) return
  router.push(`/process/${processId}`)
}

const renderStatusText = (status: ProcessStatus) => {
  switch (status) {
    case ProcessStatus.IN_PROGRESS: return '进行中'
    case ProcessStatus.SUCCESS: return '处理成功'
    case ProcessStatus.FAILED: return '处理失败'
    case ProcessStatus.PENDING:
    default: return '待处理'
  }
}
</script>

<style lang="scss" scoped>
.message-item {
  display: flex;
  flex-direction: column;
  max-width: 80%;
  margin-bottom: 15px;
  position: relative;
  
  &.user-message {
    align-self: flex-end;
    align-items: flex-end;
    background-color: transparent;
    
    .message-content {
      background-color: #07c160;
      color: #fff;
      border-radius: 18px 4px 18px 18px;
      box-shadow: 0 2px 6px rgba(7, 193, 96, 0.2);
      font-weight: 500;
    }
  }
  
  &:not(.user-message) {
    align-self: flex-start;
    align-items: flex-start;
    
    .message-content {
      background-color: #fff;
      color: #333;
      border-radius: 4px 18px 18px 18px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    }
  }
  
  .message-content {
    padding: 12px 16px;
    word-break: break-all;
    line-height: 1.6;
    font-size: 15px;
    letter-spacing: 0.2px;
    
    .text-content {
      white-space: pre-wrap;
    }
    
    &.image {
      padding: 4px;
      background-color: transparent !important;
      box-shadow: none !important;
      overflow: hidden;
      
      .van-image {
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
    }
    
    &.file {
      padding: 0;
      width: 250px;
      
      .van-cell {
        padding: 12px;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
      }
    }

    &.process {
      background-color: #fff;
      padding: 0;
      box-shadow: none;
    }
  }
  
  .message-time {
    font-size: 11px;
    color: #999;
    margin-top: 5px;
    padding: 0 4px;
    opacity: 0.8;
    background-color: transparent;
  }
}

.process-card {
  width: 280px;
  background: #fff;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);

  .process-header {
    display: flex;
    align-items: center;
    margin-bottom: 6px;

    .process-icon { color: #1989fa; font-size: 18px; margin-right: 6px; }
    .process-title { font-weight: 600; color: #333; }
  }

  .process-tip { font-size: 13px; color: #666; line-height: 1.6; margin-bottom: 8px; }

  .process-actions { display: flex; justify-content: flex-end; margin-bottom: 6px; }

  .process-preview {
    border-top: 1px dashed rgba(0,0,0,0.06);
    padding-top: 8px;

    .preview-item { display: flex; justify-content: space-between; font-size: 12px; color: #555; margin-bottom: 4px; }
    .step-name { max-width: 70%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .step-status { font-weight: 500; }
    .step-status.in_progress { color: #1989fa; }
    .step-status.success { color: #07c160; }
    .step-status.failed { color: #ee0a24; }
    .step-status.pending { color: #999; }
  }
}
</style>