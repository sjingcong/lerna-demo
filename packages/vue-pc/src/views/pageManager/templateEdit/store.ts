import { useModuleData, useStore } from '@giom/shared/modular-craft';
import { moduleProcessorMap } from './modules/processor';

const usePageStore = useStore('template-page', moduleProcessorMap);
export { usePageStore };

const useModuleStore = <T>(moduleId: string) => {
  const pageStore = usePageStore();
  // 使用模块数据 - 现在有精确的类型推断
  const { data, update } = useModuleData<T>(pageStore, moduleId);
  return {
    data,
    update,
  };
};
export { useModuleStore };