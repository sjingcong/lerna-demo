<template>
  <div class="module-config">
    <!-- 左侧模板列表 -->
    <div class="template-list">
      <div class="list-header">
        <h3 class="list-title">模板列表</h3>
        <div class="list-count">{{ templates.length }} 个模板</div>
      </div>
      
      <div class="list-content">
        <div 
          v-for="(template, index) in templates" 
          :key="template.moduleName"
          class="template-item"
          :class="{ 'selected': selectedTemplate?.moduleName === template.moduleName }"
          @click="selectTemplate(template)"
        >
          <div class="template-icon">
            <i class="icon" :class="getTemplateIcon(template.moduleCode)"></i>
          </div>
          
          <div class="template-info">
            <div class="template-name">{{ template.moduleName }}</div>
            <div class="template-desc">{{ template.moduleType }}</div>
            <div class="template-attrs">
              <span class="attr-count">{{ template.templateAttrs.length }} 个属性</span>
            </div>
          </div>
          
          <div class="template-actions">
            <button 
              class="action-btn preview-btn"
              @click.stop="previewTemplate(template)"
              title="预览模板"
            >
              <EyeOutlined />
            </button>
            <button 
              class="action-btn edit-btn"
              @click.stop="editTemplate(template)"
              title="编辑模板"
            >
              <EditOutlined />
            </button>
          </div>
        </div>
      </div>
      
      <div class="list-footer">
        <button class="add-template-btn" @click="addNewTemplate">
          <i class="icon-plus"></i>
          添加新模板
        </button>
      </div>
    </div>
    
    <!-- 右侧配置区域 -->
    <div class="config-panel">
      <div v-if="selectedTemplate" class="panel-content">
        <div class="panel-header">
          <h3>{{ selectedTemplate.moduleName }} 配置</h3>
        </div>
        <div class="panel-body">
          <!-- 动态渲染选中的模板组件 -->
           <div class="template-render" v-if="selectedTemplate">
             <TemplateRender 
               :template-component="selectedTemplate.moduleCode"
               :data="templateData"
             />
           </div>
          <p class="placeholder">配置面板内容待实现...</p>
        </div>
      </div>
      
      <div v-else class="panel-empty">
        <div class="empty-icon">
          <i class="icon-template"></i>
        </div>
        <p class="empty-text">请选择一个模板进行配置</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { usePlanTemplateStore } from '../../store/planTemplate'
import { EyeOutlined, EditOutlined } from '@ant-design/icons-vue'
import TemplateRender from './TemplateRender.vue'
import type { IModule } from './types'

// 使用store并确保类型正确
const store = usePlanTemplateStore()

// 响应式数据
const selectedTemplate = ref<IModule | null>(null)

// 计算属性
const templates = computed(() => store.templates)

// 初始化模板数据
const initTemplateData = (templateType: string) => {
  if (templateType === 'cover' && !store.templateData.cover) {
    store.initCoverData()
  } else if (templateType === 'catalog' && !store.templateData.catalog) {
    store.initCatalogData()
  }
}

// 模板组件的数据
const templateData = computed(() => {
  if (!selectedTemplate.value) return {}
  
  // 根据模板类型获取对应的数据
  const templateType = selectedTemplate.value.moduleCode.toLowerCase()
  let data = {}
  
  if (templateType === 'cover') {
    data = store.templateData.cover || {}
  } else if (templateType === 'catalog') {
    data = store.templateData.catalog || {}
  }
  
  return {
    ...data,
    // 同时传递模板配置信息
    config: selectedTemplate.value
  }
})

// 选择模板
const selectTemplate = (template: IModule) => {
  selectedTemplate.value = template
  // 初始化对应模板的数据
  const templateType = template.moduleCode.toLowerCase()
  initTemplateData(templateType)
}

// 获取模板图标
const getTemplateIcon = (moduleCode: string) => {
  const iconMap: Record<string, string> = {
    'cover': 'icon-cover',
    'catalog': 'icon-catalog',
    'content': 'icon-content',
    'chart': 'icon-chart'
  }
  return iconMap[moduleCode] || 'icon-template'
}

