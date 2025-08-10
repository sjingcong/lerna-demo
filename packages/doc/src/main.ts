import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import 'vant/lib/index.css';
import './style.css';
import 'highlight.js/styles/github.css';
import '@giom/shared/performance/webVitals';

// 路由配置
const routes = [
  {
    path: '/',
    name: 'ToolDoc',
    component: () => import('./views/ToolDoc.vue'),
  },
  {
    path: '/overall',
    name: 'Overall',
    component: () => import('./views/overall/index.vue'),
  },
  {
    path: '/h5overall',
    name: 'H5Overall',
    component: () => import('./views/h5overall/index.vue'),
  },
  {
    path: '/h5Field',
    name: 'H5Field',
    component: () => import('./views/h5Field/index.vue'),
  },
  {
    path: '/tools/:category/:tool',
    name: 'ToolDetail',
    component: () => import('./views/ToolDoc.vue'),
  },
  {
    path: '/tools/:category/:subcategory/:tool',
    name: 'ToolDetailWithSubcategory',
    component: () => import('./views/ToolDoc.vue'),
  },
  {
    path: '/preview/:type/:component',
    name: 'ComponentPreview',
    component: () => import('./views/ComponentPreview.vue'),
  },
  {
    path: '/preview/cert',
    name: 'cert',
    component: () => import('../../shared/h5-field/CertField/example.vue'),
  },
  {
    path: '/modular-craft',
    name: 'ModularCraftDoc',
    component: () => import('./views/modular-craft-doc/index.mdx'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
const app = createApp(App);
app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith('mdx-');
app.use(router);
app.mount('#app');
