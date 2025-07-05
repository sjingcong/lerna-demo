import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { useWebVitals } from './composables/useWebVitals';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// 全局性能监控
const { initWebVitals } = useWebVitals();

// 应用挂载后开始监控
app.mount('#app');

// 延迟初始化，确保应用完全加载
setTimeout(() => {
  initWebVitals();
}, 100);
// 导入 Vant 样式
import 'vant/lib/index.css';