<template>
  <div class="search-form">
    <a-form
      :model="formData"
      layout="inline"
      @finish="handleSearch"
      @reset="handleReset"
    >
      <a-form-item label="物料名称" name="materialName">
        <a-input
          v-model:value="formData.materialName"
          placeholder="支持模糊搜索，默认为空查询全部，支持输入框清空搜索内容"
          allow-clear
          style="width: 280px"
        />
      </a-form-item>
      
      <a-form-item label="物料编号" name="materialCode">
        <a-input
          v-model:value="formData.materialCode"
          placeholder="支持模糊搜索，默认为空查询全部，支持输入框清空搜索内容"
          allow-clear
          style="width: 280px"
        />
      </a-form-item>
      
      <a-form-item label="物料类型" name="materialType">
        <a-select
          v-model:value="formData.materialType"
          placeholder="请选择物料类型"
          allow-clear
          style="width: 150px"
        >
          <a-select-option value="通用">通用</a-select-option>
          <a-select-option value="商品">商品</a-select-option>
          <a-select-option value="企业">企业</a-select-option>
        </a-select>
      </a-form-item>
      
      <a-form-item label="状态" name="status">
        <a-select
          v-model:value="formData.status"
          placeholder="请选择状态"
          allow-clear
          style="width: 120px"
        >
          <a-select-option value="未生效">未生效</a-select-option>
          <a-select-option value="已生效">已生效</a-select-option>
          <a-select-option value="已失效">已失效</a-select-option>
        </a-select>
      </a-form-item>
      
      <a-form-item label="生效时间" name="effectiveTime">
        <a-range-picker
          v-model:value="formData.effectiveTime"
          show-time
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="[开始时间, 结束时间]"
          style="width: 350px"
        />
      </a-form-item>
      
      <a-form-item>
        <a-space>
          <a-button 
            type="primary" 
            html-type="submit"
            :disabled="isSearchDisabled"
          >
            <template #icon><SearchOutlined /></template>
            查询
          </a-button>
          <a-button html-type="reset">
            <template #icon><ReloadOutlined /></template>
            重置
          </a-button>
          <a-button type="primary" @click="handleAdd">
            <template #icon><PlusOutlined /></template>
            新增
          </a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons-vue';
import type { Dayjs } from 'dayjs';

interface SearchFormData {
  materialName?: string;
  materialCode?: string;
  materialType?: string;
  status?: string;
  effectiveTime?: [Dayjs, Dayjs];
}

interface Emits {
  search: [data: SearchFormData];
  reset: [];
  add: [];
}

const emit = defineEmits<Emits>();

const formData = reactive<SearchFormData>({
  materialName: undefined,
  materialCode: undefined,
  materialType: undefined,
  status: undefined,
  effectiveTime: undefined,
});

// 计算查询按钮是否禁用：如搜索框内容为空，点击查询则无响应
const isSearchDisabled = computed(() => {
  return !formData.materialName && 
         !formData.materialCode && 
         !formData.materialType && 
         !formData.status && 
         !formData.effectiveTime;
});

const handleSearch = () => {
  // 如果所有搜索条件都为空，则不执行搜索
  if (isSearchDisabled.value) {
    return;
  }
  
  // 处理物料类型对应的编号逻辑
  const searchData = { ...formData };
  if (formData.materialType === '通用') {
    // 当物料类型是通用时，对应物料编号为"COMMON"
    searchData.materialCode = 'COMMON';
  }
  
  emit('search', searchData);
};

const handleReset = () => {
  // 清空搜索框内容
  Object.keys(formData).forEach(key => {
    formData[key as keyof SearchFormData] = undefined;
  });
  emit('reset');
};

const handleAdd = () => {
  // 点击弹出新增弹框
  emit('add');
};
</script>

<style scoped>
.search-form {
  background: #fafafa;
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 6px;
}

.search-form .ant-form-item {
  margin-bottom: 16px;
}

.search-form .ant-form-item:last-child {
  margin-bottom: 0;
}
</style>