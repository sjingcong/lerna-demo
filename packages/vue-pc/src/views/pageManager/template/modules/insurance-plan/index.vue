<template>
  <div class="insurance-plan-module">
    <div class="module-header">
      <div class="header-content">
        <div class="header-left">
          <FileProtectOutlined class="module-icon" />
          <h3 class="module-title">保障方案描述</h3>
        </div>
        <div class="header-actions">
          <a-button type="primary" @click="handleSave">
            <SaveOutlined />
            保存
          </a-button>
          <a-button @click="handleReset">
            <ReloadOutlined />
            重置
          </a-button>
          <a-button @click="handlePreview">
            <EyeOutlined />
            预览
          </a-button>
        </div>
      </div>
    </div>

    <div class="module-content">
      <!-- 页面展示名称 -->
      <div class="form-section horizontal-form">
        <div class="form-label-section">
          <label class="form-label">页面展示名称</label>
          <div class="upload-description">
            必填，最多50个字符
          </div>
        </div>
        <div class="form-control-section">
          <a-input
            v-model:value="moduleData.title"
            placeholder="请输入页面展示名称"
            :maxlength="50"
            show-count
            @change="handleTitleChange"
          />
        </div>
      </div>

      <!-- 描述方案配置 -->
      <div class="form-section">
        <div class="section-header">
          <label class="form-label">描述方案配置</label>
          <a-button type="primary" @click="showAddModal">
            <PlusOutlined />
            新增
          </a-button>
        </div>
        
        <!-- 方案列表 -->
        <div class="plans-table" v-if="moduleData.plans.length > 0">
          <div class="table-header">
            <div class="col-name">名称</div>
            <div class="col-content">内容</div>
            <div class="col-action">操作</div>
          </div>
          <div class="table-body">
            <div 
              v-for="(plan, index) in moduleData.plans" 
              :key="plan.id"
              class="table-row"
            >
              <div class="col-name">{{ plan.name }}</div>
              <div class="col-content">{{ plan.content }}</div>
              <div class="col-action">
                <a-button 
                  type="link" 
                  size="small"
                  @click="handleEdit(index)"
                >
                  编辑
                </a-button>
                <a-button 
                  type="link" 
                  size="small" 
                  danger
                  @click="handleDelete(index)"
                >
                  删除
                </a-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="empty-state">
          <div class="empty-content">
            <FileProtectOutlined class="empty-icon" />
            <p>暂无保障方案</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增/编辑弹框 -->
    <a-modal
      v-model:open="modalVisible"
      :title="editingIndex === -1 ? '新增保障方案' : '编辑保障方案'"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
      :confirm-loading="modalLoading"
    >
      <a-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        layout="vertical"
      >
        <a-form-item label="名称" name="name">
          <a-input
            v-model:value="formData.name"
            placeholder="请输入保障方案名称"
            :maxlength="50"
            show-count
          />
        </a-form-item>
        <a-form-item label="内容" name="content">
          <a-input
            v-model:value="formData.content"
            placeholder="请输入保障方案内容"
            :maxlength="50"
            show-count
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive } from 'vue';
import { message } from 'ant-design-vue';
import {
  FileProtectOutlined,
  SaveOutlined,
  ReloadOutlined,
  EyeOutlined,
  PlusOutlined
} from '@ant-design/icons-vue';
import { useModuleStore } from '../../store';
import type { InsurancePlanModuleData, InsurancePlanItem } from './config';
import type { FormInstance } from 'ant-design-vue';

// 模块数据管理
const { data: moduleData, update: updateModuleData } = useModuleStore<InsurancePlanModuleData>('insurance-plan');

// 弹框相关
const modalVisible = ref(false);
const modalLoading = ref(false);
const editingIndex = ref(-1);
const formRef = ref<FormInstance>();

// 表单数据
const formData = reactive({
  name: '',
  content: ''
});

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入保障方案名称', trigger: 'blur' },
    { max: 50, message: '名称不能超过50个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入保障方案内容', trigger: 'blur' },
    { max: 50, message: '内容不能超过50个字符', trigger: 'blur' }
  ]
};

// 计算属性
const hasContent = computed(() => 
  moduleData.value.title || moduleData.value.plans.length > 0
);

// 事件处理函数
const handleTitleChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  updateModuleData({
    ...moduleData.value,
    title: target.value
  });
};

const showAddModal = () => {
  editingIndex.value = -1;
  formData.name = '';
  formData.content = '';
  modalVisible.value = true;
};

