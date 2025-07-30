<template>
  <div class="pdf-viewer">
    <!-- 工具栏 -->
    <div class="pdf-toolbar">
      <div class="toolbar-left">
        <button @click="prevPage" :disabled="currentPage <= 1" class="btn">
          上一页
        </button>
        <span class="page-info">
          {{ currentPage }} / {{ totalPages }}
        </span>
        <button @click="nextPage" :disabled="currentPage >= totalPages" class="btn">
          下一页
        </button>
      </div>
      <div class="toolbar-right">
        <button @click="zoomOut" :disabled="scale <= 0.5" class="btn">
          缩小
        </button>
        <span class="zoom-info">{{ Math.round(scale * 100) }}%</span>
        <button @click="zoomIn" :disabled="scale >= 3" class="btn">
          放大
        </button>
        <button v-if="props.showDownload" @click="downloadPdf" class="btn">
          下载
        </button>
      </div>
    </div>

    <!-- PDF渲染区域 -->
    <div class="pdf-container" ref="scrollWrapper" @scroll="handleScroll">
      <div class="pdf-scroll-content" ref="scrollContent" :style="{ transform: `scale(${scale})`, transformOrigin: 'top center' }">
        <div v-if="loading" class="loading">
          加载中...
        </div>
        <div v-if="error" class="error">
          {{ error }}
        </div>
        <div v-show="!loading && !error" class="pdf-pages-container" ref="pagesContainerRef">
          <!-- Canvas元素将通过JavaScript动态创建 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, shallowRef } from 'vue'
import * as pdfjsLib from 'pdfjs-dist'

// 设置PDF.js worker - 兼容3.x版本
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.js?url'
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

interface Props {
  src: string // PDF文件URL或base64
  initialPage?: number // 初始页码
  initialScale?: number // 初始缩放比例
  renderBuffer?: number // 预渲染缓冲区大小
  showDownload?: boolean // 是否显示下载按钮
}

const props = withDefaults(defineProps<Props>(), {
  initialPage: 1,
  initialScale: 1,
  renderBuffer: 1000,
  showDownload: false
})

const emit = defineEmits<{
  loaded: [totalPages: number]
  pageChange: [page: number]
  error: [error: string]
}>()

// 响应式数据
const loading = ref(true)
const error = ref('')
const currentPage = ref(props.initialPage)
const totalPages = ref(0)
const scale = ref(props.initialScale)
// 标志：是否由用户操作触发的页码变化
const isUserTriggered = ref(false)
const pdfDoc = shallowRef<any>(null) // 使用shallowRef避免深度代理，保持引用持久性
const canvasRefs = new Map<number, HTMLCanvasElement>()
const pagesContainerRef = ref<HTMLDivElement>()
const renderedPages = new Set<number>() // 跟踪已渲染的页面
// 存储每个页面的渲染任务
const renderTasks = new Map<number, any>()
// 存储每个页面的预计算信息（viewport）
const pageInfoCache = new Map<number, { viewport: any }>()
// 存储每个页面的loading状态
const pageLoadingStates = new Map<number, boolean>()
// 存储每个页面的容器div引用
const pageContainerRefs = new Map<number, HTMLDivElement>()
// 懒加载配置
const loadedPageCount = ref(0) // 已加载的页数
const isMounted = ref(false)

// 原生滚动相关
const scrollWrapper = ref<HTMLDivElement>()
const scrollContent = ref<HTMLDivElement>()

// 取消所有渲染任务的公共函数
const cancelAllRenderTasks = () => {
  renderTasks.forEach((task) => {
    try {
      task.cancel()
    } catch (e) {
      // 忽略取消错误
    }
  })
  renderTasks.clear()
}

