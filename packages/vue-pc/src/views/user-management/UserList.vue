<template>
  <div class="user-management">
    <!-- 页面标题 -->
    <div class="page-header">
      <a-breadcrumb>
        <a-breadcrumb-item>基础信息管理</a-breadcrumb-item>
        <a-breadcrumb-item>用户管理</a-breadcrumb-item>
      </a-breadcrumb>
      <h1 class="page-title">用户列表</h1>
    </div>

    <!-- 搜索表单 -->
    <div class="search-form">
      <a-form layout="inline" :model="searchForm" @finish="handleSearch">
        <a-form-item label="UM账号">
          <a-input 
            v-model:value="searchForm.managerUm" 
            placeholder="请输入"
            style="width: 200px"
            allow-clear
          />
        </a-form-item>
        <a-form-item label="姓名">
          <a-input 
            v-model:value="searchForm.managerName" 
            placeholder="请输入"
            style="width: 200px"
            allow-clear
          />
        </a-form-item>
        <a-form-item label="渠道归属">
          <a-select 
            v-model:value="searchForm.salesChannel" 
            placeholder="请选择"
            style="width: 200px"
            showArrow
            allow-clear
            mode="multiple"
            :options="salesChannelOptions"
          />
        </a-form-item>
        <a-form-item label="状态">
          <a-select 
            v-model:value="searchForm.enabled" 
            placeholder="请选择"
            style="width: 200px"
            allow-clear
            :options="enabledOptions"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" :loading="loading">
            查询
          </a-button>
          <a-button style="margin-left: 8px" @click="resetSearch">
            重置
          </a-button>
        </a-form-item>
      </a-form>
    </div>

    <!-- 操作按钮 -->
    <div class="action-bar">
      <div class="action-buttons">
        <a-button type="primary" @click="handleAdd">
          <template #icon>
            <plus-outlined />
          </template>
          新增
        </a-button>
        <a-button @click="handleImport">
          <template #icon>
            <import-outlined />
          </template>
          导入
        </a-button>
        <a-button @click="handleExport">
          <template #icon>
            <export-outlined />
          </template>
          导出
        </a-button>
      </div>
      <div class="table-info">
        <span v-if="selectedRowKeys.length > 0" class="selected-info">
          已选择 {{ selectedRowKeys.length }} 项
        </span>
        <span class="total-info">
          共 {{ pagination.total }} 条记录
        </span>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="table-container">
      <a-table
        :columns="columns"
        :data-source="tableData"
        :pagination="pagination"
        :loading="loading"
        row-key="managerUm"
        @change="handleTableChange"
      >
        <!-- 渠道归属列自定义渲染 -->
        <template #salesChannel="{ record }">
          <a-space wrap>
            <a-tag v-for="channel in record.salesChannel" :key="channel" color="blue">
              {{ getSalesChannelLabel(channel) }}
            </a-tag>
          </a-space>
        </template>

        <!-- 状态列自定义渲染 -->
        <template #status="{ record }">
          <a-tag :color="getStatusColor(record.enabled)">
            <template #icon>
              <component :is="getStatusIcon(record.enabled)" />
            </template>
            {{ getEnabledLabel(record.enabled) }}
          </a-tag>
        </template>

        <!-- 操作列 -->
        <template #action="{ record }">
          <a-space>
            <a-button 
              type="link" 
              size="small" 
              @click="handleStatusChange(record)"
            >
              {{ record.enabled === 1 ? '失效' : '生效' }}
            </a-button>
            <a-button type="link" size="small" @click="handleEdit(record)">
              编辑
            </a-button>
          </a-space>
        </template>
      </a-table>
    </div>

    <!-- 用户表单弹窗 -->
    <UserForm
      v-model:visible="formVisible"
      :user="currentUser"
      @success="handleFormSuccess"
    />

    <!-- 导入用户弹窗 -->
    <ImportUser
      v-model:visible="importVisible"
      @success="handleImportSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { 
  PlusOutlined, 
  ImportOutlined,
  DeleteOutlined,
  ExportOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue'
import type { User, UserRequest, UserSearchForm } from './types'
import { getUserList, saveUser } from './api'
import UserForm from './components/UserForm.vue'
import ImportUser from './components/ImportUser.vue'
import { useUserManagementStore } from '@/store/userManagement'

// 使用用户管理 store
const userManagementStore = useUserManagementStore()

// 接口类型定义已移至 types.ts 文件

