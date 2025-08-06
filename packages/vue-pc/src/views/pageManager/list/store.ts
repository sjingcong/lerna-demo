import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import { getStatusOptions, getVersionOptions, getListData } from './api';

// 搜索项类型定义
export interface SearchParams {
  productName?: string; // 商品名称
  factoryName?: string; // 方案编码
  status?: string; // 状态
  templateCode?: string; // 版本编号
  createTimeRange?: [string, string] | null; // 生效时间范围
}

// 列表数据项类型定义
export interface ListItem {
  id: string;
  productName: string; // 商品名称
  officialFactoryName: string; // 销售方案名称
  officialFactoryCode: string; // 销售方案编码
  testDate: string; // 实测日期
  templateCode: string; // 版本编号
  createTime: string; // 生效时间
  status: 'initial' | 'processing' | 'completed' | 'failed' | 'published'; // 状态
  statusText: string; // 状态文本
}

// 分页信息类型
export interface PaginationInfo {
  current: number;
  pageSize: number;
  total: number;
}

// 选项类型
export interface OptionItem {
  label: string;
  value: string;
}

export const usePageManagerListStore = defineStore('pageManagerList', () => {
  // 搜索参数
  const searchParams = reactive<SearchParams>({
    productName: '',
    factoryName: '',
    status: undefined,
    templateCode: undefined,
    createTimeRange: null,
  });

  // 列表数据
  const listData = ref<ListItem[]>([]);

  // 加载状态
  const loading = ref(false);

  // 分页信息
  const pagination = reactive<PaginationInfo>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 状态选项
  const statusOptions = ref<OptionItem[]>([]);

  // 版本编号选项
  const versionOptions = ref<OptionItem[]>([]);

  // 重置搜索参数
  const resetSearchParams = () => {
    Object.assign(searchParams, {
      productName: '',
      factoryName: '',
      status: '',
      templateCode: '',
      createTimeRange: [],
    });
  };

  // 获取列表数据
  const fetchListData = async () => {
    loading.value = true;
    try {
      const response = await getListData({
        ...searchParams,
        page: pagination.current,
        pageSize: pagination.pageSize,
      });

      listData.value = response.list;
      pagination.total = response.total;
    } catch (error) {
      console.error('获取列表数据失败:', error);
    } finally {
      loading.value = false;
    }
  };

  // 搜索
  const handleSearch = () => {
    pagination.current = 1;
    fetchListData();
  };

  // 重置
  const handleReset = () => {
    resetSearchParams();
    pagination.current = 1;
    fetchListData();
  };

  // 分页变化
  const handlePageChange = (page: number, pageSize: number) => {
    pagination.current = page;
    pagination.pageSize = pageSize;
    fetchListData();
  };

  // 获取状态选项
  const fetchStatusOptions = async () => {
    try {
      const response = await getStatusOptions();
      statusOptions.value = response;
    } catch (error) {
      console.error('获取状态选项失败:', error);
    }
  };

  // 获取版本编号选项
  const fetchVersionOptions = async () => {
    try {
      const response = await getVersionOptions();
      versionOptions.value = response;
    } catch (error) {
      console.error('获取版本选项失败:', error);
    }
  };

  return {
    searchParams,
    listData,
    loading,
    pagination,
    statusOptions,
    versionOptions,
    resetSearchParams,
    fetchListData,
    handleSearch,
    handleReset,
    handlePageChange,
    fetchStatusOptions,
    fetchVersionOptions,
  };
});
