<template>
  <div
    class="modular-craft-container"
    :key="renderKey"
  >
    <div
      v-for="module in modules"
      :key="`${module.id}-${renderKey}`"
      :class="[`module-${module.id}`, 'modular-craft-module']"
      :data-module-id="module.id"
    >
      <component
        :is="module.component"
        v-bind="{
          moduleId: module.id,
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import type { Component } from 'vue';

  // 定义接口
  interface ModuleConfig {
    id: string;
    component: Component;
  }

  interface Props {
    modules?: ModuleConfig[];
  }

  // 定义props
  const props = withDefaults(defineProps<Props>(), {
    modules: () => [],
  });

  const renderKey = ref(0);

  /**
   * 强制重新渲染
   */
  const forceUpdate = () => {
    renderKey.value++;
  };

  // 暴露方法给父组件
  defineExpose({
    forceUpdate,
  });
</script>

<style scoped>
  .modular-craft-container {
    width: 100%;
  }

  .modular-craft-module {
    position: relative;
  }
</style>
