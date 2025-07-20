<template>
  <div class="image-list">
    <div class="image-list-container">
      <draggable v-model="imageList" item-key="url" class="image-grid" :animation="200" ghost-class="ghost"
        :disabled="disabled" @end="onDragEnd">
        <template #item="{ element, index }">
          <div class="image-item" :class="{ disabled }" :style="getImageItemStyle()">
            <div class="image-wrapper">
              <img :src="element.url" :alt="`图片${index + 1}`" class="image" @click="previewImage(index)"
                @error="onImageError(element, index)" />
              <div class="image-overlay">
                <div class="image-actions">
                  <a-button type="text" size="small" class="action-btn preview-btn" @click="previewImage(index)">
                    <EyeOutlined />
                  </a-button>
                  <a-button type="text" size="small" class="action-btn delete-btn" :disabled="disabled"
                    @click="removeImage(index)">
                    <DeleteOutlined />
                  </a-button>
                </div>
              </div>
              <div class="drag-handle">
                <HolderOutlined />
              </div>
            </div>
            <!-- 比例信息已隐藏 -->
          </div>
        </template>
      </draggable>

      <!-- 上传按钮 -->
      <div class="upload-area" v-if="showUpload && !disabled && imageList.length < maxCount">
        <a-upload :file-list="[]" :before-upload="beforeUpload" :show-upload-list="false" accept="image/*"
          :multiple="true" :disabled="disabled">
          <div class="upload-button" :style="getImageItemStyle()">
            <PlusOutlined class="upload-icon" />
            <div class="upload-text">上传图片</div>
          </div>
        </a-upload>
      </div>
    </div>

    <!-- 图片预览模态框 -->
    <a-modal v-model:open="previewVisible" :footer="null" :width="800" centered class="image-preview-modal">
      <template #title>
        <span>图片预览 ({{ currentPreviewIndex + 1 }}/{{ imageList.length }})</span>
      </template>
      <div class="preview-container">
        <div class="preview-navigation">
          <a-button :disabled="currentPreviewIndex === 0" @click="prevImage" class="nav-btn">
            <LeftOutlined />
          </a-button>
          <a-button :disabled="currentPreviewIndex === imageList.length - 1" @click="nextImage" class="nav-btn">
            <RightOutlined />
          </a-button>
        </div>
        <div class="preview-image-wrapper">
          <img v-if="currentPreviewImage" :src="currentPreviewImage.url" :alt="`预览图片${currentPreviewIndex + 1}`"
            class="preview-image" />
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { message } from 'ant-design-vue'
import {
  PlusOutlined,
  EyeOutlined,
  DeleteOutlined,
  HolderOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons-vue'
import draggable from 'vuedraggable'
import type { UploadProps } from 'ant-design-vue'

// 图片数据类型定义
interface ImageItem {
  url: string
  ratio: number // 宽高比
  [key: string]: any // 允许其他属性
}

// 组件属性定义
interface Props {
  value: ImageItem[] // 图片数据数组
  maxCount?: number // 最大上传数量
  disabled?: boolean // 是否禁用
  showUpload?: boolean // 是否显示上传按钮
  maxSize?: number // 最大文件大小(MB)
  gridColumns?: number // 网格列数
  itemWidth?: number // 图片项宽度
}

// 事件定义
interface Emits {
  (e: 'update:value', value: ImageItem[]): void
  (e: 'change', value: ImageItem[]): void
  (e: 'upload', file: File): void
  (e: 'remove', item: ImageItem, index: number): void
  (e: 'sort', newList: ImageItem[]): void
}

// 属性默认值
const props = withDefaults(defineProps<Props>(), {
  maxCount: 9,
  disabled: false,
  showUpload: true,
  maxSize: 10,
  gridColumns: 3,
  itemWidth: 80,
})

// 事件发射器
const emit = defineEmits<Emits>()

// 响应式数据
const imageList = ref<ImageItem[]>([...props.value])
const previewVisible = ref(false)
const currentPreviewIndex = ref(0)

// 计算属性
const currentPreviewImage = computed(() => {
  return imageList.value[currentPreviewIndex.value]
})



// 监听imageList变化，向父组件发射事件
watch(
  imageList,
  (newList) => {
    emit('update:value', newList)
    emit('change', newList)

  },
  { deep: true }
)

// 获取图片项样式
const getImageItemStyle = () => {
  const width = props.itemWidth || 120

  return {
    width: `${width}px`,
    height: `${width}px` // 正方形显示
  }
}

// 格式化宽高比显示
const formatRatio = (ratio?: number) => {
  if (!ratio) return '未知'
  return `${ratio.toFixed(2)}:1`
}

// 上传前验证
const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  // 检查是否禁用
  if (props.disabled) {
    message.warning('组件已禁用，无法上传图片')
    return false
  }

  // 检查文件类型
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('只能上传图片文件!')
    return false
  }

  // 检查文件大小
  const isLtMaxSize = file.size / 1024 / 1024 < props.maxSize
  if (!isLtMaxSize) {
    message.error(`图片大小不能超过 ${props.maxSize}MB!`)
    return false
  }

  // 检查数量限制
  if (imageList.value.length >= props.maxCount) {
    message.error(`最多只能上传 ${props.maxCount} 张图片!`)
    return false
  }

  // 处理图片上传
  handleImageUpload(file)
  return false // 阻止自动上传
}

