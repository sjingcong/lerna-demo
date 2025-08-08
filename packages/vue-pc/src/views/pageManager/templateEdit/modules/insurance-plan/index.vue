<template>
  <div class="insurance-plan-module">
    <div class="module-header">
      <div class="header-content">
        <div class="header-left">
          <h3 class="module-title">保障方案描述</h3>
        </div>
      </div>
    </div>

    <div class="module-content">
      <!-- 页面展示名称 -->
      <a-form
        ref="titleFormRef"
        layout="horizontal"
        :label-col="{ style: { width: '120px' } }"
        :model="moduleData"
        :rules="titleFormRules"
      >
        <a-form-item
          label="页面展示名称"
          name="title"
          required
        >
          <a-input
            v-model:value="moduleData.title"
            placeholder="请输入页面展示名称"
            :maxlength="50"
            show-count
            :disabled="isPreview"
            @change="handleTitleChange"
          />
        </a-form-item>
      </a-form>

      <!-- 描述方案配置 -->
      <div class="form-section">
        <div class="section-header">
          <label class="form-label">描述方案配置</label>
          <a-button
            type="primary"
            :disabled="isPreview"
            @click="showAddModal"
          >
            <PlusOutlined />
            新增
          </a-button>
        </div>

        <!-- 方案列表 -->
        <div
          class="plans-table"
          v-if="moduleData.plans.length > 0"
        >
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
                  :disabled="isPreview"
                  @click="handleEdit(index)"
                >
                  编辑
                </a-button>
                <a-button
                  type="link"
                  size="small"
                  danger
                  :disabled="isPreview"
                  @click="handleDelete(index)"
                >
                  删除
                </a-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div
          v-else
          class="empty-state"
        >
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
        <a-form-item
          label="名称"
          name="name"
        >
          <a-input
            v-model:value="formData.name"
            placeholder="请输入保障方案名称"
            :maxlength="50"
            show-count
          />
        </a-form-item>
        <a-form-item
          label="内容"
          name="content"
        >
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
  import { FileProtectOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import { useCommonData, useModuleStore } from '@giom/shared/modular-craft';
  import { useEvent } from '@giom/shared/modular-craft';
  import type { InsurancePlanModuleData, InsurancePlanItem } from './config';
  import type { FormInstance } from 'ant-design-vue';

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
    useModuleStore<InsurancePlanModuleData>(props.moduleId);

  // 事件总线
  const { registerValidation } = useEvent();

  // 弹框相关
  const modalVisible = ref(false);
  const modalLoading = ref(false);
  const editingIndex = ref(-1);
  const formRef = ref<FormInstance>();
  const titleFormRef = ref<FormInstance>();

  // 表单数据
  const formData = reactive({
    name: '',
    content: '',
  });

  // 表单验证规则
  const titleFormRules = {
    title: [
      { required: true, message: '请输入页面展示名称', trigger: 'blur' },
      {
        min: 1,
        max: 50,
        message: '页面展示名称长度在1到50个字符',
        trigger: 'blur',
      },
    ],
  };

  const formRules = {
    name: [
      { required: true, message: '请输入保障方案名称', trigger: 'blur' },
      { max: 50, message: '名称不能超过50个字符', trigger: 'blur' },
    ],
    content: [
      { required: true, message: '请输入保障方案内容', trigger: 'blur' },
      { max: 50, message: '内容不能超过50个字符', trigger: 'blur' },
    ],
  };

  // 计算属性
  const hasContent = computed(
    () => moduleData.value.title || moduleData.value.plans.length > 0
  );

  // 事件处理函数
  const handleTitleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    updateModuleData({
      ...moduleData.value,
      title: target.value,
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
      plans: newPlans,
    });
    message.success('删除成功');
  };

  const handleModalOk = async () => {
    try {
      await formRef.value?.validate();
      modalLoading.value = true;

      const newPlan: InsurancePlanItem = {
        id:
          editingIndex.value === -1
            ? Date.now().toString()
            : moduleData.value.plans[editingIndex.value].id,
        name: formData.name,
        content: formData.content,
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
        plans: newPlans,
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

  // 校验函数
  const validateInsurancePlan = async () => {
    try {
      // 触发所有表单校验
      await titleFormRef.value?.validate();
      // 校验成功，返回空错误数组
    } catch (error: any) {
      throw error;
    }
  };

  // 注册校验函数
  registerValidation('insurance-plan', validateInsurancePlan);
</script>

<style scoped lang="less">
  .insurance-plan-module {
    background: white;
    border-radius: 8px;
    overflow: hidden;
  }

  .module-header {
    padding: 8px 24px;
    border-bottom: 1px solid #f0f0f0;

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
