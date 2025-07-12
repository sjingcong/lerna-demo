<template>
  <div class="code-block">
    <div class="code-header">
      <div class="code-info">
        <Icon icon="mdi:code-tags" class="code-icon" />
        <span v-if="title" class="code-title">{{ title }}</span>
        <span v-if="language" class="code-language">{{ language }}</span>
      </div>
      <div class="code-actions">
        <button 
          @click="copyCode" 
          class="copy-btn"
          :class="{ copied: isCopied }"
          :title="isCopied ? '已复制' : '复制代码'"
        >
          <Icon :icon="isCopied ? 'mdi:check' : 'mdi:content-copy'" />
          {{ isCopied ? '已复制' : '复制' }}
        </button>
      </div>
    </div>
    <div class="code-content">
      <pre><code :class="`language-${language}`" v-html="highlightedCode"></code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'

interface Props {
  code?: string
  language?: string
  title?: string
  filename?: string
}

const props = withDefaults(defineProps<Props>(), {
  language: 'javascript',
  title: '',
  filename: ''
})

const slots = defineSlots()
const isCopied = ref(false)

// 从slot中提取代码内容
const codeContent = computed(() => {
  if (props.code) {
    return props.code
  }
  
  // 从默认slot中提取代码
  const slotContent = slots.default?.()
  if (slotContent && slotContent[0]) {
    const textContent = slotContent[0].children as string
    if (typeof textContent === 'string') {
      // 移除代码块标记和多余的空白
      return textContent
        .replace(/^```\w*\n?/, '')
        .replace(/\n?```$/, '')
        .trim()
    }
  }
  
  return ''
})

// 简单的语法高亮（实际项目中建议使用 Prism.js 或 highlight.js）
const highlightedCode = computed(() => {
  const code = codeContent.value
  if (!code) return ''
  
  // 这里是一个简化的语法高亮实现
  // 实际项目中应该使用专业的语法高亮库
  let highlighted = code
  
  // JavaScript 关键字高亮
  if (props.language === 'javascript' || props.language === 'js') {
    highlighted = highlighted
      .replace(/\b(const|let|var|function|return|if|else|for|while|import|export|from|default|class|extends|async|await|try|catch|finally)\b/g, '<span class="keyword">$1</span>')
      .replace(/\b(true|false|null|undefined)\b/g, '<span class="literal">$1</span>')
      .replace(/'([^']*?)'/g, '<span class="string">\&$1\&</span>')
      .replace(/"([^"]*?)"/g, '<span class="string">"$1"</span>')
      .replace(/`([^`]*?)`/g, '<span class="template-string">`$1`</span>')
      .replace(/\/\/.*$/gm, '<span class="comment">$&</span>')
      .replace(/\/\*[\s\S]*?\*\//g, '<span class="comment">$&</span>')
  }
  
  // CSS 高亮
  if (props.language === 'css') {
    highlighted = highlighted
      .replace(/([.#][\w-]+)/g, '<span class="selector">$1</span>')
      .replace(/(\w+):/g, '<span class="property">$1</span>:')
      .replace(/:(\s*[^;]+);/g, ': <span class="value">$1</span>;')
  }
  
  // HTML 高亮
  if (props.language === 'html') {
    highlighted = highlighted
      .replace(/(&lt;\/?)(\w+)/g, '$1<span class="tag">$2</span>')
      .replace(/(\w+)=/g, '<span class="attr-name">$1</span>=')
      .replace(/="([^"]*)"/g, '="<span class="attr-value">$1</span>"')
  }
  
  return highlighted
})

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(codeContent.value)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
    // 降级方案
    const textArea = document.createElement('textarea')
    textArea.value = codeContent.value
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  }
}
</script>

<style scoped>
.code-block {
  margin: 1.5rem 0;
  border: 1px solid #e1e4e8;
  border-radius: 8px;
  overflow: hidden;
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

.code-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.code-icon {
  color: #007acc;
  font-size: 1.1rem;
}

.code-title {
  font-weight: 500;
  color: #2c3e50;
}

.code-language {
  background: #e1f5fe;
  color: #0277bd;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.code-actions {
  display: flex;
  gap: 0.5rem;
}

.copy-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: #f8f9fa;
  border: 1px solid #e1e4e8;
  color: #586069;
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.copy-btn:hover {
  background: #e1e4e8;
  border-color: #d1d5da;
}

.copy-btn.copied {
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

:deep(.selector) {
  color: #6f42c1;
}

:deep(.property) {
  color: #005cc5;
}

:deep(.value) {
  color: #032f62;
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