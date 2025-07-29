<template>
  <div class="order-list-page">
    <!-- 固定头部区域 -->
    <div class="fixed-header">
      <!-- 搜索框 -->
      <div class="search-container">
        <van-search
          v-model="searchValue"
          placeholder="请输入搜索关键词"
          @search="onSearch"
          @clear="onClear"
        />
      </div>

      <!-- Tab切换 -->
      <van-tabs
        v-model:active="activeTab"
        @change="onTabChange"
      >
        <van-tab
          v-for="tab in tabConfigs"
          :key="tab.name"
          :title="
            tab.count !== undefined ? `${tab.title}(${tab.count})` : tab.title
          "
          :name="tab.name"
        ></van-tab>
      </van-tabs>
    </div>

    <!-- 可滚动的列表区域 -->
    <div class="scrollable-content">
      <van-pull-refresh
        v-model="currentRefreshing"
        @refresh="onRefresh"
      >
        <van-list
          :loading="currentLoading"
          :finished="isFinished"
          finished-text="没有更多了"
          :immediate-check="false"
          @load="onLoad"
        >
          <div
            v-for="order in currentOrderList"
            :key="order.id"
            class="order-item"
          >
            <div class="order-header">
              <div class="order-title">{{ order.title }}</div>
              <div
                class="order-status"
                :class="getStatusClass(order.status)"
              >
                {{ getStatusText(order.status) }}
              </div>
            </div>

            <div class="order-details">
              <div class="details-left">
                <div class="detail-row">
                  <span class="label">订单号</span>
                  <span class="value">{{ order.orderNo }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">投保人</span>
                  <span class="value">{{ order.insuredPerson }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">业务员</span>
                  <span class="value">{{ order.salesperson }}</span>
                </div>
              </div>
              <div class="details-right" v-if="order.status === 'pending'">
                <van-button
                  type="primary"
                  size="small"
                  @click="handlePayment(order)"
                  class="pay-button"
                >
                  立即支付
                </van-button>
              </div>
            </div>

            <div class="order-footer">
              <div class="order-amount">
                订单金额：
                <span class="amount">¥{{ order.amount }}</span>
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useOrderListStore, type OrderStatus } from './store';

  // 使用订单列表store
  const orderStore = useOrderListStore();

  // 使用storeToRefs保持响应式状态
  const {
    // 状态
    activeTab,
    searchValue,
    tabConfigs,

    // 计算属性
    currentOrderList,
    currentLoading,
    currentRefreshing,
    isFinished,
  } = storeToRefs(orderStore);

  // 方法可以直接解构
  const { loadMore, refresh, search, clearSearch, handlePayment, init, reset } =
    orderStore;

  // 加载更多
  const onLoad = () => {
    console.log('加载更多');
    loadMore();
  };

  // 下拉刷新
  const onRefresh = () => {
    refresh();
  };

  // Tab切换
  const onTabChange = async (name: string | number) => {
    const tab = name as OrderStatus;

    // 如果该tab还没有数据，则加载
    // if (orderStore.orderListMap[tab].length === 0) {
    await orderStore.switchTabReloading(tab);
    // }
  };

  // 搜索
  const onSearch = () => {
    search(searchValue.value);
  };

  // 清空搜索
  const onClear = () => {
    clearSearch();
  };

  // 获取状态样式类
  const getStatusClass = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'status-pending',
      completed: 'status-completed',
      reviewing: 'status-reviewing',
    };
    return statusMap[status] || '';
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: '待支付',
      completed: '已完成',
      reviewing: '审核中',
    };
    return statusMap[status] || '未知状态';
  };

  // 组件挂载时初始化数据
  onMounted(() => {
    init();
  });

  // 组件卸载时重置状态（可选）
  onUnmounted(() => {
    // 如果需要在离开页面时保持状态，可以注释掉这行
    // reset();
  });
</script>

<style scoped lang="less">
  .order-list-page {
    background-color: #f5f5f5;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .fixed-header {
    flex-shrink: 0;
    background-color: #fff;
    z-index: 100;
  }

  .scrollable-content {
    flex: 1;
    overflow-y: auto;
    background-color: #f5f5f5;
  }

  .search-container {
    background-color: #fff;
    padding: 0;
  }

  /* 确保Tab和搜索框在固定头部中正确显示 */
  .fixed-header .search-container {
    border-bottom: 1px solid #f0f0f0;
  }

  .fixed-header :deep(.van-tabs__wrap) {
    border-bottom: 1px solid #f0f0f0;
  }

  .order-item {
    background-color: #fff;
    margin: 8px 12px;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;

    .order-title {
      font-size: 16px;
      font-weight: 500;
      color: #333;
      flex: 1;
    }

    .order-status {
      font-size: 12px;
      color: #666;

      &.status-pending {
        color: #f57c00;
      }

      &.status-completed {
        color: #4caf50;
      }

      &.status-reviewing {
        color: #2196f3;
      }
    }
  }

  .order-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    .details-left {
      flex: 1;

      .detail-row {
        display: flex;
        align-items: center;
        margin-bottom: 4px;
        font-size: 14px;

        .label {
          color: #666;
          width: 60px;
          flex-shrink: 0;
        }

        .value {
          color: #333;
          flex: 1;
        }
      }
    }

    .details-right {
      margin-left: 12px;
      
      .pay-button {
        border-radius: 20px;
        padding: 8px 16px;
      }
    }
  }

  .order-footer {
    padding-top: 12px;
    border-top: 1px solid #f0f0f0;
    text-align: right;

    .order-amount {
      font-size: 14px;
      color: #666;

      .amount {
        color: #ff4444;
        font-weight: 500;
        font-size: 18px;
        margin-left: 4px;
      }
    }
  }

  /* Tab样式调整 */
  :deep(.van-tabs__wrap) {
    background-color: #fff;
  }

  :deep(.van-tabs__nav) {
    background-color: #fff;
  }

  /* List样式调整 */
  :deep(.van-list) {
    padding-bottom: 20px;
  }

  /* 搜索框样式调整 */
  :deep(.van-search) {
    padding: 12px 16px;
  }
</style>
