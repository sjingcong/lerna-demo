import BannerEditorModule from './banner-editor/index.vue';
import InsurancePlanModule from './insurance-plan/index.vue';
import TabDetailModule from './tab-detail/index.vue';
import OtherSettingsModule from './other-settings/index.vue';

export const modules = [
  {
    id: 'banner-editor',
    component: BannerEditorModule,
  },
  {
    id: 'insurance-plan',
    component: InsurancePlanModule,
  },
  {
    id: 'tab-detail',
    component: TabDetailModule,
  },
  {
    id: 'other-settings',
    component: OtherSettingsModule,
  },
  // 可以在这里添加更多模块
  // {
  //   id: 'other-module',
  //   component: OtherModule,
  // },
];

// 导出所有模块
export {
  BannerEditorModule,
  InsurancePlanModule,
  TabDetailModule,
  OtherSettingsModule
};