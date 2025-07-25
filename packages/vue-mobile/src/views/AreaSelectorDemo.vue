<template>
  <div class="area-selector-demo">
    <div class="demo-header">
      <h1>省市区选择器演示</h1>
      <p>基于Vant级联组件实现的三级联动选择器</p>
    </div>

    <div class="demo-content">
      <div class="demo-section">
        <h2>基础用法</h2>
        <AreaSelector 
          v-model="selectedArea1" 
          @change="handleAreaChange1"
        />
        <div class="result-display" v-if="selectedArea1">
          <p><strong>选择结果：</strong>{{ selectedArea1 }}</p>
          <div v-if="areaInfo1" class="area-info">
            <p><strong>详细信息：</strong></p>
            <ul>
              <li>省份：{{ areaInfo1.provinceName }} ({{ areaInfo1.provinceId }})</li>
              <li>城市：{{ areaInfo1.cityName }} ({{ areaInfo1.cityId }})</li>
              <li>区域：{{ areaInfo1.areaName }} ({{ areaInfo1.areaId }})</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="demo-section">
        <h2>自定义标签和占位符</h2>
        <AreaSelector 
          v-model="selectedArea2" 
          label="收货地址"
          placeholder="请选择收货地址"
          @change="handleAreaChange2"
        />
        <div class="result-display" v-if="selectedArea2">
          <p><strong>选择结果：</strong>{{ selectedArea2 }}</p>
        </div>
      </div>

      <div class="demo-section">
        <h2>表单集成示例</h2>
        <van-form @submit="onSubmit">
          <van-field
            v-model="form.name"
            name="name"
            label="姓名"
            placeholder="请输入姓名"
            :rules="[{ required: true, message: '请填写姓名' }]"
          />
          <van-field
            v-model="form.phone"
            name="phone"
            label="手机号"
            placeholder="请输入手机号"
            :rules="[{ required: true, message: '请填写手机号' }]"
          />
          <AreaSelector 
            v-model="form.area" 
            label="所在地区"
            @change="handleFormAreaChange"
          />
          <van-field
            v-model="form.address"
            name="address"
            label="详细地址"
            placeholder="请输入详细地址"
            :rules="[{ required: true, message: '请填写详细地址' }]"
          />
          <div class="submit-section">
            <van-button round block type="primary" native-type="submit">
              提交表单
            </van-button>
          </div>
        </van-form>
      </div>

      <div class="demo-section">
        <h2>操作按钮</h2>
        <div class="button-group">
          <van-button type="default" @click="clearAll">清空所有选择</van-button>
          <van-button type="primary" @click="setDefaultArea">设置默认地区</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { showToast } from 'vant'
import AreaSelector from '@/components/AreaSelector.vue'

// 响应式数据
const selectedArea1 = ref('')
const selectedArea2 = ref('')
const areaInfo1 = ref<any>(null)

// 表单数据
const form = reactive({
  name: '',
  phone: '',
  area: '',
  address: ''
})

// 处理第一个选择器的变化
const handleAreaChange1 = (areaData: any) => {
  console.log('第一个选择器变化:', areaData)
  areaInfo1.value = areaData
  showToast(`已选择：${areaData.provinceName} ${areaData.cityName} ${areaData.areaName}`)
}

// 处理第二个选择器的变化
const handleAreaChange2 = (areaData: any) => {
  console.log('第二个选择器变化:', areaData)
  showToast(`收货地址已设置为：${areaData.provinceName} ${areaData.cityName} ${areaData.areaName}`)
}

// 处理表单中选择器的变化
const handleFormAreaChange = (areaData: any) => {
  console.log('表单地区选择变化:', areaData)
}

// 表单提交
const onSubmit = (values: any) => {
  console.log('表单提交:', values)
  showToast('表单提交成功！')
}

// 清空所有选择
const clearAll = () => {
  selectedArea1.value = ''
  selectedArea2.value = ''
  form.area = ''
  areaInfo1.value = null
  showToast('已清空所有选择')
}

// 设置默认地区
const setDefaultArea = () => {
  selectedArea1.value = '广东省 深圳市 南山区'
  showToast('已设置默认地区')
}
</script>

<style scoped>
.area-selector-demo {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding: 0;
}

.demo-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 20px 30px;
  text-align: center;
}

.demo-header h1 {
  margin: 0 0 10px 0;
  font-size: 24px;
  font-weight: 600;
}

.demo-header p {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

.demo-content {
  padding: 20px;
}

.demo-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.demo-section h2 {
  margin: 0 0 20px 0;
  font-size: 18px;
  color: #323233;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
}

.result-display {
  margin-top: 16px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #1989fa;
}

.result-display p {
  margin: 0 0 8px 0;
  color: #323233;
}

.area-info {
  margin-top: 12px;
}

.area-info ul {
  margin: 8px 0 0 0;
  padding-left: 20px;
}

.area-info li {
  margin-bottom: 4px;
  color: #646566;
  font-size: 14px;
}

.submit-section {
  margin-top: 24px;
  padding: 0 16px;
}

.button-group {
  display: flex;
  gap: 12px;
}

.button-group .van-button {
  flex: 1;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .demo-content {
    padding: 16px;
  }
  
  .demo-section {
    padding: 16px;
    margin-bottom: 16px;
  }
  
  .demo-header {
    padding: 30px 16px 20px;
  }
  
  .demo-header h1 {
    font-size: 20px;
  }
  
  .button-group {
    flex-direction: column;
  }
  
  .button-group .van-button {
    flex: none;
  }
}
</style>