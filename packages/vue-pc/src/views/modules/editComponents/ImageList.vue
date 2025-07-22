<template>
  <div class="image-list-editor">
    <div class="header">
      <h3>图片列表编辑</h3>
    </div>
    
    <div class="image-upload-container">
      <ImageList
        v-model:value="imageList"
        @change="handleImageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { debounce } from 'lodash-es'
import ImageList from '@giom/shared/components/ImageList.vue'

// 定义props
const props = defineProps<{
  data?: any[]
}>()

// 定义emits
const emit = defineEmits<{
  (e: 'update:data', value: any[]): void
  (e: 'change', value: any[]): void
}>()

// 响应式数据
const imageList = ref<any[]>([])

// 初始化数据
onMounted(() => {
  if (props.data && Array.isArray(props.data)) {
    imageList.value = [...props.data]
  }
})

// 监听props变化
watch(
  () => props.data,
  (newValue) => {
    if (newValue && Array.isArray(newValue)) {
      imageList.value = [...newValue]
    }
  },
  { deep: true }
)

// 数据变化处理
const handleDataChange = () => {
  const updatedData = [...imageList.value]
  emit('update:data', updatedData)
  emit('change', updatedData)
}

// 防抖处理的数据变化函数
const debouncedHandleDataChange = debounce(handleDataChange, 300)

// 图片变化处理
const handleImageChange = (newImageList: any[]) => {
  imageList.value = [...newImageList]
  debouncedHandleDataChange()
}
</script>

<style scoped>
.image-list-editor {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
}

.header {
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.header h3 {
  margin: 0;
  color: #262626;
  font-size: 16px;
  font-weight: 600;
}

.image-upload-container {
  width: 100%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .image-list-editor {
    padding: 16px;
  }
}
</style>