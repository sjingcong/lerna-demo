<template>
  <div
    class="quick-preview"
    :class="[{ 'h5-preview': isH5 }]"
  >
    <div class="preview-container">
      <div class="component-display">
        <component
          :is="component"
          v-bind="mergedProps"
          v-model="modelValue"
          @update:modelValue="handleModelUpdate"
          v-if="component"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import type { Component } from 'vue';

  interface Props {
    component: Component | null;
    props?: Record<string, any>;
    isH5?: boolean;
    config?: Record<string, any>;
    showProps?: boolean;
    size?: 'small' | 'medium' | 'large';
  }

  const props = withDefaults(defineProps<Props>(), {
    component: null,
    props: () => ({}),
    config: () => ({}),
    showProps: false,
    size: 'medium',
  });

  const modelValue = ref();

  // 合并后的属性
  const mergedProps = computed(() => {
    const merged = { ...props.props };

    // 合并示例数据 - props.config.props是数组格式
    if (props.config.props && Array.isArray(props.config.props)) {
      props.config.props.forEach((prop) => {
        if (merged[prop.name] === undefined && prop.default !== undefined) {
          // 处理数组和对象类型的默认值
          try {
            merged[prop.name] =
              typeof prop.default === 'string' &&
              (prop.type === 'array' || prop.type === 'object')
                ? JSON.parse(prop.default)
                : prop.default;
          } catch {
            merged[prop.name] = prop.default;
          }
        }
      });
    }

    return merged;
  });

  // 处理模型更新
  const handleModelUpdate = (value: any) => {
    modelValue.value = value;
  };
</script>

<style scoped lang="less">
  .quick-preview {
    border-radius: 6px;
    overflow: hidden;
    background: white;
    border-radius: 16px;
    box-shadow:
      0 10px 25px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
    &.h5-preview {
      width: 375px;
    }
  }

  .preview-container {
    display: flex;
    flex-direction: column;
  }

  .component-display {
    padding: 0.75rem;
    background: #fafafa;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* 尺寸变体 */
  .quick-preview.size-small .component-display {
    min-height: 60px;
    padding: 0.5rem;
  }

  .quick-preview.size-medium .component-display {
    min-height: 80px;
    padding: 0.75rem;
  }

  .quick-preview.size-large .component-display {
    min-height: 100px;
    padding: 1rem;
  }
</style>
