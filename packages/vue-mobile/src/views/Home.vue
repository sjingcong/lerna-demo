<template>
  <div class="home-container">
    <!-- 头部 -->
    <div class="header">
      <h1>Vue Mobile Demo</h1>
      <p>基于 Vue3 + Vant + TypeScript 的移动端应用演示</p>
    </div>

    <!-- 功能列表 -->
    <div class="feature-list">
      <!-- 表单组件 -->
      <van-cell-group title="表单组件" inset>
        <van-cell 
          title="电子签名" 
          value="支持轨迹识别的手写签名"
          is-link 
          @click="$router.push('/signature')"
        >
          <template #icon>
            <van-icon name="edit" />
          </template>
        </van-cell>
        <van-cell 
          title="选择器组件" 
          value="多种样式的选择器"
          is-link 
          @click="$router.push('/select-demo')"
        >
          <template #icon>
            <van-icon name="arrow-down" />
          </template>
        </van-cell>
        <van-cell 
          title="地区选择器" 
          value="省市区三级联动"
          is-link 
          @click="$router.push('/area-selector-demo')"
        >
          <template #icon>
            <van-icon name="location-o" />
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 展示组件 -->
      <van-cell-group title="展示组件" inset>
        <van-cell 
          title="订单列表" 
          value="订单管理演示"
          is-link 
          @click="$router.push('/orderList')"
        >
          <template #icon>
            <van-icon name="orders-o" />
          </template>
        </van-cell>
        <van-cell 
          title="表格组件" 
          value="移动端表格展示"
          is-link 
          @click="$router.push('/table-demo')"
        >
          <template #icon>
            <van-icon name="apps-o" />
          </template>
        </van-cell>
        <van-cell 
          title="图标组件" 
          value="图标展示演示"
          is-link 
          @click="$router.push('/icon-demo')"
        >
          <template #icon>
            <van-icon name="photo-o" />
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 文档预览 -->
      <van-cell-group title="文档预览" inset>
        <van-cell 
          title="PDF 预览" 
          value="PDF 文档查看器"
          is-link 
          @click="$router.push('/pdf-demo')"
        >
          <template #icon>
            <van-icon name="description" />
          </template>
        </van-cell>
        <van-cell 
          title="Excel 预览" 
          value="Excel 文档查看器"
          is-link 
          @click="$router.push('/excel-demo')"
        >
          <template #icon>
            <van-icon name="cluster-o" />
          </template>
        </van-cell>
        <van-cell 
          title="Word 预览" 
          value="Word 文档查看器"
          is-link 
          @click="$router.push('/doc-demo')"
        >
          <template #icon>
            <van-icon name="notes-o" />
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 高级功能 -->
      <van-cell-group title="高级功能" inset>
        <van-cell 
          title="模块化构建" 
          value="ModularCraft 演示"
          is-link 
          @click="$router.push('/modular-craft')"
        >
          <template #icon>
            <van-icon name="wap-nav" />
          </template>
        </van-cell>
        <van-cell 
          title="计划书" 
          value="计划书模块配置"
          is-link 
          @click="$router.push('/plan-book/demo')"
        >
          <template #icon>
            <van-icon name="calendar-o" />
          </template>
        </van-cell>
        <van-cell 
          title="安全防护" 
          value="安全组件演示"
          is-link 
          @click="$router.push('/protection')"
        >
          <template #icon>
            <van-icon name="shield-o" />
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 开发工具 -->
      <van-cell-group title="开发工具" inset>
        <van-cell 
          title="关于页面" 
          value="技术栈和语法测试"
          is-link 
          @click="$router.push('/about')"
        >
          <template #icon>
            <van-icon name="info-o" />
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <!-- 底部信息 -->
    <div class="footer">
      <p>技术栈：Vue 3.3 + Vant 4.8 + TypeScript 5.0</p>
      <p>构建工具：Vite 5.0 + Lerna 8.2</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  padding: 40px 20px;
}

.header h1 {
  font-size: 28px;
  font-weight: bold;
  margin: 0 0 12px 0;
}

.header p {
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
}

.feature-list {
  padding: 20px 16px;
}

.feature-list :deep(.van-cell-group) {
  margin-bottom: 16px;
}

.feature-list :deep(.van-cell-group__title) {
  font-weight: bold;
  color: #323233;
}

.feature-list :deep(.van-cell) {
  padding: 16px;
}

.feature-list :deep(.van-cell__title) {
  font-weight: 500;
  color: #323233;
}

.feature-list :deep(.van-cell__value) {
  color: #969799;
  font-size: 14px;
}

.feature-list :deep(.van-icon) {
  color: #1989fa;
  margin-right: 12px;
}

.footer {
  text-align: center;
  padding: 30px 20px;
  color: #969799;
  font-size: 14px;
  border-top: 1px solid #ebedf0;
  background-color: white;
}

.footer p {
  margin: 8px 0;
}
</style>