import { ref, onMounted } from 'vue';

/**
 * 预加载模块接口定义
 * @interface PreloadModule
 */
interface PreloadModule {
  /** 模块名称，用于日志显示和状态追踪 */
  name: string;
  /** 模块导入函数，返回 Promise 的动态导入 */
  importer: () => Promise<any>;
  /** 延迟加载时间（毫秒），默认 1000ms */
  delay?: number;
}

/**
 * Vue 组件预加载 Hook
 *
 * 🎯 功能说明：
 * - 在组件挂载后自动预加载指定的模块/组件
 * - 提供加载状态和已加载模块的响应式数据
 * - 支持自定义延迟时间，避免影响当前页面性能
 * - 自动错误处理和日志记录
 * - 提升用户体验，减少页面切换等待时间
 *
 * 📖 使用方式：
 * ```typescript
 * // 在组件中使用
 * const { isLoading, loadedModules } = usePreload([
 *   {
 *     name: 'About页面',
 *     importer: () => import('@/views/about/About.vue'),
 *   },
 *   {
 *     name: '用户组件',
 *     importer: () => import('@/components/UserProfile.vue'),
 *     delay: 1000
 *   }
 * ])
 * ```
 *
 * 🔄 返回值：
 * - isLoading: 当前是否有模块正在加载
 * - loadedModules: 已成功加载的模块名称列表
 *
 * ⚡ 最佳实践：
 * 1. 在首页预加载常用页面组件
 * 2. 根据用户行为预测可能访问的页面
 * 3. 设置合理的延迟时间，避免影响当前页面加载
 * 4. 在开发环境可通过 loadedModules 监控预加载效果
 *
 * @param modules 需要预加载的模块配置数组
 * @returns 返回加载状态和已加载模块列表的响应式数据
 */
export function usePreload(modules: PreloadModule[]) {
  /** 当前是否有模块正在加载 */
  const isLoading = ref(false);

  /** 已成功加载的模块名称列表 */
  const loadedModules = ref<string[]>([]);

  /**
   * 开始预加载所有配置的模块
   * 每个模块根据配置的延迟时间异步加载
   */
  const startPreload = () => {
    modules.forEach(({ name, importer, delay = 0 }) => {
      // 使用 setTimeout 实现延迟加载，避免阻塞当前页面
      setTimeout(async () => {
        try {
          isLoading.value = true;
          // 执行动态导入
          await importer();
          // 记录成功加载的模块
          loadedModules.value.push(name);
          console.log(`✅ 预加载完成: ${name}`);
        } catch (error) {
          // 预加载失败不影响主流程，只记录错误
          console.error(`❌ 预加载失败: ${name}`, error);
        } finally {
          isLoading.value = false;
        }
      }, delay);
    });
  };

  // 组件挂载后自动开始预加载
  onMounted(() => {
    startPreload();
  });

  return {
    /** 当前加载状态 */
    isLoading,
    /** 已加载模块列表 */
    loadedModules,
  };
}
