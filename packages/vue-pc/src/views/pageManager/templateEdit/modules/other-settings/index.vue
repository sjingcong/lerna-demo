<template>
  <div class="other-settings-module">
    <div class="module-header">
      <h2 class="module-title">
        <SettingOutlined />
        其他配置项
      </h2>
      <p class="module-description">配置保险条款及重要文档的勾选设置</p>
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
              :disabled="agreement.disabled"
              @change="(e) => handleAgreementChange(agreement.id, e.target.checked)"
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
import { useModuleStore } from '../../store';
import type { OtherSettingsModuleData, AgreementItem } from './config';

// 模块数据管理
const { data: moduleData, update: updateModuleData } = 
  useModuleStore<OtherSettingsModuleData>('other-settings');

// 计算属性
const isAllSelected = computed(() => {
  const selectableAgreements = moduleData.value.agreements.filter(item => !item.disabled);
  return selectableAgreements.length > 0 && selectableAgreements.every(item => item.checked);
});

const isIndeterminate = computed(() => {
  const selectableAgreements = moduleData.value.agreements.filter(item => !item.disabled);
  const checkedCount = selectableAgreements.filter(item => item.checked).length;
  return checkedCount > 0 && checkedCount < selectableAgreements.length;
});

// 事件处理函数
const handleSelectAll = (e: any) => {
  const checked = e.target.checked;
  const newAgreements = moduleData.value.agreements.map(agreement => {
    if (!agreement.disabled) {
      return { ...agreement, checked };
    }
    return agreement;
  });

  updateModuleData({
    ...moduleData.value,
    agreements: newAgreements
  });
};

const handleAgreementChange = (agreementId: string, checked: boolean) => {
  const newAgreements = moduleData.value.agreements.map(agreement => {
    if (agreement.id === agreementId) {
      return { ...agreement, checked };
    }
    return agreement;
  });

  updateModuleData({
    ...moduleData.value,
    agreements: newAgreements
  });
};
</script>

<style scoped>
.other-settings-module {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.module-header {
  margin-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 16px;
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