<template>
  <div class="other-settings-module">
    <div class="module-header">
      <h2 class="module-title">其他配置项</h2>
    </div>

    <div class="module-content">
      <!-- 保险条款及重要文档 -->
      <div class="form-section full-width">
        <label class="form-label">保险条款及重要文档</label>

        <!-- 全选选项 -->
        <div class="checkbox-group">
          <a-checkbox
            :checked="isAllSelected"
            :indeterminate="isIndeterminate"
            :disabled="isPreview"
            @change="handleSelectAll"
            class="select-all-checkbox"
          >
            全选
          </a-checkbox>
        </div>

        <!-- 协议列表 -->
        <div class="agreements-list">
          <div
            v-for="agreement in moduleData.agreements"
            :key="agreement.id"
            class="agreement-item"
          >
            <a-checkbox
              :checked="agreement.checked"
              :disabled="agreement.disabled || isPreview"
              @change="
                (e: any) =>
                  handleAgreementChange(agreement.id, e.target.checked)
              "
              class="agreement-checkbox"
            >
              {{ agreement.name }}
            </a-checkbox>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { message } from 'ant-design-vue';
  import { SettingOutlined } from '@ant-design/icons-vue';
  import { useCommonData, useModuleStore } from '@giom/shared/modular-craft';
  import { useEvent } from '@giom/shared/modular-craft';
  import type { OtherSettingsModuleData, AgreementItem } from './config';

  // Props定义
  interface Props {
    moduleId?: string;
    status?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    moduleId: '',
    status: '',
  });
  const commonData = useCommonData();
  // 计算是否为预览模式
  const isPreview = computed(() => commonData.status === 'preview');

  // 模块数据管理
  const { data: moduleData, update: updateModuleData } =
    useModuleStore<OtherSettingsModuleData>(props.moduleId);

  // 事件总线
  const { registerValidation } = useEvent();

  // 计算属性
  const isAllSelected = computed(() => {
    const selectableAgreements = moduleData.value.agreements.filter(
      (item) => !item.disabled
    );
    return (
      selectableAgreements.length > 0 &&
      selectableAgreements.every((item) => item.checked)
    );
  });

  const isIndeterminate = computed(() => {
    const selectableAgreements = moduleData.value.agreements.filter(
      (item) => !item.disabled
    );
    const checkedCount = selectableAgreements.filter(
      (item) => item.checked
    ).length;
    return checkedCount > 0 && checkedCount < selectableAgreements.length;
  });

  // 事件处理函数
  const handleSelectAll = (e: any) => {
    const checked = e.target.checked;
    const newAgreements = moduleData.value.agreements.map((agreement) => {
      if (!agreement.disabled) {
        return { ...agreement, checked };
      }
      return agreement;
    });

    updateModuleData({
      ...moduleData.value,
      agreements: newAgreements,
    });
  };

  const handleAgreementChange = (agreementId: string, checked: boolean) => {
    const newAgreements = moduleData.value.agreements.map((agreement) => {
      if (agreement.id === agreementId) {
        return { ...agreement, checked };
      }
      return agreement;
    });

    updateModuleData({
      ...moduleData.value,
      agreements: newAgreements,
    });
  };

  // // 校验函数
  // const validateOtherSettings = async () => {
  //   try {
  //     const errors: any[] = [];

  //     // 检查是否至少选择了一个协议
  //     const hasSelectedAgreement = moduleData.value.agreements.some(
  //       (agreement) => agreement.checked
  //     );

  //     if (!hasSelectedAgreement) {
  //       errors.push('请至少选择一个保险条款或重要文档');
  //     }

  //     return {
  //       moduleId: 'other-settings',
  //       errors,
  //     };
  //   } catch (error: any) {
  //     return {
  //       moduleId: 'other-settings',
  //       errors: [error.message || error],
  //     };
  //   }
  // };

  // 注册校验函数
  // registerValidation('other-settings', validateOtherSettings);
</script>

<style scoped>
  .other-settings-module {
    background: #fff;
    padding: 0 24px;
    margin-bottom: 16px;
  }

  .module-header {
    padding: 0;
    margin-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;
  }

  .module-title {
    font-size: 18px;
    font-weight: 600;
    color: #262626;
    margin: 0 0 8px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .module-description {
    font-size: 14px;
    color: #8c8c8c;
    margin: 0;
  }

  .form-section {
    margin-bottom: 24px;
  }

  .form-section.full-width {
    width: 100%;
  }

  .form-label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #262626;
    margin-bottom: 12px;
  }

  .checkbox-group {
    margin-bottom: 16px;
  }

  .select-all-checkbox {
    font-weight: 500;
    color: #1890ff;
  }

  .agreements-list {
    display: flex;
    flex-wrap: wrap;
    gap: 16px 24px;
  }

  .agreement-item {
    display: flex;
    align-items: center;
    gap: 4px;
    min-width: 120px;
  }

  .agreement-checkbox {
    font-size: 14px;
  }

  .agreement-checkbox:deep(.ant-checkbox-disabled + span) {
    color: #bfbfbf !important;
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .other-settings-module {
      padding: 16px;
      margin-bottom: 12px;
    }

    .module-title {
      font-size: 16px;
    }

    .agreements-list {
      padding-left: 16px;
    }
  }
</style>
