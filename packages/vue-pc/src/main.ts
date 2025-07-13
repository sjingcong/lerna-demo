import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { store } from './store'
import  '@giom/shared/performance/webVitals';

const app = createApp(App);


app.use(store);
app.use(router);


// 应用挂载后开始监控
app.mount('#app');
