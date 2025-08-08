import bannerEditor from './banner-editor/config';
import { insurancePlan } from './insurance-plan/config';
import { tabDetail } from './tab-detail/config';
import { otherSettings } from './other-settings/config';

export const moduleProcessorMap = {
  'banner-editor': bannerEditor,
  'insurance-plan': insurancePlan,
  'tab-detail': tabDetail,
  'other-settings': otherSettings,
  // 可以在这里添加更多模块的处理器
  // 'other-module': otherModule,
};