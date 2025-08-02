<template>
  <div class="space-preview">
    <Space v-bind="$attrs" :items="items" />
    
    <!-- 配置信息显示 -->
    <div class="config-info">
      <div class="info-item">
        <span class="label">当前配置:</span>
        <span class="value">{{ configSummary }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Space from './index.vue'

// 定义props
const props = defineProps({
  size: {
    type: [String, Number],
    default: 'medium'
  },
  direction: {
    type: String,
    default: 'horizontal'
  },
  align: {
    type: String,
    default: 'start'
  },
  wrap: {
    type: Boolean,
    default: false
  }
})

// 示例项目数据
const items = ['按钮1', '按钮2', '按钮3', '按钮4', '按钮5', '按钮6']

// 配置摘要
const configSummary = computed(() => {
  const sizeLabel = {
    small: '小间距',
    medium: '中间距', 
    large: '大间距'
  }[props.size] || props.size
  
  const directionLabel = {
    horizontal: '水平排列',
    vertical: '垂直排列'
  }[props.direction]
  
  const alignLabel = {
    start: '起始对齐',
    center: '居中对齐',
    end: '末尾对齐',
    baseline: '基线对齐'
  }[props.align]
  
  const wrapLabel = props.wrap ? '自动换行' : '不换行'
  
  return `${sizeLabel} | ${directionLabel} | ${alignLabel} | ${wrapLabel}`
})
</script>

<style scoped>
.space-preview {
  padding: 1rem;
}

.config-info {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.info-item:last-child {
  margin-bottom: 0;
}

.label {
  font-weight: 500;
  color: #64748b;
  margin-right: 0.5rem;
  min-width: 80px;
}

.value {
  color: #1e293b;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  background: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  border: 1px solid #d1d5db;
  font-size: 0.875rem;
}
</style>