<template>
  <div class="h5-preview">
    <div class="mobile-frame">
      <div class="mobile-screen">
        <!-- 组件显示区域 -->
        <div class="component-display">
          <component
            :is="component"
            v-bind="mergedProps"
            v-model="modelValue"
            @update:modelValue="handleModelUpdate"
            v-if="component"
          />
        </div>

        <!-- 交互结果显示 -->
        <div
          class="interaction-result"
          v-if="showResult"
        >
          <div class="result-item">
            <span class="label">当前值:</span>
            <span class="value">{{ displayValue }}</span>
          </div>

          <!-- 额外的结果插槽 -->
          <slot name="extra-results" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import type { Component } from 'vue';

  // Props
  interface Props {
    component: Component | null;
    props?: Record<string, any>;
    config?: Record<string, any>;
    showResult?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    component: null,
    props: () => ({}),
    config: () => ({}),
    showResult: true,
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
  const handleModelUpdate = (value) => {
    modelValue.value = value;
  };

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
</script>

<style scoped>
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
    height: 812px;
    background: #fafafa;
  }

  .component-display {
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100px;
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
</style>
