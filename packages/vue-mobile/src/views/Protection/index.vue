<template>
  <div class="protection-page">
    <div class="page-content">
      <!-- 已有方案 -->
      <div class="existing-plans">
        <h3 class="section-title">已有方案</h3>
        <div class="plans-grid">
          <div
            v-for="plan in existingPlans"
            :key="plan.id"
            class="plan-card"
            :class="{ selected: isPlanSelected(plan.id) }"
            @click="handleSelectPlan(plan)"
          >
            <div class="plan-name">{{ plan.name }}</div>
            <div
              class="plan-status"
              v-if="isPlanSelected(plan.id)"
            >
              <div class="selected-triangle"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 自定义方案 -->
      <div class="custom-plan">
        <div class="custom-plan-card">
          <span class="custom-plan-title">自定义方案名称名称</span>
          <div class="custom-plan-actions">
            <van-icon
              name="delete-o"
              class="delete-icon"
            />
            <span class="details-text">详情</span>
            <van-icon
              name="arrow"
              class="arrow-icon"
            />
            <div class="plan-status">
              <div class="selected-triangle"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 新建按钮 -->
      <div
        class="new-plan-button"
        @click="handleCreatePlan"
      >
        <span>新建组合</span>
      </div>
    </div>
  </div>

  <!-- 新建组合弹框 -->
  <CreatePlanPopup
    v-model:show="showCreatePopup"
    @confirm="handleConfirmCreate"
  />
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useProtectionStore, type Plan } from './protectionStore';
  import CreatePlanPopup from './CreatePlanPopup.vue';

  const router = useRouter();
  const protectionStore = useProtectionStore();

  // 弹框显示状态
  const showCreatePopup = ref(false);

  // 从store中获取数据和方法
  const {
    existingPlans,
    togglePlan,
    isPlanSelected,
    getSelectedCount,
    fetchExistingPlans,
  } = protectionStore;

  // 返回上一页
  const onBack = () => {
    router.back();
  };

  // 选择/取消选择方案
  const handleSelectPlan = (plan: Plan) => {
    togglePlan(plan.id);
    console.log('切换方案选择状态:', plan, '当前已选择:', getSelectedCount());
  };

  // 新建方案
  const handleCreatePlan = () => {
    showCreatePopup.value = true;
  };

  // 确认创建方案
  const handleConfirmCreate = (selectedOptions: any) => {
    // TODO: 处理创建逻辑
    console.log('选中的保障选项:', selectedOptions);
  };

  onMounted(() => {
    fetchExistingPlans();
  });
</script>

<style lang="less" scoped>
  .protection-page {
    min-height: 100vh;
    background-color: #f5f5f5;

    .page-content {
      padding: 16px;
    }

    .section-title {
      font-size: 16px;
      font-weight: 500;
      color: #333;
      margin-bottom: 12px;
      margin-top: 0;
    }

    .existing-plans {
      margin-bottom: 24px;

      .plans-grid {
        background: #fff;
        border-radius: 8px;
        padding: 16px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-bottom: 24px;
      }

      .plan-card {
        background: #f8f9fa;
        border-radius: 6px;
        padding: 0 12px;
        cursor: pointer;
        position: relative;
        border: 1px solid #e9ecef;
        min-height: 36px;
        display: flex;
        align-items: center;

        &.selected {
          background: #fff2f0;
          border-color: #ff4444;
        }

        .plan-name {
          font-size: 14px;
          color: #333;
          flex: 1;
        }

        .plan-status {
          position: absolute;
          bottom: 0;
          right: 0;
        }

        .selected-triangle {
          width: 0;
          height: 0;
          border-left: 20px solid transparent;
          border-bottom: 20px solid #ff4444;
          position: relative;

          &::after {
            content: '';
            position: absolute;
            bottom: -18px;
            right: -6px;
            width: 3px;
            height: 8px;
            background: #fff;
            transform: rotate(45deg);
          }

          &::before {
            content: '';
            position: absolute;
            bottom: -15px;
            right: -3px;
            width: 2px;
            height: 5px;
            background: #fff;
            transform: rotate(45deg);
          }
        }
      }
    }

    .custom-plan {
      .custom-plan-card {
        background: #fff;
        border-radius: 8px;
        padding: 0 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        min-height: 36px;
        position: relative;

        .custom-plan-title {
          font-size: 14px;
          color: #333;
          flex: 1;
        }

        .custom-plan-actions {
          display: flex;
          align-items: center;
          gap: 8px;

          .delete-icon {
            color: #999;
            font-size: 14px;
          }

          .details-text {
            font-size: 12px;
            color: #666;
          }

          .arrow-icon {
            color: #666;
            font-size: 12px;
          }

          .plan-status {
            position: absolute;
            bottom: 0;
            right: 0;

            .selected-triangle {
              width: 0;
              height: 0;
              border-left: 20px solid transparent;
              border-bottom: 20px solid #ff4444;
              position: relative;

              &::after {
                content: '';
                position: absolute;
                bottom: -18px;
                right: -6px;
                width: 3px;
                height: 8px;
                background: #fff;
                transform: rotate(45deg);
              }

              &::before {
                content: '';
                position: absolute;
                bottom: -15px;
                right: -3px;
                width: 2px;
                height: 5px;
                background: #fff;
                transform: rotate(45deg);
              }
            }
          }
        }
      }
    }

    // 新建按钮样式
    .new-plan-button {
      background: #ff6b35;
      border-radius: 24px;
      padding: 12px 24px;
      margin-top: 16px;
      text-align: center;
      cursor: pointer;

      span {
        color: #fff;
        font-size: 16px;
        font-weight: 500;
      }

      &:active {
        opacity: 0.8;
      }
    }
  }

  // 导航栏样式调整
  :deep(.van-nav-bar) {
    background-color: #fff;

    .van-nav-bar__title {
      font-size: 18px;
      font-weight: 500;
      color: #333;
    }

    .van-nav-bar__left {
      .van-icon {
        color: #333;
        font-size: 18px;
      }
    }
  }
</style>
