import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 轨迹点接口
export interface TrackPoint {
  x: number
  y: number
  timestamp: number
  pressure?: number
  strokeId?: string
}

// 笔画接口
export interface Stroke {
  id: string
  points: TrackPoint[]
  color: string
  width: number
  startTime: number
  endTime: number
}

// 签名数据接口
export interface SignatureData {
  id: string
  image: string
  strokes: Stroke[]
  trackInfo: TrackInfo
  timestamp: number
  metadata?: Record<string, any>
}

// 轨迹信息接口
export interface TrackInfo {
  points: number
  strokes: number
  duration: number
  avgSpeed: number
  totalDistance: number
  complexity: number // 复杂度评分
}

// 签名配置接口
export interface SignatureConfig {
  strokeWidth: number
  strokeColor: string
  backgroundColor: string
  smoothing: boolean
  pressureSensitive: boolean
  minDistance: number // 最小记录距离
  maxTrackPoints: number // 最大轨迹点数
}

export const useSignatureStore = defineStore('signature', () => {
  // 当前签名数据
  const currentSignature = ref<SignatureData | null>(null)
  
  // 历史签名列表
  const signatureHistory = ref<SignatureData[]>([])
  
  // 当前配置
  const config = ref<SignatureConfig>({
    strokeWidth: 3,
    strokeColor: '#000000',
    backgroundColor: '#FFFFFF',
    smoothing: true,
    pressureSensitive: false,
    minDistance: 2,
    maxTrackPoints: 10000
  })

  // 临时轨迹数据（用于实时记录）
  const tempTrackPoints = ref<TrackPoint[]>([])
  const tempStrokes = ref<Stroke[]>([])

  // 计算属性
  const hasSignature = computed(() => {
    return currentSignature.value !== null || tempStrokes.value.length > 0
  })

  const trackInfo = computed((): TrackInfo => {
    if (!hasSignature.value) {
      return {
        points: 0,
        strokes: 0,
        duration: 0,
        avgSpeed: 0,
        totalDistance: 0,
        complexity: 0
      }
    }

    const points = tempTrackPoints.value
    if (points.length === 0) {
      return {
        points: 0,
        strokes: tempStrokes.value.length,
        duration: 0,
        avgSpeed: 0,
        totalDistance: 0,
        complexity: 0
      }
    }

    return calculateTrackInfo(points, tempStrokes.value)
  })

  // 开始新的签名
  const startNewSignature = () => {
    currentSignature.value = null
    tempTrackPoints.value = []
    tempStrokes.value = []
  }

  // 添加轨迹点
  const addTrackPoint = (point: TrackPoint) => {
    // 检查最小距离
    if (tempTrackPoints.value.length > 0) {
      const lastPoint = tempTrackPoints.value[tempTrackPoints.value.length - 1]
      const distance = Math.sqrt(
        Math.pow(point.x - lastPoint.x, 2) + Math.pow(point.y - lastPoint.y, 2)
      )
      
      if (distance < config.value.minDistance) {
        return
      }
    }

    // 检查最大点数限制
    if (tempTrackPoints.value.length >= config.value.maxTrackPoints) {
      console.warn('已达到最大轨迹点数限制')
      return
    }

    tempTrackPoints.value.push(point)
  }

  // 开始新笔画
  const startStroke = (strokeId: string) => {
    const stroke: Stroke = {
      id: strokeId,
      points: [],
      color: config.value.strokeColor,
      width: config.value.strokeWidth,
      startTime: Date.now(),
      endTime: 0
    }
    
    tempStrokes.value.push(stroke)
  }

  // 结束当前笔画
  const endStroke = (strokeId: string) => {
    const stroke = tempStrokes.value.find(s => s.id === strokeId)
    if (stroke) {
      stroke.endTime = Date.now()
    }
  }

  // 添加点到当前笔画
  const addPointToStroke = (strokeId: string, point: TrackPoint) => {
    const stroke = tempStrokes.value.find(s => s.id === strokeId)
    if (stroke) {
      stroke.points.push({ ...point, strokeId })
    }
    addTrackPoint({ ...point, strokeId })
  }

  // 保存签名
  const saveSignature = (image: string, metadata?: Record<string, any>): SignatureData => {
    const signatureData: SignatureData = {
      id: generateId(),
      image,
      strokes: [...tempStrokes.value],
      trackInfo: trackInfo.value,
      timestamp: Date.now(),
      metadata
    }

    currentSignature.value = signatureData
    signatureHistory.value.unshift(signatureData)

    // 限制历史记录数量
    if (signatureHistory.value.length > 50) {
      signatureHistory.value = signatureHistory.value.slice(0, 50)
    }

    return signatureData
  }

  // 清除当前签名
  const clearSignature = () => {
    currentSignature.value = null
    tempTrackPoints.value = []
    tempStrokes.value = []
  }

  // 删除历史签名
  const deleteSignature = (id: string) => {
    const index = signatureHistory.value.findIndex(s => s.id === id)
    if (index > -1) {
      signatureHistory.value.splice(index, 1)
    }
  }

  // 更新配置
  const updateConfig = (newConfig: Partial<SignatureConfig>) => {
    config.value = { ...config.value, ...newConfig }
  }

  // 导出签名数据
  const exportSignature = (id: string): SignatureData | null => {
    return signatureHistory.value.find(s => s.id === id) || null
  }

  // 导入签名数据
  const importSignature = (data: SignatureData) => {
    signatureHistory.value.unshift(data)
  }

  // 获取签名统计
  const getStatistics = () => {
    const total = signatureHistory.value.length
    const avgDuration = signatureHistory.value.reduce((sum, s) => sum + s.trackInfo.duration, 0) / total || 0
    const avgComplexity = signatureHistory.value.reduce((sum, s) => sum + s.trackInfo.complexity, 0) / total || 0
    const avgStrokes = signatureHistory.value.reduce((sum, s) => sum + s.trackInfo.strokes, 0) / total || 0

    return {
      total,
      avgDuration,
      avgComplexity,
      avgStrokes
    }
  }

  return {
    // 状态
    currentSignature,
    signatureHistory,
    config,
    tempTrackPoints,
    tempStrokes,
    
    // 计算属性
    hasSignature,
    trackInfo,
    
    // 方法
    startNewSignature,
    addTrackPoint,
    startStroke,
    endStroke,
    addPointToStroke,
    saveSignature,
    clearSignature,
    deleteSignature,
    updateConfig,
    exportSignature,
    importSignature,
    getStatistics
  }
})

