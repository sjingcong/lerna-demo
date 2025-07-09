<template>
  <div class="list-page">
    <!-- 列表头 -->
    <ListHeader
      title="物料列表"
      description="管理系统中的所有物料信息"
      @add="handleAdd"
    >
      <template #actions>
        <a-space>
          <a-button @click="handleExport">
            <template #icon><ExportOutlined /></template>
            导出
          </a-button>
          <a-button type="primary" @click="handleAdd">
            <template #icon><PlusOutlined /></template>
            新增物料
          </a-button>
        </a-space>
      </template>
    </ListHeader>
    
    <!-- 搜索模块 -->
    <SearchForm
      @search="handleSearch"
      @reset="handleReset"
      @add="handleAdd"
    />
    
    <!-- 批量操作栏 -->
    <div v-if="selectedRowKeys.length > 0" class="batch-actions">
      <a-space>
        <span>已选择 {{ selectedRowKeys.length }} 项</span>
        <a-button size="small" @click="handleBatchDelete">
          批量删除
        </a-button>
        <a-button size="small" @click="handleBatchExport">
          批量导出
        </a-button>
        <a-button size="small" type="link" @click="clearSelection">
          取消选择
        </a-button>
      </a-space>
    </div>
    
    <!-- 数据表格 -->
    <DataTable
      :data-source="tableData"
      :loading="loading"
      :selected-row-keys="selectedRowKeys"
      @view="handleView"
      @edit="handleEdit"
      @copy="handleCopy"
      @delete="handleDelete"
      @selection-change="handleSelectionChange"
    />
    
    <!-- 分页器 -->
    <TablePagination
      :current="pagination.current"
      :page-size="pagination.pageSize"
      :total="pagination.total"
      @change="handlePageChange"
    />
    
    <!-- 新增/编辑弹框 -->
    <AddMaterialModal
      v-model:open="modalVisible"
      :status="modalStatus"
      :data="editData"
      @submit="handleModalSubmit"
      @cancel="handleModalCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { ExportOutlined, PlusOutlined } from '@ant-design/icons-vue';
import ListHeader from '@/components/ListHeader.vue';
import SearchForm from '@/components/SearchForm.vue';
import DataTable from '@/components/DataTable.vue';
import TablePagination from '@/components/TablePagination.vue';
import AddMaterialModal from '@/components/AddMaterialModal.vue';

interface MaterialRecord {
  id: string;
  materialName: string;
  materialType: string;
  materialCode: string;
  quantity: number;
  status: string;
  createTime: string;
  updateTime: string;
  fileKey?: string;
  isEffective?: boolean;
  effectiveTime?: string;
}

interface SearchFormData {
  materialName?: string;
  materialCode?: string;
  materialType?: string;
  status?: string;
  updateTime?: any[];
}

// 响应式数据
const loading = ref(false);
const tableData = ref<MaterialRecord[]>([]);
const selectedRowKeys = ref<string[]>([]);
const searchParams = reactive<SearchFormData>({});
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
});

// 弹框相关状态
const modalVisible = ref(false);
const modalStatus = ref<'add' | 'edit'>('add');
const editData = ref<MaterialRecord | undefined>(undefined);

// 模拟数据
const mockData: MaterialRecord[] = [
  {
    id: '1',
    materialName: '个人自主权书',
    materialType: '通用',
    materialCode: 'COMMON',
    quantity: 2,
    status: 'active',
    createTime: '2025-05-21 00:00:00',
    updateTime: '2025-05-21 00:00:00',
    fileKey: 'file_key_001',
    isEffective: true,
    effectiveTime: '2025-05-21 00:00:00',
  },
  {
    id: '2',
    materialName: '各种要求书',
    materialType: '通用',
    materialCode: 'COMMON',
    quantity: 8,
    status: 'active',
    createTime: '2025-05-21 00:00:00',
    updateTime: '2025-05-21 00:00:00',
    fileKey: 'file_key_002',
    isEffective: true,
    effectiveTime: '2025-05-21 00:00:00',
  },
  {
    id: '3',
    materialName: '主要要求书',
    materialType: '商品',
    materialCode: 'AMG00000793',
    quantity: 5,
    status: 'active',
    createTime: '2025-05-21 00:00:00',
    updateTime: '2025-05-21 00:00:00',
    fileKey: 'file_key_003',
    isEffective: true,
    effectiveTime: '2025-05-21 00:00:00',
  },
  {
    id: '4',
    materialName: '系统要求',
    materialType: '企业',
    materialCode: 'AMG00000794',
    quantity: 6,
    status: 'active',
    createTime: '2025-05-21 00:00:00',
    updateTime: '2025-05-21 00:00:00',
    fileKey: 'file_key_004',
    isEffective: false,
    effectiveTime: '2025-05-21 00:00:00',
  },
  {
    id: '5',
    materialName: '全部要求书',
    materialType: '商品',
    materialCode: '911101056851353021',
    quantity: 7,
    status: 'inactive',
    createTime: '2025-05-21 00:00:00',
    updateTime: '2025-05-21 00:00:00',
    fileKey: 'file_key_005',
    isEffective: false,
    effectiveTime: '2025-05-21 00:00:00',
  },
];