const handleEdit = (index: number) => {
  editingIndex.value = index;
  const plan = moduleData.value.plans[index];
  formData.name = plan.name;
  formData.content = plan.content;
  modalVisible.value = true;
};

const handleDelete = (index: number) => {
  const newPlans = [...moduleData.value.plans];
  newPlans.splice(index, 1);
  updateModuleData({
    ...moduleData.value,
    plans: newPlans
  });
  message.success('删除成功');
};

const handleModalOk = async () => {
  try {
    await formRef.value?.validate();
    modalLoading.value = true;

    const newPlan: InsurancePlanItem = {
      id: editingIndex.value === -1 ? Date.now().toString() : moduleData.value.plans[editingIndex.value].id,
      name: formData.name,
      content: formData.content
    };

    const newPlans = [...moduleData.value.plans];
    if (editingIndex.value === -1) {
      // 新增
      newPlans.push(newPlan);
    } else {
      // 编辑
      newPlans[editingIndex.value] = newPlan;
    }

    updateModuleData({
      ...moduleData.value,
      plans: newPlans
    });

    modalVisible.value = false;
    message.success(editingIndex.value === -1 ? '新增成功' : '编辑成功');
  } catch (error) {
    console.error('表单验证失败:', error);
  } finally {
    modalLoading.value = false;
  }
};

const handleModalCancel = () => {
  modalVisible.value = false;
  formRef.value?.resetFields();
};

const handleSave = () => {
  // 基础验证
  if (!moduleData.value.title.trim()) {
    message.warning('请输入页面展示名称');
    return;
  }

  if (moduleData.value.plans.length === 0) {
    message.warning('请至少添加一个保障方案');
    return;
  }

  // 保存逻辑
  console.log('保存保障方案配置:', moduleData.value);
  message.success('保障方案配置保存成功！');
};

const handleReset = () => {
  updateModuleData({
    title: '',
    plans: []
  });
  message.info('已重置所有配置');
};

const handlePreview = () => {
  if (!hasContent.value) {
    message.warning('暂无内容可预览');
    return;
  }
  
  console.log('预览数据:', moduleData.value);
  message.info('预览功能开发中...');
};
</script>

<style scoped lang="less">
.insurance-plan-module {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  overflow: hidden;
}

.module-header {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 24px;
  border-bottom: 1px solid #e8e8e8;

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;

    .module-icon {
      font-size: 24px;
      color: #1890ff;
    }

    .module-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #262626;
    }
  }

  .header-actions {
    display: flex;
    gap: 12px;
  }
}

.module-content {
  padding: 24px;
}

.vertical-layout {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-section {
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }

  &.horizontal-form {
    display: flex;
    align-items: flex-start;
    gap: 20px;

    .form-label-section {
      flex: 0 0 140px;
      min-width: 140px;
    }

    .form-control-section {
      flex: 1;
      min-width: 0;
    }
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #262626;
  font-size: 14px;
}

.upload-description {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 4px;
}

.plans-table {
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  overflow: hidden;

  .table-header {
    display: flex;
    background: #fafafa;
    border-bottom: 1px solid #e8e8e8;
    font-weight: 500;
    color: #262626;
  }

  .table-row {
    display: flex;
    border-bottom: 1px solid #e8e8e8;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background: #f5f5f5;
    }
  }

  .col-name {
    flex: 0 0 200px;
    padding: 12px 16px;
    border-right: 1px solid #e8e8e8;
  }

  .col-content {
    flex: 1;
    padding: 12px 16px;
    border-right: 1px solid #e8e8e8;
    word-break: break-all;
  }

  .col-action {
    flex: 0 0 120px;
    padding: 12px 16px;
    display: flex;
    gap: 8px;
  }
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #8c8c8c;

  .empty-icon {
    font-size: 48px;
    color: #d9d9d9;
    margin-bottom: 16px;
  }

  p {
    margin-bottom: 16px;
    font-size: 14px;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .module-header {
    padding: 16px;

    .header-content {
      flex-direction: column;
      gap: 16px;
      align-items: flex-start;
    }

    .header-actions {
      width: 100%;
      justify-content: flex-end;
    }
  }

  .module-content {
    padding: 16px;
  }

  .form-section.horizontal-form {
    flex-direction: column;
    gap: 8px;

    .form-label-section {
      flex: none;
      min-width: auto;
    }

    .form-control-section {
      flex: none;
    }
  }

  .plans-table {
    .col-name {
      flex: 0 0 120px;
    }

    .col-action {
      flex: 0 0 100px;
    }
  }
}
</style>