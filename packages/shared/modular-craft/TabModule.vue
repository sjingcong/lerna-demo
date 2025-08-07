<template>
  <div
    class="tab-module"
    :id="moduleId"
  >
    <van-tabs
      v-model:active="activeTab"
      scrollspy
      sticky
      @change="onTabChange"
    >
      <van-tab
        v-for="(tab, index) in moduleData.children"
        :key="tab.id"
        :title="tab.title"
      >
        <div class="tab-content">
          <Render :module-data="tab" />
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup lang="ts">
  import { ref, defineProps, defineEmits, computed } from 'vue';
  import Render from './Render.vue';
  import { useEvent } from './useEvent';

  interface ModuleData {
    id: string;
    component: any;
    children?: ModuleData[];
    title?: string;
    [key: string]: any;
  }

  const props = defineProps<{
    moduleId: string;
    moduleData: ModuleData;
  }>();

  const emit = defineEmits<{
    tabChange: [index: number, title: string];
  }>();

  const activeTab = ref(0);
  const { scrollTo } = useEvent();

  // 计算属性获取tabs
  const tabs = computed(() => props.moduleData.children || []);

  // 事件处理
  const onTabChange = (index: string | number) => {
    const tabIndex = typeof index === 'string' ? parseInt(index) : index;
    // 更新moduleData中的activeTab
    activeTab.value = tabIndex;
    const currentTab = tabs.value[tabIndex];
    if (currentTab) {
      // 滚动到对应的模块
      if (currentTab.id) {
        scrollTo(currentTab.id);
      }
    }
  };
</script>

<style scoped>
  .tab-module {
    width: 100%;
  }

  .tab-content {
    padding: 16px 0;
  }
</style>
