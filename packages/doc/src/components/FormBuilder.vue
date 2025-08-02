<template>
  <div class="form-builder">
    <!-- 表单构建器标题 -->
    <div class="builder-header">
      <div class="title-section">
        <Icon
          icon="mdi:form-select"
          class="title-icon"
        />
        <h2>表单构建器</h2>
      </div>
      <p class="description">选择需要的Field组件，快速生成完整的表单代码</p>
    </div>

    <!-- 左右布局容器 -->
    <div class="builder-content">
      <!-- 左侧：Field选择器 -->
      <div class="left-panel">
        <div class="field-selector">
          <div class="selector-header">
            <h3>选择Field组件</h3>
            <div class="selector-actions">
              <a-button
                size="small"
                @click="selectAllFields"
              >
                全选
              </a-button>
              <a-button
                size="small"
                @click="clearAllFields"
              >
                清空
              </a-button>
            </div>
          </div>

          <a-checkbox-group
            v-model:value="selectedFields"
            class="field-list"
          >
            <div
              v-for="component in components"
              :key="component.name"
              class="field-item"
            >
              <div class="field-content">
                <a-checkbox
                  :value="component.name"
                  class="field-checkbox"
                >
                  <div class="field-info">
                    <span class="field-name">
                      {{ component.config?.componentTitle || component.name }}
                    </span>
                    <span
                      v-if="component.config?.description"
                      class="field-description"
                    >
                      {{ component.config.description }}
                    </span>
                  </div>
                </a-checkbox>

                <!-- 组件预览 -->
                <div class="component-preview">
                  <QuickPreview
                    :component="component.component"
                    :config="component.config"
                    size="small"
                    :is-h5="true"
                  />
                </div>

                <!-- 操作按钮 -->
                <div class="field-actions">
                  <a-button
                    size="small"
                    type="link"
                    @click="openDetailPreview(component.name)"
                    class="detail-btn"
                  >
                    <Icon icon="mdi:eye" />
                    详细配置
                  </a-button>
                  <a-button
                    v-if="selectedFields.includes(component.name)"
                    size="small"
                    type="primary"
                    @click="openFieldConfig(component.name)"
                    class="config-btn"
                  >
                    定制
                  </a-button>
                </div>
              </div>
            </div>
          </a-checkbox-group>
        </div>
      </div>

      <!-- 右侧：代码预览和表单预览 -->
      <div class="right-panel">
        <!-- 生成的表单代码 -->
        <div
          v-if="selectedFields.length > 0"
          class="code-section"
        >
          <div class="code-header">
            <h3>生成的表单代码</h3>
            <a-button
              type="primary"
              size="small"
              @click="copyFormCode"
            >
              <Icon icon="mdi:content-copy" />
              复制代码
            </a-button>
          </div>

          <div class="code-preview">
            <pre><code>{{ generatedFormCode }}</code></pre>
          </div>
        </div>

        <!-- 表单预览 -->
        <div
          v-if="selectedFields.length > 0"
          class="form-preview"
        >
          <div class="preview-header">
            <h3>表单预览</h3>
          </div>

          <div class="preview-container">
            <div class="h5-preview">
              <div class="mobile-frame">
                <div class="mobile-screen">
                  <div class="component-display">
                    <VanForm
                      ref="previewFormRef"
                      class="preview-form"
                    >
                      <component
                        v-for="fieldName in selectedFields"
                        :key="fieldName"
                        :is="getComponentByName(fieldName)?.component"
                        v-model="formData[fieldName]"
                        v-bind="getDefaultProps(fieldName)"
                        @update:modelValue="
                          (value) => updateFormData(fieldName, value)
                        "
                      />
                    </VanForm>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div
          v-if="selectedFields.length === 0"
          class="empty-state"
        >
          <div class="empty-icon">📝</div>
          <h3>请选择Field组件</h3>
          <p>选择左侧的Field组件来构建您的表单</p>
        </div>
      </div>
    </div>

    <!-- 功能定制弹框 -->
    <a-modal
      v-model:open="showConfigDialog"
      title="功能定制"
      :footer="null"
      width="800px"
      :style="{ top: '20px' }"
    >
      <div class="config-dialog">
        <div class="dialog-content">
          <div
            v-if="selectedConfigField"
            class="config-section"
          >
            <h4>
              {{
                getComponentByName(selectedConfigField)?.config
                  ?.componentTitle || selectedConfigField
              }}
            </h4>
            <PropertyConfig
              :component-config="
                getComponentByName(selectedConfigField)?.config
              "
              :config="fieldConfigs[selectedConfigField] || {}"
              @update:config="
                (config) => updateFieldConfig(selectedConfigField, config)
              "
            />
          </div>

          <div
            v-else
            class="select-field-hint"
          >
            <p>请先选择一个Field组件进行配置</p>
            <div class="field-selector-mini">
              <a-button
                v-for="fieldName in selectedFields"
                :key="fieldName"
                size="small"
                :type="
                  selectedConfigField === fieldName ? 'primary' : 'default'
                "
                @click="selectedConfigField = fieldName"
                class="field-btn"
              >
                {{
                  getComponentByName(fieldName)?.config?.componentTitle ||
                  fieldName
                }}
              </a-button>
            </div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import { Icon } from '@iconify/vue';
  import {
    Form as AForm,
    FormItem as AFormItem,
    Checkbox as ACheckbox,
    CheckboxGroup as ACheckboxGroup,
    Button as AButton,
    Modal as AModal,
  } from 'ant-design-vue';
  import PropertyConfig from './PropertyConfig.vue';
  import QuickPreview from './QuickPreview.vue';
  import { Form as VanForm } from 'vant';
  import type { Component } from 'vue';
  import { useRouter } from 'vue-router';

  interface ComponentData {
    name: string;
    component: Component | null;
    config: any;
  }

  // Props
  interface Props {
    components: ComponentData[];
  }

  const router = useRouter();

  const props = defineProps<Props>();

  // 响应式数据
  const selectedFields = ref<string[]>([]);
  const formData = ref<Record<string, any>>({});
  const previewFormRef = ref();

  // 功能定制相关
  const showConfigDialog = ref(false);
  const selectedConfigField = ref<string>('');
  const fieldConfigs = ref<Record<string, Record<string, any>>>({});

  // 表单构建器相关方法
  const selectAllFields = () => {
    selectedFields.value = props.components.map((c) => c.name);
  };

  const clearAllFields = () => {
    selectedFields.value = [];
  };

  const getComponentByName = (name: string) => {
    return props.components.find((c) => c.name === name);
  };

  const getDefaultProps = (fieldName: string) => {
    const component = getComponentByName(fieldName);
    if (!component?.config?.props) return {};

    const defaultProps: Record<string, any> = {};
    component.config.props.forEach((prop: any) => {
      if (prop.default !== undefined) {
        defaultProps[prop.name] = prop.default;
      }
    });

    // 合并用户自定义配置
    const userConfig = fieldConfigs.value[fieldName] || {};
    return { ...defaultProps, ...userConfig };
  };

  const updateFormData = (fieldName: string, value: any) => {
    formData.value[fieldName] = value;
  };

  // 功能定制相关方法
  const openFieldConfig = (fieldName: string) => {
    selectedConfigField.value = fieldName;
    showConfigDialog.value = true;
  };

  const closePropertyConfig = () => {
    showConfigDialog.value = false;
    selectedConfigField.value = '';
  };

  const updateFieldConfig = (
    fieldName: string,
    config: Record<string, any>
  ) => {
    fieldConfigs.value[fieldName] = config;
  };

  // 生成表单代码的计算属性
  const generatedFormCode = computed(() => {
    if (selectedFields.value.length === 0) return '';

    const formFields = selectedFields.value
      .map((fieldName) => {
        const component = getComponentByName(fieldName);
        const componentName = fieldName; // 使用英文组件名
        const defaultProps = getDefaultProps(fieldName);

        // 生成属性字符串
        const props = [];
        Object.entries(defaultProps).forEach(([key, value]) => {
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

        const propsString =
          props.length > 0 ? '\n    ' + props.join('\n    ') : '';
        const modelName = fieldName.toLowerCase().replace(/field$/i, '');

        return `  <${componentName}
    v-model="${modelName}"${propsString}
  />`;
      })
      .join('\n\n');

    const scriptData = selectedFields.value
      .map((fieldName) => {
        const modelName = fieldName.toLowerCase().replace(/field$/i, '');
        return `const ${modelName} = ref('');`;
      })
      .join('\n  ');

    return `<template>
  <van-form ref="formRef">
${formFields}
  <\/van-form>
<\/template>

<script setup>
import { ref } from 'vue';
import { Form as VanForm } from 'vant';
${selectedFields.value
  .map((fieldName) => {
    const component = getComponentByName(fieldName);
    return component?.config?.importDesc;
  })
  .join('\n')}

const formRef = ref();

// 表单数据
${scriptData}
<\/script>`;
  });

  // 复制表单代码
  const copyFormCode = async () => {
    if (!generatedFormCode.value) return;

    try {
      await navigator.clipboard.writeText(generatedFormCode.value);
      console.log('代码已复制到剪贴板');
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 打开详细配置预览
  const openDetailPreview = (componentName: string) => {
    // 跳转到详细配置页面
    const route = `/preview/h5-field/${componentName}`;
    router.push(route);
  };

  // 监听选中字段变化，初始化表单数据和字段配置
  watch(
    selectedFields,
    (newFields) => {
      const newFormData: Record<string, any> = {};
      const newFieldConfigs: Record<string, Record<string, any>> = {
        ...fieldConfigs.value,
      };

      if (Array.isArray(newFields)) {
        newFields.forEach((fieldName) => {
          // 初始化表单数据
          if (formData.value[fieldName] !== undefined) {
            newFormData[fieldName] = formData.value[fieldName];
          } else {
            newFormData[fieldName] = '';
          }

          // 初始化字段配置（如果还没有配置）
          if (!newFieldConfigs[fieldName]) {
            const component = getComponentByName(fieldName);
            if (component?.config?.props) {
              const defaultConfig: Record<string, any> = {};
              component.config.props.forEach((prop: any) => {
                if (prop.default !== undefined) {
                  defaultConfig[prop.name] = prop.default;
                }
              });
              newFieldConfigs[fieldName] = defaultConfig;
            }
          }
        });
      }

      formData.value = newFormData;
      fieldConfigs.value = newFieldConfigs;
    },
    { immediate: true }
  );
</script>

<style scoped>
  .form-builder {
    background: white;
    border-radius: 8px;
    padding: 2rem;
    margin-top: 2rem;
    border: 1px solid #e1e4e8;
  }

  .builder-header {
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e1e4e8;
  }

  .title-section {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }

  .title-icon {
    font-size: 1.5rem;
    color: #52c41a;
  }

  .title-section h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2c3e50;
    margin: 0;
  }

  .description {
    font-size: 0.875rem;
    color: #6a737d;
    margin: 0;
  }

  .builder-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    min-height: 600px;
  }

  .left-panel {
    border-right: 1px solid #e1e4e8;
    padding-right: 2rem;
  }

  .right-panel {
    padding-left: 2rem;
  }

  .field-selector {
    height: 100%;
  }

  .selector-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .selector-header h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #2c3e50;
    margin: 0;
  }

  .selector-actions {
    display: flex;
    gap: 0.5rem;
  }

  .field-list {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    gap: 1rem;
    max-height: 500px;
    overflow-y: auto;
  }

  .field-item {
    padding: 1rem;
    border: 1px solid #e1e4e8;
    border-radius: 6px;
    transition: all 0.2s ease;
  }

  .field-item:hover {
    border-color: #007acc;
    background: #f8f9fa;
  }

  .field-content {
    display: flex;
    gap: 0.75rem;
  }

  .field-checkbox {
    display: flex;
    align-items: flex-start;
  }

  .component-preview {
    margin-left: 1.5rem;
    padding: 0.5rem;
  }

  .field-actions {
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 0.5rem;
    margin-left: 1.5rem;
  }

  .detail-btn {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .config-btn {
    flex-shrink: 0;
  }

  .field-info {
    display: flex;
    flex-direction: column;
    width: 200px;
    gap: 0.25rem;
    margin-left: 0.5rem;
  }

  .field-name {
    font-weight: 500;
    color: #2c3e50;
  }

  .field-description {
    white-space: pre-line;
    font-size: 0.75rem;
    color: #6a737d;
  }

  .code-section {
    margin-bottom: 2rem;
  }

  .code-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .code-header h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #2c3e50;
    margin: 0;
  }

  .code-preview {
    background: #f6f8fa;
    border: 1px solid #e1e4e8;
    border-radius: 6px;
    overflow: auto;
    max-height: 400px;
  }

  .code-preview pre {
    margin: 0;
    padding: 1rem;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.875rem;
    line-height: 1.5;
    color: #24292e;
  }

  .form-preview {
    margin-bottom: 2rem;
  }

  .preview-header h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #2c3e50;
    margin: 0 0 1rem 0;
  }

  .preview-container {
    background: #f8f9fa;
    border: 1px solid #e1e4e8;
    border-radius: 6px;
    padding: 1.5rem;
    overflow: auto;
    max-height: 600px;
    display: flex;
    justify-content: center;
  }

  .h5-preview {
    display: flex;
    flex-direction: column;
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
    height: 600px;
    background: #fafafa;
  }

  .component-display {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    min-height: 100px;
  }

  .preview-form {
    max-width: 400px;
    margin: 0 auto;
  }

  .empty-state {
    text-align: center;
    padding: 3rem 2rem;
    color: #6a737d;
  }

  .empty-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  .empty-state h3 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    color: #2c3e50;
  }

  .empty-state p {
    font-size: 0.875rem;
    margin: 0;
  }

  .dialog-header {
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #f0f0f0;
  }

  .field-selector-mini {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  @media (max-width: 768px) {
    .form-builder {
      padding: 1rem;
    }

    .builder-content {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .left-panel {
      border-right: none;
      border-bottom: 1px solid #e1e4e8;
      padding-right: 0;
      padding-bottom: 1rem;
    }

    .right-panel {
      padding-left: 0;
      padding-top: 1rem;
    }

    .field-list {
      max-height: 300px;
    }

    .selector-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .code-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
  }
</style>
