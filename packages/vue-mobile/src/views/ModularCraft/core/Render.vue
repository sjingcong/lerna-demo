<template>
  <component
    :is="moduleData.component"
    :moduleId="moduleData.id"
    :module-data="moduleData"
  />
</template>

<script setup lang="ts">
  import { defineProps } from 'vue';

  interface ModuleData {
    id?: string;
    component: any;
    children?: ModuleData[];
    [key: string]: any;
  }

  defineProps<{
    moduleData: ModuleData;
  }>();
</script>
