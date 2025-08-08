import { defineStore, storeToRefs } from 'pinia';
import { ref, reactive, computed, toRef, Ref, inject } from 'vue';
import VueScrollTo from 'vue-scrollto';

// 模块数据类型定义
type ModuleData = Record<string, any>;
type ModuleDataProcessor = {
  defaultValue: ModuleData;
  processor: (globalData: any, updateData: (newData: any) => void) => void;
};

/**
 * 创建Store实例的工厂函数 - 支持在不同页面创建独立的状态实例
 * Pinia 内部会自动管理 store 实例，相同 storeId 会返回同一个实例
 */
export const useStore = (
  storeId: string,
  moduleConfigs: Record<string, ModuleDataProcessor>
) => {
  let defaultValue: Record<string, any> = {};
  Object.keys(moduleConfigs).forEach((key) => {
    defaultValue[key] = moduleConfigs[key].defaultValue;
  });
  return defineStore(storeId, () => {
    // 响应式状态
    const moduleData = reactive<Record<string, any>>(defaultValue);
    const commonData = ref<any>({});
    const isLoading = ref<boolean>(false);
    const loadingCount = ref<number>(0);

    /**
     * 处理所有模块数据
     */
    const processAllModules = (data: any) => {
      for (const [moduleName] of Object.entries(moduleConfigs)) {
        processModuleData(moduleName, data);
      }
    };

    /**
     * 处理单个模块数据
     */
    const processModuleData = (moduleName: string, data: any) => {
      const config = moduleConfigs[moduleName];
      if (!config) {
        console.warn(`Module processor not found: ${moduleName}`);
        return;
      }

      try {
        // 清空之前的数据
        moduleData[moduleName] = {} as any;

        // 创建更新函数
        const updateData = (newData: any) => {
          if (!moduleData[moduleName]) {
            moduleData[moduleName] = {} as any;
          }
          // 使用对象展开语法保持响应式
          moduleData[moduleName] = {
            ...moduleData[moduleName],
            ...newData,
          };
        };

        // 执行处理器
        config.processor(data, updateData);
      } catch (error) {
        console.error(`Failed to process module data: ${moduleName}`, error);
      }
    };

    /**
     * 设置模块数据（完全替换）
     */
    const setModuleData = (moduleName: string, data: any) => {
      moduleData[moduleName] = data;
    };

    /**
     * 更新模块数据（合并更新）
     */
    const updateModuleData = (moduleName: string, data: any) => {
      if (!moduleData[moduleName]) {
        moduleData[moduleName] = {} as any;
      }
      // 使用对象展开语法保持响应式
      moduleData[moduleName] = {
        ...moduleData[moduleName],
        ...data,
      };
    };

    /**
     * 设置公共数据
     */
    const setCommonData = (data: any) => {
      commonData.value = data;
    };

    /**
     * 开始loading
     */
    const startLoading = () => {
      loadingCount.value++;
      isLoading.value = true;
    };

    /**
     * 停止loading
     */
    const stopLoading = () => {
      if (loadingCount.value > 0) {
        loadingCount.value--;
      }
      isLoading.value = loadingCount.value > 0;
    };

    /**
     * 强制停止所有loading
     */
    const forceStopLoading = () => {
      loadingCount.value = 0;
      isLoading.value = false;
    };

    /**
     * 更新公共数据
     */
    const updateCommonData = (data: any) => {
      commonData.value = {
        ...commonData.value,
        ...data,
      };
    };

    return {
      // 状态
      moduleData,
      commonData,
      isLoading,

      // 方法
      processAllModules,
      setModuleData,
      setCommonData,
      updateModuleData,
      updateCommonData,

      // 模块方法

      startLoading,
      stopLoading,
      forceStopLoading,
    };
  });
};

/**
 * 使用模块数据
 */
export function useModuleData<T>(
  store: ReturnType<ReturnType<typeof useStore>>,
  moduleName: string
) {
  return {
    // 数据 - 直接返回响应式对象，无需.value访问
    data: toRef(store.moduleData, moduleName as string) as Ref<T>,

    update(data: Partial<T>) {
      store.updateModuleData(moduleName as string, data);
    },
  };
}

// Store注入的key
export const CRAFT_STORE_KEY = Symbol('craft-store');

/**
 * 使用模块Store - 通过inject获取store实例
 * 必须在CraftConfig组件的作用域内使用
 */
export function useModuleStore<T>(moduleId: string) {
  const store = inject(CRAFT_STORE_KEY);

  if (!store) {
    throw new Error('useModuleStore must be used within CraftConfig component');
  }

  const { data, update } = useModuleData<T>(store as any, moduleId);

  return {
    data,
    update,
  };
}

export type IStore = ReturnType<ReturnType<typeof useStore>>;
export function useCommonData() {
  const store = inject<IStore>(CRAFT_STORE_KEY);

  if (!store) {
    throw new Error('useCommonData must be used within CraftConfig component');
  }

  return store.commonData;
}

// 导出类型
export type { ModuleData, ModuleDataProcessor };
