<template>
  <div class="cover-template">
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
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { Field as VanField } from 'vant'
import type { IModule } from './types'

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
.cover-template {
  width: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  padding: 20px;
  margin: 0 auto;
}

/* 企业保障计划书悬浮模块 */
.cover-template > * {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
  display: flex;
}

/* 背景图片区域 */
.background-section {
  flex: 1;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 40px;
  color: white;
}

.company-logo {
  text-align: left;
}

.logo-text {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
  letter-spacing: 2px;
}

.logo-subtitle {
  font-size: 14px;
  opacity: 0.9;
  letter-spacing: 1px;
}

.business-people {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}

.people-placeholder {
  font-size: 80px;
  opacity: 0.8;
  text-align: center;
}

/* 表单区域 */
.form-section {
  flex: 1;
  background: white;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  .cover-template {
    padding: 10px;
    min-height: 100vh;
  }
  
  .cover-template > * {
    flex-direction: column;
    max-width: none;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .background-section {
    min-height: 250px;
    padding: 20px;
  }
  
  .logo-text {
    font-size: 20px;
  }
  
  .people-placeholder {
    font-size: 60px;
  }
  
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