import { defineStore, storeToRefs } from 'pinia';
import { ref, reactive, computed, toRef, Ref } from 'vue';

// 模块数据类型定义
type ModuleData = Record<string, any>;
type ModuleConfigItem = {
  defaultValue: ModuleData;
  processor: (globalData: any, updateData: (newData: any) => void) => void;
};

/**
 * 创建Store实例的工厂函数 - 支持在不同页面创建独立的状态实例
 * Pinia 内部会自动管理 store 实例，相同 storeId 会返回同一个实例
 */
export const useStore = (
  storeId: string,
  moduleConfigs: Record<string, ModuleConfigItem>
) => {
  let defaultValue: Record<string, any> = {};
  Object.keys(moduleConfigs).forEach((key) => {
    defaultValue[key] = moduleConfigs[key].defaultValue;
  });
  return defineStore(storeId, () => {
    // 响应式状态
    const globalData = ref<any>({});
    const moduleData = reactive<Record<string, any>>(defaultValue);

    // 数据访问器 (getters)
    const getModuleData = (moduleName: string) => {
      return moduleData[moduleName] || ({} as any);
    };

    // 方法 (actions)
    /**
     * 设置全局数据
     */
    const setGlobalData = (data: any) => {
      globalData.value = data;
      // 重新处理所有已注册的模块数据
      processAllModules();
    };

    /**
     * 处理所有模块数据
     */
    const processAllModules = () => {
      for (const [moduleName] of Object.entries(moduleConfigs)) {
        processModuleData(moduleName);
      }
    };

    /**
     * 处理单个模块数据
     */
    const processModuleData = (moduleName: string) => {
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
        config.processor(globalData.value, updateData);
      } catch (error) {
        console.error(`Failed to process module data: ${moduleName}`, error);
      }
    };

    /**
     * 更新模块数据
     */
    const updateModuleData = (moduleName: string, data: any) => {
      debugger;
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
     * 清空模块数据
     */
    const clearModuleData = (moduleName: string) => {
      delete moduleData[moduleName];
    };

    // 方法
    const refresh = (moduleName: string) => {
      processModuleData(moduleName as string);
    };

    const update = (moduleName: string, data: any) => {
      updateModuleData(moduleName as string, data);
    };

    const clear = (moduleName: string) => {
      clearModuleData(moduleName as string);
    };

    /**
     * 清空所有数据
     */
    const clearAllData = () => {
      globalData.value = {};
      Object.keys(moduleData).forEach((key) => delete moduleData[key]);
    };

    /**
     * 获取所有已注册的模块名称
     */
    const getRegisteredModules = (): string[] => {
      return Object.keys(moduleConfigs);
    };

    return {
      // 状态
      globalData,
      moduleData,
      // 计算属性
      getModuleData,
      // 方法
      setGlobalData,
      processAllModules,
      processModuleData,
      updateModuleData,
      clearModuleData,
      refresh,
      update,
      clear,
      clearAllData,
      getRegisteredModules,
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

    // 方法
    refresh() {
      store.processModuleData(moduleName as string);
    },

    update(data: any) {
      store.updateModuleData(moduleName as string, data);
    },

    clear() {
      store.clearModuleData(moduleName as string);
    },
  };
}

// 导出类型
export type { ModuleData, ModuleConfigItem as ModuleDataProcessor };