// 工具函数

// 生成唯一ID
const generateId = (): string => {
  return `sig_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// 计算轨迹信息
const calculateTrackInfo = (points: TrackPoint[], strokes: Stroke[]): TrackInfo => {
  if (points.length === 0) {
    return {
      points: 0,
      strokes: 0,
      duration: 0,
      avgSpeed: 0,
      totalDistance: 0,
      complexity: 0
    }
  }

  const startTime = points[0].timestamp
  const endTime = points[points.length - 1].timestamp
  const duration = endTime - startTime

  // 计算总距离
  let totalDistance = 0
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const dx = curr.x - prev.x
    const dy = curr.y - prev.y
    totalDistance += Math.sqrt(dx * dx + dy * dy)
  }

  // 计算平均速度
  const avgSpeed = duration > 0 ? totalDistance / duration : 0

  // 计算复杂度（基于方向变化和速度变化）
  let complexity = 0
  if (points.length > 2) {
    let directionChanges = 0
    let speedChanges = 0
    
    for (let i = 2; i < points.length; i++) {
      const p1 = points[i - 2]
      const p2 = points[i - 1]
      const p3 = points[i]
      
      // 计算方向变化
      const angle1 = Math.atan2(p2.y - p1.y, p2.x - p1.x)
      const angle2 = Math.atan2(p3.y - p2.y, p3.x - p2.x)
      const angleDiff = Math.abs(angle1 - angle2)
      
      if (angleDiff > Math.PI / 6) { // 大于30度认为方向变化
        directionChanges++
      }
      
      // 计算速度变化
      const speed1 = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)) / (p2.timestamp - p1.timestamp || 1)
      const speed2 = Math.sqrt(Math.pow(p3.x - p2.x, 2) + Math.pow(p3.y - p2.y, 2)) / (p3.timestamp - p2.timestamp || 1)
      
      if (Math.abs(speed1 - speed2) / Math.max(speed1, speed2, 0.1) > 0.5) { // 速度变化超过50%
        speedChanges++
      }
    }
    
    complexity = (directionChanges + speedChanges) / points.length * 100
  }

  return {
    points: points.length,
    strokes: strokes.length,
    duration,
    avgSpeed,
    totalDistance,
    complexity: Math.round(complexity * 100) / 100
  }
}

// 数据持久化函数
export const saveSignatureToStorage = (signature: SignatureData) => {
  try {
    const stored = localStorage.getItem('signature_history')
    const history: SignatureData[] = stored ? JSON.parse(stored) : []
    history.unshift(signature)
    
    // 限制存储数量
    if (history.length > 20) {
      history.splice(20)
    }
    
    localStorage.setItem('signature_history', JSON.stringify(history))
  } catch (error) {
    console.error('保存签名到本地存储失败:', error)
  }
}

export const loadSignatureFromStorage = (): SignatureData[] => {
  try {
    const stored = localStorage.getItem('signature_history')
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('从本地存储加载签名失败:', error)
    return []
  }
}