// 创建所有页面的canvas元素并计算尺寸
const createAllCanvasElements = async () => {
  if (!pagesContainerRef.value || !pdfDoc.value) return

  // 清空容器和缓存
  pagesContainerRef.value.innerHTML = ''
  canvasRefs.clear()
  renderedPages.clear() // 清空已渲染页面记录
  pageInfoCache.clear() // 清空页面信息缓存
  pageLoadingStates.clear() // 清空loading状态
  pageContainerRefs.clear() // 清空容器引用

  // 获取容器可用宽度
  const container = scrollWrapper.value
  const containerWidth = container ? container.clientWidth - 16 : window.innerWidth - 16

  if (containerWidth <= 0) {
    console.warn('容器宽度无效，无法创建canvas元素')
    return
  }

  // 为所有页面创建canvas元素并计算尺寸
  for (let pageNum = 1; pageNum <= totalPages.value; pageNum++) {
    try {
      // 获取页面信息以计算尺寸
      const page = await pdfDoc.value.getPage(pageNum)
      const viewport = page.getViewport({ scale: 1 })

      // 计算适合的缩放比例
      const scaleToFit = containerWidth / viewport.width

      if (scaleToFit <= 0 || !isFinite(scaleToFit)) {
        console.warn(`页面 ${pageNum} 缩放比例无效: ${scaleToFit}`)
        continue
      }

      // 计算最终尺寸
      const adjustedViewport = page.getViewport({ scale: scaleToFit })
      if (adjustedViewport.width <= 0 || adjustedViewport.height <= 0) {
        console.warn(`页面 ${pageNum} viewport尺寸无效`)
        continue
      }

      // 缓存页面信息，避免在渲染时重复计算
      pageInfoCache.set(pageNum, {
        viewport: adjustedViewport
      })

      // 创建页面容器div
      const pageContainer = document.createElement('div')
      pageContainer.className = 'pdf-page-container'
      pageContainer.style.position = 'relative'
      pageContainer.style.display = 'inline-block'
      pageContainer.style.marginTop = '8px'
      pageContainer.dataset.page = pageNum.toString()

      // 创建canvas元素
      const canvas = document.createElement('canvas')
      canvas.className = 'pdf-canvas'
      canvas.dataset.page = pageNum.toString()

      // 设置canvas尺寸
      canvas.width = adjustedViewport.width
      canvas.height = adjustedViewport.height
      canvas.style.width = `${adjustedViewport.width}px`
      canvas.style.height = `${adjustedViewport.height}px`
      canvas.style.display = 'block'

      // 添加占位背景，表示未渲染状态
      const context = canvas.getContext('2d')
      if (context) {
        context.fillStyle = '#f8f9fa'
        context.fillRect(0, 0, canvas.width, canvas.height)

        // 添加页码提示
        context.fillStyle = '#6c757d'
        context.font = '16px Arial'
        context.textAlign = 'center'
        context.fillText(
          `第 ${pageNum} 页`,
          canvas.width / 2,
          canvas.height / 2
        )
      }

      // 创建loading图标容器
      const loadingContainer = document.createElement('div')
      loadingContainer.className = 'pdf-loading-container'
      loadingContainer.style.position = 'absolute'
      loadingContainer.style.top = '50%'
      loadingContainer.style.left = '50%'
      loadingContainer.style.transform = 'translate(-50%, -50%)'
      loadingContainer.style.display = 'none'
      loadingContainer.style.zIndex = '10'
      loadingContainer.innerHTML = `
        <div class="pdf-loading-icon" style="
          width: 40px;
          height: 40px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #1989fa;
          border-radius: 50%;
          animation: pdf-loading-spin 1s linear infinite;
        "></div>
      `

      // 将canvas和loading添加到页面容器
      pageContainer.appendChild(canvas)
      pageContainer.appendChild(loadingContainer)

      // 添加到主容器
      pagesContainerRef.value.appendChild(pageContainer)

      // 保存引用
      canvasRefs.set(pageNum, canvas)
      pageContainerRefs.set(pageNum, pageContainer)
      pageLoadingStates.set(pageNum, false)

    } catch (err) {
      console.error(`创建页面 ${pageNum} canvas失败:`, err)
    }
  }
}

// 加载PDF文档
const loadPdf = async () => {
  console.log('loadPdf')
  try {
    loading.value = true
    error.value = ''

    // 清除之前的渲染状态
    renderedPages.clear()
    canvasRefs.clear()
    pageInfoCache.clear()
    pageLoadingStates.clear()
    pageContainerRefs.clear()

    // 取消所有未完成的渲染任务
    cancelAllRenderTasks()

    const loadingTask = pdfjsLib.getDocument(props.src)
    pdfDoc.value = await loadingTask.promise
    totalPages.value = pdfDoc.value.numPages

    emit('loaded', totalPages.value)

    // 等待DOM更新完成后初始化显示
    await nextTick()
    await initializePdfDisplay()
    loading.value = false
  } catch (err: any) {
    loading.value = false
    error.value = `PDF加载失败: ${err.message}`
    emit('error', error.value)
  }
}

