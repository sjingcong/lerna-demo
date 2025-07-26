<template>
  <div class="demo-container">
    <h2>移动端表格组件演示</h2>

    <!-- 基础表格 -->
    <div class="demo-section">
      <h3>1. 基础表格（支持第一列行合并）</h3>
      <MobileTable
        :columns="columns"
        :data="tableData"
        :mergeFirstColumn="true"
        :rowHeight="50"
        :border="true"
        :stripe="true"
      />
    </div>

    <!-- 部分自定义列 -->
    <div class="demo-section">
      <h3>2. 部分自定义列内容</h3>
      <MobileTable
        :columns="columns"
        :data="tableData"
        :mergeFirstColumn="true"
        :border="true"
        :stripe="true"
      >
        <!-- 只自定义价格列，添加货币符号和样式 -->
        <template #price="{ record, text }">
          <span class="price-tag">¥{{ text }}</span>
        </template>
      </MobileTable>
    </div>

    <!-- 使用通用默认列插槽 -->
    <div class="demo-section">
      <h3>3. 使用通用默认列插槽</h3>
      <MobileTable
        :columns="columns"
        :data="tableData"
        :mergeFirstColumn="true"
        :border="true"
        :stripe="true"
      >
        <!-- 自定义价格列 -->
        <template #price="{ record, text }">
          <span class="price-tag special">💰 ¥{{ text }}</span>
        </template>

        <!-- 通用默认列样式，应用于其他列 -->
        <template #defaultcolumn="{ record, text, column }">
          <div class="default-cell">
            <span class="cell-content">{{ text }}</span>
          </div>
        </template>
      </MobileTable>
    </div>

    <!-- 继承vxe-table的props -->
    <div class="demo-section">
      <h3>4. 继承vxe-table的props（加载状态、空数据等）</h3>
      <div class="controls">
        <button @click="toggleLoading">切换加载状态</button>
        <button @click="toggleEmpty">切换空数据</button>
        <button @click="addData">添加数据</button>
      </div>
      <MobileTable
        :columns="columns"
        :data="currentData"
        :loading="loading"
        :empty-text="'暂无数据，请添加一些内容'"
        :tooltip-config="{ showAll: true }"
        :border="true"
        :stripe="true"
        :size="'medium'"
      >
        <template #price="{ record, text }">
          <span class="price-tag">¥{{ text }}</span>
        </template>
      </MobileTable>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import MobileTable from '@/components/MobileTable.vue';

  // 表格列配置
  const columns = ref([
    {
      title: '计划',
      dataIndex: 'category',
      key: 'category',
      width: 120,
    },
    {
      title: '分类',
      dataIndex: 'type',
      key: 'type',
      width: 200,
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      width: 100,
    },
    {
      title: '人数',
      dataIndex: 'count',
      key: 'count',
      width: 80,
    },
  ]);

  // 控制状态
  const loading = ref(false);
  const showEmpty = ref(false);

  // 表格数据
  const tableData = ref([
    {
      category: '计划一',
      type: '【30-40】-男-一类职业',
      price: 120,
      count: 150,
    },
    {
      category: '计划一',
      type: '【30-46】-女-二类职业',
      price: 180,
      count: 200,
    },
    {
      category: '计划一',
      type: '【40-50】-男-三类职业',
      price: 220,
      count: 100,
    },
    {
      category: '计划一',
      type: '【25-35】-女-一类职业',
      price: 150,
      count: 180,
    },
    {
      category: '计划二',
      type: '【35-45】-男-二类职业',
      price: 200,
      count: 120,
    },
    {
      category: '计划二',
      type: '【28-38】-女-三类职业',
      price: 160,
      count: 90,
    },
    {
      category: '计划二',
      type: '【45-55】-男-一类职业',
      price: 250,
      count: 80,
    },
  ]);

  // 计算当前显示的数据
  const currentData = computed(() => {
    return showEmpty.value ? [] : tableData.value;
  });

  // 控制方法
  const toggleLoading = () => {
    loading.value = !loading.value;
  };

  const toggleEmpty = () => {
    showEmpty.value = !showEmpty.value;
  };

  const addData = () => {
    const newData = {
      category: `计划${Math.floor(Math.random() * 3) + 1}`,
      type: `【${20 + Math.floor(Math.random() * 30)}-${30 + Math.floor(Math.random() * 30)}】-${Math.random() > 0.5 ? '男' : '女'}-${Math.floor(Math.random() * 3) + 1}类职业`,
      price: 100 + Math.floor(Math.random() * 200),
      count: 50 + Math.floor(Math.random() * 200),
    };
    tableData.value.push(newData);
  };
</script>

<style scoped>
  .demo-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;

    h2 {
      color: #333;
      margin-bottom: 30px;
      text-align: center;
    }

    .demo-section {
      margin-bottom: 40px;

      h3 {
        color: #666;
        margin-bottom: 15px;
        font-size: 16px;
        border-left: 4px solid #1890ff;
        padding-left: 10px;
      }
    }

    .controls {
      margin-bottom: 15px;

      button {
        margin-right: 10px;
        padding: 8px 16px;
        background: #1890ff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;

        &:hover {
          background: #40a9ff;
        }

        &:active {
          background: #096dd9;
        }
      }
    }
  }

  :deep(.price-tag) {
    padding: 4px 8px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;

    &.special {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      font-size: 13px;
    }
  }

  :deep(.default-cell) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;

    .cell-content {
      font-weight: 500;
      color: #333;
      font-size: 14px;
    }

    .cell-label {
      font-size: 10px;
      color: #999;
      background: #f5f5f5;
      padding: 1px 6px;
      border-radius: 8px;
    }
  }

  @media (max-width: 768px) {
    .demo-container {
      padding: 10px;
    }

    h2 {
      font-size: 18px;
    }

    h3 {
      font-size: 14px;
    }

    .controls {
      button {
        margin-bottom: 5px;
        font-size: 12px;
        padding: 6px 12px;
      }
    }
  }
</style>
