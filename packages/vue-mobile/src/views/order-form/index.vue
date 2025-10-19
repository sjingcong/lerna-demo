<template>
  <div class="order-form-container">
    <h2 class="form-title">订单提交</h2>
    
    <Module title="客户信息" icon="/icons/user.svg">
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <!-- 客户信息 -->
          <van-field
            v-model="formData.customerName"
            name="customerName"
            label="客户姓名"
            placeholder="请输入客户姓名"
            :rules="[{ required: true, message: '请填写客户姓名' }]"
          />
          
          <van-field
            v-model="formData.phone"
            name="phone"
            label="联系电话"
            placeholder="请输入联系电话"
            :rules="[{ required: true, message: '请填写联系电话' }]"
          />
          
          <van-field
            v-model="formData.address"
            name="address"
            label="收货地址"
            placeholder="请输入收货地址"
            :rules="[{ required: true, message: '请填写收货地址' }]"
          />
        </van-cell-group>
      </van-form>
    </Module>
    
    <Module title="订单信息" icon="/icons/shopping-cart.svg">
      <van-form>
        <van-cell-group inset>
          <!-- 订单信息 -->
          <van-field
            v-model="formData.productName"
            name="productName"
            label="产品名称"
            placeholder="请输入产品名称"
            :rules="[{ required: true, message: '请填写产品名称' }]"
          />
          
          <van-field
            v-model="formData.quantity"
            name="quantity"
            label="数量"
            type="digit"
            placeholder="请输入数量"
            :rules="[{ required: true, message: '请填写数量' }]"
          />
          
          <van-field
            v-model="formData.remark"
            name="remark"
            label="备注"
            type="textarea"
            placeholder="请输入备注信息"
            rows="3"
            autosize
          />
        </van-cell-group>
      </van-form>
    </Module>
    
    <Module :border="false">
      <div style="margin: 16px;">
        <van-button round block type="primary" @click="onSubmit">
          提交订单
        </van-button>
      </div>
    </Module>
    
    <!-- 提交成功弹窗 -->
    <van-dialog v-model:show="showSuccessDialog" title="提交成功" confirm-button-text="确定" @confirm="goToOrderList">
      <p class="success-message">订单已成功提交！</p>
    </van-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';
import Module from '../components/Module.vue';

const router = useRouter();

// 表单数据
const formData = reactive({
  customerName: '',
  phone: '',
  productName: '',
  quantity: '',
  address: '',
  remark: ''
});

// 成功弹窗控制
const showSuccessDialog = ref(false);

// 提交表单
const onSubmit = () => {
  // 这里可以添加实际的表单提交逻辑，如API调用等
  console.log('表单数据：', formData);
  
  // 模拟提交成功
  setTimeout(() => {
    showToast('提交成功');
    showSuccessDialog.value = true;
  }, 1000);
};

// 跳转到订单列表
const goToOrderList = () => {
  router.push('/orderList');
};
</script>

<style scoped>
.order-form-container {
  padding: 16px;
  background-color: #f7f8fa;
  min-height: 100vh;
}

.form-title {
  text-align: center;
  margin-bottom: 20px;
  font-size: 20px;
  color: #323233;
}

.success-message {
  text-align: center;
  padding: 20px 0;
  color: #07c160;
}
</style>