<template>
  <div class="data-table">
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      :pagination="false"
      :row-selection="rowSelection"
      :scroll="{ x: 1200 }"
      row-key="id"
    >
      <!-- 物料类型列 -->
      <template #materialType="{ record }">
        <a-tag :color="record.materialType === 'COMMON' ? 'blue' : 'green'">
          {{ record.materialType === 'COMMON' ? '通用' : '专用' }}
        </a-tag>
      </template>
      
      <!-- 状态列 -->
      <template #status="{ record }">
        <a-badge
          :status="record.status === 'active' ? 'success' : 'default'"
          :text="record.status === 'active' ? '启用' : '禁用'"
        />
      </template>
      
      <!-- 操作列 -->
      <template #action="{ record }">
        <a-space>
          <a-button type="link" size="small" @click="handleView(record)">
            查看
          </a-button>
          <a-button type="link" size="small" @click="handleEdit(record)">
            编辑
          </a-button>
          <a-button type="link" size="small" @click="handleCopy(record)">
            复制
          </a-button>
          <a-popconfirm
            title="确定要删除这条记录吗？"
            @confirm="handleDelete(record)"
          >
            <a-button type="link" size="small" danger>
              删除
            </a-button>
          </a-popconfirm>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { TableColumnsType, TableProps } from 'ant-design-vue';

interface MaterialRecord {
  id: string;
  materialName: string;
  materialType: string;
  materialCode: string;
  quantity: number;
  status: string;
  createTime: string;
  updateTime: string;
}

interface Props {
  dataSource: MaterialRecord[];
  loading?: boolean;
  selectedRowKeys?: string[];
}

interface Emits {
  view: [record: MaterialRecord];
  edit: [record: MaterialRecord];
  copy: [record: MaterialRecord];
  delete: [record: MaterialRecord];
  selectionChange: [selectedRowKeys: string[], selectedRows: MaterialRecord[]];
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  selectedRowKeys: () => [],
});

const emit = defineEmits<Emits>();

// 表格列配置
const columns: TableColumnsType = [
  {
    title: '物料名称',
    dataIndex: 'materialName',
    key: 'materialName',
    width: 150,
    ellipsis: true,
  },
  {
    title: '物料类型',
    dataIndex: 'materialType',
    key: 'materialType',
    width: 100,
    slots: { customRender: 'materialType' },
  },
  {
    title: '物料编号',
    dataIndex: 'materialCode',
    key: 'materialCode',
    width: 150,
  },
  {
    title: '数量',
    dataIndex: 'quantity',
    key: 'quantity',
    width: 80,
    align: 'right',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    slots: { customRender: 'status' },
  },
  {
    title: '生效时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 150,
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    fixed: 'right',
    slots: { customRender: 'action' },
  },
];

// 行选择配置
const rowSelection = computed<TableProps['rowSelection']>(() => ({
  selectedRowKeys: props.selectedRowKeys,
  onChange: (selectedRowKeys: string[], selectedRows: MaterialRecord[]) => {
    emit('selectionChange', selectedRowKeys, selectedRows);
  },
}));

// 事件处理
const handleView = (record: MaterialRecord) => {
  emit('view', record);
};

const handleEdit = (record: MaterialRecord) => {
  emit('edit', record);
};

const handleCopy = (record: MaterialRecord) => {
  emit('copy', record);
};

const handleDelete = (record: MaterialRecord) => {
  emit('delete', record);
};
</script>

<style scoped>
.data-table {
  background: #fff;
  border-radius: 6px;
}
</style>