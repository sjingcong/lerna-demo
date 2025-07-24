<template>
  <div class="module-config">
    <!-- 模块渲染区域 -->
    <div class="render-panel">
      <div v-if="currentModule" class="panel-content">
        <div class="panel-header">
          <h3>{{ currentModule.moduleName }} 预览</h3>
        </div>
        <div class="panel-body">
          <!-- 动态渲染选中的模块组件 -->
          <div class="template-render" v-if="currentModule">
            <ModuleRender 
              :template-component="currentModule.moduleCode" 
              :data="selectedModuleData.data"
              :config="selectedModuleData.config"
            />
          </div>
        </div>
      </div>

      <div v-else class="panel-empty">
        <div class="empty-icon">
          <i class="icon-template"></i>
        </div>
        <p class="empty-text">暂无模块数据</p>
      </div>
    </div>
    
    <!-- 下一步按钮 -->
    <NextButton @module-changed="handleModuleChanged" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { usePlanTemplateStore } from '../../stores/planTemplateStore'
import ModuleRender from './ModuleRender.vue'
import NextButton from './components/NextButton.vue'
import type { IModule } from '@giom/shared/planBookComponents/types'

interface Props {
  id?: string // 路由参数，对应模块代码
  moduleCode?: string // 指定要渲染的模块代码
}

const props = withDefaults(defineProps<Props>(), {
  id: '',
  moduleCode: ''
})

// 使用store
const store = usePlanTemplateStore()

// 当前模块
const currentModule = computed(() => {
  // 优先使用路由参数id
  if (props.id) {
    return store.modules.find(m => m.moduleCode === props.id) || null
  }
  // 其次使用moduleCode prop
  if (props.moduleCode) {
    return store.modules.find(m => m.moduleCode === props.moduleCode) || null
  }
  return store.currentModule
})

// 模块组件的数据
const selectedModuleData = computed(() => {
  if (!currentModule.value) return {}

  // 根据模块代码获取对应的数据
  const moduleCode = currentModule.value.moduleCode
  const data = store.moduleValueMap[moduleCode] || {}

  return {
    data,
    // 同时传递模块配置信息
    config: currentModule.value
  }
})

// 处理模块切换事件
const handleModuleChanged = (module: IModule) => {
  console.log('模块已切换到:', module.moduleName)
}

// 组件挂载时初始化
onMounted(async () => {
  try {
    // 初始化模块列表
    await store.initModules()

    // 优先使用路由参数id
    if (props.id) {
      await store.selectModuleByCode(props.id)
    } else if (props.moduleCode) {
      // 其次使用moduleCode prop
      await store.selectModuleByCode(props.moduleCode)
    } else if (store.modules.length > 0) {
      // 否则选择第一个模块
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
  flex-direction: column;
  height: 100vh;
  background-color: #f5f7fa;
}

/* 模块渲染面板 */
.render-panel {
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
  overflow-y: auto;
}

.template-render {
  width: 100%;
  height: 100%;
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

/* 移动端适配 */
@media (max-width: 768px) {
  .panel-header {
    padding: 15px;
  }
  
  .panel-header h3 {
    font-size: 16px;
  }
  
  .panel-body {
    padding: 15px;
  }
}

/* 滚动条样式 */
.panel-body::-webkit-scrollbar {
  width: 6px;
}

.panel-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.panel-body::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.panel-body::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>