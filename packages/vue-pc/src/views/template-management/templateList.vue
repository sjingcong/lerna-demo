<template>
    <div class="template-list-container">
        <!-- 搜索表单 -->
        <div class="search-form">
            <a-form :model="templateStore.queryParams" layout="inline">
                <a-form-item label="模板名称">
                    <a-input v-model:value="templateStore.queryParams.templateName" placeholder="请输入模板名称" allow-clear
                        @pressEnter="handleSearch" />
                </a-form-item>
                <a-form-item label="模板标签">
                    <a-input v-model:value="templateStore.queryParams.templateTag" placeholder="请输入模板标签" allow-clear
                        @pressEnter="handleSearch" />
                </a-form-item>
                <a-form-item label="创建人">
                    <a-input v-model:value="templateStore.queryParams.creater" placeholder="请输入创建人" allow-clear
                        @pressEnter="handleSearch" />
                </a-form-item>
                <a-form-item label="创建时间">
                    <a-range-picker v-model:value="templateStore.queryParams.createTimeRange" 
                        :placeholder="['选择开始时间', '选择结束时间']"
                        format="YYYY-MM-DD" value-format="YYYY-MM-DD" @change="handleSearch" />
                </a-form-item>
                <a-form-item>
                    <a-button type="primary" @click="handleSearch">
                        <SearchOutlined />
                        搜索
                    </a-button>
                    <a-button @click="handleReset" style="margin-left: 8px;">
                        <ReloadOutlined />
                        重置
                    </a-button>
                </a-form-item>
            </a-form>
        </div>

        <!-- 模板卡片展示区域 -->
        <div class="template-cards-container">
            <!-- 加载状态 -->
            <div v-if="templateStore.loading" class="loading-container">
                <a-spin size="large" />
                <p>加载中...</p>
            </div>

            <!-- 空状态 -->
            <div v-else-if="!templateStore.templateList.length" class="empty-container">
                <a-empty description="暂无模板数据">

                </a-empty>
            </div>

            <!-- 模板卡片列表 -->
            <div v-else class="template-cards-grid" :style="gridStyle">
                <TemplateCard v-for="template in templateStore.templateList" :key="template.id" :template="template"
                    @edit="handleEdit" @view="handleView" @delete="handleDelete" />
            </div>

            <!-- 分页组件 -->
            <div v-if="!templateStore.loading && templateStore.templateList.length" class="pagination-container">
                <a-pagination v-model:current="templateStore.queryParams.pageNum"
                    v-model:page-size="templateStore.queryParams.pageSize" :total="templateStore.total"
                    :show-size-changer="true" :show-quick-jumper="true"
                    :show-total="(total, range) => `共 ${total} 条记录，第 ${range[0]}-${range[1]} 条`"
                    :page-size-options="['12', '24', '36', '48']" @change="handlePageChange"
                    @show-size-change="handlePageSizeChange" />
            </div>
        </div>

        <!-- 删除确认弹框 -->
        <a-modal v-model:open="deleteDialogVisible" title="删除确认" width="400px" @cancel="handleDeleteCancel">
            <p>确定要删除模板 "{{ currentTemplate?.templateName }}" 吗？</p>
            <p class="warning-text">此操作不可撤销，请谨慎操作！</p>
            <template #footer>
                <a-button @click="handleDeleteCancel">取消</a-button>
                <a-button type="primary" danger @click="handleDeleteConfirm" :loading="deleteLoading">
                    确定删除
                </a-button>
            </template>
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { useTemplateManagementStore } from './store'
import TemplateCard from './components/TemplateCard.vue'
import { deleteTemplate } from './api'

// 类型定义
interface Template {
    id: string
    templateName: string
    version: string
    creater: string
    createTime: string
    tags?: string[]
}

// Store
const templateStore = useTemplateManagementStore()

// 响应式数据

const cardsPerRow = ref<number>(4)
const deleteDialogVisible = ref<boolean>(false)
const deleteLoading = ref<boolean>(false)
const currentTemplate = ref<Template | null>(null)

// 分页相关数据直接使用store中的queryParams

// 计算属性
const gridStyle = computed(() => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${cardsPerRow.value}, 1fr)`,
    gap: '16px'
}))


// 搜索方法
const handleSearch = async () => {
    try {
        // 设置搜索参数并重置分页（从searchForm同步到queryParams）
        templateStore.resetPagination()
        // 获取数据
        await templateStore.fetchTemplateList()
    } catch (error) {
    }
}

// 重置方法
const handleReset = async () => {
    // 重置搜索表单和查询参数
    templateStore.resetQueryParams()
    // 获取数据
    await templateStore.fetchTemplateList()
}

// 分页变化
const handlePageChange = async (page: number) => {
    templateStore.setPagination(page, templateStore.queryParams.pageSize)
    await templateStore.fetchTemplateList()
}

// 每页条数变化
const handlePageSizeChange = async (current: number, size: number) => {
    templateStore.setPagination(1, size)
    await templateStore.fetchTemplateList()
}

const handleEdit = (template: Template) => {
    // TODO: 实现编辑功能
    message.info(`编辑模板: ${template.templateName}`)
}

const handleView = (template: Template) => {
    // TODO: 实现查看功能
    message.info(`查看模板: ${template.templateName}`)
}

const handleDelete = (template: Template) => {
    currentTemplate.value = template
    deleteDialogVisible.value = true
}

const handleDeleteCancel = () => {
    deleteDialogVisible.value = false
    currentTemplate.value = null
}

const handleDeleteConfirm = async () => {
    if (!currentTemplate.value) return

    deleteLoading.value = true
    try {
        // 模拟API调用
        await deleteTemplate(currentTemplate.value.id)
        message.success('删除成功')
    } catch (error) {

    } finally {
        deleteDialogVisible.value = false
        deleteLoading.value = false
    }
}

// 生命周期
onMounted(async () => {
    try {
        // 获取初始数据
        await templateStore.fetchTemplateList()
    } catch (error) {
        message.error('页面初始化失败，请刷新页面重试')
        console.error('onMounted error:', error)
    }
})
</script>

<style scoped>
.template-list-container {
    padding: 20px;
    background-color: #f5f5f5;
    min-height: 100vh;
}

.search-form {
    background: white;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cards-per-row-config {
    background: white;
    padding: 16px 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 12px;
}

.cards-per-row-config span {
    font-weight: 500;
    color: #333;
}

.template-cards-container {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 0;
    color: #666;
}

.loading-container p {
    margin-top: 16px;
    font-size: 14px;
}

.error-container,
.empty-container {
    padding: 40px 0;
}

.template-cards-grid {
    width: 100%;
}

.pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 24px;
    padding: 16px 0;
}

.warning-text {
    color: #f56c6c;
    font-size: 14px;
    margin-top: 8px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
    .template-cards-grid {
        grid-template-columns: repeat(3, 1fr) !important;
    }
}

@media (max-width: 768px) {
    .template-cards-grid {
        grid-template-columns: repeat(2, 1fr) !important;
    }

    .search-form :deep(.ant-form) {
        flex-direction: column;
    }

    .search-form :deep(.ant-form-item) {
        margin-right: 0;
        margin-bottom: 16px;
    }
}

@media (max-width: 480px) {
    .template-cards-grid {
        grid-template-columns: 1fr !important;
    }

    .template-list-container {
        padding: 12px;
    }

    .search-form,
    .cards-per-row-config,
    .template-cards-container {
        padding: 16px;
    }
}
</style>