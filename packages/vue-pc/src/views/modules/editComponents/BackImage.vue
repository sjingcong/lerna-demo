<template>
  <div class="back-image">
    <div class="image-upload-container">
      <ImageList
        v-model:value="localImageList"
        :max-count="1"
        @change="handleImageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { debounce } from 'lodash-es'
import ImageList from '@giom/shared/components/ImageList.vue'

interface BackImageData {
  url: string
  ratio: string
}

interface Props {
  data: BackImageData
}

interface Emits {
  (e: 'update:data', value: BackImageData): void
  (e: 'change', value: BackImageData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 创建响应式数据副本
const localImageList = reactive<any[]>(
  props.data?.url ? [{ url: props.data.url, ratio: parseFloat(props.data.ratio) || '' }] : []
)

// 监听props变化
watch(() => props.data, (newData) => {
  const newImageList = newData?.url ? [{ url: newData.url, ratio: parseFloat(newData.ratio) || 1.78 }] : []
  localImageList.splice(0, localImageList.length, ...newImageList)
}, { deep: true })

// 数据变化处理
const handleDataChange = () => {
  const updatedData: BackImageData = {
    url: localImageList.length > 0 ? localImageList[0].url : '',
    ratio: localImageList.length > 0 ? localImageList[0].ratio.toString() : ''
  }
  emit('update:data', updatedData)
  emit('change', updatedData)
}

// 防抖处理的数据变化函数
const debouncedHandleDataChange = debounce(handleDataChange, 300)

// 图片变化处理
const handleImageChange = (imageList: any[]) => {
  debugger
  localImageList.splice(0, localImageList.length, ...imageList)
  debouncedHandleDataChange()
}
</script>

<style scoped>
.back-image {
  background: #fff;
  border-radius: 8px;
}

.section-header {
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.section-header h3 {
  margin: 0;
  color: #262626;
  font-size: 16px;
  font-weight: 600;
}

.image-info {
  padding: 12px;
  background: #fafafa;
  border-radius: 6px;
  border: 1px solid #f0f0f0;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.label {
  color: #666;
  font-size: 14px;
  min-width: 80px;
}

.value {
  color: #333;
  font-size: 14px;
  word-break: break-all;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .back-image {
    padding: 16px;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .label {
    min-width: auto;
  }
}
</style>