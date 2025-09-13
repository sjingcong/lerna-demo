<template>
  <div class="signature-container">
    <!-- 头部标题栏 -->
    <van-nav-bar
      title="电子签名"
      left-text="返回"
      left-arrow
      @click-left="onBack"
      @click-right="onSave"
    >
      <template #right>
        <van-button type="primary" size="small" :disabled="!hasSignature">
          保存
        </van-button>
      </template>
    </van-nav-bar>

    <!-- 签名画布区域 -->
    <div class="canvas-wrapper">
      <canvas
        ref="canvasRef"
        class="signature-canvas"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
        @mouseup="onMouseUp"
        @mouseleave="onMouseUp"
      ></canvas>
      
      <!-- 无签名时的提示 -->
      <div v-if="!hasSignature" class="empty-hint">
        请在此区域签名
      </div>
    </div>

    <!-- 操作按钮区域 -->
    <div class="action-buttons">
      <van-button 
        class="action-btn" 
        @click="clearSignature"
        :disabled="!hasSignature"
      >
        清除
      </van-button>
      <van-button 
        class="action-btn" 
        type="primary" 
        @click="previewSignature"
        :disabled="!hasSignature"
      >
        预览
      </van-button>
    </div>

    <!-- 签名设置 -->
    <van-cell-group class="settings-group">
      <van-cell title="笔触粗细">
        <template #right-icon>
          <van-slider
            v-model="strokeWidth"
            :min="1"
            :max="10"
            :step="1"
            class="stroke-slider"
          />
        </template>
      </van-cell>
      <van-cell title="笔触颜色" @click="showColorPicker = true">
        <template #right-icon>
          <div 
            class="color-preview" 
            :style="{ backgroundColor: strokeColor }"
          ></div>
        </template>
      </van-cell>
    </van-cell-group>

    <!-- 轨迹识别信息 -->
    <van-cell-group class="track-info" v-if="trackInfo.points > 0">
      <van-cell title="轨迹信息" :label="`共 ${trackInfo.points} 个点，${trackInfo.strokes} 笔画`" />
      <van-cell title="签名时长" :value="`${trackInfo.duration}ms`" />
      <van-cell title="平均速度" :value="`${trackInfo.avgSpeed.toFixed(2)}px/ms`" />
    </van-cell-group>

    <!-- 颜色选择器 -->
    <van-popup v-model:show="showColorPicker" position="bottom">
      <div class="color-picker">
        <div class="color-title">选择笔触颜色</div>
        <div class="color-grid">
          <div
            v-for="color in colorOptions"
            :key="color"
            class="color-item"
            :class="{ active: strokeColor === color }"
            :style="{ backgroundColor: color }"
            @click="selectColor(color)"
          ></div>
        </div>
      </div>
    </van-popup>

    <!-- 预览弹窗 -->
    <van-dialog
      v-model:show="showPreview"
      title="签名预览"
      :show-cancel-button="false"
      confirm-button-text="确定"
    >
      <div class="preview-container">
        <img v-if="previewImage" :src="previewImage" alt="签名预览" />
      </div>
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showConfirmDialog } from 'vant'

// 轨迹点接口
interface TrackPoint {
  x: number
  y: number
  timestamp: number
  pressure?: number
}

// 轨迹信息接口
interface TrackInfo {
  points: number
  strokes: number
  duration: number
  avgSpeed: number
}

const router = useRouter()

// 画布相关
const canvasRef = ref<HTMLCanvasElement>()
const ctx = ref<CanvasRenderingContext2D>()
const hasSignature = ref(false)

// 绘制状态
const isDrawing = ref(false)
const strokeWidth = ref(3)
const strokeColor = ref('#000000')

// 轨迹识别相关
const trackPoints = ref<TrackPoint[]>([])
const currentStroke = ref<TrackPoint[]>([])
const trackInfo = ref<TrackInfo>({
  points: 0,
  strokes: 0,
  duration: 0,
  avgSpeed: 0
})

