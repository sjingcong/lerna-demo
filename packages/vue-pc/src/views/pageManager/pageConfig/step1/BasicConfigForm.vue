<template>
  <div class="basic-config-form">
    <a-form
      ref="formRef"
      :model="formData"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
      layout="horizontal"
      class="config-form"
      :rules="formRules"
    >
      <!-- 渠道归属 -->
      <a-form-item
        label="渠道归属"
        name="channelAttribution"
        has-feedback
      >
        <a-select
          v-model:value="formData.channelAttribution"
          placeholder="请选择渠道归属"
          style="width: 400px"
          size="large"
          :options="channelOptions"
          :disabled="props.status === 'preview'"
          @change="handleChannelChange"
        />
        <template #extra>
          <div class="field-hint">
            <span class="hint-text">
              选择销售渠道类型，不同渠道可能有不同的佣金政策和管理要求
            </span>
          </div>
        </template>
      </a-form-item>

      <!-- 选择销售商品 -->
      <a-form-item
        label="选择销售商品"
        name="salesProduct"
        has-feedback
      >
        <a-select
          v-model:value="formData.salesProduct"
          style="width: 400px"
          placeholder="请选择销售商品"
          size="large"
          :options="salesProductOptions"
          :disabled="props.status === 'preview'"
          @change="handleSalesProductChange"
        />
      </a-form-item>

      <!-- 指定生效日期 -->
      <a-form-item
        label="指定生效日期"
        name="effectiveDate"
        has-feedback
      >
        <a-date-picker
          v-model:value="formData.effectiveDate"
          show-time
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择生效日期"
          size="large"
          style="width: 400px"
          :disabled="props.status === 'preview'"
          @change="handleDateChange"
          :disabled-date="disabledDate"
          :disabled-time="disabledDateTime"
        />
      </a-form-item>

      <!-- 描述 -->
      <a-form-item
        label="描述"
        name="description"
        has-feedback
      >
        <a-textarea
          v-model:value="formData.description"
          placeholder="限200字"
          :rows="4"
          style="width: 400px"
          :maxlength="200"
          show-count
          :disabled="props.status === 'preview'"
          @change="handleDescriptionChange"
          @blur="validateDescription"
        />
      </a-form-item>

      <!-- 选择模板 -->
      <a-form-item
        label="选择模板"
        name="selectedTemplate"
        has-feedback
      >
        <a-table
          :data-source="templateOptions"
          :columns="templateColumns"
          style="width: 800px"
          :pagination="false"
          :row-selection="templateRowSelection"
          :scroll="{ y: 300 }"
          :loading="templateLoading"
          size="small"
          row-key="id"
          class="template-table"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'id'">
              <span class="template-id">{{ record.id }}</span>
            </template>
            <template v-else-if="column.key === 'name'">
              <span class="template-name">{{ record.name }}</span>
            </template>
            <template v-else-if="column.key === 'description'">
              <span class="template-desc">{{ record.description }}</span>
            </template>
          </template>
        </a-table>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, watch, onMounted, withDefaults } from 'vue';
  import { message } from 'ant-design-vue';
  import { storeToRefs } from 'pinia';
  import type { FormInstance, Rule } from 'ant-design-vue/es/form';
  import dayjs, { Dayjs } from 'dayjs';
  import { usePageConfigStore } from '../store';
  import { getTemplateList } from '../api';

  // 表单数据接口
  interface FormData {
    salesProduct: string;
    channelAttribution: string;
    effectiveDate: string;
    description: string;
    selectedTemplate: string;
  }

  // 模板选项接口
  interface TemplateOption {
    id: string;
    name: string;
    description: string;
  }

  // 组件状态类型
  type ComponentStatus = 'add' | 'edit' | 'preview';

  // 定义props
  const props = withDefaults(
    defineProps<{
      status?: ComponentStatus;
      initialData?: Partial<FormData>;
    }>(),
    {
      status: 'add',
      initialData: () => ({}),
    }
  );

  // 定义事件
  const emit = defineEmits<{
    'form-change': [data: FormData];
    'template-select': [templateId: string];
  }>();

  // 使用store
  const store = usePageConfigStore();
  const { formData, channelOptions, salesProductOptions, optionsLoading } =
    storeToRefs(store);
  const { loadSalesProductOptions } = store;

  // 表单引用
  const formRef = ref<FormInstance>();

  // 表单校验规则
  const formRules: Record<string, Rule[]> = {
    channelAttribution: [
      { required: true, message: '请选择渠道归属', trigger: 'change' },
    ],
    salesProduct: [
      { required: true, message: '请选择销售商品', trigger: 'change' },
    ],
    effectiveDate: [
      { required: true, message: '请选择生效日期', trigger: 'change' },
    ],
    description: [{ max: 200, message: '描述不能超过200字', trigger: 'blur' }],
    selectedTemplate: [
      { required: true, message: '请选择模板', trigger: 'change' },
    ],
  };

  // 模板选项
  const templateOptions = ref<TemplateOption[]>([]);
  const templateLoading = ref(false);

  // Table 列配置
  const templateColumns = [
    {
      title: '模板编号',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      align: 'center',
    },
    {
      title: '模板名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
  ];

  // Table 行选择配置
  const templateRowSelection = computed(() => ({
    type: 'radio',
    selectedRowKeys: formData.value.selectedTemplate
      ? [formData.value.selectedTemplate]
      : [],
    onSelect: (record: TemplateOption) => {
      if (props.status !== 'preview') {
        selectTemplate(record.id);
      }
    },
    getCheckboxProps: () => ({
      disabled: props.status === 'preview',
    }),
  }));

  // 处理渠道归属变化
  const handleChannelChange = async (value: string) => {
    console.log('渠道归属变化:', value);
    try {
      // 更新表单数据
      formData.value.channelAttribution = value;
      formData.value.salesProduct = ''; // 清空销售商品选择

      // 重新加载销售商品选项
      await loadSalesProductOptions(value);

      emitFormChange();
    } catch (error) {
      console.error('处理渠道变更失败:', error);
    }
  };

  // 选择模板
  const selectTemplate = (templateId: string) => {
    formData.value.selectedTemplate = templateId;
    emitFormChange();
    emit('template-select', templateId);
  };

  // 处理销售商品变化
  const handleSalesProductChange = (value: string) => {
    console.log('销售商品变化:', value);
    emitFormChange();
  };

  // 处理日期变化
  const handleDateChange = (dateString: string) => {
    console.log('生效日期变化:', dateString);
    emitFormChange();
  };

  // 处理描述变化
  const handleDescriptionChange = () => {
    console.log('描述变化:', formData.value.description);
    emitFormChange();
  };

  // 验证描述字段
  const validateDescription = () => {
    if (formData.value.description && formData.value.description.length > 200) {
      message.warning('描述内容不能超过200字');
    }
  };

  // 触发表单变化事件
  const emitFormChange = () => {
    emit('form-change', formData.value);
  };

  // 禁用过去的日期
  const disabledDate = (current: Dayjs) => {
    return current && current < dayjs().startOf('day');
  };

  // 禁用过去的时间
  const disabledDateTime = () => {
    const now = dayjs();
    return {
      disabledHours: () => {
        const hours = [];
        for (let i = 0; i < now.hour(); i++) {
          hours.push(i);
        }
        return hours;
      },
      disabledMinutes: (selectedHour: number) => {
        if (selectedHour === now.hour()) {
          const minutes = [];
          for (let i = 0; i < now.minute(); i++) {
            minutes.push(i);
          }
          return minutes;
        }
        return [];
      },
      disabledSeconds: (selectedHour: number, selectedMinute: number) => {
        if (selectedHour === now.hour() && selectedMinute === now.minute()) {
          const seconds = [];
          for (let i = 0; i < now.second(); i++) {
            seconds.push(i);
          }
          return seconds;
        }
        return [];
      },
    };
  };

  // 监听props变化
  watch(
    () => props.initialData,
    (newData) => {
      if (newData && Object.keys(newData).length > 0) {
        console.log('接收到初始数据:', newData);
      }
    },
    { immediate: true, deep: true }
  );

  // 加载模板数据
  const loadTemplateOptions = async () => {
    try {
      templateLoading.value = true;
      const templates = await getTemplateList();
      templateOptions.value = templates;
    } catch (error) {
      console.error('加载模板数据失败:', error);
      message.error('加载模板数据失败，请重试');
    } finally {
      templateLoading.value = false;
    }
  };

  // 组件挂载时的初始化逻辑
  onMounted(async () => {
    console.log('BasicConfigForm 组件挂载完成');
    await loadTemplateOptions();
    emitFormChange();
  });

  // 暴露验证方法给父组件
  const validate = async () => {
    if (!formRef.value) return false;
    try {
      await formRef.value.validate();
      return true;
    } catch (error) {
      console.error('表单验证失败:', error);
      return false;
    }
  };

  // 暴露重置方法给父组件
  const resetFields = () => {
    if (formRef.value) {
      formRef.value.resetFields();
    }
  };

  // 暴露方法给父组件
  defineExpose({
    validate,
    resetFields,
  });
</script>

<style scoped>
  .basic-config-form {
    display: flex;
    align-items: center;
    padding: 20px;
    box-sizing: border-box;
    justify-content: center;
    background: #fff;
  }

  .field-hint {
    margin-top: 4px;
  }

  .hint-text {
    color: #666;
    font-size: 12px;
    line-height: 1.4;
  }

  .template-id {
    font-family: 'Monaco', 'Menlo', monospace;
    font-weight: 500;
    color: #1890ff;
    white-space: nowrap;
  }

  .template-name {
    font-weight: 500;
    color: #262626;
    line-height: 1.5;
  }

  .template-desc {
    color: #666;
    font-size: 13px;
    line-height: 1.5;
    white-space: normal;
    word-wrap: break-word;
  }
</style>
