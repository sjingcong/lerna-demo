import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: '/about',
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/about/About.vue')
  },
  {
    path: '/pdf-demo',
    name: 'PdfDemo',
    component: () => import('@/views/pdfDemo/PdfDemo.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router