// UI状态
const showColorPicker = ref(false)
const showPreview = ref(false)
const previewImage = ref('')

// 颜色选项
const colorOptions = [
  '#000000', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500',
  '#800080', '#008000', '#800000', '#000080'
]

// 初始化画布
const initCanvas = async () => {
  await nextTick()
  if (!canvasRef.value) return

  const canvas = canvasRef.value
  const container = canvas.parentElement
  if (!container) return

  // 设置画布尺寸
  const rect = container.getBoundingClientRect()
  canvas.width = rect.width * window.devicePixelRatio
  canvas.height = (rect.height - 100) * window.devicePixelRatio
  canvas.style.width = `${rect.width}px`
  canvas.style.height = `${rect.height - 100}px`

  // 获取上下文
  const context = canvas.getContext('2d')
  if (!context) return

  ctx.value = context
  
  // 设置绘制属性
  context.scale(window.devicePixelRatio, window.devicePixelRatio)
  context.lineCap = 'round'
  context.lineJoin = 'round'
  context.fillStyle = '#FFFFFF'
  context.fillRect(0, 0, canvas.width, canvas.height)
}

// 获取触摸/鼠标位置
const getPosition = (event: TouchEvent | MouseEvent) => {
  if (!canvasRef.value) return { x: 0, y: 0 }

  const rect = canvasRef.value.getBoundingClientRect()
  let clientX: number, clientY: number

  if (event instanceof TouchEvent) {
    const touch = event.touches[0] || event.changedTouches[0]
    clientX = touch.clientX
    clientY = touch.clientY
  } else {
    clientX = event.clientX
    clientY = event.clientY
  }

  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  }
}

// 开始绘制
const startDrawing = (event: TouchEvent | MouseEvent) => {
  event.preventDefault()
  
  if (!ctx.value) return

  isDrawing.value = true
  currentStroke.value = []
  
  const pos = getPosition(event)
  const point: TrackPoint = {
    x: pos.x,
    y: pos.y,
    timestamp: Date.now()
  }

  currentStroke.value.push(point)
  
  ctx.value.beginPath()
  ctx.value.moveTo(pos.x, pos.y)
  ctx.value.strokeStyle = strokeColor.value
  ctx.value.lineWidth = strokeWidth.value
}

// 绘制中
const drawing = (event: TouchEvent | MouseEvent) => {
  event.preventDefault()
  
  if (!isDrawing.value || !ctx.value) return

  const pos = getPosition(event)
  const point: TrackPoint = {
    x: pos.x,
    y: pos.y,
    timestamp: Date.now()
  }

  currentStroke.value.push(point)
  
  ctx.value.lineTo(pos.x, pos.y)
  ctx.value.stroke()
}

// 结束绘制
const endDrawing = (event: TouchEvent | MouseEvent) => {
  event.preventDefault()
  
  if (!isDrawing.value) return

  isDrawing.value = false
  hasSignature.value = true

  // 添加当前笔画到轨迹数据
  if (currentStroke.value.length > 0) {
    trackPoints.value.push(...currentStroke.value)
    updateTrackInfo()
  }
}

// 更新轨迹信息
const updateTrackInfo = () => {
  if (trackPoints.value.length === 0) return

  const startTime = trackPoints.value[0].timestamp
  const endTime = trackPoints.value[trackPoints.value.length - 1].timestamp
  const duration = endTime - startTime

  // 计算笔画数（通过时间间隔判断）
  let strokes = 1
  for (let i = 1; i < trackPoints.value.length; i++) {
    const timeDiff = trackPoints.value[i].timestamp - trackPoints.value[i - 1].timestamp
    if (timeDiff > 200) { // 200ms间隔认为是新笔画
      strokes++
    }
  }

  // 计算总距离和平均速度
  let totalDistance = 0
  for (let i = 1; i < trackPoints.value.length; i++) {
    const prev = trackPoints.value[i - 1]
    const curr = trackPoints.value[i]
    const dx = curr.x - prev.x
    const dy = curr.y - prev.y
    totalDistance += Math.sqrt(dx * dx + dy * dy)
  }

  trackInfo.value = {
    points: trackPoints.value.length,
    strokes,
    duration,
    avgSpeed: duration > 0 ? totalDistance / duration : 0
  }
}

