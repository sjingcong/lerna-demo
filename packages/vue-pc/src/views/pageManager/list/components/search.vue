<template>
  <div class="search-wrapper">
    <div class="search-container">
      <a-form
        :model="searchParams"
        layout="inline"
        class="search-form"
      >
        <a-form-item label="商品名称">
          <a-auto-complete
            v-model:value="searchParams.productName"
            :options="productNameSuggestions"
            style="width: 200px"
            @search="handleProductNameSearch"
            @select="handleProductNameSelect"
          >
            <a-input
              placeholder="请输入商品名称"
              :allow-clear="true"
            >
              <template #suffix>
                <LoadingOutlined v-if="searchLoading" />
              </template>
            </a-input>
            <template #option="item">
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                "
              >
                <span>{{ item.label }}</span>
                <span style="color: #999; font-size: 12px">
                  {{ item.category || '商品' }}
                </span>
              </div>
            </template>
          </a-auto-complete>
        </a-form-item>

        <a-form-item label="方案编码">
          <a-input
            v-model:value="searchParams.factoryName"
            placeholder="请输入"
            allow-clear
            style="width: 200px"
          />
        </a-form-item>

        <a-form-item label="状态">
          <a-select
            v-model:value="searchParams.status"
            placeholder="请选择"
            allow-clear
            style="width: 200px"
          >
            <a-select-option
              v-for="option in statusOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="版本编号">
          <a-select
            v-model:value="searchParams.templateCode"
            placeholder="请选择"
            allow-clear
            style="width: 200px"
          >
            <a-select-option
              v-for="option in versionOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="生效时间">
          <a-range-picker
            v-model:value="searchParams.createTimeRange"
            show-time
            :placeholder="['开始时间', '结束时间']"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 350px"
          />
        </a-form-item>
      </a-form>

      <div class="search-buttons">
        <a-button
          type="primary"
          :disabled="isSearchDisabled"
          @click="handleSearch"
        >
          查询
        </a-button>
        <a-button
          style="margin-left: 8px"
          @click="handleReset"
        >
          重置
        </a-button>
      </div>
    </div>
    <div class="search-footer-buttons">
      <a-button
        type="primary"
        @click="handleCreate"
      >
        新建
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, computed } from 'vue';
  import { storeToRefs } from 'pinia';
  import { debounce } from 'lodash-es';
  import { LoadingOutlined } from '@ant-design/icons-vue';
  import { usePageManagerListStore } from '../store';
  import { getProductNameSuggestions } from '../api';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const store = usePageManagerListStore();
  const { searchParams, statusOptions, versionOptions } = storeToRefs(store);
  const { handleSearch, handleReset, fetchStatusOptions, fetchVersionOptions } =
    store;

  // 商品名称建议数据
  const productNameSuggestions = ref([]);
  // 搜索loading状态
  const searchLoading = ref(false);

  // 计算查询按钮是否禁用
  const isSearchDisabled = computed(() => {
    const params = searchParams.value;
    return (
      !params.productName &&
      !params.factoryName &&
      !params.status &&
      !params.templateCode &&
      (!params.createTimeRange || params.createTimeRange.length !== 2)
    );
  });

  // 实际的搜索函数
  const performSearch = async (searchText: string) => {
    try {
      searchLoading.value = true;
      const response = await getProductNameSuggestions(searchText);
      productNameSuggestions.value = response;
    } catch (error) {
      console.error('获取商品名称建议失败:', error);
      productNameSuggestions.value = [];
    } finally {
      searchLoading.value = false;
    }
  };

  // 使用lodash-es的debounce创建防抖搜索函数
  const debouncedSearch = debounce(performSearch, 1000);

  // 处理商品名称搜索（带防抖）
  const handleProductNameSearch = (searchText: string) => {
    // 如果搜索文本为空，清空建议列表
    if (!searchText.trim()) {
      productNameSuggestions.value = [];
      searchLoading.value = false;
      debouncedSearch.cancel(); // 取消待执行的防抖函数
      return;
    }

    // 执行防抖搜索
    debouncedSearch(searchText);
  };

  // 处理商品名称选择
  const handleProductNameSelect = (value: string) => {
    searchParams.value.productName = value;
  };

  // 新建
  const handleCreate = () => {
    router.push({
      name: 'PageConfig',
      query: {
        mode: 'create',
      },
    });
  };

  // 组件挂载时获取选项数据
  onMounted(() => {
    fetchStatusOptions();
    fetchVersionOptions();
  });
</script>

<style scoped>
  .search-wrapper {
    padding: 20px;
    border-radius: 8px;
    background: #fff;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  .search-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .search-form {
    margin-bottom: 0;
    flex: 1;
  }

  .search-form .ant-form-item {
    margin-bottom: 16px;
  }

  .search-buttons {
    margin-left: 20px;
    flex-shrink: 0;
  }
  .search-footer-buttons {
    margin-top: 16px;
  }
</style>
