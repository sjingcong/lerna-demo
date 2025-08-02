<template>
  <div class="h5-field-page">
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <Icon
            icon="mdi:form-textbox"
            class="title-icon"
          />
          <h1>H5 Field 组件</h1>
        </div>
        <p class="description">
          专为移动端表单设计的字段组件库，提供丰富的输入控件和完善的校验机制
        </p>
      </div>
    </div>

    <div class="page-content">
      <div class="component-list">
        <div
          v-for="componentData in components"
          :key="componentData.name"
          class="component-item"
        >
          <div class="component-content">
            <div class="component-info">
              <span class="component-name">
                {{ componentData.config?.componentTitle || componentData.name }}
              </span>
              <span
                class="component-description"
                v-if="componentData.config?.description"
              >
                {{ componentData.config.description }}
              </span>
            </div>

            <div class="component-preview">
              <QuickPreview
                :component="componentData.component"
                :config="componentData.config"
                size="small"
                :is-h5="true"
              />
            </div>
            <router-link
              :to="`/preview/h5-field/${componentData.name}`"
              class="preview-link"
            >
              <Icon icon="mdi:eye" />
              详细配置
            </router-link>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div
        v-if="components.length === 0"
        class="empty-state"
      >
        <div class="empty-icon">📱</div>
        <h3>暂无 Field 组件</h3>
        <p>正在开发更多表单组件...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { Icon } from '@iconify/vue';
  import QuickPreview from '@/components/QuickPreview.vue';
  import type { Component } from 'vue';

  interface ComponentData {
    name: string;
    component: Component | null;
    config: any;
  }

  const components = ref<ComponentData[]>([]);

  // 动态获取h5-field目录下的所有组件
  const loadComponents = async () => {
    try {
      // 使用import.meta.glob动态导入所有组件目录
      const componentModules = import.meta.glob(
        '../../../../shared/h5-field/*/index.vue'
      );
      const propsModules = import.meta.glob(
        '../../../../shared/h5-field/*/props.json'
      );

      // 从路径中提取组件名称
      const componentNames = Object.keys(componentModules)
        .map((path) => {
          const match = path.match(/\/([^/]+)\/index\.vue$/);
          return match ? match[1] : '';
        })
        .filter((name) => name);

      // 加载每个组件的实例和配置
      const componentDataPromises = componentNames.map(async (name) => {
        try {
          const componentModule =
            await componentModules[
              `../../../../shared/h5-field/${name}/index.vue`
            ]();
          const propsModule =
            await propsModules[
              `../../../../shared/h5-field/${name}/props.json`
            ]();

          return {
            name,
            component: componentModule.default,
            config: propsModule.default,
          };
        } catch (error) {
          console.error(`加载组件 ${name} 失败:`, error);
          return {
            name,
            component: null,
            config: null,
          };
        }
      });

      const componentData = await Promise.all(componentDataPromises);
      components.value = componentData.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    } catch (error) {
      console.error('加载组件列表失败:', error);
      // 如果动态加载失败，使用默认组件列表
      components.value = [
        {
          name: 'PhoneField',
          component: null,
          config: null,
        },
      ];
    }
  };

  onMounted(() => {
    loadComponents();
  });
</script>

<style scoped>
  .h5-field-page {
    min-height: 100vh;
    background: #f8f9fa;
  }

  .page-header {
    background: white;
    border-bottom: 1px solid #e1e4e8;
    padding: 2rem 0;
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .title-section {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .title-icon {
    font-size: 2.5rem;
    color: #007acc;
  }

  .title-section h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #2c3e50;
    margin: 0;
  }

  .description {
    font-size: 1.2rem;
    color: #6a737d;
    margin: 0;
  }

  .page-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .component-list {
    display: grid;
    gap: 1.5rem;
  }

  .component-item {
    background: white;
    border: 1px solid #e1e4e8;
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.2s ease;
  }

  .component-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }

  .component-content {
    display: grid;
    grid-template-columns: 1fr auto auto;
    align-items: center;
    padding: 1.5rem;
    gap: 1.5rem;
  }

  .component-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .component-name {
    font-size: 1.25rem;
    font-weight: 600;
    color: #2c3e50;
  }

  .component-description {
    font-size: 0.875rem;
    color: #6a737d;
    line-height: 1.4;
  }

  .component-preview {
    min-width: 200px;
    display: flex;
    justify-content: center;
  }

  .preview-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: #007acc;
    color: white;
    text-decoration: none;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    transition: background-color 0.2s;
    white-space: nowrap;
  }

  .preview-link:hover {
    background: #005a9e;
    color: white;
  }

  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    color: #6a737d;
  }

  .empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .empty-state h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: #2c3e50;
  }

  .empty-state p {
    font-size: 1rem;
    margin: 0;
  }

  @media (max-width: 768px) {
    .component-content {
      grid-template-columns: 1fr;
      text-align: center;
    }

    .component-preview {
      order: -1;
    }
  }
</style>
