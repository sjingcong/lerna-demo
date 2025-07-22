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
  },
  {
    path: '/excel-demo',
    name: 'ExcelDemo',
    component: () => import('@/views/ExcelViewerDemo.vue')
  },
  {
    path: '/doc-demo',
    name: 'DocDemo',
    component: () => import('@/views/DocViewerDemo.vue')
  },
  {
    path: '/table-demo',
    name: 'TableDemo',
    component: () => import('@/components/MobileTableDemo.vue')
  },
  {
    path: '/plan-book/:id',
    name: 'PlanBook',
    component: () => import('@/views/planBook/ModuleConfig.vue'),
    props: true
  }

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router