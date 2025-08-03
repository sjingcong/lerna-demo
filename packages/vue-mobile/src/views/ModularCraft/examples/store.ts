import { useStore } from '../core';
import { moduleProcessorMap } from '../modules/processor';

const usePageStore = useStore('example-page', moduleProcessorMap);
export { usePageStore };
