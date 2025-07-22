<template>
  <div class="module-config">
    <!-- 左侧模块列表 -->
    <div class="template-list">
      <div class="list-header">
        <div class="header-left">
          <h3 class="list-title">模块列表</h3>
          <div class="list-count">{{ store.modules.length }} 个模块</div>
        </div>
        <div class="header-right">
          <button class="add-image-btn" @click="addImageModule" title="添加图片模块">
            <i class="icon-image"></i>
            添加图片模块
          </button>
        </div>
      </div>

      <div class="list-content">
        <draggable v-model="store.modules" @change="handleDragChange" item-key="moduleName" :animation="200"
          ghost-class="ghost" chosen-class="chosen" drag-class="drag">
          <template #item="{ element: template }">
            <div class="template-item" :class="{ 'selected': store.currentModule?.moduleName === template.moduleName }"
              @click="selectTemplate(template)">
              <div class="template-icon">
                <i class="icon" :class="getModuleIcon(template.moduleCode)"></i>
              </div>

              <div class="template-info">
                <div class="template-name">{{ template.moduleName }}</div>
                <div class="template-desc">{{ template.moduleType }}</div>
                <div class="template-attrs">
                  <span class="attr-count">{{ template.templateAttrs.length }} 个属性</span>
                </div>
              </div>
            </div>
          </template>
        </draggable>
      </div>
    </div>

    <!-- 中间模块渲染区域 -->
    <div class="render-panel">
      <div v-if="store.currentModule" class="panel-content">
        <div class="panel-header">
          <h3>{{ store.currentModule.moduleName }} 预览</h3>
        </div>
        <div class="panel-body">
          <!-- 动态渲染选中的模块组件 -->
          <div class="template-render" v-if="store.currentModule">
            <ModuleRender :template-component="store.currentModule.moduleCode" :data="selectedModuleData.data"
              :config="selectedModuleData.config" />
          </div>
        </div>
      </div>

      <div v-else class="panel-empty">
        <div class="empty-icon">
          <i class="icon-template"></i>
        </div>
        <p class="empty-text">请选择一个模块进行预览</p>
      </div>
    </div>

    <!-- 右侧数据配置区域 -->
    <div class="data-config-panel">
      <ModuleDataConfig :module="store.currentModule" @save="handleModuleDataSave" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { usePlanTemplateStore } from '../../store/planTemplate'
import ModuleRender from './ModuleRender.vue'
import ModuleDataConfig from './ModuleDataConfig.vue'
import type { IModule } from '@giom/shared/planBookComponents/types'
import draggable from 'vuedraggable'

// 使用store并确保类型正确
const store = usePlanTemplateStore()

// 拖拽变化处理
const handleDragChange = async (event: any) => {
  if (event.moved) {
    try {
      // await store.reorderModules(store.modules)
      console.log('模块顺序更新成功')
    } catch (error) {
      console.error('更新模块顺序失败:', error)
    }
  }
}



// 模块组件的数据
const selectedModuleData = computed(() => {
  if (!store.currentModule) return {}

  // 根据模块代码获取对应的数据
  const moduleCode = store.currentModule.moduleCode
  const data = store.moduleValueMap[moduleCode] || {}

  return {
    data,
    // 同时传递模块配置信息
    config: store.currentModule
  }
})

// 选择模块
const selectTemplate = async (template: IModule) => {
  await store.setCurrentModule(template)
}

// 获取模块图标
const getModuleIcon = (moduleCode: string) => {
  const iconMap: Record<string, string> = {
    'cover': 'icon-cover',
    'catalog': 'icon-catalog',
    'content': 'icon-content',
    'chart': 'icon-chart'
  }
  return iconMap[moduleCode] || 'icon-template'
}

// 添加图片模块
const addImageModule = async () => {
  try {
    const newModule = await store.addImageModule()
    console.log('图片模块添加成功:', newModule.moduleName)
    // 自动选择新添加的模块
    await store.setCurrentModule(newModule)
  } catch (error) {
    console.error('添加图片模块失败:', error)
  }
}

// 处理模块数据保存
const handleModuleDataSave = async (moduleData: IModule) => {
  try {
    // 更新store中的模块数据
    await store.updateModule(moduleData)
    console.log('模块数据保存成功:', moduleData)
  } catch (error) {
    console.error('保存模块数据失败:', error)
  }
}

// 组件挂载时初始化模块列表并选择第一个模块
onMounted(async () => {
  try {
    // 初始化模块列表
    await store.initModules()

    // 选择第一个模块
    if (store.modules.length > 0) {
      await store.selectModuleByCode(store.modules[0].moduleCode)
    }
  } catch (error) {
    console.error('初始化模块配置失败:', error)
  }
})
</script>

<style scoped>
.module-config {
  display: flex;
  height: 100vh;
  background-color: #f5f7fa;
}

/* 左侧模块列表 */
.template-list {
  width: 400px;
  background: white;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e4e7ed;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.header-right {
  display: flex;
  align-items: center;
}

.list-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.list-count {
  font-size: 12px;
  color: #909399;
}

.add-image-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-image-btn:hover {
  background: #337ecc;
}

.add-image-btn .icon-image {
  width: 14px;
  height: 14px;
  background: currentColor;
  mask: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>') no-repeat center;
  mask-size: contain;
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
  transform: translateY(-2px);
}

.template-item.active {
  border-color: #409eff;
  background: #f0f9ff;
}

.template-item.selected {
  border-color: #409eff;
  background: #f0f9ff;
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


/* 中间模块渲染面板 */
.render-panel {
  flex: 1;
  background: white;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e4e7ed;
}

/* 右侧数据配置面板 */
.data-config-panel {
  width: 550px;
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
  overflow-y: auto;
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
@media (max-width: 1200px) {
  .template-list {
    width: 300px;
  }

  .data-config-panel {
    width: 380px;
  }
}

@media (max-width: 1024px) {
  .template-list {
    width: 280px;
  }

  .data-config-panel {
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
    height: 40vh;
  }

  .render-panel {
    height: 40vh;
    border-right: none;
    border-bottom: 1px solid #e4e7ed;
  }

  .data-config-panel {
    width: 100%;
    height: 20vh;
  }
}

/* vuedraggable 拖拽样式 */
.ghost {
  opacity: 0.5;
  background: #f0f0f0;
}

.chosen {
  opacity: 0.8;
  transform: rotate(2deg);
}

.drag {
  opacity: 0.6;
  transform: rotate(5deg);
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