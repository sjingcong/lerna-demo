import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Plan {
  id: string
  name: string
}

export interface ProtectionOption {
  label: string
  value: string
}

export interface ProtectionCategory {
  title: string
  options: ProtectionOption[]
  required?: boolean
  maxPerRow?: number
}

export const useProtectionStore = defineStore('protection', () => {
  // 已有方案列表
  const existingPlans = ref<Plan[]>([
    { id: '1', name: '销售方案计划1' },
    { id: '2', name: '销售方案计划2' },
    { id: '3', name: '销售方案计划3' },
    { id: '4', name: '销售方案计划4' }
  ])

  // 当前选中的方案ID列表
  const selectedPlanIds = ref<string[]>([])

  // 保障选择数据
  const protectionCategories = ref<ProtectionCategory[]>([
    {
      title: '医疗保障（必选）',
      required: true,
      maxPerRow: 2,
      options: [
        { label: '免赔2万', value: '1' },
        { label: '免赔1万', value: '2' }
      ]
    },
    {
      title: '意外保障（可选）',
      required: false,
      maxPerRow: 4,
      options: [
        { label: '30万', value: '3' },
        { label: '50万', value: '4' },
        { label: '100万', value: '5' },
        { label: '200万', value: '6' },
        { label: '300万', value: '16' },
        { label: '500万', value: '17' },
        { label: '800万', value: '18' },
        { label: '1000万', value: '19' }
      ]
    },
    {
      title: '疾病身故保障（可选）',
      required: false,
      maxPerRow: 4,
      options: [
        { label: '10万', value: '7' },
        { label: '20万', value: '8' },
        { label: '30万', value: '9' }
      ]
    },
    {
      title: '重大疾病保障（可选）',
      required: false,
      maxPerRow: 4,
      options: [
        { label: '10万', value: '10' },
        { label: '20万', value: '11' },
        { label: '30万', value: '12' },
        { label: '50万', value: '20' },
        { label: '80万', value: '21' },
        { label: '100万', value: '22' }
      ]
    },
    {
      title: '一般门诊保障（可选）',
      required: false,
      maxPerRow: 4,
      options: [
        { label: '10万', value: '13' },
        { label: '20万', value: '14' },
        { label: '30万', value: '15' }
      ]
    }
  ])

  // 当前选中的保障选项（支持多选）
  const selectedProtectionOptions = ref<{[categoryIndex: number]: string[]}>({})

  // 选择/取消选择方案
  const togglePlan = (planId: string) => {
    const index = selectedPlanIds.value.indexOf(planId)
    if (index > -1) {
      // 如果已选中，则取消选择
      selectedPlanIds.value.splice(index, 1)
    } else {
      // 如果未选中，则添加到选中列表
      selectedPlanIds.value.push(planId)
    }
  }

  // 清空所有选择
  const clearSelection = () => {
    selectedPlanIds.value = []
  }

  // 判断方案是否被选中
  const isPlanSelected = (planId: string) => {
    return selectedPlanIds.value.includes(planId)
  }

  // 获取当前选中的方案列表
  const getSelectedPlans = () => {
    return existingPlans.value.filter(plan => selectedPlanIds.value.includes(plan.id))
  }

  // 获取选中方案的数量
  const getSelectedCount = () => {
    return selectedPlanIds.value.length
  }

  // 选择/取消选择保障选项（支持多选）
  const toggleProtectionOption = (categoryIndex: number, optionValue: string) => {
    if (!selectedProtectionOptions.value[categoryIndex]) {
      selectedProtectionOptions.value[categoryIndex] = []
    }
    
    const options = selectedProtectionOptions.value[categoryIndex]
    const index = options.indexOf(optionValue)
    
    if (index > -1) {
      // 如果已选中，则取消选择
      options.splice(index, 1)
    } else {
      // 如果未选中，则添加到选中列表
      options.push(optionValue)
    }
  }

  // 获取选中的保障选项
  const getSelectedProtectionOptions = (categoryIndex: number) => {
    return selectedProtectionOptions.value[categoryIndex] || []
  }

  // 判断保障选项是否被选中
  const isProtectionOptionSelected = (categoryIndex: number, optionValue: string) => {
    const options = selectedProtectionOptions.value[categoryIndex] || []
    return options.includes(optionValue)
  }

  // 清空保障选择
  const clearProtectionSelection = () => {
    selectedProtectionOptions.value = {}
  }

  // 获取已有方案数据（模拟API调用）
  const fetchExistingPlans = async () => {
    try {
      // TODO: 调用后端接口获取已有方案
      // const response = await api.getExistingPlans()
      // existingPlans.value = response.data
      console.log('获取已有方案数据')
    } catch (error) {
      console.error('获取已有方案失败:', error)
    }
  }

  return {
    // 状态
    existingPlans,
    selectedPlanIds,
    protectionCategories,
    selectedProtectionOptions,
    
    // 方法
    togglePlan,
    clearSelection,
    isPlanSelected,
    getSelectedPlans,
    getSelectedCount,
    fetchExistingPlans,
    toggleProtectionOption,
    getSelectedProtectionOptions,
    isProtectionOptionSelected,
    clearProtectionSelection
  }
})