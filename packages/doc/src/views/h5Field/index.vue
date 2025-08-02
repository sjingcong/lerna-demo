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
      <!-- 表单构建器 -->
      <FormBuilder :components="components" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { Icon } from '@iconify/vue';
  import FormBuilder from '../../components/FormBuilder.vue';
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
    margin: 0 auto;
    padding: 2rem;
  }
</style>
