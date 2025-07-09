<template>
  <a-modal
    v-model:open="visible"
    :title="modalTitle"
    width="600px"
    :confirm-loading="loading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
    >
      <a-form-item label="物料类型" name="materialType" required>
        <a-select
          v-model:value="formData.materialType"
          placeholder="请选择物料类型"
          style="width: 100%"
          :disabled="status === 'edit'"
        >
          <a-select-option value="通用">通用</a-select-option>
          <a-select-option value="商品">商品</a-select-option>
          <a-select-option value="企业">企业</a-select-option>
        </a-select>
      </a-form-item>
      
      <a-form-item label="物料名称" name="materialName" required>
        <a-input
          v-model:value="formData.materialName"
          placeholder="请输入物料名称，限100字"
          :maxlength="100"
          show-count
        />
      </a-form-item>
      
      <a-form-item label="物料编号" name="materialCode" required>
        <a-input
          v-model:value="formData.materialCode"
          placeholder="请输入物料编号，限20字，支持英文、数字、字符"
          :maxlength="20"
          show-count
          :disabled="status === 'edit'"
        />
      </a-form-item>
      
      <a-form-item label="上传附件" name="fileKey">
        <FileUpload
          v-model="formData.fileKey"
          @change="handleFileChange"
        />
      </a-form-item>
      
      <a-form-item label="是否生效" name="isEffective">
        <a-switch
          v-model:checked="formData.isEffective"
          checked-children="生效"
          un-checked-children="未生效"
        />
      </a-form-item>
      
      <a-form-item label="生效时间" name="effectiveTime" required>
        <a-date-picker
          v-model:value="formData.effectiveTime"
          show-time
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择生效时间"
          style="width: 100%"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue';
import { message } from 'ant-design-vue';
import type { FormInstance, Rule } from 'ant-design-vue/es/form';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import FileUpload from './FileUpload.vue';

interface MaterialFormData {
  materialType: string;
  materialName: string;
  materialCode: string;
  fileKey: string;
  isEffective: boolean;
  effectiveTime: Dayjs | null;
}

interface MaterialData {
  id?: string | number;
  materialType: string;
  materialName: string;
  materialCode: string;
  fileKey?: string;
  isEffective: boolean;
  effectiveTime: string | Dayjs;
}

interface Props {
  open: boolean;
  status: 'add' | 'edit'; // 新增：add，编辑：edit
  data?: MaterialData; // 编辑时传入的数据
}

interface Emits {
  'update:open': [value: boolean];
  submit: [data: MaterialFormData, status: 'add' | 'edit'];
  cancel: [];
}

const props = withDefaults(defineProps<Props>(), {
  status: 'add',
  data: undefined
});
const emit = defineEmits<Emits>();

const visible = ref(false);
const loading = ref(false);
const formRef = ref<FormInstance>();

// 弹框标题
const modalTitle = computed(() => {
  return props.status === 'add' ? '新增弹框' : '编辑弹框';
});

// 表单数据
const formData = reactive<MaterialFormData>({
  materialType: '',
  materialName: '',
  materialCode: '',
  fileKey: '',
  isEffective: false,
  effectiveTime: null,
});

// 表单验证规则
const rules: Record<string, Rule[]> = {
  materialType: [
    { required: true, message: '请选择物料类型', trigger: 'change' }
  ],
  materialName: [
    { required: true, message: '请输入物料名称', trigger: 'blur' },
    { max: 100, message: '物料名称不能超过100字', trigger: 'blur' }
  ],
  materialCode: [
    { required: true, message: '请输入物料编号', trigger: 'blur' },
    { max: 20, message: '物料编号不能超过20字', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9\-_]+$/, message: '物料编号只能包含英文、数字、字符', trigger: 'blur' }
  ],
  effectiveTime: [
    { required: true, message: '请选择生效时间', trigger: 'change' }
  ]
};

// 监听外部传入的open状态
watch(() => props.open, (newVal) => {
  visible.value = newVal;
  if (newVal) {
    initForm();
  }
});

// 监听内部visible状态变化
watch(visible, (newVal) => {
  emit('update:open', newVal);
});

// 初始化表单
const initForm = () => {
  if (props.status === 'edit' && props.data) {
    // 编辑模式，填充数据
    formData.materialType = props.data.materialType;
    formData.materialName = props.data.materialName;
    formData.materialCode = props.data.materialCode;
    formData.fileKey = props.data.fileKey || '';
    formData.isEffective = props.data.isEffective;
    formData.effectiveTime = typeof props.data.effectiveTime === 'string' 
      ? dayjs(props.data.effectiveTime) 
      : props.data.effectiveTime;
  } else {
    // 新增模式，重置表单
    resetForm();
  }
};

// 重置表单
const resetForm = () => {
  formData.materialType = '';
  formData.materialName = '';
  formData.materialCode = '';
  formData.fileKey = '';
  formData.isEffective = false;
  formData.effectiveTime = null;
  formRef.value?.resetFields();
};

// 文件上传变化处理
const handleFileChange = (fileKey: string, fileName: string) => {
  formData.fileKey = fileKey;
};

// 校验物料名称唯一性
const checkMaterialNameUnique = async (materialName: string): Promise<boolean> => {
  // 模拟接口调用
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 模拟已存在的物料名称
  const existingNames = ['个人自主权书', '各种要求书', '主要要求书'];
  
  // 编辑模式下，如果名称没有变化，则不需要校验
  if (props.status === 'edit' && props.data && props.data.materialName === materialName) {
    return true;
  }
  
  return !existingNames.includes(materialName);
};

// 提交表单
const handleSubmit = async () => {
  try {
    // 表单验证
    await formRef.value?.validate();
    
    loading.value = true;
    
    // 校验物料名称唯一性
    const isUnique = await checkMaterialNameUnique(formData.materialName);
    if (!isUnique) {
      message.error(`该[${formData.materialName}]已有，请勿重复提交`);
      return;
    }
    
    // 提交数据
    emit('submit', { ...formData }, props.status);
    
    const successMessage = props.status === 'add' ? '新增成功！' : '编辑成功！';
    message.success(successMessage);
    visible.value = false;
    
  } catch (error) {
    console.error('表单验证失败:', error);
  } finally {
    loading.value = false;
  }
};

// 取消操作
const handleCancel = () => {
  visible.value = false;
  emit('cancel');
};
</script>

<style scoped>
.ant-form-item {
  margin-bottom: 24px;
}
</style>