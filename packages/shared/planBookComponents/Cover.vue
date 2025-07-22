<template>
  <ModuleContainer :back-image="props.data?.backImage">
    <!-- 企业保障计划书表单区域 -->
    <div class="form-section">
      <div class="form-container">
        <h2 class="form-title">企业保障计划书</h2>
        
        <div class="form-fields">
          <div class="field-item">
            <label class="field-label">企业名称</label>
            <van-field
              v-model="formData.companyName"
              placeholder="请输入企业名称"
              class="custom-field"
              @update:model-value="handleFieldChange"
            />
          </div>
          
          <div class="field-item">
            <label class="field-label">年份</label>
            <van-field
              v-model="formData.year"
              placeholder="请输入年份"
              class="custom-field"
              @update:model-value="handleFieldChange"
            />
          </div>
          
          <div class="field-item">
            <label class="field-label">服务经理</label>
            <van-field
              v-model="formData.serviceManager"
              placeholder="请输入服务经理姓名"
              class="custom-field"
              @update:model-value="handleFieldChange"
            />
          </div>
          
          <div class="field-item">
            <label class="field-label">联系电话</label>
            <van-field
              v-model="formData.phone"
              placeholder="请输入联系电话"
              class="custom-field"
              @update:model-value="handleFieldChange"
            />
          </div>
          
          <div class="field-item">
            <label class="field-label">电子邮箱</label>
            <van-field
              v-model="formData.email"
              placeholder="请输入电子邮箱"
              class="custom-field"
              @update:model-value="handleFieldChange"
            />
          </div>
        </div>
      </div>
    </div>
  </ModuleContainer>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { Field as VanField } from 'vant'
import type { IModule } from './types'
import ModuleContainer from './ModuleContainer.vue'

// 表单数据接口
interface FormData {
  companyName: string
  year: string
  serviceManager: string
  phone: string
  email: string
}

// Props
interface Props {
  data?: {
    companyName?: string
    year?: string
    serviceManager?: string
    phone?: string
    email?: string
    backImage?: {
      url?: string
      ratio?: number
    }
    [key: string]: any
  }
  config?: IModule
}

const props = withDefaults(defineProps<Props>(), {
  data: () => ({})
})

// Emits
const emit = defineEmits<{
  update: [data: FormData]
}>()

// 表单数据
const formData = reactive<FormData>({
  companyName: props.data?.companyName || '',
  year: props.data?.year || new Date().getFullYear().toString(),
  serviceManager: props.data?.serviceManager || '',
  phone: props.data?.phone || '',
  email: props.data?.email || ''
})



// 处理字段变化
const handleFieldChange = () => {
  emit('update', { ...formData })
}
</script>

<style scoped>


/* 表单区域 */
.form-section {
  flex: 1;
  background: white;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.form-container {
  width: 100%;
  max-width: 400px;
}

.form-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 30px;
  text-align: left;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.field-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.field-label {
  min-width: 80px;
  font-size: 14px;
  color: #666;
  font-weight: 500;
  text-align: left;
}

.custom-field {
  flex: 1;
}

.custom-field :deep(.van-field__control) {
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  background: #f8f9fa;
}

.custom-field :deep(.van-field__control:focus) {
  outline: none;
  background: #f0f2f5;
}

.custom-field :deep(.van-field__body) {
  padding: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {

  
  .form-section {
    padding: 20px;
  }
  
  .field-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .field-label {
    min-width: auto;
    text-align: left;
  }
  
  .custom-field {
    width: 100%;
  }
}
</style>