// 预览模板
const previewTemplate = (template: IModule) => {
  console.log('预览模板:', template.moduleName)
  // TODO: 实现预览功能
}

// 编辑模板
const editTemplate = (template: IModule) => {
  console.log('编辑模板:', template.moduleName)
  // TODO: 实现编辑功能
}

// 添加新模板
const addNewTemplate = () => {
  console.log('添加新模板')
  // TODO: 实现添加功能
}

// 组件挂载时默认选择第一个模板
onMounted(() => {
  if (templates.value.length > 0) {
    selectTemplate(templates.value[0])
  }
})
</script>

<style scoped>
.module-config {
  display: flex;
  height: 100vh;
  background-color: #f5f7fa;
}

/* 左侧模板列表 */
.template-list {
  width: 400px;
  background: white;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
}

.list-header {
  padding: 20px;
  border-bottom: 1px solid #e4e7ed;
  background: #fafbfc;
}

.list-title {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.list-count {
  font-size: 14px;
  color: #909399;
}

.list-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.template-item {
  display: flex;
  align-items: center;
  padding: 16px;
  margin-bottom: 12px;
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.template-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
  transform: translateY(-2px);
}

.template-item.active {
  border-color: #409eff;
  background: #f0f9ff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

.template-item.selected {
  border-color: #409eff;
  background: #f0f9ff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

.template-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
}

.template-icon .icon {
  width: 24px;
  height: 24px;
  background: white;
  border-radius: 4px;
}

.template-info {
  flex: 1;
  min-width: 0;
}

.template-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.template-desc {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
  line-height: 1.4;
}

.template-attrs {
  display: flex;
  align-items: center;
}

.attr-count {
  font-size: 12px;
  color: #909399;
  background: #f4f4f5;
  padding: 2px 8px;
  border-radius: 12px;
}

.template-actions {
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.template-item:hover .template-actions {
  opacity: 1;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.preview-btn {
  background: #e1f3d8;
  color: #67c23a;
}

.preview-btn:hover {
  background: #67c23a;
  color: white;
}

.edit-btn {
  background: #fdf6ec;
  color: #e6a23c;
}

.edit-btn:hover {
  background: #e6a23c;
  color: white;
}

.action-btn .icon-eye,
.action-btn .icon-edit {
  width: 16px;
  height: 16px;
  background: currentColor;
  border-radius: 2px;
}

.list-footer {
  padding: 20px;
  border-top: 1px solid #e4e7ed;
}

.add-template-btn {
  width: 100%;
  height: 44px;
  border: 2px dashed #c0c4cc;
  background: transparent;
  color: #606266;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.add-template-btn:hover {
  border-color: #409eff;
  color: #409eff;
  background: #f0f9ff;
}

.add-template-btn .icon-plus {
  width: 16px;
  height: 16px;
  background: currentColor;
  border-radius: 2px;
}

/* 右侧配置面板 */
.config-panel {
  flex: 1;
  background: white;
  display: flex;
  flex-direction: column;
}

.panel-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 20px;
  border-bottom: 1px solid #e4e7ed;
  background: #fafbfc;
}

.panel-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.panel-body {
  flex: 1;
  padding: 20px;
}

.template-render {
  margin-bottom: 20px;
  padding: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background: #fafbfc;
}

.placeholder {
  color: #909399;
  text-align: center;
  margin-top: 40px;
}

.panel-empty {
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

.empty-icon .icon-template {
  width: 40px;
  height: 40px;
  background: #c0c4cc;
  border-radius: 4px;
}

.empty-text {
  font-size: 16px;
  color: #909399;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .template-list {
    width: 320px;
  }
}

@media (max-width: 768px) {
  .module-config {
    flex-direction: column;
    height: auto;
  }
  
  .template-list {
    width: 100%;
    height: 50vh;
  }
  
  .config-panel {
    height: 50vh;
  }
}

/* 滚动条样式 */
.list-content::-webkit-scrollbar {
  width: 6px;
}

.list-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.list-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.list-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>