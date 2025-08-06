<template>
  <a-modal
    :open="visible"
    title="提交审核"
    width="800px"
    :footer="null"
    @cancel="handleCancel"
  >
    <a-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      layout="vertical"
      class="submit-review-form"
    >
      <a-form-item
        label="销售商品名称"
        name="productName"
      >
        <a-input
          v-model:value="formData.productName"
          placeholder="请输入销售商品名称"
          disabled
        />
      </a-form-item>

      <a-form-item
        label="发起人"
        name="initiator"
      >
        <a-input
          v-model:value="formData.initiator"
          placeholder="当前登录用户UM"
          disabled
        />
      </a-form-item>

      <a-form-item
        label="备注标题"
        name="remarkTitle"
      >
        <a-input
          v-model:value="formData.remarkTitle"
          placeholder="最多50字"
          :maxlength="50"
          show-count
        />
      </a-form-item>

      <a-form-item label="添加UM账号">
        <div class="um-account-section">
          <a-input
            v-model:value="umAccountInput"
            placeholder="请输入UM账号"
            style="width: 200px; margin-right: 8px"
            @press-enter="handleAddUmAccount"
          />
          <a-button
            type="primary"
            @click="handleAddUmAccount"
          >
            添加
          </a-button>
        </div>

        <div class="approval-type-buttons">
          <a-button
            v-for="type in approvalTypes"
            :key="type.key"
            :type="selectedApprovalType === type.key ? 'primary' : 'default'"
            @click="handleApprovalTypeChange(type.key)"
          >
            {{ type.icon }} {{ type.label }}
          </a-button>
        </div>
      </a-form-item>

      <a-form-item label="审批链">
        <div class="approval-chain">
          <div
            v-if="approvalGroups.length === 0"
            class="empty-chain"
          >
            暂无审批人
          </div>
          <div
            v-else
            class="approval-chain-list"
          >
            <template
              v-for="(group, groupIndex) in approvalGroups"
              :key="'group-' + groupIndex"
            >
              <div class="approval-group">
                <template
                  v-for="(user, userIndex) in group.users"
                  :key="'user-' + groupIndex + '-' + userIndex"
                >
                  <a-tag
                    :color="getTagColor(group.groupType)"
                    closable
                    @close="handleRemoveUserFromGroup(groupIndex, userIndex)"
                    class="user-tag"
                  >
                    {{ user }}
                  </a-tag>
                  <span
                    v-if="userIndex < group.users.length - 1"
                    class="group-separator"
                  >
                    {{ getSeparatorText(group.groupType) }}
                  </span>
                </template>
              </div>
              <span
                v-if="groupIndex < approvalGroups.length - 1"
                class="group-divider"
              >
                →
              </span>
            </template>
          </div>
        </div>
      </a-form-item>

      <a-form-item
        label="审批正文"
        name="approvalContent"
      >
        <a-textarea
          v-model:value="formData.approvalContent"
          placeholder="请输入审批正文"
          :rows="6"
          :maxlength="500"
          show-count
        />
      </a-form-item>
    </a-form>

    <div class="modal-footer">
      <a-button @click="handleCancel">取消</a-button>
      <a-button
        type="primary"
        :loading="submitLoading"
        @click="handleSubmit"
      >
        确认
      </a-button>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
  import { ref, reactive, watch, computed } from 'vue';
  import { message } from 'ant-design-vue';
  import type { FormInstance } from 'ant-design-vue';

  interface Props {
    visible: boolean;
    productName?: string;
  }

  interface Emits {
    (e: 'update:visible', value: boolean): void;
    (e: 'submit', data: any): void;
  }

  const props = withDefaults(defineProps<Props>(), {
    visible: false,
    productName: '',
  });

  const emit = defineEmits<Emits>();

  const formRef = ref<FormInstance>();
  const submitLoading = ref(false);
  const umAccountInput = ref('');
  const selectedApprovalType = ref('sequential');
  // 存储审批组信息，每组包含多个用户和组内关系类型
  const approvalGroups = ref<Array<{ users: string[]; groupType: string }>>([]);

  // 表单数据
  const formData = reactive({
    productName: '',
    initiator: '当前登录用户UM',
    remarkTitle: '',
    approvalChain: '',
    approvalContent: '',
  });

  // 审批类型
  const approvalTypes = [
    { key: 'sequential', label: '顺序审批', icon: '→' },
    { key: 'collaborative', label: '协同审批', icon: '/' },
    { key: 'parallel', label: '并行审批', icon: '||' },
    { key: 'circulate', label: '传阅', icon: '↑' },
  ];

  // 表单验证规则
  const rules = {
    remarkTitle: [
      { required: true, message: '请输入备注标题', trigger: 'blur' },
      { max: 50, message: '备注标题不能超过50个字符', trigger: 'blur' },
    ],
    approvalContent: [
      { required: true, message: '请输入审批正文', trigger: 'blur' },
      { max: 500, message: '审批正文不能超过500个字符', trigger: 'blur' },
    ],
  };

  // 根据分组结构生成审批链文本
  const approvalChainText = computed(() => {
    if (approvalGroups.value.length === 0) return '';

    const separatorMap = {
      sequential: ' → ', // 顺序审批
      collaborative: ' / ', // 协同审批
      parallel: ' || ', // 并行审批
      circulate: ' ↑ ', // 传阅
    };

    const groupTexts = approvalGroups.value.map((group) => {
      if (group.users.length === 1) {
        return group.users[0];
      }
      const separator = separatorMap[group.groupType] || ' / ';
      return group.users.join(separator);
    });

    return groupTexts.join(' → ');
  });

  // 监听审批链变化，同步到表单数据
  watch(approvalChainText, (newVal) => {
    formData.approvalChain = newVal;
  });

  // 监听props变化
  watch(
    () => props.visible,
    (newVal) => {
      if (newVal) {
        formData.productName = props.productName;
        // 重置表单
        resetForm();
      }
    }
  );

  // 添加UM账号
  const handleAddUmAccount = () => {
    if (!umAccountInput.value.trim()) {
      message.warning('请输入UM账号');
      return;
    }

    const userName = umAccountInput.value.trim();

    // 检查是否已存在于所有组中
    const existsInAnyGroup = approvalGroups.value.some((group) =>
      group.users.includes(userName)
    );
    if (existsInAnyGroup) {
      message.warning('该UM账号已存在于审批链中');
      return;
    }

    if (selectedApprovalType.value === 'sequential') {
      // 顺序审批：创建新组
      approvalGroups.value.push({
        users: [userName],
        groupType: 'sequential',
      });
      message.success(`已添加UM账号: ${userName} (新的审批组)`);
    } else {
      // 其他类型：添加到最后一个组，如果没有组则创建新组
      const lastGroup = approvalGroups.value[approvalGroups.value.length - 1];

      if (!lastGroup) {
        // 创建新组
        approvalGroups.value.push({
          users: [userName],
          groupType: selectedApprovalType.value,
        });
        const typeLabel = approvalTypes.find(
          (t) => t.key === selectedApprovalType.value
        )?.label;
        message.success(`已添加UM账号: ${userName} (新的${typeLabel}组)`);
      } else {
        // 添加到最后一个组
        lastGroup.users.push(userName);
        const typeLabel = approvalTypes.find(
          (t) => t.key === lastGroup.groupType
        )?.label;
        message.success(`已添加UM账号: ${userName} 到${typeLabel}组`);
      }
    }

    umAccountInput.value = '';
  };

  // 审批类型变化
  const handleApprovalTypeChange = (type: string) => {
    selectedApprovalType.value = type;
    const typeLabel = approvalTypes.find((t) => t.key === type)?.label;

    if (type === 'sequential') {
      message.info(`已选择: ${typeLabel}，每次添加用户将创建新的审批组`);
    } else {
      // 对于协同审批、并行审批、传阅，只修改最后一个组的审批方式
      if (approvalGroups.value.length > 0) {
        const lastGroup = approvalGroups.value[approvalGroups.value.length - 1];
        lastGroup.groupType = type;
        message.info(`已将最后一个组的审批方式修改为: ${typeLabel}`);
      } else {
        message.info(`已选择: ${typeLabel}，将应用于下一个添加的审批组`);
      }
    }
  };

  // 获取连接符文本
  const getSeparatorText = (approvalType: string) => {
    const separatorMap = {
      sequential: '→',
      collaborative: '/',
      parallel: '||',
      circulate: '↑',
    };
    return separatorMap[approvalType] || '→';
  };

  // 获取标签颜色
  const getTagColor = (approvalType: string) => {
    const colorMap = {
      sequential: 'blue',
      collaborative: 'green',
      parallel: 'orange',
      circulate: 'purple',
    };
    return colorMap[approvalType] || 'blue';
  };

  // 从组中删除用户
  const handleRemoveUserFromGroup = (groupIndex: number, userIndex: number) => {
    const group = approvalGroups.value[groupIndex];
    const removedUser = group.users[userIndex];

    group.users.splice(userIndex, 1);

    // 如果组变空了，删除整个组
    if (group.users.length === 0) {
      approvalGroups.value.splice(groupIndex, 1);
      message.success(`已删除审批人: ${removedUser}，并删除空组`);
    } else {
      message.success(`已删除审批人: ${removedUser}`);
    }
  };

  // 重置表单
  const resetForm = () => {
    formData.remarkTitle = '';
    formData.approvalChain = '';
    formData.approvalContent = '';
    umAccountInput.value = '';
    approvalGroups.value = [];
    selectedApprovalType.value = 'sequential';
    formRef.value?.clearValidate();
  };

  // 取消
  const handleCancel = () => {
    emit('update:visible', false);
  };

  // 提交
  const handleSubmit = async () => {
    try {
      await formRef.value?.validate();

      const totalUsers = approvalGroups.value.reduce(
        (sum, group) => sum + group.users.length,
        0
      );
      if (totalUsers === 0) {
        message.warning('请添加至少一个审批人');
        return;
      }

      submitLoading.value = true;

      // 模拟提交
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const submitData = {
        ...formData,
        approvalType: selectedApprovalType.value,
      };

      emit('submit', submitData);
      emit('update:visible', false);

      message.success('提交审核成功');
    } catch (error) {
      console.error('表单验证失败:', error);
    } finally {
      submitLoading.value = false;
    }
  };
