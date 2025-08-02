<template>
  <div class="component-preview-page">
    <div class="preview-header">
      <div class="header-content">
        <button
          @click="goBack"
          class="back-btn"
        >
          ← 返回文档
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
            <div class="config-form">
              <div
                v-for="prop in visibleProps"
                :key="prop.name"
                class="config-item"
              >
                <label class="config-label">{{ prop.title }}</label>
                <div class="config-control">
                  <!-- Switch控件 -->
                  <a-switch
                    v-if="prop.control === 'switch'"
                    :checked="config[prop.name]"
                    @change="(checked) => updateConfig(prop.name, checked)"
                  />

                  <!-- Radio控件 -->
                  <a-radio-group
                    v-else-if="prop.control === 'radio'"
                    :value="config[prop.name]"
                    @change="(e) => updateConfig(prop.name, e.target.value)"
                  >
                    <a-radio
                      v-for="option in prop.options"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </a-radio>
                  </a-radio-group>

                  <!-- Select控件 -->
                  <a-select
                    v-else-if="prop.control === 'select'"
                    :value="config[prop.name]"
                    @change="(value) => updateConfig(prop.name, value)"
                    style="width: 100%"
                  >
                    <a-select-option
                      v-for="option in prop.options"
                      :key="option.value"
                      :value="option.value"
                    >
                      {{ option.label }}
                    </a-select-option>
                  </a-select>

                  <!-- Input控件 -->
                  <a-input-number
                    v-if="prop.control === 'input' && prop.type === 'number'"
                    :value="config[prop.name]"
                    @change="(value) => updateConfig(prop.name, value)"
                    style="width: 100%"
                  />
                  <a-input
                    v-else-if="prop.control === 'input'"
                    :value="config[prop.name]"
                    @input="(e) => updateConfig(prop.name, e.target.value)"
                  />
                </div>
                <div
                  v-if="prop.description"
                  class="config-description"
                >
                  {{ prop.description }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 左侧移动端预览 -->
        <div class="mobile-preview">
          <div class="mobile-frame">
            <div class="mobile-screen">
              <component
                :is="componentInstance"
                v-bind="mergedProps"
                v-model="modelValue"
                @update:modelValue="handleModelUpdate"
                @change="handleChange"
                v-if="componentInstance"
              />

              <!-- 交互结果显示 -->
              <div class="interaction-result">
                <div class="result-item">
                  <span class="label">当前值:</span>
                  <span class="value">{{ displayValue }}</span>
                </div>
              </div>
            </div>
          </div>
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
  import {
    Switch as ASwitch,
    RadioGroup as ARadioGroup,
    Radio as ARadio,
    Select as ASelect,
    SelectOption as ASelectOption,
    Input as AInput,
    InputNumber as AInputNumber,
    message,
  } from 'ant-design-vue';

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

  // 示例数据
  const sampleData = ref({
    options: [
      { label: '选项1', value: 'option1' },
      { label: '选项2', value: 'option2' },
      { label: '选项3', value: 'option3' },
    ],
  });

  // 可见属性
  const visibleProps = computed(() => {
    if (!componentConfig.value?.props) return [];

    return componentConfig.value.props.filter((prop) => {
      if (!prop.dependsOn) return true;

      return Object.entries(prop.dependsOn).every(([key, value]) => {
        return config.value[key] === value;
      });
    });
  });

  // 合并后的属性
  const mergedProps = computed(() => {
    const merged = { ...config.value };

    // 合并示例数据
    Object.keys(sampleData.value).forEach((key) => {
      if (merged[key] === undefined) {
        merged[key] = sampleData.value[key];
      }
    });

    return merged;
  });

  // 显示值
  const displayValue = computed(() => {
    if (modelValue.value === undefined || modelValue.value === null) {
      return '未选择';
    }
    if (Array.isArray(modelValue.value)) {
      return modelValue.value.length > 0
        ? JSON.stringify(modelValue.value)
        : '[]';
    }
    return modelValue.value;
  });

  // 更新配置
  const updateConfig = (key, value) => {
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

    try {
      // 动态导入组件配置
      const propsModule = await import(
        `../../../shared/h5-components/${componentName}/props.json`
      );
      const previewModule = await import(
        `../../../shared/h5-components/${componentName}/preview.vue`
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
    background: white;
    width: 400px;
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

  .preview-header {
    padding: 0;
    margin-bottom: 0.5rem;
  }

  .preview-header h4 {
    margin: 0;
    font-size: 1.125rem;
    color: #1e293b;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .mobile-frame {
    width: 375px;
    margin: 0 auto;
    background: white;
    border-radius: 16px;
    box-shadow:
      0 10px 25px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    border: 1px solid #f1f5f9;
  }

  .mobile-screen {
    height: 812px;
    background: #fafafa;
  }

  .desktop-preview {
    padding: 2rem;
  }

  .desktop-container {
    max-width: 600px;
    margin: 0 auto;
  }

  .interaction-result {
    margin: 1.5rem;
    padding: 1.5rem;
    background: white;
    border-radius: 12px;
    border: 1px solid #f1f5f9;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  }

  .result-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
    padding: 0.5rem 0;
  }

  .result-item:last-child {
    margin-bottom: 0;
  }

  .result-item.options-result {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 0.75rem 0;
  }

  .label {
    font-weight: 500;
    color: #64748b;
    font-size: 0.875rem;
  }

  .value {
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.875rem;
    color: #1e293b;
    background: white;
    padding: 0.25rem 0.5rem;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
