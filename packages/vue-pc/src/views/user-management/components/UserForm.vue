<template>
  <a-modal
    :visible="props.visible"
    :title="isEdit ? '编辑用户' : '新增用户'"
    :confirm-loading="loading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    width="600px"
  >
    <a-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      :label-col="{ style: { width: '100px', textAlign: 'left' } }"
      
    >
      <a-form-item label="UM账号" name="managerUm">
        <a-input 
          v-model:value="formData.managerUm" 
          allowClear
          placeholder="请输入UM账号"
          :disabled="isEdit"
        />
      </a-form-item>

      <a-form-item label="姓名" name="managerName">
        <a-input 
          v-model:value="formData.managerName" 
          allowClear
          placeholder="请输入姓名"
        />
      </a-form-item>

      <a-form-item label="手机号" name="phoneNumber">
        <a-input 
          v-model:value="formData.phoneNumber" 
          allowClear
          placeholder="请输入手机号"
        />
      </a-form-item>

      <a-form-item label="渠道归属" name="salesChannel">
        <a-select
          v-model:value="formData.salesChannel"
          showArrow
          placeholder="请选择渠道归属"
          allowClear
          mode="multiple"
          :options="salesChannelOptions"
        >
          <template #dropdownRender="{ menuNode: menu }">
            <v-nodes :vnodes="menu" />
            <a-divider style="margin: 4px 0" />
            <a-space style="padding: 4px 8px">
              <a-button type="link" size="small" @click="handleSelectAll">全选</a-button>
              <a-button type="link" size="small" @click="handleDeselectAll">反选</a-button>
            </a-space>
          </template>
        </a-select>
      </a-form-item>

      <a-form-item label="是否生效" name="enabled">
        <a-switch v-model:checked="formData.enabled" :checked-value="1" :un-checked-value="0" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, defineComponent } from 'vue';
import { message } from 'ant-design-vue';
import type { FormInstance } from 'ant-design-vue';
// Assuming types will be updated later, using any for now
// import type { User, CreateUserRequest, UpdateUserRequest } from '../types';
import { saveUser } from '../api';
import { useUserManagementStore } from '@/store/userManagement';

// 使用用户管理 store
const userManagementStore = useUserManagementStore();

interface Props {
  visible: boolean;
  user?: any | null; // Using any to accommodate new fields
}

interface Emits {
  (e: 'update:visible', value: boolean): void;
  (e: 'success'): void;
}

interface FormData {
  managerUm: string;
  managerName: string;
  phoneNumber: string;
  salesChannel: string[];
  enabled: 0 | 1;
}

const props = withDefaults(defineProps<Props>(), {
  user: null
});

const emit = defineEmits<Emits>();

const formRef = ref<FormInstance>();
const loading = ref(false);

const isEdit = computed(() => !!props.user);

const getInitialFormData = (): FormData => ({
  managerUm: '',
  managerName: '',
  phoneNumber: '',
  salesChannel: [],
  enabled: 0
});

const formData = reactive<FormData>(getInitialFormData());

// 从 store 获取渠道归属选项
const salesChannelOptions = computed(() => userManagementStore.salesChannelOptions);

const VNodes = defineComponent({
  props: {
    vnodes: {
      type: Object,
      required: true,
    },
  },
  render() {
    return this.vnodes;
  },
});

const handleSelectAll = () => {
  formData.salesChannel = salesChannelOptions.value.map(option => option.value);
};

const handleDeselectAll = () => {
  formData.salesChannel = [];
};

const rules = {
  managerUm: [
    { required: true, message: '请输入UM账号', trigger: 'blur' },
    { max: 100, message: 'UM账号长度不能超过100个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_.-]+$/, message: 'UM账号只能包含英文、数字和常用符号', trigger: 'blur' }
  ],
  managerName: [
    { max: 100, message: '姓名长度不能超过100个字符', trigger: 'blur' }
  ],
  phoneNumber: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { max: 20, message: '手机号长度不能超过20个字符', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  salesChannel: [
    { required: true, message: '请选择渠道归属', trigger: 'change', type: 'array', min: 1 }
  ]
};

const resetForm = () => {
  Object.assign(formData, getInitialFormData());
  formRef.value?.clearValidate();
};

watch(
  () => props.user,
  (user) => {
    resetForm();
    if (user) {
      formData.managerUm = user.managerUm;
      formData.managerName = user.managerName;
      formData.phoneNumber = user.phoneNumber;
      formData.salesChannel =  user.salesChannel || [];
      formData.enabled = user.enabled;
    }
  },
  { immediate: true, deep: true }
);

const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    loading.value = true;
    const submitData = {
      ...formData,
    };

    await saveUser(submitData);
    message.success(isEdit.value ? '用户更新成功' : '用户创建成功');
    emit('success');
    handleCancel();
  } catch (error) {
    console.error('表单提交失败:', error);
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  resetForm();
  emit('update:visible', false);
};
</script>

<style scoped lang="less">
.ant-form-item {
  margin-bottom: 24px;
}

</style>