</script>

<style scoped>
  .submit-review-form {
    max-height: 60vh;
    overflow-y: auto;
  }

  .um-account-section {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
  }

  .approval-type-buttons {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .approval-type-buttons .ant-btn {
    border-radius: 16px;
    font-size: 12px;
    height: 28px;
    padding: 0 12px;
  }

  .approval-chain {
    margin-top: 8px;
  }

  .empty-chain {
    color: #999;
    font-style: italic;
    padding: 8px 12px;
    background-color: #f5f5f5;
    border-radius: 6px;
    text-align: center;
  }

  .approval-chain-list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    padding: 8px;
    background-color: #fafafa;
    border-radius: 6px;
    border: 1px solid #d9d9d9;
    min-height: 40px;
  }

  .approval-group {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    border-radius: 4px;
    background-color: #f0f0f0;
  }

  .group-separator {
    font-weight: bold;
    color: #666;
    margin: 0 2px;
  }

  .group-divider {
    font-weight: bold;
    color: #1890ff;
    margin: 0 8px;
    font-size: 16px;
  }

  .user-tag {
    margin: 0;
  }

  .user-tag .anticon-close {
    margin-left: 6px;
    font-size: 12px;
  }

  .modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;
  }

  :deep(.ant-form-item-label) {
    font-weight: 500;
  }

  :deep(.ant-input:disabled) {
    background-color: #f5f5f5;
    color: #999;
  }

  :deep(.ant-textarea:disabled) {
    background-color: #f5f5f5;
    color: #999;
  }
</style>
