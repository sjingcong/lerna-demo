/**
 * 图片预加载专用 Hook
 * 极简版本 - 自动触发加载，无返回值
 */

export interface ImagePreloadOptions {
    priority?: 'high' | 'low'
    delay?: number // 延迟加载时间（毫秒）
    onLoad?: () => void // 加载成功回调
    onError?: (error: Error) => void // 加载失败回调
}

export function useImagePreload(
    baseUrl: string,
    options: ImagePreloadOptions = {}
): void {
    const {
        priority = 'low',
        delay = 0,
        onLoad,
        onError
    } = options

    let timeoutId: number | null = null

    // 预加载图片
    const preloadImage = (): void => {
        const img = new Image()

        img.onload = () => {
            onLoad?.()
        }

        img.onerror = () => {
            const err = new Error(`Failed to load image: ${baseUrl}`)
            onError?.(err)
        }

        // 设置优先级
        if ('fetchPriority' in img) {
            (img as any).fetchPriority = priority
        }

        img.src = baseUrl
    }

    // 延迟加载
    const loadWithDelay = (): void => {
        if (delay > 0) {
            timeoutId = window.setTimeout(preloadImage, delay)
        } else {
            preloadImage()
        }
    }

    // 立即加载模式
    loadWithDelay()

}