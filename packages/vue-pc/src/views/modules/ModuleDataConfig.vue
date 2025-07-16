<template>
  <div class="module-data-config">
    <div class="config-header">
      <h3>模块数据配置</h3>
      <p class="config-desc">配置当前模块的基本属性</p>
    </div>
    
    <div class="config-content" v-if="moduleData">
      <div class="config-section">
        <h4 class="section-title">基本信息</h4>
        
        <!-- 模块名称 -->
        <div class="config-item">
          <label class="config-label">模块名称</label>
          <a-input 
            v-model:value="localModuleData.moduleName"
            placeholder="请输入模块名称"
            @change="handleModuleNameChange"
          />
        </div>
        
        <!-- 可编辑状态 -->
        <div class="config-item">
          <label class="config-label">可编辑</label>
          <div class="switch-wrapper">
            <a-switch 
              v-model:checked="localModuleData.editable"
              @change="handleEditableChange"
            />
            <span class="switch-desc">
              {{ localModuleData.editable ? '允许编辑' : '禁止编辑' }}
            </span>
          </div>
        </div>
        
        <!-- 可删除状态 -->
        <div class="config-item">
          <label class="config-label">可删除</label>
          <div class="switch-wrapper">
            <a-switch 
              v-model:checked="localModuleData.deletable"
              @change="handleDeletableChange"
            />
            <span class="switch-desc">
              {{ localModuleData.deletable ? '允许删除' : '禁止删除' }}
            </span>
          </div>
        </div>
      </div>
      

    </div>
    
    <div v-else class="config-empty">
      <div class="empty-icon">
        <i class="icon-settings"></i>
      </div>
      <p class="empty-text">请选择一个模块进行配置</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import type { IModule } from './types'

interface Props {
  moduleData?: IModule | null
}

interface Emits {
  (e: 'update:moduleData', data: IModule): void
  (e: 'save', data: IModule): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 本地数据副本
const localModuleData = ref<Partial<IModule>>({})

// 监听外部数据变化
watch(
  () => props.moduleData,
  (newData) => {
    if (newData) {
      localModuleData.value = {
        moduleName: newData.moduleName,
        editable: newData.editable,
        deletable: newData.deletable,
        moduleCode: newData.moduleCode,
        moduleType: newData.moduleType,
        templateAttrs: newData.templateAttrs
      }
    } else {
      localModuleData.value = {}
    }
  },
  { immediate: true, deep: true }
)

// 实时更新模块数据
const updateModuleData = () => {
  if (!props.moduleData) return
  
  const updatedData: IModule = {
    ...props.moduleData,
    moduleName: localModuleData.value.moduleName || props.moduleData.moduleName,
    editable: localModuleData.value.editable ?? props.moduleData.editable,
    deletable: localModuleData.value.deletable ?? props.moduleData.deletable
  }
  
  emit('save', updatedData)
  emit('update:moduleData', updatedData)
}

// 处理模块名称变化
const handleModuleNameChange = () => {
  updateModuleData()
}

// 处理可编辑状态变化
const handleEditableChange = (checked: boolean) => {
  updateModuleData()
}

// 处理可删除状态变化
const handleDeletableChange = (checked: boolean) => {
  updateModuleData()
}
</script>

<style scoped>
.module-data-config {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
}

.config-header {
  padding: 20px;
  border-bottom: 1px solid #e4e7ed;
  background: #fafbfc;
}

.config-header h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.config-desc {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

.config-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.config-section {
  margin-bottom: 32px;
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  padding-bottom: 8px;
  border-bottom: 1px solid #e4e7ed;
}

.config-item {
  margin-bottom: 20px;
}

.config-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #606266;
}

.switch-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.switch-desc {
  font-size: 14px;
  color: #909399;
}



.config-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #c0c4cc;
}

.empty-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #f4f4f5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.empty-icon .icon-settings {
  width: 40px;
  height: 40px;
  background: #c0c4cc;
  border-radius: 4px;
}

.empty-text {
  font-size: 16px;
  color: #909399;
  margin: 0;
}

/* 滚动条样式 */
.config-content::-webkit-scrollbar {
  width: 6px;
}

.config-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.config-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.config-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>