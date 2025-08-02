<template>
  <div class="component-preview-page">
    <div class="preview-header">
      <div class="header-content">
        <button
          @click="goBack"
          class="back-btn"
        >
          ← 返回
        </button>
        <div class="title-section">
          <h1>{{ componentConfig?.componentTitle || '组件预览' }}</h1>
          <p class="description">{{ componentConfig?.description }}</p>
        </div>
      </div>
    </div>

    <div class="preview-content">
      <!-- 组件引用方式模块 -->
      <div class="usage-section">
        <div class="usage-content">
          <div class="usage-item">
            <div
              class="code-block"
              style="height: 20px; min-height: 20px; padding-right: 80px"
            >
              <code>{{ componentConfig?.importDesc }}</code>
              <button
                class="copy-btn"
                @click="copyToClipboard(componentConfig.importDesc)"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <rect
                    x="9"
                    y="9"
                    width="13"
                    height="13"
                    rx="2"
                    ry="2"
                  ></rect>
                  <path
                    d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="preview-layout">
        <!-- 左侧配置面板 -->
        <div class="config-section">
          <div class="config-panel">
            <h3>属性配置</h3>
            <PropertyConfig
              :component-config="componentConfig"
              :config="config"
              @update:config="updateConfig"
            />
          </div>
        </div>

        <!-- 左侧移动端预览 -->
        <div class="mobile-preview">
          <H5Preview
            :component="componentInstance"
            :props="mergedProps"
            :config="componentConfig"
            :show-result="true"
          />
        </div>

        <!-- 右侧代码预览 -->
        <div class="code-preview">
          <pre class="code-block"><code>{{ generatedCode }}</code> <button
            class="copy-btn"
            @click="copyCode"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect
                x="9"
                y="9"
                width="13"
                height="13"
                rx="2"
                ry="2"
              ></rect>
              <path
                d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
              ></path>
            </svg>
          </button></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed, watch, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { message } from 'ant-design-vue';
  import PropertyConfig from '../components/PropertyConfig.vue';
  import H5Preview from '../components/H5Preview.vue';

  const route = useRoute();
  const router = useRouter();

  // 组件配置
  const componentConfig = ref(null);
  const componentInstance = ref(null);
  const config = ref({});
  const modelValue = ref();
  const generatedCode = ref('');

  // 当前组件信息
  const currentComponent = computed(() => {
    return {
      name:
        componentConfig.value?.componentName ||
        route.params.component ||
        'Component',
    };
  });

  // 合并后的属性
  const mergedProps = computed(() => {
    const merged = { ...config.value };
    return merged;
  });

  // 更新配置
  const updateConfig = (newConfig) => {
    const oldMultiple = config.value.multiple;
    config.value = newConfig;

    // 当multiple属性变化时，重置modelValue
    if (oldMultiple !== newConfig.multiple) {
      modelValue.value = newConfig.multiple ? [] : '';
    }
  };

  // 单个属性更新（保留兼容性）
  const updateSingleConfig = (key, value) => {
    config.value[key] = value;

    // 当multiple属性变化时，重置modelValue
    if (key === 'multiple') {
      modelValue.value = value ? [] : '';
    }
  };

  // 处理模型更新
  const handleModelUpdate = (value) => {
    modelValue.value = value;
  };

  // 复制到剪贴板
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      // 这里可以添加成功提示
      message.success('复制成功');
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 生成属性示例
  const generatePropsExample = () => {
    if (!componentConfig.value?.props) return '';

    const examples = [];
    componentConfig.value.props.forEach((prop) => {
      if (prop.name && config.value[prop.name] !== undefined) {
        const value = config.value[prop.name];
        if (typeof value === 'string') {
          examples.push(`${prop.name}="${value}"`);
        } else if (typeof value === 'boolean') {
          if (value) {
            examples.push(prop.name);
          }
        } else {
          examples.push(`:${prop.name}="${JSON.stringify(value)}"`);
        }
      }
    });

    return examples.join(' ');
  };

  // 处理变化事件
  const handleChange = (value) => {};

  // 生成代码
  const generateCode = () => {
    if (!componentConfig.value) return;

    const componentName = componentConfig.value.componentName || 'Component';
    const props = [];

    // 生成属性字符串
    Object.entries(config.value).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (typeof value === 'boolean') {
          if (value) {
            props.push(key);
          }
        } else if (typeof value === 'string') {
          props.push(`${key}="${value}"`);
        } else {
          props.push(`:${key}="${JSON.stringify(value)}"`);
        }
      }
    });

    const propsString = props.length > 0 ? '\n  ' + props.join('\n  ') : '';

    // 生成v-model绑定
    const vModelString = 'v-model="selectedValue"';

    // 只生成组件标签部分
    const template = `<${componentName}
  ${vModelString}${propsString}
  @update:modelValue="handleUpdate"
  @change="handleChange"
/>`;

    generatedCode.value = template;
  };

  // 复制代码
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode.value);
      message.success('复制成功');
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 返回文档
  const goBack = () => {
    router.go(-1);
  };

  // 初始化配置
  const initConfig = () => {
    if (!componentConfig.value?.props) return;

    const initialConfig = {};
    componentConfig.value.props.forEach((prop) => {
      if (prop.default !== undefined) {
        try {
          initialConfig[prop.name] =
            typeof prop.default === 'string' &&
            (prop.type === 'array' || prop.type === 'object')
              ? JSON.parse(prop.default)
              : prop.default;
        } catch {
          initialConfig[prop.name] = prop.default;
        }
      }
    });

    config.value = initialConfig;

    // 初始化模型值
    const multipleDefault = componentConfig.value.props?.find(
      (p) => p.name === 'multiple'
    )?.default;
    modelValue.value = multipleDefault ? [] : '';
  };

  // 加载组件配置
  const loadComponentConfig = async () => {
    const componentName = route.params.component;
    const componentType = route.params.type || 'h5-components'; // 默认为h5-components

    try {
      // 动态导入组件配置
      const propsModule = await import(
        `../../../shared/${componentType}/${componentName}/props.json`
      );
      const previewModule = await import(
        `../../../shared/${componentType}/${componentName}/preview.vue`
      );

      componentConfig.value = propsModule.default;
      componentConfig.value.component = previewModule.default;
      componentInstance.value = previewModule.default;

      initConfig();
    } catch (error) {
      console.error('加载组件配置失败:', error);
    }
  };

  // 监听配置变化
  watch(config, generateCode, { deep: true });

  onMounted(() => {
    loadComponentConfig();
  });
