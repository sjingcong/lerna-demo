import bannerEditor from './banner-editor/config';
import { insurancePlan } from './insurance-plan/config';
import { tabDetail } from './tab-detail/config';

export const moduleProcessorMap = {
  'banner-editor': bannerEditor,
  'insurance-plan': insurancePlan,
  'tab-detail': tabDetail,
  // 可以在这里添加更多模块的处理器
  // 'other-module': otherModule,
};