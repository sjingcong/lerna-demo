<template>
  <div class="template-render">
    <component 
      :is="currentComponent" 
      v-if="currentComponent"
      v-bind="data"
    />
    <div v-else class="component-not-found">
      组件 "{{ templateComponent }}" 未找到
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getTemplateComponent } from './constant'

interface Props {
  templateComponent: string
  data?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  data: () => ({})
})

// 根据组件名获取实际组件
const currentComponent = computed(() => {
  return getTemplateComponent(props.templateComponent)
})

</script>

<style scoped>
.template-render {
  width: 100%;
  height: 100%;
}

.component-not-found {
  padding: 20px;
  text-align: center;
  color: #999;
  border: 1px dashed #ddd;
  border-radius: 4px;
}
</style>