<template>
  <van-popup
    v-model:show="visible"
    position="bottom"
    :style="{ height: '80%' }"
    round
    closeable
    close-icon-position="top-right"
    @close="handleClose"
  >
    <div class="create-popup">
      <div class="popup-header">
        <h3>保障选择</h3>
      </div>

      <div class="popup-content">
        <div
          v-for="(category, categoryIndex) in protectionCategories"
          :key="categoryIndex"
          class="protection-category"
        >
          <div class="category-header">
            <div class="header-left">
              <span class="category-number">{{ categoryIndex + 1 }}</span>
              <span class="category-title">{{ category.title }}</span>
            </div>
            <!-- 展开/收起按钮 -->
            <div
              v-if="shouldShowExpandButton(category)"
              class="expand-toggle-button"
              @click="toggleExpand(categoryIndex)"
            >
              <span>{{ expandedCategories[categoryIndex] ? '收起' : '展开全部' }}</span>
              <van-icon 
                :name="expandedCategories[categoryIndex] ? 'arrow-up' : 'arrow-down'" 
                size="12" 
              />
            </div>
          </div>

          <div
            class="options-grid"
            :class="`grid-${category.maxPerRow || 4}`"
          >
            <div
              v-for="(option, optionIndex) in category.options.slice(
                0,
                getDisplayOptionsCount(category, categoryIndex)
              )"
              :key="option.value"
              class="option-item"
              :class="{
                selected:
                  isProtectionOptionSelected(categoryIndex, option.value),
                required: category.required,
              }"
              @click="handleSelectProtection(categoryIndex, option.value)"
            >
              {{ option.label }}
            </div>
          </div>
        </div>
      </div>

      <div class="popup-footer">
        <van-button
          type="primary"
          block
          @click="handleConfirmCreate"
          :disabled="!getSelectedProtectionOptions(0).length"
        >
          确认创建
        </van-button>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import { useProtectionStore } from './protectionStore';

  interface Props {
    show: boolean;
  }

  interface Emits {
    (e: 'update:show', value: boolean): void;
    (e: 'confirm', data: any): void;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<Emits>();

  const protectionStore = useProtectionStore();

  // 展开状态
  const expandedCategories = ref<{ [key: number]: boolean }>({});

  // 从store中获取数据和方法
  const {
    protectionCategories,
    selectedProtectionOptions,
    toggleProtectionOption,
    getSelectedProtectionOptions,
    isProtectionOptionSelected,
    clearProtectionSelection,
  } = protectionStore;

  // 控制弹框显示
  const visible = computed({
    get: () => props.show,
    set: (value) => emit('update:show', value),
  });

  // 选择/取消选择保障选项
  const handleSelectProtection = (
    categoryIndex: number,
    optionValue: string
  ) => {
    toggleProtectionOption(categoryIndex, optionValue);
  };

  // 切换展开状态
  const toggleExpand = (categoryIndex: number) => {
    expandedCategories.value[categoryIndex] =
      !expandedCategories.value[categoryIndex];
  };

  // 获取显示的选项数量
  const getDisplayOptionsCount = (category: any, categoryIndex: number) => {
    const maxPerRow = category.maxPerRow || 4;
    const isExpanded = expandedCategories.value[categoryIndex];
    return isExpanded
      ? category.options.length
      : Math.min(maxPerRow, category.options.length);
  };

  // 是否需要显示展开按钮
  const shouldShowExpandButton = (category: any) => {
    const maxPerRow = category.maxPerRow || 4;
    return category.options.length > maxPerRow;
  };

  // 关闭弹框
  const handleClose = () => {
    visible.value = false;
  };

  // 确认创建方案
  const handleConfirmCreate = () => {
    emit('confirm', selectedProtectionOptions.value);
    visible.value = false;
  };

  // 监听弹框显示状态，重置选择
  const resetSelection = () => {
    clearProtectionSelection();
    expandedCategories.value = {};
  };

  // 当弹框显示时重置选择
  const handleShow = () => {
    if (visible.value) {
      resetSelection();
    }
  };

  // 监听显示状态变化
  watch(() => visible.value, handleShow);
</script>

<style lang="less" scoped>
  .create-popup {
    height: 100%;
    display: flex;
    flex-direction: column;

    .popup-header {
      padding: 20px 16px 16px;
      border-bottom: 1px solid #f0f0f0;

      h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #333;
        text-align: center;
      }
    }

    .popup-content {
      flex: 1;
      padding: 16px;
      overflow-y: auto;

      .protection-category {
        margin-bottom: 24px;

        .category-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;

          .header-left {
            display: flex;
            align-items: center;

            .category-number {
              width: 20px;
              height: 20px;
              background: #ff6b35;
              color: #fff;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 12px;
              font-weight: 600;
              margin-right: 8px;
            }

            .category-title {
              font-size: 16px;
              font-weight: 500;
              color: #333;
            }
          }

          .expand-toggle-button {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 4px 8px;
            background: transparent;
            border: none;
            font-size: 12px;
            color: #333;
            cursor: pointer;
            transition: all 0.2s;

            &:hover {
              color: #666;
            }
          }
        }

        .options-grid {
          display: grid;
          gap: 8px;

          &.grid-2 {
            grid-template-columns: repeat(2, 1fr);
          }

          &.grid-4 {
            grid-template-columns: repeat(4, 1fr);
          }

          .option-item {
            padding: 8px 12px;
            border: 1px solid #e0e0e0;
            border-radius: 6px;
            text-align: center;
            font-size: 14px;
            color: #666;
            cursor: pointer;
            transition: all 0.2s;
            position: relative;

            &:hover {
              border-color: #ff6b35;
            }

            &.selected {
              background: #fff5f2;
              border: 1px solid #ff6b35;
              color: #ff6b35;

              &::after {
                content: '';
                position: absolute;
                bottom: 0;
                right: 0;
                width: 0;
                height: 0;
                border-left: 10px solid transparent;
                border-bottom: 10px solid #ff6b35;
              }
            }
          }
        }
      }
    }

    .popup-footer {
      padding: 16px;
      border-top: 1px solid #f0f0f0;

      .van-button {
        height: 44px;
        border-radius: 22px;
        font-size: 16px;
        font-weight: 500;
      }
    }
  }
</style>
