<template>
  <div
    class="select"
    :class="`select--${layoutType}`"
  >
    <!-- Grid布局：支持换行 -->
    <div
      v-if="layoutType === 'grid'"
      class="select__grid"
      :class="{
        [`select__grid_row${itemsPerRow}`]: itemsPerRow,
        select__grid_auto: !itemsPerRow,
      }"
    >
      <div
        v-for="(option, index) in options"
        :key="option.value"
        class="select__item"
        :class="{
          'select__item--selected': isSelected(option.value),
          'select__item--disabled': props.disabled || option.disabled,
        }"
        :style="getItemStyle(option)"
        @click="handleSelect(option.value)"
      >
        <slot
          name="option"
          :option="option"
          :selected="isSelected(option.value)"
          :disabled="props.disabled || option.disabled"
        >
          <span class="select__text">{{ option.label }}</span>
        </slot>
      </div>
    </div>

    <!-- Scroll布局：不换行，支持滚动 -->
    <div
      v-else
      class="select__scroll-container"
    >
      <div
        v-for="(option, index) in options"
        :key="option.value"
        class="select__item"
        :class="{
          'select__item--selected': isSelected(option.value),
          'select__item--disabled': props.disabled || option.disabled,
        }"
        :style="getItemStyle(option)"
        @click="handleSelect(option.value)"
      >
        <slot
          name="option"
          :option="option"
          :selected="isSelected(option.value)"
          :disabled="props.disabled || option.disabled"
        >
          <span class="select__text">{{ option.label }}</span>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue';

  import type { SelectOption, SelectProps, SelectEmits } from './types';

  interface Props extends SelectProps {}

  interface Emits extends SelectEmits {}

  const props = withDefaults(defineProps<Props>(), {
    multiple: false,
    layoutType: 'grid',
    itemsPerRow: undefined,
    disabled: false,
    itemWidth: undefined,
  });

  const emit = defineEmits<Emits>();

  const isSelected = (value: string | number): boolean => {
    if (props.multiple) {
      const selectedValues = Array.isArray(props.modelValue)
        ? props.modelValue
        : [];
      return selectedValues.includes(value);
    }
    return props.modelValue === value;
  };

  const handleSelect = (value: string | number) => {
    // 检查是否禁用
    const option = props.options.find((opt) => opt.value === value);
    if (props.disabled || option?.disabled) {
      return;
    }

    if (props.multiple) {
      const selectedValues = Array.isArray(props.modelValue)
        ? [...props.modelValue]
        : [];
      const index = selectedValues.indexOf(value);

      if (index > -1) {
        selectedValues.splice(index, 1);
      } else {
        selectedValues.push(value);
      }

      emit('update:modelValue', selectedValues);
      emit('change', selectedValues);
    } else {
      emit('update:modelValue', value);
      emit('change', value);
    }
  };

  const getItemStyle = (option: SelectOption) => {
    const style: Record<string, any> = {};

    // 优先使用选项自定义宽度
    if (option.width) {
      style.width =
        typeof option.width === 'number' ? `${option.width}px` : option.width;
    } else if (props.layoutType === 'scroll' && props.itemWidth) {
      // scroll模式下使用全局itemWidth
      style.width =
        typeof props.itemWidth === 'number'
          ? `${props.itemWidth}px`
          : props.itemWidth;
      style.flexShrink = 0;
    } else if (props.layoutType === 'scroll') {
      // scroll模式下自适应宽度
      style.flexShrink = 0;
      style.whiteSpace = 'nowrap';
    }

    return style;
  };
</script>

<style scoped lang="less">
  .select {
    width: 100%;

    // Grid布局：支持换行
    &--grid .select__grid {
      margin: -6px;

      // 自适应宽度布局
      &.select__grid_auto {
        display: flex;
        flex-wrap: wrap;

        .select__item {
          margin: 6px;
        }
      }

      // 固定列数布局 - 使用flexbox替代grid以提高兼容性
      &.select__grid_row1 {
        display: flex;
        flex-wrap: wrap;

        .select__item {
          flex: 0 0 calc(100% - 12px);
          margin: 6px;
        }
      }

      &.select__grid_row2 {
        display: flex;
        flex-wrap: wrap;

        .select__item {
          flex: 0 0 calc(50% - 12px);
          margin: 6px;
          box-sizing: border-box;
        }
      }

      &.select__grid_row3 {
        display: flex;
        flex-wrap: wrap;

        .select__item {
          flex: 0 0 calc(33.333% - 12px);
          margin: 6px;
          box-sizing: border-box;
        }
      }

      &.select__grid_row4 {
        display: flex;
        flex-wrap: wrap;

        .select__item {
          flex: 0 0 calc(25% - 12px);
          margin: 6px;
          box-sizing: border-box;
        }
      }

      &.select__grid_row5 {
        display: flex;
        flex-wrap: wrap;

        .select__item {
          flex: 0 0 calc(20% - 12px);
          margin: 6px;
          box-sizing: border-box;
        }
      }

      &.select__grid_row6 {
        display: flex;
        flex-wrap: wrap;

        .select__item {
          flex: 0 0 calc(16.666% - 12px);
          margin: 6px;
          box-sizing: border-box;
        }
      }
    }

    // Scroll布局：不换行，支持滚动
    &--scroll .select__scroll-container {
      display: flex;
      flex-wrap: nowrap;
      overflow-x: auto;
      padding-bottom: 4px;
      scrollbar-width: none;
      -ms-overflow-style: none;

      &::-webkit-scrollbar {
        display: none;
      }

      .select__item {
        margin-right: 12px;

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }

  // 选项样式
  .select__item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    padding: 0 8px;
    border: 1px solid rgb(184, 186, 191);
    border-radius: 4px;
    background-color: #fff;
    cursor: pointer;
    transition: all 0.3s ease;
    user-select: none;
    box-sizing: border-box;

    &--selected {
      border-color: rgb(255, 209, 181);
      background-color: #fff7f2;
      color: #ff6b35;
    }

    &:hover:not(&--disabled) {
      border-color: rgb(255, 209, 181);
    }

    &--disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background-color: #f5f5f5;

      .select__text {
        color: #999;
      }
    }
  }

  .select__text {
    font-size: 14px;
    line-height: 1.4;
    text-align: center;
  }

  // 响应式调整
  @media (max-width: 375px) {
    .select__item {
      min-height: 40px;
      padding: 6px 12px;
    }

    .select__text {
      font-size: 13px;
    }
  }
</style>
