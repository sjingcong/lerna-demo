import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getSalesChannelList } from '@/views/user-management/api'

// 渠道归属选项接口
export interface SalesChannelOption {
  label: string
  value: string
}

// 状态选项接口
export interface EnabledOption {
  label: string
  value: 0 | 1
}

// 接口返回的渠道数据接口
interface SalesChannelApiItem {
  code: string
  desc: string
}

// 用户管理 Store
export const useUserManagementStore = defineStore('userManagement', () => {
  // 渠道归属选项
  const salesChannelOptions = ref<SalesChannelOption[]>([])

  // 状态选项
  const enabledOptions = ref<EnabledOption[]>([
    { label: '已生效', value: 1 },
    { label: '已失效', value: 0 }
  ])

  // 计算属性：获取渠道归属标签
  const getSalesChannelLabel = computed(() => {
    return (value: string) => {
      const option = salesChannelOptions.value.find(opt => opt.value === value)
      return option ? option.label : value
    }
  })

  // 计算属性：获取状态标签
  const getEnabledLabel = computed(() => {
    return (value: 0 | 1) => {
      const option = enabledOptions.value.find(opt => opt.value === value)
      return option?.label
    }
  })

  // 计算属性：获取状态颜色
  const getStatusColor = computed(() => {
    return (enabled: 0 | 1) => {
      return enabled === 1 ? 'green' : 'red'
    }
  })

  // 方法：设置渠道归属选项
  const setSalesChannelOptions = (options: SalesChannelOption[]) => {
    salesChannelOptions.value = options
  }

  // 方法：初始化渠道归属选项
  const initSalesChannelOptions = async () => {
    try {
      const response = await getSalesChannelList({})
      if (response && Array.isArray(response)) {
        const options: SalesChannelOption[] = response.map((item: SalesChannelApiItem) => ({
          label: item.desc,
          value: item.code
        }))
        setSalesChannelOptions(options)
      }
    } catch (error) {
      console.error('获取渠道归属选项失败:', error)
      setSalesChannelOptions([])
    }
  }

  return {
    // 状态
    salesChannelOptions,
    enabledOptions,
    
    // 计算属性
    getSalesChannelLabel,
    getEnabledLabel,
    getStatusColor,
    
    // 方法
    setSalesChannelOptions,
    initSalesChannelOptions,
  }
}, {
  // 持久化配置
  persist: {
    key: 'user-management-store',
    storage: localStorage,
  }
})