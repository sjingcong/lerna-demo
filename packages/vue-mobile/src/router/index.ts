import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/about/About.vue'),
  },
  {
    path: '/pdf-demo',
    name: 'PdfDemo',
    component: () => import('@/views/pdfDemo/PdfDemo.vue'),
  },
  {
    path: '/excel-demo',
    name: 'ExcelDemo',
    component: () => import('@/views/ExcelViewerDemo.vue'),
  },
  {
    path: '/doc-demo',
    name: 'DocDemo',
    component: () => import('@/views/DocViewerDemo.vue'),
  },
  {
    path: '/table-demo',
    name: 'TableDemo',
    component: () => import('@/views/MobileTableDemo.vue'),
  },
  {
    path: '/plan-book/:id',
    name: 'PlanBook',
    component: () => import('@/views/planBook/ModuleConfig.vue'),
    props: true,
  },
  {
    path: '/area-selector-demo',
    name: 'AreaSelectorDemo',
    component: () => import('@/views/AreaSelectorDemo.vue'),
  },
  {
    path: '/icon-demo',
    name: 'IconDemo',
    component: () => import('@/views/IconImageDemo.vue'),
  },
  {
    path: '/orderList',
    name: 'orderList',
    component: () => import('@/views/OrderList/index.vue'),
  },
  {
    path: '/signature',
    name: 'Signature',
    component: () => import('@/views/Signature/index.vue'),
  },
  {
    path: '/protection',
    name: 'Protection',
    component: () => import('@/views/Protection/index.vue'),
  },
  {
    path: '/select-demo',
    name: 'SelectDemo',
    component: () => import('@/views/Form/Field/Select/demo.vue'),
  },
  {
    path: '/modular-craft',
    name: 'ModularCraft',
    component: () => import('@/views/ModularCraft/page.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
