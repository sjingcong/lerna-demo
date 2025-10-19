<template>
  <div class="chat-input">
    <div class="input-wrapper">
      <van-field
        ref="fieldRef"
        v-model="inputText"
        type="textarea"
        rows="3"
        placeholder="请输入消息"
        :border="false"
        @keyup.enter="sendTextMessage"
      >
        <template #button>
          <div class="action-buttons">
            <button class="send-btn" @click="sendTextMessage" aria-label="发送">
              <svg class="plane" viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
                <path d="M2.01 21l20.49-9L2.01 3 2 10l15 2-15 2z"></path>
              </svg>
            </button>
          </div>
        </template>
      </van-field>
    </div>
    
    <!-- 图片上传 -->
    <van-uploader
      ref="imageUploader"
      v-show="false"
      :after-read="afterImageRead"
      :before-read="beforeImageRead"
      :max-size="MAX_IMAGE_SIZE"
      accept="image/*"
    />
    
    <!-- 文件上传 -->
    <van-uploader
      ref="fileUploader"
      v-show="false"
      :after-read="afterFileRead"
      :before-read="beforeFileRead"
      :max-size="MAX_FILE_SIZE"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Message, MessageType } from '../../types/chat'
import { UploaderInstance } from 'vant'
import { uploadFile } from '../../api/chat'
import { showToast } from 'vant'

const emit = defineEmits<{
  (e: 'send', message: Message): void
}>()

const inputText = ref('')
const fieldRef = ref<any | null>(null)
const imageUploader = ref<UploaderInstance | null>(null)
const fileUploader = ref<UploaderInstance | null>(null)
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

// 发送文本消息
const sendTextMessage = () => {
  if (!inputText.value.trim()) return
  
  const message: Message = {
    id: Date.now().toString(),
    content: inputText.value,
    type: MessageType.TEXT,
    isUser: true,
    time: new Date().getTime()
  }
  
  emit('send', message)
  inputText.value = ''
}

// 暴露给父组件的方法：聚焦与设置文本
defineExpose({
  focus: () => fieldRef.value?.focus?.(),
  setText: (t: string) => { inputText.value = t }
})

// 处理图片上传
const handleImageUpload = () => {
  imageUploader.value?.chooseFile()
}

// 图片上传后处理
const afterImageRead = async (file: any) => {
  try {
    const resp: any = await uploadFile({ type: 'image', content: file.content })
    const url = resp?.url || file.content
    const message: Message = {
      id: Date.now().toString(),
      content: url,
      type: MessageType.IMAGE,
      isUser: true,
      time: new Date().getTime()
    }
    emit('send', message)
  } catch (e) {
    const message: Message = {
      id: Date.now().toString(),
      content: file.content,
      type: MessageType.IMAGE,
      isUser: true,
      time: new Date().getTime()
    }
    emit('send', message)
  }
}

// 读取图片前校验：类型与大小
const beforeImageRead = (file: any) => {
  const raw = file?.file || file
  const type = raw?.type || ''
  const size = raw?.size || file?.size || 0
  if (!type.startsWith('image/')) {
    showToast('请选择图片文件')
    return false
  }
  if (size > MAX_IMAGE_SIZE) {
    showToast('图片大小不能超过 5MB')
    return false
  }
  return true
}

// 处理文件上传
const handleFileUpload = () => {
  fileUploader.value?.chooseFile()
}

// 文件上传后处理
const afterFileRead = async (file: any) => {
  try {
    const resp: any = await uploadFile({ type: 'file', content: file.content, name: file.file.name, size: file.file.size })
    const url = resp?.url || file.content
    const message: Message = {
      id: Date.now().toString(),
      content: '文件已上传',
      type: MessageType.FILE,
      isUser: true,
      time: new Date().getTime(),
      fileName: resp?.name || file.file.name,
      fileSize: resp?.size || file.file.size,
      fileUrl: url
    }
    emit('send', message)
  } catch (e) {
    const message: Message = {
      id: Date.now().toString(),
      content: '文件已上传',
      type: MessageType.FILE,
      isUser: true,
      time: new Date().getTime(),
      fileName: file.file.name,
      fileSize: file.file.size,
      fileUrl: URL.createObjectURL(file.file)
    }
    emit('send', message)
  }
}

// 读取文件前校验：大小与类型
const ALLOWED_FILE_TYPES = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
const beforeFileRead = (file: any) => {
  const raw = file?.file || file
  const type = raw?.type || ''
  const size = raw?.size || file?.size || 0
  if (size > MAX_FILE_SIZE) {
    showToast('文件大小不能超过 10MB')
    return false
  }
  if (ALLOWED_FILE_TYPES.length && type && !ALLOWED_FILE_TYPES.includes(type)) {
    showToast('暂不支持该文件类型')
    return false
  }
  return true
}
</script>

<style lang="scss" scoped>
.chat-input {
  width: 100%;
  padding-bottom: constant(safe-area-inset-bottom); /* iOS 11.0 */
  padding-bottom: env(safe-area-inset-bottom); /* iOS 11.2+ */
  
  .input-wrapper {
    display: flex;
    align-items: center;
    position: relative;
    
    .van-field {
      flex: 1;
      padding: 12px 0;
    }
  }
  // 在多行输入下为右下角发送按钮留出空间，避免文本被遮挡
  :deep(.van-field__control) {
    padding-right: 56px;
  }
  .action-buttons {
    position: absolute;
    right: 12px;
    bottom: 12px;
    display: flex;
    align-items: center;
    
    .send-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: #1989fa;
      border: none;
      color: #fff;
      box-shadow: 0 2px 8px rgba(25, 137, 250, 0.3);
      cursor: pointer;
      transition: box-shadow 0.2s ease, transform 0.2s ease;
    }
    .send-btn:active {
      transform: translateY(1px);
    }
    .plane {
      width: 20px;
      height: 20px;
    }
  }
}
</style>