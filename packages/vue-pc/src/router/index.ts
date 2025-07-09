import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/list/List.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/about/About.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router