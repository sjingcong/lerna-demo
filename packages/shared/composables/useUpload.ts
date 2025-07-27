import { ref, type Ref } from 'vue'

export interface UploadOptions {
  httpInstance: any // HTTP实例，如axios实例
  file: File // 要上传的文件
  uploadApi: string // 上传接口地址
}

export interface UploadResult {
  isUploading: Ref<boolean>
  progress: Ref<number>
  error: Ref<string | null>
  result: Ref<any>
  upload: () => Promise<any>
}

/**
 * 文件上传组合式函数
 * @param options 上传配置选项
 * @returns 上传相关的响应式数据和方法
 */
export function useUpload(options: UploadOptions): UploadResult {
  const { httpInstance, file, uploadApi } = options

  // 响应式状态
  const isUploading = ref(false)
  const progress = ref(0)
  const error = ref<string | null>(null)
  const result = ref<any>(null)

  /**
   * 执行文件上传
   */
  const upload = async (): Promise<any> => {
    try {
      // 重置状态
      isUploading.value = true
      progress.value = 0
      error.value = null
      result.value = null

      // 创建FormData
      const formData = new FormData()
      formData.append('file', file)

      // 发起上传请求
      const response = await httpInstance.post(uploadApi, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent: any) => {
          if (progressEvent.total) {
            progress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          }
        }
      })

      // 上传成功
      result.value = response.data
      progress.value = 100
      return response.data

    } catch (err: any) {
      // 上传失败
      error.value = err.message || '上传失败'
      throw err
    } finally {
      isUploading.value = false
    }
  }

  return {
    isUploading,
    progress,
    error,
    result,
    upload
  }
}

export default useUpload