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
];