// 渲染指定页面内容到已存在的canvas
const renderPageContent = async (pageNum: number) => {
  if (!pdfDoc.value) {
    console.warn('PDF文档未准备好')
    return
  }

  const canvas = canvasRefs.get(pageNum)
  if (!canvas) {
    console.warn(`页面 ${pageNum} 的Canvas元素未准备好`)
    return
  }

  const context = canvas.getContext('2d')
  if (!context) {
    console.error('无法获取Canvas 2D上下文')
    return
  }

  // 如果该页面正在渲染，先取消之前的渲染任务
  const existingTask = renderTasks.get(pageNum)
  if (existingTask) {
    console.log(`页面已经在渲染,页面${pageNum}`)
    return
  }

  // 显示loading状态
  const pageContainer = pageContainerRefs.get(pageNum)
  const loadingContainer = pageContainer?.querySelector('.pdf-loading-container') as HTMLElement
  if (loadingContainer) {
    loadingContainer.style.display = 'block'
    pageLoadingStates.set(pageNum, true)
  }

  try {
    // 清除画布内容
    context.clearRect(0, 0, canvas.width, canvas.height)

    const page = await pdfDoc.value.getPage(pageNum)

    // 使用缓存的页面信息，避免重复计算
    const cachedInfo = pageInfoCache.get(pageNum)
    if (!cachedInfo) {
      console.warn(`页面 ${pageNum} 的缓存信息不存在`)
      return
    }
    const adjustedViewport = cachedInfo.viewport

    // 渲染页面内容到已存在的canvas
    const renderContext = {
      canvasContext: context,
      viewport: adjustedViewport
    }

    // 开始新的渲染任务
    const renderTask = page.render(renderContext)
    renderTasks.set(pageNum, renderTask)

    await renderTask.promise

    // 渲染成功，标记为已渲染
    renderedPages.add(pageNum)

    // 隐藏loading状态
    if (loadingContainer) {
      loadingContainer.style.display = 'none'
      pageLoadingStates.set(pageNum, false)
    }

    // 渲染完成后清除任务引用
    renderTasks.delete(pageNum)
  } catch (err: any) {
    // 清除任务引用
    renderTasks.delete(pageNum)

    // 隐藏loading状态
    if (loadingContainer) {
      loadingContainer.style.display = 'none'
      pageLoadingStates.set(pageNum, false)
    }

    // 如果是取消错误，不显示给用户
    if (err.name !== 'RenderingCancelledException') {
      error.value = `页面 ${pageNum} 渲染失败: ${err.message}`
      console.error('PDF渲染错误:', err)
    }
  }
}

// 初始化PDF显示（创建所有canvas，不进行渲染）
const initializePdfDisplay = async () => {
  if (!pdfDoc.value) return

  // 创建所有页面的canvas元素（带占位内容）
  await createAllCanvasElements()

  loadedPageCount.value = totalPages.value // 所有canvas都已创建

  // 触发初始的动态渲染检查，基于可视区域判断是否需要渲染
  await nextTick()
  updateCurrentPageByScroll()
}

// 翻页功能
const prevPage = () => {
  if (currentPage.value > 1) {
    isUserTriggered.value = true
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    isUserTriggered.value = true
    currentPage.value++
  }
}

// 缩放功能 - 使用原生 CSS transform
const zoomIn = () => {
  if (scale.value < 3) {
    const newScale = Math.min(scale.value + 0.2, 3)
    scale.value = newScale
  }
}

const zoomOut = () => {
  if (scale.value > 0.5) {
    const newScale = Math.max(scale.value - 0.2, 0.5)
    scale.value = newScale
  }
}