// 响应式数据
const loading = ref(false)
const tableData = ref<User[]>([])
const selectedRowKeys = ref<string[]>([])
const formVisible = ref(false)
const importVisible = ref(false)
const currentUser = ref<User | null>(null)
// 搜索表单数据
const searchForm = reactive<UserSearchForm>({
  managerUm: '',
  managerName: '',
  salesChannel: [],
  enabled: 0
})

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条记录`
})

// 从 store 获取选项数据
const salesChannelOptions = computed(() => userManagementStore.salesChannelOptions)
const enabledOptions = computed(() => userManagementStore.enabledOptions)

// 表格列配置
const columns = [
  {
    title: 'UM账号',
    dataIndex: 'managerUm',
    key: 'managerUm',
    width: 120
  },
  {
    title: '姓名',
    dataIndex: 'managerName',
    key: 'managerName',
    width: 100
  },
  {
    title: '手机号',
    dataIndex: 'phoneNumber',
    key: 'phoneNumber',
    width: 130
  },
  {
    title: '渠道归属',
    dataIndex: 'salesChannel',
    key: 'salesChannel',
    width: 150,
    slots: { customRender: 'salesChannel' }
  },
  {
    title: '状态',
    dataIndex: 'enabled',
    key: 'enabled',
    width: 100,
    slots: { customRender: 'status' }
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    slots: { customRender: 'action' }
  }
]



// 从 store 获取方法
const getSalesChannelLabel = computed(() => userManagementStore.getSalesChannelLabel)
const getStatusColor = computed(() => userManagementStore.getStatusColor)
const getEnabledLabel = computed(() => userManagementStore.getEnabledLabel)

// 获取状态图标
const getStatusIcon = (enabled: number) => {
  return enabled === 1 ? CheckCircleOutlined : CloseCircleOutlined;
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const params = {
      ...searchForm,
      current: pagination.current,
      pageSize: pagination.pageSize
    }
    const response = await getUserList(params)
    tableData.value = response.rows
    pagination.total = response.total
  } catch (error) {
    message.error('网络错误，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 搜索处理
const handleSearch = () => {
  pagination.current = 1
  selectedRowKeys.value = []
  loadData()
}

// 重置搜索
const resetSearch = () => {
  Object.assign(searchForm, {
    managerUm: '',
    managerName: '',
    salesChannel: [],
    enabled: 0
  })
  pagination.current = 1
  selectedRowKeys.value = []
  loadData()
}

// 表格变化处理
const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  loadData()
}

// 新增用户
const handleAdd = () => {
  currentUser.value = null
  formVisible.value = true
}

// 编辑用户
const handleEdit = (record: User) => {
  currentUser.value = { ...record }
  formVisible.value = true
}

// 表单成功回调
const handleFormSuccess = () => {
  formVisible.value = false
  currentUser.value = null
  loadData()
  message.success('操作成功')
}

// 状态变更
const handleStatusChange = async (record: User) => {
  const newEnabled = record.enabled === 1 ? 0 : 1;
  try {
    const updateData: UserRequest = {
      managerUm: record.managerUm,
      managerName: record.managerName,
      phoneNumber: record.phoneNumber,
      salesChannel: record.salesChannel,
      enabled: newEnabled
    };
    await saveUser(updateData);
    message.success('状态更新成功');
    loadData();
  } catch (error) {
    message.error('状态更新失败');
  }
}

// 导入用户
const handleImport = () => {
  importVisible.value = true
}

// 导入成功回调
const handleImportSuccess = () => {
  importVisible.value = false
  loadData()
  message.success('导入成功')
}

// 导出用户
const handleExport = async () => {
  try {
    message.info('导出功能开发中...')
  } catch (error) {
    message.error('导出失败')
  }
}

// 组件挂载时加载数据
onMounted(async () => {
  // 初始化渠道归属选项
  await userManagementStore.initSalesChannelOptions()
  // 加载用户列表数据
  loadData()
})
</script>

<style scoped>
.user-management {
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 24px;
}

.page-header .ant-breadcrumb {
  margin-bottom: 8px;
}

.page-title {
  margin: 0;
  font-size: 24px;
  font-weight: 500;
  color: #262626;
}

.search-form {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.search-form .ant-form-item {
  margin-bottom: 16px;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.table-info {
  display: flex;
  align-items: center;
  gap: 16px;
  color: #666;
  font-size: 14px;
}

.selected-info {
  color: #1890ff;
  font-weight: 500;
}

.total-info {
  color: #999;
}

.table-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.table-container .ant-table {
  border-radius: 8px;
}

.table-container .ant-table-thead > tr > th {
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
  font-weight: 600;
  color: #262626;
}

.table-container .ant-table-tbody > tr > td {
  border-bottom: 1px solid #f0f0f0;
}

.table-container .ant-table-tbody > tr:hover > td {
  background: #f5f5f5;
}

.ant-tag {
  border-radius: 4px;
  font-size: 12px;
  padding: 2px 8px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.ant-btn-link {
  padding: 0;
  height: auto;
  line-height: 1.5;
}

.ant-btn-link + .ant-btn-link {
  margin-left: 8px;
}

.ant-space {
  gap: 8px !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-management {
    padding: 16px;
  }
  
  .search-form {
    padding: 16px;
  }
  
  .search-form .ant-form {
    flex-direction: column;
  }
  
  .search-form .ant-form-item {
    width: 100%;
  }
  
  .action-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .action-buttons {
    flex-wrap: wrap;
  }
  
  .table-container {
    overflow-x: auto;
  }
}

/* 自定义滚动条 */
.table-container ::-webkit-scrollbar {
  height: 6px;
}

.table-container ::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.table-container ::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.table-container ::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 加载状态优化 */
.ant-spin-container {
  min-height: 200px;
}

/* 表格行选择样式 */
.ant-table-tbody > tr.ant-table-row-selected > td {
  background: #e6f7ff;
}

.ant-table-tbody > tr.ant-table-row-selected:hover > td {
  background: #bae7ff;
}
</style>