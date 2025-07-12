import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import  '@giom/shared/performance/webVitals';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);


// 应用挂载后开始监控
app.mount('#app');

// 导入 Vant 样式
import 'vant/lib/index.css';