// 下载PDF
const downloadPdf = () => {
  const link = document.createElement('a')
  link.href = props.src
  link.download = `document_${Date.now()}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 原生滚动处理函数
const handleScroll = () => {
  throttledUpdateCurrentPage()
}

// 滚动到指定页面
const scrollToPage = (pageNum: number) => {
  if (!scrollWrapper.value || pageNum < 1 || pageNum > totalPages.value) {
    return
  }

  const pageContainer = pageContainerRefs.get(pageNum)
  if (pageContainer) {
    const containerTop = pageContainer.offsetTop
    // 考虑缩放比例的影响
    const scaledTop = containerTop * scale.value
    scrollWrapper.value.scrollTo({
      top: scaledTop,
      behavior: 'smooth'
    })
  }
}

// 使用requestAnimationFrame优化滚动性能
const createRAFThrottle = (func: Function) => {
  let rafId: number | null = null
  let isScheduled = false

  return function (this: any, ...args: any[]) {
    if (isScheduled) {
      return
    }
    isScheduled = true
    rafId = requestAnimationFrame(() => {
      func.apply(this, args)
      isScheduled = false
      rafId = null
    })
  }
}

// 根据滚动位置更新当前页面并动态渲染
const updateCurrentPageByScroll = () => {
  if (!scrollWrapper.value) {
    return
  }

  const scrollTop = scrollWrapper.value.scrollTop
  const containerHeight = scrollWrapper.value.clientHeight
  const centerY = scrollTop + containerHeight / 2
  const viewportTop = scrollTop
  const viewportBottom = viewportTop + containerHeight

  // 找到最接近中心的页面并触发动态渲染
  let closestPage = 1
  let minDistance = Infinity
  const visiblePages = new Set()
  const renderQueue = []

  for (let i = 1; i <= totalPages.value; i++) {
    const canvas = canvasRefs.get(i)
    const pageContainer = pageContainerRefs.get(i)
    if (canvas && pageContainer) {
      // 考虑缩放比例的影响
      const containerTop = pageContainer.offsetTop * scale.value
      const containerHeight = pageContainer.offsetHeight * scale.value
      const containerCenter = containerTop + containerHeight / 2
      const containerBottom = containerTop + containerHeight

      // 添加预渲染缓冲区，提前渲染即将进入可视区域的页面
      const renderBuffer = props.renderBuffer
      const extendedViewportTop = viewportTop - renderBuffer
      const extendedViewportBottom = viewportBottom + renderBuffer
      const isInViewport = containerBottom > extendedViewportTop && containerTop < extendedViewportBottom

      if (isInViewport) {
        visiblePages.add(i)

        // 检查是否已经渲染过
        if (!renderedPages.has(i)) {
          renderQueue.push(i)
        }
      }

      // 计算最接近中心的页面
      const distance = Math.abs(containerCenter - centerY)
      if (distance < minDistance) {
        minDistance = distance
        closestPage = i
      }
    }
  }

  // 限制同时渲染的页面数量，避免一次性渲染过多页面
  const maxConcurrentRenders = 2
  const toRender = renderQueue.slice(0, maxConcurrentRenders)

  toRender.forEach(pageNum => {
    console.log(`动态渲染页面 ${pageNum}`)
    renderPageContent(pageNum).catch(err => {
      console.error(`动态渲染页面 ${pageNum} 失败:`, err)
    })
  })

  if (closestPage !== currentPage.value) {
    currentPage.value = closestPage
    emit('pageChange', currentPage.value)
  }
}

// 创建基于requestAnimationFrame的页面更新函数
const throttledUpdateCurrentPage = createRAFThrottle(updateCurrentPageByScroll)

// 监听页码变化
watch(currentPage, (newPage, oldPage) => {
  // 只有在用户点击按钮时才滚动到对应页面
  // 避免滚动时的循环调用
  if (newPage !== oldPage && isUserTriggered.value) {
    scrollToPage(newPage)
    isUserTriggered.value = false // 重置标志
  }
})

// 重置组件状态
const resetComponentState = () => {
  // 取消所有未完成的渲染任务
  cancelAllRenderTasks()

  // 重置状态
  currentPage.value = props.initialPage
  totalPages.value = 0
  scale.value = props.initialScale
  loading.value = true
  error.value = ''
  loadedPageCount.value = 0

  // 清空缓存
  canvasRefs.clear()
  renderedPages.clear()
  pageInfoCache.clear()
  pageLoadingStates.clear()
  pageContainerRefs.clear()

  // 清空容器内容
  if (pagesContainerRef.value) {
    pagesContainerRef.value.innerHTML = ''
  }
}

// 监听src变化
watch(() => props.src, () => {
  if (props.src && isMounted.value) {
    resetComponentState()
    loadPdf()
  }
}, { immediate: true })

// 组件挂载
onMounted(async () => {
  isMounted.value = true
  if (props.src) {
    await loadPdf()
  }
})

// 组件卸载时清理资源
onUnmounted(() => {
  // 取消所有未完成的渲染任务
  cancelAllRenderTasks()
})
</script>

<style scoped>
.pdf-viewer {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}

.pdf-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  color: #333;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:hover:not(:disabled) {
  background-color: #f0f0f0;
  border-color: #ccc;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info,
.zoom-info {
  font-size: 12px;
  color: #666;
  white-space: nowrap;
}

.pdf-container {
  flex: 1;
  position: relative;
  overflow: auto;
  background-color: #f5f5f5;
  /* 原生滚动优化 */
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  /* Safari 触摸优化 */
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  /* 触摸操作优化 */
  touch-action: manipulation;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

.pdf-scroll-content {
  min-height: 100%;
  transition: transform 0.3s ease;
  /* 硬件加速 */
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.pdf-pages-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100%;
  /* 触摸优化 */
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
  touch-action: manipulation;
}

.pdf-canvas {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 90vh;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  border-radius: 4px;
  object-fit: contain;
  /* 触摸优化 */
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
  touch-action: manipulation;
}

.loading,
.error {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 16px;
  color: #666;
}

.error {
  color: #f56565;
}

.loading-more,
.load-complete {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  font-size: 14px;
  color: #666;
  gap: 8px;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes pdf-loading-spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.load-complete {
  color: #999;
  font-size: 12px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .pdf-toolbar {
    padding: 8px 10px;
  }

  .toolbar-left,
  .toolbar-right {
    gap: 6px;
  }

  .btn {
    padding: 4px 8px;
    font-size: 11px;
  }

  .page-info,
  .zoom-info {
    font-size: 11px;
  }

  .pdf-container {
    padding: 10px;
  }
}
</style>