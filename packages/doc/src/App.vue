<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view />
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ConfigProvider } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import 'dayjs/locale/zh-cn';

// 设置中文语言包
const locale = zhCN;
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-container {
  flex: 1;
  display: flex;
}

.content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.content.with-sidebar {
  margin-left: 280px;
}

@media (max-width: 768px) {
  .content.with-sidebar {
    margin-left: 0;
  }
}
</style>