<template>
  <div class="config-container">
    <a-steps
      :current="currentStep"
      class="config-steps"
    >
      <a-step title="基础配置" />
      <a-step title="模块配置" />
    </a-steps>

    <div class="step-content">
      <!-- 步骤1：基础配置 -->
      <div
        v-if="currentStep === 0"
        class="step-panel"
      >
        <div class="step-title">
          <h2>基础配置</h2>
          <p>请填写页面的基本信息</p>
        </div>
        <div class="step-body">
          <!-- 这里将来填充步骤1的内容 -->
          <div class="placeholder">
            <div class="placeholder-icon">⚙️</div>
            <div class="placeholder-text">步骤1内容待开发</div>
          </div>
        </div>
      </div>

      <!-- 步骤2：模块配置 -->
      <div
        v-if="currentStep === 1"
        class="step-panel"
      >
        <div class="step-title">
          <h2>模块配置</h2>
          <p>配置页面的模块和布局设置</p>
        </div>
        <div class="step-body">
          <div class="module-layout">
            <!-- 左侧：模板编辑 -->
            <div class="module-panel left-panel">
              <div class="panel-header">
                <h3>模板编辑</h3>
                <span class="panel-subtitle">Template Edit</span>
              </div>
              <div class="panel-content">
                <TemplateEditPage @data-change="handleTemplateDataChange" />
              </div>
            </div>

            <!-- 右侧：模板预览 -->
            <div class="module-panel right-panel">
              <div class="panel-header">
                <h3>模板预览</h3>
                <span class="panel-subtitle">Template Review</span>
              </div>
              <div class="panel-content">
                <iframe
                  ref="reviewIframe"
                  src="/template-review"
                  class="module-iframe"
                  frameborder="0"
                  @load="onIframeLoad"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="step-actions">
      <a-button
        v-if="currentStep > 0"
        @click="prevStep"
        class="action-btn"
      >
        上一步
      </a-button>
      <a-button
        v-if="currentStep < 1"
        type="primary"
        @click="nextStep"
        class="action-btn"
      >
        下一步
      </a-button>
      <a-button
        v-if="currentStep === 1"
        type="primary"
        @click="handleFinish"
        class="action-btn"
      >
        完成配置
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, toRaw } from 'vue';
  import { message } from 'ant-design-vue';
  import TemplateEditPage from '../templateEdit/page.vue';
  import { useTemplateDataSender } from '@/composables/useTemplateDataBridge';

  // 当前步骤
  const currentStep = ref(0);

  // iframe引用
  const reviewIframe = ref<HTMLIFrameElement>();

  // 使用模板数据桥接服务
  const { sendTemplateData, onIframeLoad, isReady } =
    useTemplateDataSender(reviewIframe);

  // 处理来自TemplateEditPage的数据变化
  const handleTemplateDataChange = (data: any) => {
    // 深度转换响应式对象为普通对象
    const plainData = JSON.parse(JSON.stringify(toRaw(data.moduleData)));
    sendTemplateData(plainData);
  };

  // 下一步
  const nextStep = () => {
    if (currentStep.value < 1) {
      currentStep.value++;
    }
  };

  // 上一步
  const prevStep = () => {
    if (currentStep.value > 0) {
      currentStep.value--;
    }
  };

  // 完成配置
  const handleFinish = () => {
    message.success('页面配置完成！');
    // 这里可以添加保存逻辑
  };
</script>

<style scoped>
  .config-container {
    width: 100vw;
    height: 100vh;
    background: white;
    padding: 32px;
    box-sizing: border-box;
  }

  .config-steps {
    margin-bottom: 32px;
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }

  .module-layout {
    display: flex;
    gap: 24px;
    height: calc(100vh - 200px);
    min-height: 600px;
  }

  .module-panel {
    flex: 1;
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .panel-header {
    padding: 16px 20px;
    background: #fafafa;
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .panel-header h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #262626;
  }

  .panel-subtitle {
    font-size: 12px;
    color: #8c8c8c;
    font-weight: normal;
  }

  .panel-content {
    height: calc(100% - 57px);
    position: relative;
  }

  .module-iframe {
    width: 100%;
    height: 100%;
    border: none;
    background: #fff;
  }

  .step-content {
    min-height: 400px;
    margin-bottom: 32px;
  }

  .step-panel {
    height: 100%;
  }

  .step-title {
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;
  }

  .step-title h2 {
    margin: 0 0 8px 0;
    font-size: 20px;
    color: #262626;
  }

  .step-title p {
    margin: 0;
    color: #8c8c8c;
    font-size: 14px;
  }

  .step-body {
    padding: 24px 0;
  }

  .placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 300px;
    background: #fafafa;
    border: 2px dashed #d9d9d9;
    border-radius: 8px;
    color: #8c8c8c;
  }

  .placeholder-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .placeholder-text {
    font-size: 16px;
  }

  .step-actions {
    display: flex;
    justify-content: center;
    gap: 16px;
    padding-top: 24px;
    border-top: 1px solid #f0f0f0;
  }

  .action-btn {
    min-width: 100px;
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .config-container {
      padding: 24px 16px;
    }

    .step-actions {
      flex-direction: column;
      align-items: center;
    }

    .action-btn {
      width: 100%;
      max-width: 200px;
    }
  }
</style>