</script>

<style scoped>
  @import 'ant-design-vue/dist/reset.css';
  .component-preview-page {
    min-height: 100vh;
    background: #f8fafc;
  }

  .preview-header {
    background: white;
    border-bottom: 1px solid #e2e8f0;
    padding: 1rem 0;
  }

  .header-content {
    max-width: 1200px;
    padding: 16px;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .back-btn {
    padding: 0.5rem 1rem;
    background: #f1f5f9;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    color: #475569;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
  }

  .back-btn:hover {
    background: #e2e8f0;
  }

  .title-section h1 {
    margin: 0;
    font-size: 1.5rem;
    color: #1e293b;
  }

  .title-section .description {
    margin: 0.25rem 0 0 0;
    color: #64748b;
    font-size: 0.875rem;
  }

  .preview-content {
    padding: 2rem 1rem;
  }

  .usage-section {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
  }

  .usage-section h3 {
    margin: 0 0 1rem 0;
    font-size: 1.1rem;
    color: #1e293b;
  }

  .usage-content {
    display: inline-block;
    padding-right: 40px;
  }

  .usage-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .usage-label {
    font-weight: 500;
    color: #374151;
    font-size: 0.875rem;
  }

  .code-block {
    position: relative;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 0.75rem 3rem 0.75rem 1rem;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.875rem;
    color: #1e293b;
    overflow-x: auto;
  }

  .code-block code {
    background: none;
    padding: 0;
    border: none;
    font-family: inherit;
  }

  .copy-btn {
    position: absolute;
    top: 50%;
    right: 0.75rem;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #64748b;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .copy-btn:hover {
    background: #e2e8f0;
    color: #1e293b;
  }
  .config-section {
    flex: 0 0 600px;
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    overflow-y: auto;
  }

  .config-panel h3 {
    margin: 0 0 1rem 0;
    font-size: 1.1rem;
    color: #1e293b;
  }

  .config-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .config-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .config-label {
    font-weight: 500;
    color: #374151;
    font-size: 0.875rem;
  }

  .config-control {
    gap: 0.25rem;
  }

  /* Ant Design Vue组件会使用自己的样式 */

  .config-description {
    font-size: 0.75rem;
    color: #6b7280;
    margin-top: 0.25rem;
  }

  .preview-section {
    background: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .preview-tabs {
    display: flex;
    border-bottom: 1px solid #e2e8f0;
  }

  .tab-btn {
    padding: 1rem 1.5rem;
    background: none;
    border: none;
    cursor: pointer;
    color: #64748b;
    font-size: 0.875rem;
    transition: all 0.2s;
    border-bottom: 2px solid transparent;
  }

  .tab-btn:hover {
    color: #1e293b;
    background: #f8fafc;
  }

  .tab-btn.active {
    color: #3b82f6;
    border-bottom-color: #3b82f6;
  }

  .preview-layout {
    display: flex;
  }

  .mobile-preview {
    display: flex;
    flex-direction: column;
    margin-left: 20px;
  }

  .desktop-preview {
    padding: 2rem;
  }

  .desktop-container {
    max-width: 600px;
    margin: 0 auto;
  }

  .options-preview {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    max-width: 300px;
  }

  .option-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background: #fafafa;
    border: 1px solid #f1f5f9;
    border-radius: 8px;
    font-size: 0.875rem;
    transition: all 0.2s ease;
  }

  .option-item:hover {
    background: #f1f5f9;
    border-color: #e2e8f0;
  }

  .option-label {
    font-weight: 500;
    color: #374151;
    font-size: 0.9rem;
  }

  .option-value {
    color: #6b7280;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.8rem;
    background: white;
    padding: 0.375rem 0.75rem;
    border-radius: 6px;
    border: 1px solid #e5e7eb;
  }

  .code-preview {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 500px;
    height: 812px;
    background: white;
    border-radius: 16px;
    box-shadow:
      0 10px 25px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
    border: 1px solid #f1f5f9;
    overflow: hidden;
    margin-left: 20px;
  }

  .code-header {
    padding: 1.25rem 1.75rem;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .code-title {
    font-weight: 500;
    color: #1e293b;
  }

  .copy-btn {
    padding: 0.375rem 0.75rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.875rem;
    transition: background 0.2s;
  }

  .copy-btn:hover {
    background: #2563eb;
  }

  .code-block {
    flex: 1;
    margin: 0;
    padding: 1.75rem;
    background: #1e293b;
    color: #e2e8f0;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.875rem;
    line-height: 1.6;
    overflow: auto;
    min-height: 400px;
  }
</style>
