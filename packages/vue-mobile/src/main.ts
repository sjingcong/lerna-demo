import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { useWebVitals } from '@giom/shared';
// 设置rem基准值
function setRem() {
  const baseSize = 37.5; // 基准大小，对应设计稿375px
  const scale = document.documentElement.clientWidth / 375; // 375为设计稿宽度
  document.documentElement.style.fontSize = baseSize * Math.min(scale, 2) + 'px';
}

// 初始化
setRem();
// 改变窗口大小时重新设置
window.addEventListener('resize', setRem);
window.addEventListener('pageshow', function (e) {
  if (e.persisted) {
    setRem();
  }
});
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