import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/home/Home.vue')
  },
  {
    path: '/List',
    name: 'List',
    component: () => import('@/views/list/List.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/about/About.vue')
  },
  {
    path: '/template-demo',
    name: 'TemplateDemo',
    component: () => import('@/views/modules/ModuleConfig.vue')
  },
  {
    path: '/image-list-demo',
    name: 'ImageListDemo',
    component: () => import('@/views/ImageListDemo.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router