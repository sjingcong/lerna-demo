<template>
  <div class="mobile-table-wrapper">
    <vxe-table
      ref="tableRef"
      :data="data"
      headerRowClassName="header-row"
      :show-header="showHeader"
      :border="border"
      :stripe="stripe"
      :height="height"
      :max-height="maxHeight"
      :span-method="mergeFirstColumn ? spanMethod : undefined"
      class="mobile-table"
      :row-config="{ height: rowHeight }"
      v-bind="attrs"
    >
      <vxe-column
        v-for="column in columns"
        :key="column.key"
        :field="column.dataIndex"
        :title="column.title"
        :width="column.width"
        :align="column.align || 'center'"
        :fixed="column.fixed"
      >
        <template #default="{ row, rowIndex }">
          <slot
            v-if="$slots[column.key]"
            :name="column.key"
            :record="row"
            :text="row[column.dataIndex]"
            :index="rowIndex"
          />
          <slot
            v-else-if="$slots['defaultcolumn']"
            name="defaultcolumn"
            :record="row"
            :text="row[column.dataIndex]"
            :index="rowIndex"
          />
          <span v-else>{{ row[column.dataIndex] }}</span>
        </template>
      </vxe-column>
    </vxe-table>
  </div>
</template>

<script setup lang="ts">
  import { ref, defineProps, defineSlots, useAttrs } from 'vue';
  import { VxeTable, VxeColumn, VxeTableProps } from 'vxe-table';

  // 禁用自动继承属性到根元素
  defineOptions({
    inheritAttrs: false,
  });

  interface Column {
    title: string;
    dataIndex: string;
    key: string;
    width?: string | number;
    align?: 'left' | 'center' | 'right';
    fixed?: 'left' | 'right';
  }

  interface TableProps extends Partial<VxeTableProps> {
    columns: Column[];
    showHeader?: boolean;
    mergeFirstColumn?: boolean;
    rowHeight?: number;
  }

  const props = withDefaults(defineProps<TableProps>(), {
    showHeader: true,
    mergeFirstColumn: true,
    rowHeight: 50,
    border: true,
    stripe: false,
  });

  // 获取所有传递给组件的属性（除了已定义的props）
  const attrs = useAttrs();

  defineSlots<{
    [key: string]: (props: { record: any; text: any; index: number }) => any;
  }>();

  const tableRef = ref<InstanceType<typeof VxeTable>>();

  // vxe-table的行合并方法
  const spanMethod = ({ row, rowIndex, column, columnIndex }: any) => {
    if (!props.mergeFirstColumn || columnIndex !== 0) {
      return;
    }

    const firstColumnKey = props.columns[0]?.dataIndex;
    if (!firstColumnKey) return;

    const currentValue = row[firstColumnKey];
    let rowspan = 1;
    let colspan = 1;

    // 向下查找相同值的行数
    for (let i = rowIndex + 1; i < (props.data || []).length; i++) {
      if ((props.data || [])[i][firstColumnKey] === currentValue) {
        rowspan++;
      } else {
        break;
      }
    }

    // 向上查找是否有相同值（如果有，则当前行应该被隐藏）
    for (let i = rowIndex - 1; i >= 0; i--) {
      if ((props.data || [])[i][firstColumnKey] === currentValue) {
        // 当前行应该被隐藏
        return { rowspan: 0, colspan: 0 };
      } else {
        break;
      }
    }

    return { rowspan, colspan };
  };
</script>

<style scoped lang="less">
  .mobile-table-wrapper {
    width: 100%;
    border-radius: 6px;
    overflow: hidden;
    background: #fff;
  }

  .mobile-table {
    width: 100%;
    font-size: 14px;
  }

  /* 覆盖vxe-table默认样式 */
  :deep(.vxe-table) {
    border: 1px solid #e8e8e8;
    border-radius: 6px;
  }

  :deep(.vxe-header--column) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    font-weight: 600;
    color: #ffffff !important;
    padding: 12px 8px;
    font-size: 14px;
    border-right: 1px solid rgba(255, 255, 255, 0.2);
  }

  :deep(.vxe-body--column) {
    padding: 12px 8px;
    color: #595959;
    font-size: 14px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :deep(.vxe-table .vxe-header--row .vxe-header--column) {
    padding: 4px 8px;
  }

  :deep(.vxe-table .vxe-header--row .vxe-header--column .vxe-cell) {
    min-height: 20px !important;
    height: 30px !important;
  }
</style>
