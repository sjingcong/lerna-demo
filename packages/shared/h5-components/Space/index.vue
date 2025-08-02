<template>
  <div 
    class="space-container"
    :class="{
      [`space-${direction}`]: true,
      [`space-align-${align}`]: align
    }"
    :style="containerStyle"
  >
    <template v-for="(item, index) in items" :key="index">
      <div 
        class="space-item"
        :style="itemStyle"
      >
        <slot name="item" :item="item" :index="index">
          <button class="space-button">{{ item }}</button>
        </slot>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// 定义props
const props = defineProps({
  // 间距大小
  size: {
    type: [String, Number],
    default: 'medium'
  },
  // 排列方向
  direction: {
    type: String,
    default: 'horizontal',
    validator: (value) => ['horizontal', 'vertical'].includes(value)
  },
  // 对齐方式
  align: {
    type: String,
    default: 'start',
    validator: (value) => ['start', 'center', 'end', 'baseline'].includes(value)
  },
  // 是否自动换行
  wrap: {
    type: Boolean,
    default: false
  },
  // 项目列表
  items: {
    type: Array,
    default: () => ['按钮1', '按钮2', '按钮3']
  }
})

// 计算间距值
const getSpaceSize = (size) => {
  if (typeof size === 'number') {
    return `${size}px`
  }
  
  const sizeMap = {
    small: '8px',
    medium: '16px',
    large: '24px'
  }
  
  return sizeMap[size] || sizeMap.medium
}

// 容器样式
const containerStyle = computed(() => {
  const gap = getSpaceSize(props.size)
  
  return {
    gap,
    flexWrap: props.wrap ? 'wrap' : 'nowrap'
  }
})

// 项目样式
const itemStyle = computed(() => {
  return {
    flexShrink: props.wrap ? 1 : 0
  }
})
</script>

<style scoped>
.space-container {
  display: flex;
}

.space-horizontal {
  flex-direction: row;
}

.space-vertical {
  flex-direction: column;
}

.space-align-start {
  align-items: flex-start;
}

.space-align-center {
  align-items: center;
}

.space-align-end {
  align-items: flex-end;
}

.space-align-baseline {
  align-items: baseline;
}

.space-item {
  display: flex;
}

.space-button {
  padding: 8px 16px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.space-button:hover {
  background: #40a9ff;
}

.space-button:active {
  background: #096dd9;
}
</style>