// 获取列表数据
const fetchData = async () => {
  loading.value = true;
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 模拟分页和搜索
    let filteredData = [...mockData];
    
    // 应用搜索条件
    if (searchParams.materialName) {
      filteredData = filteredData.filter(item => 
        item.materialName.includes(searchParams.materialName!)
      );
    }
    if (searchParams.materialCode) {
      filteredData = filteredData.filter(item => 
        item.materialCode.includes(searchParams.materialCode!)
      );
    }
    if (searchParams.materialType) {
      filteredData = filteredData.filter(item => 
        item.materialType === searchParams.materialType
      );
    }
    if (searchParams.status) {
      filteredData = filteredData.filter(item => 
        item.status === searchParams.status
      );
    }
    
    // 分页
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    
    tableData.value = filteredData.slice(start, end);
    pagination.total = filteredData.length;
  } catch (error) {
    message.error('获取数据失败');
  } finally {
    loading.value = false;
  }
};

// 事件处理
const handleSearch = (params: SearchFormData) => {
  Object.assign(searchParams, params);
  pagination.current = 1;
  fetchData();
};

const handleReset = () => {
  Object.keys(searchParams).forEach(key => {
    delete searchParams[key as keyof SearchFormData];
  });
  pagination.current = 1;
  fetchData();
};

const handlePageChange = (page: number, pageSize: number) => {
  pagination.current = page;
  pagination.pageSize = pageSize;
  fetchData();
};

const handleSelectionChange = (keys: string[], rows: MaterialRecord[]) => {
  selectedRowKeys.value = keys;
};

const clearSelection = () => {
  selectedRowKeys.value = [];
};

// 打开新增弹框
const handleAdd = () => {
  modalStatus.value = 'add';
  editData.value = undefined;
  modalVisible.value = true;
};

// 打开编辑弹框
const handleEdit = (record: MaterialRecord) => {
  modalStatus.value = 'edit';
  editData.value = { ...record };
  modalVisible.value = true;
};

// 弹框提交
const handleModalSubmit = (data: any, status: 'add' | 'edit') => {
  console.log(`${status === 'add' ? '新增' : '编辑'}数据:`, data);
  
  if (status === 'add') {
    // 处理新增逻辑
    message.success('新增成功！');
  } else {
    // 处理编辑逻辑
    message.success('编辑成功！');
  }
  
  // 重新获取列表数据
  fetchData();
  modalVisible.value = false;
};

// 弹框取消
const handleModalCancel = () => {
  modalVisible.value = false;
  editData.value = undefined;
};

const handleView = (record: MaterialRecord) => {
  message.info(`查看: ${record.materialName}`);
};


const handleCopy = (record: MaterialRecord) => {
  message.info(`复制: ${record.materialName}`);
};

const handleDelete = (record: MaterialRecord) => {
  message.success(`删除成功: ${record.materialName}`);
  fetchData();
};

const handleExport = () => {
  message.info('导出功能');
};

const handleBatchDelete = () => {
  message.success(`批量删除 ${selectedRowKeys.value.length} 项`);
  selectedRowKeys.value = [];
  fetchData();
};

const handleBatchExport = () => {
  message.info(`批量导出 ${selectedRowKeys.value.length} 项`);
};

// 初始化
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.list-page {
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
}

.batch-actions {
  background: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 6px;
  padding: 8px 16px;
  margin-bottom: 16px;
}
</style>