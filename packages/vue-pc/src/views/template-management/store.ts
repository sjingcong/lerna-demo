import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { getTemplateList } from './api'
import type { TemplateQueryParams, TemplateItem } from './types'


// 模板管理 Store
export const useTemplateManagementStore = defineStore('templateManagement', () => {
    // 模板列表数据
    const templateList = ref<TemplateItem[]>([])
    
    // 查询参数
    const queryParams = reactive<TemplateQueryParams>({
        templateTag: '',
        templateName: '',
        creater: '',
        createTimeRange: null,
        pageNum: 1,
        pageSize: 12
    })

    // 加载状态
    const loading = ref(false)
    const total = ref(0)


    // 方法：重置查询参数和搜索表单
    const resetQueryParams = () => {
        
        // 重置查询参数
        queryParams.templateTag = ''
        queryParams.templateName = ''
        queryParams.creater = ''
        queryParams.createTimeRange = null
        queryParams.pageNum = 1
        queryParams.pageSize = 12
    }

    // 方法：设置分页参数
    const setPagination = (pageNum: number, pageSize: number) => {
        queryParams.pageNum = pageNum
        queryParams.pageSize = pageSize
    }
    // 方法：重置分页参数
    const resetPagination = () => {
        queryParams.pageNum = 1
        queryParams.pageSize = 12
    }


    // 方法：获取模板列表
    const fetchTemplateList = async (params?: Partial<TemplateQueryParams>) => {
        try {
            loading.value = true
            
            // 使用传入的参数或当前store中的查询参数
            const requestParams = { ...queryParams, ...params }
            
            const response = await getTemplateList(requestParams)
            
            // 更新数据和分页信息
            templateList.value = response.list
            total.value = response.total
            
            // 同步分页参数
            queryParams.pageNum = response.pageNum
            queryParams.pageSize = response.pageSize
        } catch (err) {
            console.error('获取模板列表失败:', err)
            templateList.value = []
            total.value = 0
        } finally {
            loading.value = false
        }
    }



    return {
        // 状态
        templateList,
        queryParams,
        loading,
        total,

        // 方法
        resetQueryParams,
        setPagination,
        resetPagination,
        fetchTemplateList,
    }
}, {
    // 持久化配置
    persist: {
        key: 'template-management-store',
        storage: localStorage,
        // 持久化搜索表单和查询参数，不持久化列表数据和加载状态
        paths: ['searchForm', 'queryParams']
    }
})