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
    path: '/templatepage',
    name: 'TemplatePage',
    component: () => import('@/views/modules/ModuleConfig.vue')
  },
  {
    path: '/user-list',
    name: 'UserList',
    component: () => import('@/views/user-management/UserList.vue')
  },
  {
    path: '/image-list-demo',
    name: 'ImageListDemo',
    component: () => import('@/views/ImageListDemo.vue')
  },
  {
    path: '/template-management',
    name: 'TemplateManagement',
    component: () => import('@/views/template-management/templateList.vue')
  },
  {
    path: '/page-manager-list',
    name: 'PageManagerList',
    component: () => import('@/views/pageManager/list/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router