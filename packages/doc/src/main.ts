import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'
import 'highlight.js/styles/github.css'
import  '@giom/shared/performance/webVitals';

// 路由配置
const routes = [
  {
    path: '/',
    name: 'ToolDoc',
    component: () => import('./views/ToolDoc.vue')
  },
  {
    path: '/tools/:category/:tool',
    name: 'ToolDetail',
    component: () => import('./views/ToolDoc.vue')
  },
  {
    path: '/tools/:category/:subcategory/:tool',
    name: 'ToolDetailWithSubcategory',
    component: () => import('./views/ToolDoc.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
const app = createApp(App)
app.config.compilerOptions.isCustomElement = tag => tag.startsWith('mdx-')
app.use(router)
app.mount('#app')