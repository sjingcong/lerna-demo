<template>
  <div class="list-module">
    <div class="list-header">
      <h3>任务列表</h3>
      <div class="list-controls">
        <button
          @click="addSampleItem"
          class="btn btn-primary"
        >
          添加任务
        </button>
      </div>
    </div>

    <div
      v-if="(moduleData.items || []).length === 0"
      class="empty-state"
    >
      <div class="empty-icon">📝</div>
      <p>暂无任务</p>
    </div>

    <div
      v-else
      class="list-content"
    >
      <div
        v-for="item in moduleData.items"
        :key="item.id"
        class="list-item"
      >
        <div class="item-content">
          <span class="item-name">{{ item.name }}</span>
          <span class="item-id">#{{ item.id }}</span>
        </div>

        <div class="item-actions">
          <button
            @click="removeItem(item.id)"
            class="btn btn-sm btn-danger"
          >
            删除
          </button>
        </div>
      </div>
    </div>

    <div class="list-footer">
      <span class="module-info">
        模块: list | 最后更新: {{ new Date().toLocaleTimeString() }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useModuleData, useEvent } from '../../core';
  import { usePageStore } from '../../examples/store';
  import { ListModuleData } from './config';

  // 使用模块数据 - 现在有精确的类型推断
  const pageStore = usePageStore();
  const { data: moduleData, update } = useModuleData<ListModuleData>(
    pageStore,
    'list'
  );
  // 使用事件系统
  const { emit } = useEvent();

  // 事件处理方法

  const removeItem = (itemId: number) => {
    const currentItems = moduleData.value.items || [];
    const updatedItems = currentItems.filter((item) => item.id !== itemId);

    const newData = {
      items: updatedItems,
    };
    update(newData);
  };

  const addSampleItem = () => {
    const currentItems = moduleData.value.items || [];
    const newItem = {
      id: Date.now(),
      name: `任务 ${currentItems.length + 1}`,
    };
    // 现在可以直接使用push方法修改数据，会自动同步到store
    moduleData.value.items.push(newItem);

    emit('list:item-added', newItem);
  };
</script>

<style scoped>
  .list-module {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background-color: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
  }

  .list-header h3 {
    margin: 0;
    color: #2c3e50;
  }

  .list-controls {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .empty-state {
    text-align: center;
    padding: 40px;
    color: #666;
  }

  .empty-icon {
    font-size: 48px;
    margin-bottom: 10px;
  }

  .list-content {
    padding: 0;
  }

  .list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #f0f0f0;
    transition: background-color 0.2s;
  }

  .list-item:hover {
    background-color: #f8f9fa;
  }

  .list-item:last-child {
    border-bottom: none;
  }

  .item-content {
    flex: 1;
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .item-name {
    font-weight: 600;
    color: #2c3e50;
  }

  .item-id {
    color: #999;
    font-size: 12px;
  }

  .item-actions {
    display: flex;
    gap: 8px;
  }

  .btn {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.3s;
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-sm {
    padding: 4px 8px;
    font-size: 11px;
  }

  .btn-primary {
    background-color: #3498db;
    color: white;
  }

  .btn-primary:hover {
    background-color: #2980b9;
  }

  .btn-danger {
    background-color: #dc3545;
    color: white;
  }

  .btn-danger:hover {
    background-color: #c82333;
  }

  .list-footer {
    padding: 10px 20px;
    background-color: #f8f9fa;
    border-top: 1px solid #e9ecef;
    font-size: 11px;
    color: #666;
    text-align: center;
  }

  @media (max-width: 768px) {
    .list-header {
      flex-direction: column;
      gap: 15px;
    }

    .list-controls {
      width: 100%;
      justify-content: space-between;
    }

    .list-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }

    .item-actions {
      width: 100%;
      justify-content: flex-end;
    }
  }
</style>
