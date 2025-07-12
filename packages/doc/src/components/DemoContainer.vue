<template>
  <div class="demo-container">
    <div class="demo-header">
      <div class="demo-info">
        <Icon icon="mdi:play-circle" class="demo-icon" />
        <h3 v-if="title" class="demo-title">{{ title }}</h3>
        <p v-if="description" class="demo-description">{{ description }}</p>
      </div>
      <div class="demo-actions">
        <button 
          v-if="showCode"
          @click="toggleCode" 
          class="toggle-btn"
          :class="{ active: isCodeVisible }"
          :title="isCodeVisible ? '隐藏代码' : '查看代码'"
        >
          <Icon :icon="isCodeVisible ? 'mdi:eye-off' : 'mdi:eye'" />
          {{ isCodeVisible ? '隐藏代码' : '查看代码' }}
        </button>
        <button 
          v-if="showReset"
          @click="resetDemo" 
          class="reset-btn"
          title="重置演示"
        >
          <Icon icon="mdi:refresh" />
          重置
        </button>
      </div>
    </div>
    
    <div class="demo-content">
      <div class="demo-preview">
        <slot></slot>
      </div>
      
      <div v-if="showCode && isCodeVisible" class="demo-code">
        <div class="code-header">
          <span class="code-label">
            <Icon icon="mdi:code-tags" />
            示例代码
          </span>
          <button @click="copyDemoCode" class="copy-code-btn" :class="{ copied: isCopied }">
            <Icon :icon="isCopied ? 'mdi:check' : 'mdi:content-copy'" />
            {{ isCopied ? '已复制' : '复制' }}
          </button>
        </div>
        <div class="code-content">
          <pre><code v-html="highlightedCode"></code></pre>
        </div>
      </div>
    </div>
    
    <div v-if="note" class="demo-note">
      <Icon icon="mdi:information" class="note-icon" />
      <span>{{ note }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'

interface Props {
  title?: string
  description?: string
  note?: string
  showCode?: boolean
  showReset?: boolean
  code?: string
  language?: string
}

const props = withDefaults(defineProps<Props>(), {
  showCode: true,
  showReset: false,
  language: 'vue'
})

const emit = defineEmits<{
  reset: []
}>()

const isCodeVisible = ref(false)
const isCopied = ref(false)

const toggleCode = () => {
  isCodeVisible.value = !isCodeVisible.value
}

const resetDemo = () => {
  emit('reset')
}

// 简单的Vue代码高亮
const highlightedCode = computed(() => {
  if (!props.code) return ''
  
  let code = props.code
  
  // Vue模板高亮
  if (props.language === 'vue') {
    code = code
      // HTML标签
      .replace(/(&lt;\/?)(\w+)/g, '$1<span class="tag">$2</span>')
      // 属性名
      .replace(/(\w+)=/g, '<span class="attr-name">$1</span>=')
      // 属性值
      .replace(/="([^"]*)"/g, '="<span class="attr-value">$1</span>"')
      // Vue指令
      .replace(/\b(v-\w+|@\w+|:\w+)/g, '<span class="directive">$1</span>')
      // 插值表达式
      .replace(/{{([^}]+)}}/g, '<span class="interpolation">{{$1}}</span>')
  }
  
  // JavaScript高亮
  if (props.language === 'javascript' || props.language === 'js') {
    code = code
      .replace(/\b(const|let|var|function|return|if|else|for|while|import|export|from|default|class|extends|async|await|try|catch|finally)\b/g, '<span class="keyword">$1</span>')
      .replace(/\b(true|false|null|undefined)\b/g, '<span class="literal">$1</span>')
      .replace(/'([^']*?)'/g, '<span class="string">\&$1\&</span>')
      .replace(/"([^"]*?)"/g, '<span class="string">"$1"</span>')
      .replace(/`([^`]*?)`/g, '<span class="template-string">`$1`</span>')
      .replace(/\/\/.*$/gm, '<span class="comment">$&</span>')
  }
  
  return code
})

const copyDemoCode = async () => {
  if (!props.code) return
  
  try {
    await navigator.clipboard.writeText(props.code)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
  }
}
</script>

<style scoped>
.demo-container {
  margin: 2rem 0;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.demo-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e1e4e8;
}

.demo-info {
  flex: 1;
}

.demo-icon {
  color: #28a745;
  font-size: 1.2rem;
  margin-right: 0.5rem;
  vertical-align: middle;
}

.demo-title {
  display: inline;
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  vertical-align: middle;
}

.demo-description {
  color: #6a737d;
  margin: 0.5rem 0 0 0;
  font-size: 0.9rem;
  line-height: 1.5;
}

.demo-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.toggle-btn,
.reset-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: #ffffff;
  border: 1px solid #e1e4e8;
  color: #586069;
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.toggle-btn:hover,
.reset-btn:hover {
  background: #f3f4f6;
  border-color: #d1d5da;
}

.toggle-btn.active {
  background: #007acc;
  border-color: #007acc;
  color: white;
}

.reset-btn {
  color: #e36209;
  border-color: #fd8c73;
}

.reset-btn:hover {
  background: #fff5f0;
  border-color: #e36209;
}

.demo-content {
  position: relative;
}

.demo-preview {
  padding: 2rem 1.5rem;
  min-height: 100px;
  background: #ffffff;
}

.demo-code {
  border-top: 1px solid #e1e4e8;
  background: #f8f9fa;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #ffffff;
  border-bottom: 1px solid #e1e4e8;
}

.code-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: #2c3e50;
  font-size: 0.9rem;
}

.copy-code-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: #f8f9fa;
  border: 1px solid #e1e4e8;
  color: #586069;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;
}

.copy-code-btn:hover {
  background: #e1e4e8;
}

.copy-code-btn.copied {
  background: #28a745;
  border-color: #28a745;
  color: white;
}

.code-content {
  overflow-x: auto;
}

.code-content pre {
  margin: 0;
  padding: 1rem;
  background: #f8f9fa;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #24292e;
}

.code-content code {
  background: none;
  padding: 0;
  font-size: inherit;
  color: inherit;
}

.demo-note {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #fff3cd;
  border-top: 1px solid #ffeaa7;
  color: #856404;
  font-size: 0.875rem;
}

.note-icon {
  color: #f39c12;
  flex-shrink: 0;
}

/* 语法高亮样式 */
:deep(.keyword) {
  color: #d73a49;
  font-weight: 600;
}

:deep(.literal) {
  color: #005cc5;
}

:deep(.string) {
  color: #032f62;
}

:deep(.template-string) {
  color: #032f62;
}

:deep(.comment) {
  color: #6a737d;
  font-style: italic;
}

:deep(.tag) {
  color: #22863a;
}

:deep(.attr-name) {
  color: #6f42c1;
}

:deep(.attr-value) {
  color: #032f62;
}

:deep(.directive) {
  color: #e36209;
  font-weight: 600;
}

:deep(.interpolation) {
  color: #6f42c1;
  background: rgba(111, 66, 193, 0.1);
  padding: 0.1rem 0.2rem;
  border-radius: 2px;
}

/* 滚动条样式 */
.code-content::-webkit-scrollbar {
  height: 8px;
}

.code-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.code-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.code-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

@media (max-width: 768px) {
  .demo-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .demo-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .demo-preview {
    padding: 1.5rem 1rem;
  }
  
  .code-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .code-content pre {
    padding: 0.75rem;
    font-size: 0.8rem;
  }
}
</style>