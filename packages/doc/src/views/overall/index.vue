<template>
  <div class="overall-page">
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <Icon icon="mdi:apps" class="title-icon" />
          <h1>工具总览</h1>
        </div>
        <p class="description">查看所有可用的工具和组件</p>
      </div>
    </div>

    <div class="page-content">
      <div class="overview-grid">
        <!-- 这里可以添加工具总览的内容 -->
        <div class="overview-card">
          <div class="card-header">
            <Icon icon="mdi:puzzle" class="card-icon" />
            <h3>规范工具</h3>
          </div>
          <p class="card-description">代码规范、接口规范等开发规范工具</p>
          <router-link to="/tools" class="card-link">查看详情 →</router-link>
        </div>

        <div class="overview-card">
          <div class="card-header">
            <Icon icon="mdi:puzzle-outline" class="card-icon" />
            <h3>通用组件</h3>
          </div>
          <p class="card-description">可复用的通用组件库</p>
          <router-link to="/tools" class="card-link">查看详情 →</router-link>
        </div>

        <div class="overview-card">
          <div class="card-header">
            <Icon icon="mdi:cellphone" class="card-icon" />
            <h3>H5组件</h3>
          </div>
          <p class="card-description">移动端专用组件</p>
          <router-link to="/h5overall" class="card-link">查看详情 →</router-link>
        </div>

        <div class="overview-card">
          <div class="card-header">
            <Icon icon="mdi:form-textbox" class="card-icon" />
            <h3>H5 Field</h3>
          </div>
          <p class="card-description">移动端表单字段组件</p>
          <router-link to="/h5Field" class="card-link">查看详情 →</router-link>
        </div>

        <div class="overview-card">
          <div class="card-header">
            <Icon icon="mdi:loading" class="card-icon" />
            <h3>预加载</h3>
          </div>
          <p class="card-description">资源预加载相关工具</p>
          <router-link to="/tools" class="card-link">查看详情 →</router-link>
        </div>

        <div class="overview-card">
          <div class="card-header">
            <Icon icon="mdi:table" class="card-icon" />
            <h3>表单</h3>
          </div>
          <p class="card-description">表单组件和工具</p>
          <router-link to="/tools" class="card-link">查看详情 →</router-link>
        </div>

        <div class="overview-card">
          <div class="card-header">
            <Icon icon="mdi:view-module" class="card-icon" />
            <h3>ModularCraft</h3>
          </div>
          <p class="card-description">模块化页面搭建框架，支持配置驱动和模块组合</p>
          <router-link to="/modular-craft" class="card-link">查看详情 →</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>

<style scoped>
.overall-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.page-header {
  background: white;
  border-bottom: 1px solid #e1e4e8;
  padding: 2rem 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.title-icon {
  font-size: 2.5rem;
  color: #007acc;
}

.title-section h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.description {
  font-size: 1.2rem;
  color: #6a737d;
  margin: 0;
}

.page-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.overview-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #e1e4e8;
}

.overview-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.card-icon {
  font-size: 2rem;
  color: #007acc;
}

.card-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.card-description {
  color: #6a737d;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.card-link {
  color: #007acc;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.card-link:hover {
  color: #005a9e;
  text-decoration: underline;
}
</style>