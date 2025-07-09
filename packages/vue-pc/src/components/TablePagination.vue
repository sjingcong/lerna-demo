<template>
  <div class="table-pagination">
    <div class="pagination-info">
      <span>共 {{ total }} 条记录，第 {{ current }}/{{ Math.ceil(total / pageSize) }} 页</span>
      <a-select
        v-model:value="currentPageSize"
        style="width: 80px; margin-left: 16px"
        @change="handlePageSizeChange"
      >
        <a-select-option value="10">10条/页</a-select-option>
        <a-select-option value="20">20条/页</a-select-option>
        <a-select-option value="50">50条/页</a-select-option>
        <a-select-option value="100">100条/页</a-select-option>
      </a-select>
    </div>
    
    <a-pagination
      v-model:current="currentPage"
      v-model:page-size="currentPageSize"
      :total="total"
      :show-size-changer="false"
      :show-quick-jumper="true"
      :show-total="(total, range) => `显示 ${range[0]}-${range[1]} 条，共 ${total} 条`"
      @change="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  current: number;
  pageSize: number;
  total: number;
}

interface Emits {
  change: [page: number, pageSize: number];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const currentPage = ref(props.current);
const currentPageSize = ref(props.pageSize);

// 监听props变化
watch(() => props.current, (newVal) => {
  currentPage.value = newVal;
});

watch(() => props.pageSize, (newVal) => {
  currentPageSize.value = newVal;
});

const handlePageChange = (page: number, pageSize: number) => {
  emit('change', page, pageSize);
};

const handlePageSizeChange = (pageSize: number) => {
  emit('change', 1, pageSize); // 改变页大小时回到第一页
};
</script>

<style scoped>
.table-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding: 16px 0;
}

.pagination-info {
  display: flex;
  align-items: center;
  color: #8c8c8c;
  font-size: 14px;
}
</style>