// 处理图片上传
const handleImageUpload = (file: File) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      const ratio = Number((img.width / img.height).toFixed(2))
      const newImage: ImageItem = {
        url: e.target?.result as string,
        ratio: ratio
      }
      imageList.value.push(newImage)
      message.success('图片上传成功!')
    }
    img.src = e.target?.result as string
  }
  reader.readAsDataURL(file)

  // 发射上传事件
  emit('upload', file)
}

// 移除图片
const removeImage = (index: number) => {
  if (props.disabled) {
    message.warning('组件已禁用，无法删除图片')
    return
  }
  const removedItem = imageList.value[index]
  imageList.value.splice(index, 1)
  emit('remove', removedItem, index)
  message.success('图片已删除')
}

// 图片加载错误处理
const onImageError = (item: ImageItem, index: number) => {
  console.error(`图片加载失败: ${item.url}`)
  message.error(`第${index + 1}张图片加载失败`)
}

// 预览图片
const previewImage = (index: number) => {
  currentPreviewIndex.value = index
  previewVisible.value = true
}

// 上一张图片
const prevImage = () => {
  if (currentPreviewIndex.value > 0) {
    currentPreviewIndex.value--
  }
}

// 下一张图片
const nextImage = () => {
  if (currentPreviewIndex.value < imageList.value.length - 1) {
    currentPreviewIndex.value++
  }
}

// 拖拽结束处理
const onDragEnd = () => {
  emit('sort', imageList.value)
}
</script>

<style scoped>
.image-list {
  width: 100%;
}

.image-list-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
}

.image-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.image-item {
  position: relative;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background-color: white;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: move;
}

.image-item:hover:not(.disabled) {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.image-item.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.image-item.disabled .image-overlay {
  display: none;
}

.image-item.disabled .drag-handle {
  display: none;
}

.image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.image:hover {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-item:hover .image-overlay {
  opacity: 1;
}

.image-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  color: white !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.action-btn:hover {
  background-color: rgba(255, 255, 255, 0.2) !important;
}

.preview-btn:hover {
  border-color: #1890ff !important;
}

.delete-btn:hover {
  border-color: #ff4d4f !important;
}

.drag-handle {
  position: absolute;
  top: 4px;
  right: 4px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  cursor: move;
}

.image-info {
  height: 40px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border-top: 1px solid #e8e8e8;
}

.image-ratio {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.upload-button {
  box-sizing: border-box;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: white;
}

.upload-button:hover:not(:disabled) {
  border-color: #1890ff;
  background-color: #f0f8ff;
}

.upload-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
  border-color: #d9d9d9;
  background-color: #f5f5f5;
}

.upload-button:disabled .upload-icon,
.upload-button:disabled .upload-text {
  color: #bfbfbf;
}

.upload-icon {
  font-size: 24px;
  color: #999;
  margin-bottom: 8px;
}

.upload-text {
  font-size: 14px;
  color: #666;
}

.ghost {
  opacity: 0.5;
  background-color: #f0f8ff;
}

/* 预览模态框样式 */
.image-preview-modal :deep(.ant-modal-body) {
  padding: 0;
}

.preview-container {
  position: relative;
}

.preview-navigation {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
  display: flex;
  gap: 8px;
}

.nav-btn {
  background-color: rgba(0, 0, 0, 0.5) !important;
  border: none !important;
  color: white !important;
}

.nav-btn:hover {
  background-color: rgba(0, 0, 0, 0.7) !important;
}

.nav-btn:disabled {
  background-color: rgba(0, 0, 0, 0.2) !important;
  color: rgba(255, 255, 255, 0.3) !important;
}

.preview-image-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background-color: #f5f5f5;
}

.preview-image {
  max-width: 100%;
  max-height: 500px;
  object-fit: contain;
}

.preview-info {
  padding: 16px;
  background-color: white;
  border-top: 1px solid #e8e8e8;
}

.preview-info p {
  margin: 8px 0;
  font-size: 14px;
  color: #666;
}

.preview-info strong {
  color: #333;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .image-list-container {
    gap: 12px;
    padding: 12px;
  }

  .image-grid {
    gap: 12px;
  }

  .upload-icon {
    font-size: 20px;
  }

  .upload-text {
    font-size: 12px;
  }
}
</style>