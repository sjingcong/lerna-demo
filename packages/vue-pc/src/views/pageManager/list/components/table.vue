<template>
  <div class="table-container">
    <a-table
      :data-source="listData"
      :loading="loading"
      :columns="columns"
      :pagination="false"
      bordered
      size="middle"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <a-tag :color="getStatusColor(record.status)">
            {{ record.statusText }}
          </a-tag>
        </template>

        <template v-if="column.key === 'action'">
          <div class="action-buttons">
            <template
              v-for="(button, index) in getActionButtons(record.status)"
              :key="button.key"
            >
              <a-divider
                v-if="index > 0"
                type="vertical"
              />
              <a-button
                type="link"
                size="small"
                :danger="button.danger"
                @click="button.handler(record)"
              >
                {{ button.label }}
              </a-button>
            </template>
          </div>
        </template>
      </template>
    </a-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <a-pagination
        v-model:current="pagination.current"
        v-model:page-size="pagination.pageSize"
        :page-size-options="['10', '20', '50', '100']"
        :total="pagination.total"
        show-size-changer
        show-quick-jumper
        show-total
        @change="handleCurrentChange"
        @show-size-change="handleSizeChange"
      >
        <template #buildOptionText="props">
          <span>{{ props.value }}条/页</span>
        </template>
      </a-pagination>
    </div>
    
    <!-- 提交审核弹框 -->
    <SubmitReviewModal
      v-model:visible="submitReviewModalVisible"
      :product-name="currentRecord?.productName"
      @submit="handleSubmitReviewConfirm"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { storeToRefs } from 'pinia';
  import { message, Modal } from 'ant-design-vue';
  import { useRouter } from 'vue-router';
  import { usePageManagerListStore, type ListItem } from '../store';
  import SubmitReviewModal from './SubmitReviewModal.vue';

  const router = useRouter();

  const store = usePageManagerListStore();
  const { listData, loading, pagination } = storeToRefs(store);
  const { handlePageChange } = store;

  // 提交审核弹框相关
  const submitReviewModalVisible = ref(false);
  const currentRecord = ref<ListItem | null>(null);

  interface ActionButton {
    key: string;
    label: string;
    handler: (record: ListItem) => void;
    danger?: boolean;
  }

  // 表格列配置
  const columns = [
    {
      title: '销售商品名称',
      dataIndex: 'productName',
      key: 'productName',
      width: 150,
      ellipsis: true,
    },
    {
      title: '销售方案名称',
      dataIndex: 'officialFactoryName',
      key: 'officialFactoryName',
      width: 150,
      ellipsis: true,
    },
    {
      title: '销售方案编码',
      dataIndex: 'officialFactoryCode',
      key: 'officialFactoryCode',
      width: 120,
    },
    {
      title: '实测日期',
      dataIndex: 'testDate',
      key: 'testDate',
      width: 100,
    },
    {
      title: '版本编号',
      dataIndex: 'templateCode',
      key: 'templateCode',
      width: 100,
    },
    {
      title: '生效时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160,
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
    },
  ];

  // 获取状态标签颜色
  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      initial: 'default',
      processing: 'processing',
      completed: 'success',
      failed: 'error',
      published: 'success',
    };
    return statusMap[status] || 'default';
  };

  // 分页大小变化
  const handleSizeChange = (size: number) => {
    handlePageChange(pagination.value.current, size);
  };

  // 当前页变化
  const handleCurrentChange = (page: number) => {
    handlePageChange(page, pagination.value.pageSize);
  };

  // 查看
  const handleView = (record: ListItem) => {
    // 查看页面，跳转到PageConfig页面，传递页面ID和模式
    router.push({
      name: 'PageConfig',
      query: {
        id: record.id,
        mode: 'view'
      }
    });
  };

  // 编辑
  const handleEdit = (record: ListItem) => {
    // 编辑页面，跳转到PageConfig页面，传递页面ID和模式
    router.push({
      name: 'PageConfig',
      query: {
        id: record.id,
        mode: 'edit'
      }
    });
  };

  // 复制
  const handleCopy = (record: ListItem) => {
    // 复制页面，跳转到PageConfig页面，传递被复制页面的ID和复制模式
    router.push({
      name: 'PageConfig',
      query: {
        copyFromId: record.id,
        mode: 'create'
      }
    });
  };

  // 删除
  const handleDelete = (record: ListItem) => {
    Modal.confirm({
      title: '提示',
      content: `确定要删除 "${record.productName}" 吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        message.success('删除成功');
        // 这里可以调用删除接口
      },
      onCancel() {
        message.info('已取消删除');
      },
    });
  };

  // 上架
  const handleOnline = (record: ListItem) => {
    Modal.confirm({
      title: '提示',
      content: `确定要上架 "${record.productName}" 吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        message.success('上架成功');
        // 这里可以调用上架接口
      },
      onCancel() {
        message.info('已取消上架');
      },
    });
  };

  // 下架
  const handleOffline = (record: ListItem) => {
    Modal.confirm({
      title: '提示',
      content: `确定要下架 "${record.productName}" 吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        message.success('下架成功');
        // 这里可以调用下架接口
      },
      onCancel() {
        message.info('已取消下架');
      },
    });
  };

  // 提交审核
  const handleSubmitReview = (record: ListItem) => {
    currentRecord.value = record;
    submitReviewModalVisible.value = true;
  };

  // 提交审核确认
  const handleSubmitReviewConfirm = (data: any) => {
    console.log('提交审核数据:', data);
    // 这里可以调用提交审核接口
    // 可以根据需要刷新列表数据
    store.fetchListData();
  };

  // 审核通过
  const handleApprove = (record: ListItem) => {
    Modal.confirm({
      title: '提示',
      content: `确定要审核通过 "${record.productName}" 吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        message.success('审核通过成功');
        // 这里可以调用审核通过接口
      },
      onCancel() {
        message.info('已取消审核通过');
      },
    });
  };

  // 审核不通过
  const handleReject = (record: ListItem) => {
    Modal.confirm({
      title: '提示',
      content: `确定要审核不通过 "${record.productName}" 吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        message.success('审核不通过成功');
        // 这里可以调用审核不通过接口
      },
      onCancel() {
        message.info('已取消审核不通过');
      },
    });
  };

  // 状态和按钮的映射关系
  const actionButtonsMap: Record<string, ActionButton[]> = {
    initial: [
      { key: 'view', label: '查看', handler: handleView },
      { key: 'edit', label: '修改', handler: handleEdit },
      { key: 'submit', label: '提交审核', handler: handleSubmitReview },
      { key: 'delete', label: '删除', handler: handleDelete, danger: true },
    ],
    processing: [
      { key: 'view', label: '查看', handler: handleView },
      { key: 'approve', label: '审核通过', handler: handleApprove },
      { key: 'reject', label: '审核不通过', handler: handleReject },
    ],
    completed: [
      { key: 'view', label: '查看', handler: handleView },
      { key: 'copy', label: '复制', handler: handleCopy },
      { key: 'online', label: '上架', handler: handleOnline },
      { key: 'delete', label: '删除', handler: handleDelete, danger: true },
    ],
    failed: [
      { key: 'view', label: '查看', handler: handleView },
      { key: 'copy', label: '复制', handler: handleCopy },
      { key: 'delete', label: '删除', handler: handleDelete, danger: true },
    ],
    published: [
      { key: 'view', label: '查看', handler: handleView },
      { key: 'copy', label: '复制', handler: handleCopy },
      { key: 'offline', label: '下架', handler: handleOffline },
    ],
  };
  // 根据状态获取操作按钮
  const getActionButtons = (status: string) => {
    return (
      actionButtonsMap[status] || [
        { key: 'view', label: '查看', handler: handleView },
      ]
    );
  };
</script>

<style scoped>
  .table-container {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  :deep(.ant-table) {
    font-size: 14px;
  }

  :deep(.ant-table-thead > tr > th) {
    background-color: #fafafa;
    color: #333;
    font-weight: 600;
  }

  :deep(.ant-table-tbody > tr > td) {
    padding: 12px 16px;
  }

  .action-buttons {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .action-buttons .ant-btn {
    padding: 0;
    height: auto;
    line-height: 1;
  }

  .action-buttons .ant-divider-vertical {
    margin: 0 8px;
    height: 12px;
  }
</style>
