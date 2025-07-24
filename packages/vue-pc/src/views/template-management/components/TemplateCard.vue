<template>
  <div class="template-card" @click="handleView">
    <!-- 上半部分：图片背景 -->
    <div class="card-image">
      <img :src="template.templageCover" :alt="template.templateName" class="cover-image" />
    </div>
        <a-button
          type="text"
          size="small"
          class="delete-btn"
          @click.stop="handleDelete"
        >
          <CloseOutlined />
        </a-button>
    <!-- 下半部分：白底内容区 -->
    <div class="card-content">
      <!-- 右上角按钮组 -->
      <div class="action-buttons">
        <a-button
          type="link"
          size="small"
          class="edit-btn"
          @click.stop="handleEdit"
        >
          编辑
        </a-button>

      </div>
      
      <!-- 模板信息 -->
      <div class="template-info">
        <h3 class="template-name">{{ template.templateName }}</h3>
        <p class="template-desc">{{ template.templateDesc }}</p>
        <p class="create-time">{{ formatCreateTime(template.createTime) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CloseOutlined } from '@ant-design/icons-vue'
import type { TemplateItem } from '../types'

// Props
const props = defineProps<{
  template: TemplateItem
}>()

// Emits
const emit = defineEmits<{
  edit: [template: TemplateItem]
  view: [template: TemplateItem]
  delete: [template: TemplateItem]
}>()

// 方法
const handleEdit = () => {
  emit('edit', props.template)
}

const handleView = () => {
  emit('view', props.template)
}

const handleDelete = () => {
  emit('delete', props.template)
}

// 格式化创建时间
const formatCreateTime = (time: string) => {
  if (!time) return ''
  // 如果是时间戳，转换为日期格式
  const date = new Date(time)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}
</script>

<style scoped>
.template-card {
  position: relative;
  width: 100%;
  height: 320px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  background: #fff;
}

.template-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

/* 上半部分：图片区域 */
.card-image {
  width: 100%;
  height: 180px;
  overflow: hidden;
  position: relative;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.template-card:hover .cover-image {
  transform: scale(1.05);
}

/* 下半部分：内容区域 */
.card-content {
  height: 140px;
  padding: 16px;
  background: #fff;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* 右上角按钮组 */
.action-buttons {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
  display: flex;
  gap: 4px;
}

.delete-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  border-radius: 6px;
  padding: 4px 8px;
  height: auto;
  min-width: auto;
}

.delete-btn {
  padding: 4px 6px;
}

/* 模板信息区域 */
.template-info {
  flex: 1;
  padding-right: 80px; /* 为按钮组留出更多空间 */
}

.template-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.template-desc {
  font-size: 14px;
  color: #666;
  margin: 0 0 12px 0;
  line-height: 1.5;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}

.create-time {
  font-size: 12px;
  color: #999;
  margin: 0;
  line-height: 1.4;
}
</style>