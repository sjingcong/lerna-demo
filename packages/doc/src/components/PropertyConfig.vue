<template>
  <div class="property-config">
    <a-form
      layout="horizontal"
      class="config-form"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
    >
      <a-form-item
        v-for="prop in visibleProps"
        :key="prop.name"
        :label="prop.title"
        class="config-item"
      >
        <!-- Switch控件 -->
        <a-switch
          v-if="prop.control === 'switch'"
          :checked="config[prop.name]"
          @change="(checked) => updateConfig(prop.name, checked)"
        />

        <!-- Radio控件 -->
        <a-radio-group
          v-else-if="prop.control === 'radio'"
          :value="config[prop.name]"
          @change="(e) => updateConfig(prop.name, e.target.value)"
        >
          <a-radio
            v-for="option in prop.options"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </a-radio>
        </a-radio-group>

        <!-- Select控件 -->
        <a-select
          v-else-if="prop.control === 'select'"
          :value="config[prop.name]"
          @change="(value) => updateConfig(prop.name, value)"
          style="width: 100%"
        >
          <a-select-option
            v-for="option in prop.options"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </a-select-option>
        </a-select>

        <!-- Checkbox多选控件 -->
        <a-checkbox-group
          v-else-if="prop.control === 'checkbox'"
          :value="config[prop.name] || []"
          @change="(values) => updateConfig(prop.name, values)"
        >
          <a-checkbox
            v-for="option in prop.options"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </a-checkbox>
        </a-checkbox-group>

        <!-- Input控件 -->
        <a-input-number
          v-if="prop.control === 'input' && prop.type === 'number'"
          :value="config[prop.name]"
          @change="(value) => updateConfig(prop.name, value)"
          style="width: 100%"
        />
        <a-input
          v-else-if="prop.control === 'input'"
          :value="config[prop.name]"
          @change="(e) => updateConfig(prop.name, e.target.value)"
        />

        <div
          v-if="prop.description"
          class="config-description"
        >
          {{ prop.description }}
        </div>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import {
    Form as AForm,
    FormItem as AFormItem,
    Switch as ASwitch,
    RadioGroup as ARadioGroup,
    Radio as ARadio,
    Select as ASelect,
    SelectOption as ASelectOption,
    Input as AInput,
    InputNumber as AInputNumber,
    Checkbox as ACheckbox,
    CheckboxGroup as ACheckboxGroup,
  } from 'ant-design-vue';

  interface PropConfig {
    name: string;
    title: string;
    type: string;
    control: string;
    description?: string;
    options?: Array<{ label: string; value: any }>;
    default?: any;
  }

  interface Props {
    componentConfig: any;
    config: Record<string, any>;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<{
    'update:config': [config: Record<string, any>];
  }>();

  // 过滤可见的属性
  const visibleProps = computed(() => {
    if (!props.componentConfig?.props) return [];
    return props.componentConfig.props.filter((prop: PropConfig) => {
      // 过滤掉一些不需要在配置面板中显示的属性
      const excludeProps = ['modelValue', 'rules'];
      return !excludeProps.includes(prop.name);
    });
  });

  // 更新配置
  const updateConfig = (propName: string, value: any) => {
    const newConfig = { ...props.config };
    newConfig[propName] = value;
    emit('update:config', newConfig);
  };
</script>

<style scoped>
  .property-config {
    padding: 1rem;
  }

  .config-form {
    max-width: 100%;
  }

  .config-item {
    margin-bottom: 1rem;
  }

  .config-description {
    font-size: 0.75rem;
    color: #6a737d;
    line-height: 1.4;
    margin-top: 0.5rem;
  }
</style>
