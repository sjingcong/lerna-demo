<template>
  <div class="select-demo">
    <div class="demo-header">
      <h2>Select 组件演示</h2>
    </div>

    <!-- 1. 单选和多选功能展示 -->
    <div class="demo-section">
      <h3>1. 单选和多选功能（默认Grid布局）</h3>
      
      <div class="demo-item">
        <p>单选模式：</p>
        <Select
          v-model="singleValue"
          :options="genderOptions"
          layout-type="grid"
          :items-per-row="2"
          @change="handleChange"
        />
        <p class="result">选中值：{{ singleValue }}</p>
      </div>
      
      <div class="demo-item">
        <p>多选模式：</p>
        <Select
          v-model="multipleValue"
          :options="cityOptions.slice(0, 6)"
          layout-type="grid"
          :items-per-row="3"
          multiple
          @change="handleChange"
        />
        <p class="result">选中值：{{ multipleValue }}</p>
      </div>
    </div>

    <!-- 2. 单选的1-5列功能展示 -->
    <div class="demo-section">
      <h3>2. 单选Grid布局列数展示</h3>
      
      <div class="demo-item">
        <p>1列：</p>
        <Select
          v-model="gridValue1"
          :options="cityOptions.slice(0, 3)"
          layout-type="grid"
          :items-per-row="1"
          @change="handleChange"
        />
        <p class="result">{{ gridValue1 }}</p>
      </div>
      
      <div class="demo-item">
        <p>2列：</p>
        <Select
          v-model="gridValue2"
          :options="cityOptions.slice(0, 4)"
          layout-type="grid"
          :items-per-row="2"
          @change="handleChange"
        />
        <p class="result">{{ gridValue2 }}</p>
      </div>
      
      <div class="demo-item">
        <p>3列：</p>
        <Select
          v-model="gridValue3"
          :options="cityOptions.slice(0, 6)"
          layout-type="grid"
          :items-per-row="3"
          @change="handleChange"
        />
        <p class="result">{{ gridValue3 }}</p>
      </div>
      
      <div class="demo-item">
        <p>4列：</p>
        <Select
          v-model="gridValue4"
          :options="cityOptions"
          layout-type="grid"
          :items-per-row="4"
          @change="handleChange"
        />
        <p class="result">{{ gridValue4 }}</p>
      </div>
      
      <div class="demo-item">
        <p>5列：</p>
        <Select
          v-model="gridValue5"
          :options="cityOptions.slice(0, 10)"
          layout-type="grid"
          :items-per-row="5"
          @change="handleChange"
        />
        <p class="result">{{ gridValue5 }}</p>
      </div>
    </div>

    <!-- 3. 自适应宽度功能展示 -->
    <div class="demo-section">
      <h3>3. 自适应宽度功能</h3>
      
      <div class="demo-item">
        <p>Grid自适应宽度：</p>
        <Select
          v-model="gridValueAuto"
          :options="autoWidthOptions"
          layout-type="grid"
          @change="handleChange"
        />
        <p class="result">{{ gridValueAuto }}</p>
      </div>
      
      <div class="demo-item">
        <p>Scroll自适应宽度：</p>
        <Select
          v-model="scrollValueAuto"
          :options="autoWidthOptions"
          layout-type="scroll"
          @change="handleChange"
        />
        <p class="result">{{ scrollValueAuto }}</p>
      </div>
    </div>

    <!-- 4. 自定义内容功能展示 -->
    <div class="demo-section">
      <h3>4. 自定义内容功能</h3>
      
      <div class="demo-item">
        <p>自定义选项内容：</p>
        <Select
          v-model="customSlotValue"
          :options="customSlotOptions"
          layout-type="grid"
          :items-per-row="2"
          @change="handleChange"
        >
          <template #option="{ option, selected }">
            <div class="custom-option">
              <span class="custom-option__icon">{{ option.icon }}</span>
              <span class="custom-option__text">{{ option.label }}</span>
              <span
                v-if="selected"
                class="custom-option__check"
              >
                ✓
              </span>
            </div>
          </template>
        </Select>
        <p class="result">{{ customSlotValue }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import Select from './index.vue';
  import type { SelectOption } from './types';

  // 1. 单选和多选功能
  const singleValue = ref<string>('');
  const multipleValue = ref<string[]>([]);
  
  // 2. Grid布局列数展示
  const gridValue1 = ref<string>('');
  const gridValue2 = ref<string>('');
  const gridValue3 = ref<string>('');
  const gridValue4 = ref<string>('');
  const gridValue5 = ref<string>('');
   
  // 3. 自适应宽度功能
  const gridValueAuto = ref<string>('');
  const scrollValueAuto = ref<string>('');

  // 4. 自定义内容功能
  const customSlotValue = ref<string>('');

  // 选项数据
  const genderOptions: SelectOption[] = [
    { label: '男', value: 'male' },
    { label: '女', value: 'female' },
  ];

  const cityOptions: SelectOption[] = [
    { label: '北京', value: 'beijing' },
    { label: '上海', value: 'shanghai' },
    { label: '广州', value: 'guangzhou' },
    { label: '深圳', value: 'shenzhen' },
    { label: '杭州', value: 'hangzhou' },
    { label: '南京', value: 'nanjing' },
    { label: '成都', value: 'chengdu' },
    { label: '重庆', value: 'chongqing' },
  ];

  const autoWidthOptions: SelectOption[] = [
    { label: '短', value: 'short' },
    { label: '中等长度', value: 'medium' },
    { label: '这是一个很长的选项文本', value: 'long' },
    { label: '超级超级超级长的选项内容展示', value: 'very_long' },
  ];

  const customSlotOptions: SelectOption[] = [
    { label: '首页', value: 'home', icon: '🏠' },
    { label: '用户', value: 'user', icon: '👤' },
    { label: '设置', value: 'settings', icon: '⚙️' },
    { label: '帮助', value: 'help', icon: '❓' },
  ];

  const handleChange = (value: any) => {
    console.log('Select 值变化：', value);
  };
</script>

<style scoped>
  .select-demo {
    padding: 20px;
    background-color: #f5f5f5;
    min-height: 100vh;
  }

  .demo-header {
    text-align: center;
    margin-bottom: 30px;
  }

  .demo-header h2 {
    color: #333;
    font-size: 24px;
    margin: 0;
  }

  .demo-section {
    background-color: #fff;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .demo-section h3 {
    color: #333;
    font-size: 18px;
    margin: 0 0 12px 0;
    border-bottom: 2px solid #ff6b35;
    padding-bottom: 6px;
  }

  .demo-item {
    margin-bottom: 16px;
  }

  .demo-item:last-child {
    margin-bottom: 0;
  }

  .demo-section p {
    color: #666;
    font-size: 14px;
    margin: 0 0 8px 0;
  }

  .result {
    background-color: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 6px;
    padding: 6px 10px;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    color: #495057;
    margin-top: 6px;
  }

  .custom-option {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .custom-option__icon {
    font-size: 16px;
  }

  .custom-option__text {
    flex: 1;
  }

  .custom-option__check {
    color: #ff6b35;
    font-weight: bold;
  }
</style>
