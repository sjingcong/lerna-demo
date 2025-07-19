# PDF预览组件 (PdfViewer)

基于PDF.js的Vue 3 PDF预览组件，专为移动端优化，支持触摸手势操作。

## 功能特性

- ✅ **PDF文档渲染** - 基于Mozilla PDF.js，支持标准PDF格式
- ✅ **翻页功能** - 支持按钮翻页和触摸滑动翻页
- ✅ **缩放功能** - 支持按钮缩放和双指缩放手势
- ✅ **下载功能** - 一键下载PDF文档
- ✅ **移动端优化** - 响应式设计，适配各种屏幕尺寸
- ✅ **触摸手势** - 支持滑动翻页、双指缩放
- ✅ **加载状态** - 显示加载进度和错误信息
- ✅ **TypeScript支持** - 完整的类型定义

## 安装依赖

```bash
yarn add pdfjs-dist
```

## 基本使用

```vue
<template>
  <div class="pdf-container">
    <PdfViewer
      :src="pdfUrl"
      :initial-page="1"
      :initial-scale="1"
      @loaded="onPdfLoaded"
      @page-change="onPageChange"
      @error="onPdfError"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PdfViewer from '@/components/PdfViewer.vue'

const pdfUrl = ref('path/to/your/document.pdf')

const onPdfLoaded = (totalPages: number) => {
  console.log(`PDF加载完成，共${totalPages}页`)
}

const onPageChange = (page: number) => {
  console.log(`当前页码: ${page}`)
}

const onPdfError = (error: string) => {
  console.error('PDF加载错误:', error)
}
</script>

<style scoped>
.pdf-container {
  height: 100vh;
}
</style>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `src` | `string` | - | PDF文件URL或base64数据 |
| `initialPage` | `number` | `1` | 初始显示页码 |
| `initialScale` | `number` | `1` | 初始缩放比例 |

## Events

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `loaded` | `totalPages: number` | PDF加载完成时触发 |
| `pageChange` | `page: number` | 页码变化时触发 |
| `error` | `error: string` | 发生错误时触发 |

## 支持的PDF来源

### 1. 远程URL
```javascript
const pdfUrl = 'https://example.com/document.pdf'
```

### 2. 本地文件（通过FileReader）
```javascript
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file && file.type === 'application/pdf') {
    const reader = new FileReader()
    reader.onload = (e) => {
      pdfUrl.value = e.target.result // base64格式
    }
    reader.readAsDataURL(file)
  }
}
```

### 3. Base64数据
```javascript
const pdfUrl = 'data:application/pdf;base64,JVBERi0xLjQK...'
```

## 触摸手势操作

- **左右滑动** - 翻页（滑动距离 > 50px，垂直偏移 < 100px）
- **双指缩放** - 缩放文档（缩放范围：0.5x - 3x）

## 工具栏功能

- **上一页/下一页** - 翻页导航
- **页码显示** - 当前页/总页数
- **缩小/放大** - 缩放控制（0.5x - 3x）
- **缩放显示** - 当前缩放比例
- **下载** - 下载PDF文档

## 样式定制

组件使用scoped样式，可以通过CSS变量或深度选择器进行定制：

```vue
<style>
/* 自定义工具栏颜色 */
.pdf-viewer .pdf-toolbar {
  background-color: #your-color;
}

/* 自定义按钮样式 */
.pdf-viewer .btn {
  background-color: #your-button-color;
}
</style>
```

## 移动端适配

组件已针对移动端进行优化：

- 响应式工具栏布局
- 触摸友好的按钮尺寸
- 优化的触摸手势识别
- 适配小屏幕的字体和间距

## 注意事项

1. **CORS问题** - 确保PDF文件服务器支持跨域访问
2. **文件大小** - 大文件可能影响加载性能，建议压缩PDF
3. **浏览器兼容性** - 支持现代浏览器，IE需要polyfill
4. **Worker配置** - 组件自动配置PDF.js worker，无需手动设置

## 演示页面

访问 `/pdf-demo` 路由查看完整的使用演示，包括：

- 文件上传预览
- 示例PDF加载
- 功能操作演示
- 错误处理展示

## 技术栈

- Vue 3 + TypeScript
- PDF.js (Mozilla)
- 响应式设计
- 触摸手势支持