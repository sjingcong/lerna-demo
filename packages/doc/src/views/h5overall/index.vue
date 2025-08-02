<template>
  <div class="h5-overall-page">
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <Icon
            icon="mdi:cellphone"
            class="title-icon"
          />
          <h1>H5组件总览</h1>
        </div>
        <p class="description">移动端专用组件库，提供丰富的H5组件</p>
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
                {{ componentData.config.componentTitle }}
              </span>
              <span
                class="component-description"
                v-if="componentData.config.description"
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
              :to="`/preview/h5-components/${componentData.name}`"
              class="preview-link"
            >
              <Icon icon="mdi:eye" />
              详细配置
            </router-link>
          </div>
        </div>
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

  // 动态获取h5-components目录下的所有组件
  const loadComponents = async () => {
    try {
      // 使用import.meta.glob动态导入所有组件目录
      const componentModules = import.meta.glob(
        '../../../../shared/h5-components/*/index.vue'
      );
      const propsModules = import.meta.glob(
        '../../../../shared/h5-components/*/props.json'
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
              `../../../../shared/h5-components/${name}/index.vue`
            ]();
          const propsModule =
            await propsModules[
              `../../../../shared/h5-components/${name}/props.json`
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
          name: 'Select',
          component: null,
          config: null,
        },
        {
          name: 'Space',
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
  .h5-overall-page {
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
    padding: 3rem 2rem;
  }

  .component-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .component-item {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: box-shadow 0.2s;
  }

  .component-item:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  .component-content {
    display: flex;
    align-items: center;
    padding: 0.75rem;
    gap: 1rem;
  }

  .component-info {
    flex: 0 0 200px;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .component-name {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1e293b;
  }

  .component-description {
    font-size: 0.875rem;
    color: #64748b;
    line-height: 1.4;
  }

  .preview-link {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    color: #3b82f6;
    text-decoration: none;
    font-weight: 500;
    padding: 0.375rem 0.75rem;
    border-radius: 4px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    transition: all 0.2s;
    font-size: 0.8rem;
    width: fit-content;
  }

  .preview-link:hover {
    color: #2563eb;
    background: #f1f5f9;
    border-color: #cbd5e1;
  }

  .component-preview {
    flex: 1;
    min-width: 0;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
</style>