// 触摸事件处理
const onTouchStart = (event: TouchEvent) => startDrawing(event)
const onTouchMove = (event: TouchEvent) => drawing(event)
const onTouchEnd = (event: TouchEvent) => endDrawing(event)

// 鼠标事件处理
const onMouseDown = (event: MouseEvent) => startDrawing(event)
const onMouseMove = (event: MouseEvent) => drawing(event)
const onMouseUp = (event: MouseEvent) => endDrawing(event)

// 清除签名
const clearSignature = async () => {
  const result = await showConfirmDialog({
    title: '确认清除',
    message: '确定要清除当前签名吗？'
  })

  if (result === 'confirm' && ctx.value && canvasRef.value) {
    ctx.value.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
    ctx.value.fillStyle = '#FFFFFF'
    ctx.value.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height)
    
    hasSignature.value = false
    trackPoints.value = []
    trackInfo.value = {
      points: 0,
      strokes: 0,
      duration: 0,
      avgSpeed: 0
    }
  }
}

// 预览签名
const previewSignature = () => {
  if (!canvasRef.value) return

  previewImage.value = canvasRef.value.toDataURL('image/png')
  showPreview.value = true
}

// 选择颜色
const selectColor = (color: string) => {
  strokeColor.value = color
  showColorPicker.value = false
}

// 保存签名
const onSave = async () => {
  if (!hasSignature.value) {
    showToast('请先进行签名')
    return
  }

  if (!canvasRef.value) return

  try {
    const imageData = canvasRef.value.toDataURL('image/png')
    
    // 这里可以调用API保存签名数据
    const signatureData = {
      image: imageData,
      trackData: trackPoints.value,
      trackInfo: trackInfo.value,
      timestamp: Date.now()
    }

    console.log('签名数据:', signatureData)
    
    showToast('签名保存成功')
    
    // 可以传递签名数据给父组件或路由参数
    router.back()
  } catch (error) {
    console.error('保存签名失败:', error)
    showToast('保存失败，请重试')
  }
}

// 返回
const onBack = async () => {
  if (hasSignature.value) {
    const result = await showConfirmDialog({
      title: '确认离开',
      message: '当前签名尚未保存，确定要离开吗？'
    })
    
    if (result === 'confirm') {
      router.back()
    }
  } else {
    router.back()
  }
}

// 窗口尺寸变化处理
const handleResize = () => {
  initCanvas()
}

onMounted(() => {
  initCanvas()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.signature-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
}

.canvas-wrapper {
  flex: 1;
  position: relative;
  margin: 16px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.signature-canvas {
  display: block;
  width: 100%;
  height: 100%;
  cursor: crosshair;
  touch-action: none;
}

.empty-hint {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #999;
  font-size: 16px;
  pointer-events: none;
}

.action-buttons {
  display: flex;
  gap: 12px;
  padding: 16px;
}

.action-btn {
  flex: 1;
  height: 44px;
}

.settings-group {
  margin: 0 16px 16px;
}

.stroke-slider {
  width: 100px;
}

.color-preview {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #ddd;
}

.track-info {
  margin: 0 16px 16px;
}

.color-picker {
  padding: 20px;
}

.color-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
  text-align: center;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.color-item {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.color-item.active {
  border-color: #1989fa;
  transform: scale(1.1);
}

.preview-container {
  padding: 20px;
  text-align: center;
}

.preview-container img {
  max-width: 100%;
  max-height: 300px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>