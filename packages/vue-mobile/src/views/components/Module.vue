<template>
  <div class="module" :class="[`theme-${theme}`, { 'has-border': border }]">
    <div class="module-header" v-if="title || $slots.header">
      <slot name="header">
        <div class="module-title-wrapper">
          <div class="module-icon" v-if="icon">
            <img :src="icon" alt="模块图标" />
          </div>
          <h3 class="module-title">{{ title }}</h3>
        </div>
        <div class="module-extra" v-if="$slots.extra">
          <slot name="extra"></slot>
        </div>
      </slot>
    </div>
    <div class="module-content" :class="{ 'no-padding': noPadding }">
      <slot></slot>
    </div>
    <div class="module-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  // 模块标题
  title: {
    type: String,
    default: ''
  },
  // 模块图标
  icon: {
    type: String,
    default: ''
  },
  // 主题：light, dark, primary
  theme: {
    type: String,
    default: 'light',
    validator: (value: string) => ['light', 'dark', 'primary'].includes(value)
  },
  // 是否显示边框
  border: {
    type: Boolean,
    default: true
  },
  // 内容区域是否取消内边距
  noPadding: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.module {
  background-color: #ffffff;
  border-radius: 8px;
  margin-bottom: 16px;
  overflow: hidden;
}

.module.has-border {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #ebedf0;
}

.module-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.module-title-wrapper {
  display: flex;
  align-items: center;
}

.module-icon {
  margin-right: 8px;
}

.module-icon img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.module-title {
  font-size: 16px;
  font-weight: 500;
  margin: 0;
  color: #323233;
}

.module-content {
  padding: 16px;
}

.module-content.no-padding {
  padding: 0;
}

.module-footer {
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
}

/* 主题样式 */
.theme-light {
  background-color: #ffffff;
}

.theme-dark {
  background-color: #323233;
}

.theme-dark .module-title {
  color: #ffffff;
}

.theme-dark .module-header,
.theme-dark .module-footer {
  border-color: #3a3a3c;
}

.theme-primary {
  background-color: #1989fa;
}

.theme-primary .module-title {
  color: #ffffff;
}

.theme-primary .module-header,
.theme-primary .module-footer {
  border-color: rgba(255, 255, 255, 0.1);
}
</style>