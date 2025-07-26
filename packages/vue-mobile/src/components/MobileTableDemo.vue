<template>
  <div class="demo-container">
    <h2>移动端表格组件演示</h2>

    <div class="demo-section">
      <h3>基础表格（支持第一列行合并）</h3>
      <MobileTable :columns="columns" :dataSource="tableData" :mergeFirstColumn="true"  :rowHeight="20">
        <template #category="{ text }">
          <span class="table-cell">{{ text }}</span>
        </template>
        <template #type="{ text }">
          <span class="table-cell">{{ text }}人</span>
        </template>
        <template #price="{ text }">
          <span class="table-cell">{{ text }}人</span>
        </template>
        <template #count="{ text }">
          <span class="table-cell">{{ text }}人</span>
        </template>
      </MobileTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MobileTable from './MobileTable.vue'

// 表格列配置
const columns = ref([
  {
    title: '计划',
    dataIndex: 'category',
    key: 'category',
    // align: 'left',
    // width: "200",
    // fixed: 'left' // 固定在左侧
  },
  // {
  //   title: '分类',
  //   dataIndex: 'type',
  //   width: "auto",
  //   key: 'type'
  // },
  {
    title: '单价',
    dataIndex: 'price',
    width: "auto",
    key: 'price'
  },
  // {
  //   title: '人数',
  //   dataIndex: 'count',
  //   width: "auto",
  //   key: 'count'
  // },
])


// 表格数据
const tableData = ref([
  {
    category: '计划一',
    type: '【30-40】-男-一类职业-有什么呢，我也不知道啊',
    price: 120,
    count: 150,
    remark: '这是一个很长的备注信息，用来测试表格内容不换行的效果'
  },
  {
    category: '计划一',
    type: '【30-46】-男-一类职业-有',
    price: 120,
    count: 150,
    remark: '优先级高'
  },
  {
    category: '计划一',
    type: '【30-40】-男-一类职业-有',
    price: 120,
    count: 150,
    remark: '需要特别关注的项目'
  },
  {
    category: '计划一',
    type: '【30-40】-男-一类职业-有',
    price: 120,
    count: 150,
    remark: '正常'
  },
  {
    category: '计划一',
    type: '【30-40】-男-一类职业-有',
    price: 120,
    count: 150,
    remark: '待确认'
  },
  {
    category: '计划2',
    type: '【30-40】-男-一类职业-有',
    price: 120,
    count: 150,
    remark: '新增项目'
  },
  {
    category: '计划2',
    type: '【30-40】-男-一类职业-有',
    price: 120,
    count: 150,
    remark: '测试数据，包含很多文字内容来验证不换行功能'
  },
  {
    category: '计划2',
    type: '【30-40】-男-一类职业-有',
    price: 120,
    count: 150,
    remark: '已完成'
  },
  {
    category: '计划2',
    type: '【30-40】-男-一类职业-有',
    price: 120,
    count: 150,
    remark: '进行中'
  }
])
</script>

<style scoped>
.demo-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;

  .table-cell {
    white-space: nowrap;
    padding-right: 4px;
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
}
</style>