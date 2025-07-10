<template>
  <div class="list-header">
    <div class="header-left">
      <h2 class="title">{{ title }}</h2>
      <p class="description" v-if="description">{{ description }}</p>
    </div>
    <div class="header-right">
      <slot name="actions">
        <a-button type="primary" @click="handleAdd">
          <template #icon><PlusOutlined /></template>
          新增
        </a-button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PlusOutlined } from '@ant-design/icons-vue';

interface Props {
  title: string;
  description?: string;
}

interface Emits {
  add: [];
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const handleAdd = () => {
  emit('add');
};
</script>

<style scoped>
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.header-left {
  flex: 1;
}

.title {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #262626;
}

.description {
  margin: 0;
  color: #8c8c8c;
  font-size: 14px;
}

.header-right {
  flex-shrink: 0;
}
</style>