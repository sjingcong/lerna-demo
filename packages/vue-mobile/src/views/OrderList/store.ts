import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { showToast } from 'vant';

// 订单状态类型
export type OrderStatus = 'all' | 'pending' | 'completed' | 'reviewing';

// 订单接口
export interface Order {
  id: string;
  title: string;
  orderNo: string;
  insuredPerson: string;
  salesperson: string;
  amount: string;
  status: OrderStatus;
  createTime?: string;
  updateTime?: string;
}

// 分页信息接口
export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

// Tab配置接口
export interface TabConfig {
  name: OrderStatus;
  title: string;
  count?: number;
}

export const useOrderListStore = defineStore('orderList', () => {
  // ===== 状态管理 =====

  // 当前激活的tab
  const activeTab = ref<OrderStatus>('all');

  // 搜索关键词
  const searchValue = ref('');

  // 订单列表数据 - 按tab分组存储
  const orderListMap = ref<Record<OrderStatus, Order[]>>({
    all: [],
    pending: [],
    completed: [],
    reviewing: [],
  });

  // 加载状态
  const loadingMap = ref<Record<OrderStatus, boolean>>({
    all: false,
    pending: false,
    completed: false,
    reviewing: false,
  });

  // 刷新状态
  const refreshingMap = ref<Record<OrderStatus, boolean>>({
    all: false,
    pending: false,
    completed: false,
    reviewing: false,
  });

  // 分页信息
  const paginationMap = ref<Record<OrderStatus, PaginationInfo>>({
    all: { currentPage: 1, pageSize: 10, total: 0, hasMore: true },
    pending: { currentPage: 1, pageSize: 10, total: 0, hasMore: true },
    completed: { currentPage: 1, pageSize: 10, total: 0, hasMore: true },
    reviewing: { currentPage: 1, pageSize: 10, total: 0, hasMore: true },
  });

  // Tab配置
  const tabConfigs = ref<TabConfig[]>([
    { name: 'all', title: '全部' },
    { name: 'pending', title: '待支付' },
    { name: 'completed', title: '已完成' },
    { name: 'reviewing', title: '审核中' },
  ]);

  // ===== 计算属性 =====

  // 当前tab的订单列表
  const currentOrderList = computed(() => {
    return orderListMap.value[activeTab.value] || [];
  });

  // 当前tab的加载状态 - 改为可写的ref
  const currentLoading = computed({
    get: () => loadingMap.value[activeTab.value],
    set: (value: boolean) => {
      loadingMap.value[activeTab.value] = value;
    },
  });

  // 当前tab的刷新状态 - 改为可写的ref
  const currentRefreshing = computed({
    get: () => refreshingMap.value[activeTab.value],
    set: (value: boolean) => {
      refreshingMap.value[activeTab.value] = value;
    },
  });

  // 当前tab的分页信息
  const currentPagination = computed(() => {
    return paginationMap.value[activeTab.value];
  });

  // 是否已加载完成
  const isFinished = computed(() => {
    return !currentPagination.value.hasMore;
  });

  // ===== 模拟数据 =====

  const mockOrders: Order[] = [
    {
      id: '1',
      title: '团体e生保臻选版2025',
      orderNo: '38420342842342341',
      insuredPerson: '张平安',
      salesperson: '张平安',
      amount: '20000.00',
      status: 'pending',
      createTime: '2024-01-15 10:30:00',
    },
    {
      id: '2',
      title: '团体e生保臻选版2025',
      orderNo: '38420342842342342',
      insuredPerson: '李明',
      salesperson: '王小二',
      amount: '15000.00',
      status: 'completed',
      createTime: '2024-01-14 14:20:00',
    },
    {
      id: '3',
      title: '团体e生保臻选版2025',
      orderNo: '38420342842342343',
      insuredPerson: '赵四',
      salesperson: '张平安',
      amount: '25000.00',
      status: 'reviewing',
      createTime: '2024-01-13 09:15:00',
    },
    {
      id: '4',
      title: '个人意外险2025',
      orderNo: '38420342842342344',
      insuredPerson: '刘五',
      salesperson: '李小花',
      amount: '8000.00',
      status: 'pending',
      createTime: '2024-01-12 16:45:00',
    },
    {
      id: '5',
      title: '家庭财产险',
      orderNo: '38420342842342345',
      insuredPerson: '陈六',
      salesperson: '王小二',
      amount: '12000.00',
      status: 'completed',
      createTime: '2024-01-11 11:30:00',
    },
  ];

  // ===== 方法 =====

  /**
   * 获取订单列表
   * @param tab 标签页
   * @param page 页码
   * @param isRefresh 是否刷新
   */
  const fetchOrderList = async (
    tab: OrderStatus = activeTab.value,
    page: number = 1,
    isRefresh: boolean = false
  ) => {
    try {
      // 设置加载状态
      if (isRefresh) {
        refreshingMap.value[tab] = true;
      } else {
        loadingMap.value[tab] = true;
      }
      console.log(
        '请求订单列表',
        'tab',
        tab,
        'page',
        page,
        'isRefresh',
        isRefresh
      );
      // 模拟API请求延迟
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 根据tab过滤数据
      let filteredOrders = mockOrders;
      if (tab !== 'all') {
        filteredOrders = mockOrders.filter((order) => order.status === tab);
      }

      // 根据搜索关键词过滤
      if (searchValue.value) {
        filteredOrders = filteredOrders.filter(
          (order) =>
            order.title.includes(searchValue.value) ||
            order.orderNo.includes(searchValue.value) ||
            order.insuredPerson.includes(searchValue.value)
        );
      }

      // 模拟分页
      const pageSize = paginationMap.value[tab].pageSize;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const pageData = filteredOrders.slice(startIndex, endIndex);

      // 更新数据
      if (isRefresh || page === 1) {
        orderListMap.value[tab] = pageData;
      } else {
        orderListMap.value[tab].push(...pageData);
      }

      // 更新分页信息
      paginationMap.value[tab] = {
        currentPage: page,
        pageSize,
        total: filteredOrders.length,
        hasMore: endIndex < filteredOrders.length,
      };

      // 更新tab计数
      updateTabCounts();
    } catch (error) {
      console.error('获取订单列表失败:', error);
      showToast('加载失败，请重试');
    } finally {
      loadingMap.value[tab] = false;
      refreshingMap.value[tab] = false;
    }
  };

  /**
   * 加载更多
   */
  const loadMore = async () => {
    const pagination = currentPagination.value;
    if (!pagination.hasMore || currentLoading.value) return;

    await fetchOrderList(activeTab.value, pagination.currentPage + 1);
  };

  /**
   * 下拉刷新
   */
  const refresh = async () => {
    // 重置分页信息
    paginationMap.value[activeTab.value] = {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      hasMore: true,
    };

    await fetchOrderList(activeTab.value, 1, true);
  };

  /**
   * 切换tab时刷新数据
   */
  const switchTabReloading = async (tab: OrderStatus) => {
    // 重置分页信息
    paginationMap.value[tab] = {
      currentPage: 1,
      pageSize: 10,
      total: 0,
      hasMore: true,
    };

    await fetchOrderList(activeTab.value, 1, false);
  };

  /**
   * 搜索
   * @param keyword 搜索关键词
   */
  const search = async (keyword: string) => {
    searchValue.value = keyword;

    // 重置所有tab的分页信息
    Object.keys(paginationMap.value).forEach((tab) => {
      paginationMap.value[tab as OrderStatus] = {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        hasMore: true,
      };
      // 清空数据，强制重新加载
      orderListMap.value[tab as OrderStatus] = [];
    });

    await fetchOrderList(activeTab.value, 1, true);
  };

  /**
   * 清空搜索
   */
  const clearSearch = async () => {
    await search('');
  };

  /**
   * 更新tab计数
   */
  const updateTabCounts = () => {
    tabConfigs.value.forEach((config) => {
      if (config.name === 'all') {
        config.count = mockOrders.length;
      } else {
        config.count = mockOrders.filter(
          (order) => order.status === config.name
        ).length;
      }
    });
  };

  /**
   * 处理支付
   * @param order 订单信息
   */
  const handlePayment = async (order: Order) => {
    try {
      showToast(`正在跳转支付页面，订单号：${order.orderNo}`);
      // 这里可以跳转到支付页面或调用支付接口
      // 支付成功后可以更新订单状态
      // await updateOrderStatus(order.id, 'completed')
    } catch (error) {
      console.error('支付处理失败:', error);
      showToast('支付失败，请重试');
    }
  };

  /**
   * 更新订单状态
   * @param orderId 订单ID
   * @param newStatus 新状态
   */
  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      // 在所有tab中查找并更新订单
      Object.keys(orderListMap.value).forEach((tab) => {
        const orders = orderListMap.value[tab as OrderStatus];
        const orderIndex = orders.findIndex((order) => order.id === orderId);
        if (orderIndex !== -1) {
          orders[orderIndex].status = newStatus;
        }
      });

      // 重新加载当前tab数据
      await refresh();

      showToast('订单状态更新成功');
    } catch (error) {
      console.error('更新订单状态失败:', error);
      showToast('更新失败，请重试');
    }
  };

  /**
   * 初始化数据
   */
  const init = async () => {
    updateTabCounts();
    await fetchOrderList('all', 1, false);
  };

  /**
   * 重置状态
   */
  const reset = () => {
    activeTab.value = 'all';
    searchValue.value = '';

    // 清空所有数据
    Object.keys(orderListMap.value).forEach((tab) => {
      orderListMap.value[tab as OrderStatus] = [];
      loadingMap.value[tab as OrderStatus] = false;
      refreshingMap.value[tab as OrderStatus] = false;
      paginationMap.value[tab as OrderStatus] = {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        hasMore: true,
      };
    });
  };

  return {
    // 状态
    activeTab,
    searchValue,
    orderListMap,
    loadingMap,
    refreshingMap,
    paginationMap,
    tabConfigs,

    // 计算属性
    currentOrderList,
    currentLoading,
    currentRefreshing,
    currentPagination,
    isFinished,

    // 方法
    fetchOrderList,
    loadMore,
    refresh,
    switchTabReloading,
    search,
    clearSearch,
    updateTabCounts,
    handlePayment,
    updateOrderStatus,
    init,
    reset,
  };
});
