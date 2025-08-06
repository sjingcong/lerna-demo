import BannerModule from './banner/index.vue';
import ProductModule from './product-detail/index.vue';
import ClaimProcess from './claim-process/index.vue';
import { TabModule, ListModule } from '../core';

export const modules = [
  {
    id: 'banner',
    component: BannerModule,
  },
  {
    component: TabModule,
    children: [
      {
        id: 'tab1',
        title: 'tab1',
        component: ListModule,
        children: [
          {
            id: 'tab',
            component: ProductModule,
          },
        ],
      },
      {
        title: '商品详情',
        id: 'product-detail',
        component: ProductModule,
      },
      {
        title: '理赔流程',
        id: 'claim-process',
        component: ClaimProcess,
      },
    ],
  },
];
