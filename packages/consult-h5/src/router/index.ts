import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/chat'
  },
  {
    path: '/chat',
    name: 'Chat',
    component: () => import('../views/ChatView.vue')
  },
  {
    path: '/process/:id',
    name: 'ProcessDetail',
    component: () => import('../views/ProcessDetailView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router