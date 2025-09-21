<template>
  <div class="about-container">
    <!-- 头部横幅 -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Vue Mobile Demo</h1>
        <p class="hero-subtitle">基于 Lerna 的现代化 Monorepo 前端项目</p>
        <div class="tech-badges">
          <span class="badge vue">Vue 3.3</span>
          <span class="badge ts">TypeScript 5.0</span>
          <span class="badge vite">Vite 5.0</span>
          <span class="badge lerna">Lerna 8.2</span>
        </div>
      </div>
    </div>

    <!-- 项目概述 -->
    <van-cell-group class="section" title="项目概述">
      <van-cell>
        <div class="overview-content">
          <p class="overview-text">
            这是一个基于 <strong>Lerna</strong> 管理的多包前端项目，采用 <strong>Monorepo</strong> 架构，
            统一管理多个 Vue3 应用和共享库，实现代码复用、模块化开发和统一构建流程。
          </p>
          <div class="features-grid">
            <div class="feature-item">
              <van-icon name="apps-o" class="feature-icon" />
              <span>多包管理</span>
            </div>
            <div class="feature-item">
              <van-icon name="share-o" class="feature-icon" />
              <span>代码共享</span>
            </div>
            <div class="feature-item">
              <van-icon name="setting-o" class="feature-icon" />
              <span>统一构建</span>
            </div>
            <div class="feature-item">
              <van-icon name="shield-o" class="feature-icon" />
              <span>类型安全</span>
            </div>
          </div>
        </div>
      </van-cell>
    </van-cell-group>

    <!-- 技术栈 -->
    <van-cell-group class="section" title="核心技术栈">
      <van-cell 
        v-for="tech in techStack" 
        :key="tech.name"
        :title="tech.name"
        :label="tech.description"
        :value="tech.version"
      >
        <template #icon>
          <div class="tech-icon" :class="tech.className">{{ tech.icon }}</div>
        </template>
      </van-cell>
    </van-cell-group>

    <!-- 子包架构 -->
    <van-cell-group class="section" title="子包架构">
      <van-cell 
        v-for="pkg in packages" 
        :key="pkg.name"
        :title="pkg.name"
        :label="pkg.description"
        is-link
        @click="showPackageDetail(pkg)"
      >
        <template #icon>
          <van-icon :name="pkg.icon" class="package-icon" />
        </template>
        <template #right-icon>
          <van-tag :type="pkg.status === 'stable' ? 'primary' : 'warning'" size="small">
            {{ pkg.status === 'stable' ? '稳定' : '开发中' }}
          </van-tag>
        </template>
      </van-cell>
    </van-cell-group>

    <!-- 性能指标 -->
    <van-cell-group class="section" title="性能表现">
      <van-cell 
        v-for="metric in performanceMetrics" 
        :key="metric.name"
        :title="metric.name"
        :label="metric.description"
        :value="metric.value"
      >
        <template #icon>
          <div class="metric-icon good">{{ metric.icon }}</div>
        </template>
      </van-cell>
    </van-cell-group>

    <!-- 开发指南 -->
    <van-cell-group class="section" title="开发指南">
      <van-cell 
        title="快速开始"
        label="克隆项目并启动开发环境"
        is-link
        @click="showQuickStart = true"
      >
        <template #icon>
          <van-icon name="play-circle-o" class="guide-icon" />
        </template>
      </van-cell>
      <van-cell 
        title="构建部署"
        label="项目构建和部署流程"
        is-link
        @click="showBuildGuide = true"
      >
        <template #icon>
          <van-icon name="completed" class="guide-icon" />
        </template>
      </van-cell>
    </van-cell-group>

    <!-- 项目信息 -->
    <div class="project-info">
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">License</div>
          <div class="info-value">MIT</div>
        </div>
        <div class="info-item">
          <div class="info-label">版本</div>
          <div class="info-value">1.0.0</div>
        </div>
        <div class="info-item">
          <div class="info-label">Node 要求</div>
          <div class="info-value">≥ 18.0</div>
        </div>
        <div class="info-item">
          <div class="info-label">更新时间</div>
          <div class="info-value">{{ lastUpdateTime }}</div>
        </div>
      </div>
    </div>

    <!-- 包详情弹窗 -->
    <van-popup 
      v-model:show="showPackagePopup" 
      position="bottom" 
      :style="{ height: '60%' }"
      round
      closeable
    >
      <div class="package-detail" v-if="selectedPackage">
        <div class="detail-header">
          <van-icon :name="selectedPackage.icon" class="detail-icon" />
          <div>
            <h3>{{ selectedPackage.name }}</h3>
            <p>{{ selectedPackage.description }}</p>
          </div>
        </div>
        <div class="detail-content">
          <h4>主要功能</h4>
          <ul>
            <li v-for="feature in selectedPackage.features" :key="feature">
              {{ feature }}
            </li>
          </ul>
          <h4>技术实现</h4>
          <div class="tech-tags">
            <van-tag 
              v-for="tech in selectedPackage.technologies" 
              :key="tech" 
              type="primary" 
              size="small"
            >
              {{ tech }}
            </van-tag>
          </div>
        </div>
      </div>
    </van-popup>

    <!-- 快速开始弹窗 -->
    <van-dialog
      v-model:show="showQuickStart"
      title="快速开始"
      :show-cancel-button="false"
      confirm-button-text="知道了"
    >
      <div class="code-block">
        <pre><code># 克隆项目
git clone &lt;repository-url&gt;

# 安装依赖
npm install

# 启动开发（交互式选择）
npm run dev

# 或直接启动移动端
npm run vue-mobile</code></pre>
      </div>
    </van-dialog>

    <!-- 构建指南弹窗 -->
    <van-dialog
      v-model:show="showBuildGuide"
      title="构建部署"
      :show-cancel-button="false"
      confirm-button-text="知道了"
    >
      <div class="code-block">
        <pre><code># 构建所有包
npm run build

# 类型检查
npm run type-check

# 代码检查
npm run lint

# 代码格式化
npm run format</code></pre>
      </div>
    </van-dialog>

    <!-- 返回首页按钮 -->
    <div class="bottom-actions">
      <van-button type="primary" block @click="$router.push('/')">
        返回首页
      </van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 响应式数据
const showPackagePopup = ref(false)
const selectedPackage = ref<any>(null)
const showQuickStart = ref(false)
const showBuildGuide = ref(false)

// 技术栈数据
const techStack = ref([
  { name: 'Vue.js', version: '3.3.0', description: '渐进式 JavaScript 框架', icon: '💍', className: 'vue' },
  { name: 'TypeScript', version: '5.0.0', description: 'JavaScript 的超集，提供类型安全', icon: '🔷', className: 'typescript' },
  { name: 'Vite', version: '5.0.0', description: '新一代前端构建工具', icon: '⚡', className: 'vite' },
  { name: 'Vant', version: '4.8.0', description: '移动端 Vue 组件库', icon: '📱', className: 'vant' },
  { name: 'Pinia', version: '3.0.3', description: 'Vue 的状态管理库', icon: '🍍', className: 'pinia' },
  { name: 'Lerna', version: '8.2.3', description: 'Monorepo 管理工具', icon: '📦', className: 'lerna' }
])

// 子包数据
const packages = ref([
  {
    name: 'vue-mobile', description: '移动端 Vue3 应用，集成 Vant UI 组件库', icon: 'phone-o', status: 'stable',
    features: ['移动端自适应布局', 'Vant 组件库集成', '电子签名、表单组件', 'PDF/Excel/Word 文档预览'],
    technologies: ['Vue 3', 'Vant', 'TypeScript', 'Vite']
  },
  {
    name: 'vue-pc', description: 'PC端 Vue3 应用，使用 Ant Design Vue', icon: 'desktop-o', status: 'stable',
    features: ['PC端管理后台', 'Ant Design Vue 组件库', '模板编辑器', '模块化页面构建'],
    technologies: ['Vue 3', 'Ant Design Vue', 'TypeScript', 'Vite']
  },
  {
    name: 'shared', description: '跨平台共享组件库，实现代码复用', icon: 'share-o', status: 'stable',
    features: ['H5 通用组件', '表单字段组件', '模块化渲染引擎', '组合式函数'],
    technologies: ['Vue 3', 'TypeScript', 'Composition API']
  },
  {
    name: 'doc', description: '文档展示系统，组件使用示例和 API 文档', icon: 'description', status: 'stable',
    features: ['组件演示和文档', '代码高亮和预览', 'H5 组件实时预览'],
    technologies: ['Vue 3', 'Ant Design Vue', 'TypeScript']
  },
  {
    name: 'lx', description: '前端埋点 SDK，支持性能监控和行为分析', icon: 'chart-trending-o', status: 'stable',
    features: ['Web Vitals 性能指标监控', 'API 调用、JS 错误埋点', '插件化架构设计'],
    technologies: ['TypeScript', 'Rollup', 'Core-js']
  }
])

// 性能指标数据
const performanceMetrics = ref([
  { name: 'FCP', description: '首次内容绘制时间', value: '1.2s', icon: '⚡' },
  { name: 'LCP', description: '最大内容绘制时间', value: '2.1s', icon: '📊' },
  { name: 'CLS', description: '累积布局偏移', value: '0.05', icon: '📎' },
  { name: 'Bundle Size', description: '打包体积大小', value: '156KB', icon: '📦' }
])

// 计算属性
const lastUpdateTime = computed(() => new Date().toLocaleDateString('zh-CN'))

// 方法
const showPackageDetail = (pkg: any) => {
  selectedPackage.value = pkg
  showPackagePopup.value = true
}
</script>

<style scoped>
.about-container {
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* 头部横幅 */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  text-align: center;
  color: white;
}

.hero-title {
  font-size: 32px;
  font-weight: bold;
  margin: 0 0 12px 0;
  letter-spacing: -0.5px;
}

.hero-subtitle {
  font-size: 16px;
  opacity: 0.9;
  margin: 0 0 24px 0;
  line-height: 1.5;
}

.tech-badges {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
}

.badge {
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  backdrop-filter: blur(10px);
}

.badge.vue { background: rgba(79, 192, 141, 0.3); }
.badge.ts { background: rgba(49, 120, 198, 0.3); }
.badge.vite { background: rgba(255, 196, 0, 0.3); }
.badge.lerna { background: rgba(153, 102, 255, 0.3); }

/* 区块样式 */
.section {
  margin: 16px;
}

.section :deep(.van-cell-group__title) {
  font-weight: bold;
  color: #323233;
  padding-left: 0;
}

/* 概述内容 */
.overview-content {
  padding: 8px 0;
}

.overview-text {
  line-height: 1.6;
  color: #646566;
  margin-bottom: 16px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 14px;
  color: #323233;
}

.feature-icon {
  color: #1989fa;
  font-size: 16px;
}

/* 技术栈图标 */
.tech-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  margin-right: 12px;
}

.tech-icon.vue { background: linear-gradient(45deg, #4fc08d, #42b883); }
.tech-icon.typescript { background: linear-gradient(45deg, #3178c6, #235a97); }
.tech-icon.vite { background: linear-gradient(45deg, #ffc400, #ff9500); }
.tech-icon.vant { background: linear-gradient(45deg, #1989fa, #0570de); }
.tech-icon.pinia { background: linear-gradient(45deg, #ffd93d, #ffb800); }
.tech-icon.lerna { background: linear-gradient(45deg, #9966ff, #7c3aed); }

/* 包图标 */
.package-icon {
  color: #1989fa;
  margin-right: 12px;
  font-size: 18px;
}

/* 指南图标 */
.guide-icon {
  color: #52c41a;
  margin-right: 12px;
  font-size: 18px;
}

/* 性能指标图标 */
.metric-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  margin-right: 12px;
}

.metric-icon.good {
  background: linear-gradient(45deg, #52c41a, #389e0d);
  color: white;
}

/* 项目信息 */
.project-info {
  margin: 16px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  text-align: center;
}

.info-label {
  font-size: 12px;
  color: #969799;
  margin-bottom: 4px;
}

.info-value {
  font-size: 16px;
  font-weight: bold;
  color: #323233;
}

/* 弹窗样式 */
.package-detail {
  padding: 24px;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.detail-icon {
  font-size: 32px;
  color: #1989fa;
}

.detail-header h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  color: #323233;
}

.detail-header p {
  margin: 0;
  color: #646566;
  font-size: 14px;
}

.detail-content h4 {
  margin: 20px 0 12px 0;
  font-size: 16px;
  color: #323233;
}

.detail-content ul {
  margin: 0 0 20px 0;
  padding-left: 20px;
}

.detail-content li {
  margin-bottom: 8px;
  color: #646566;
  line-height: 1.5;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* 代码块 */
.code-block {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  margin: 16px 0;
}

.code-block pre {
  margin: 0;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.5;
  color: #24292e;
  white-space: pre-wrap;
}

/* 底部操作 */
.bottom-actions {
  padding: 20px 16px 40px;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .hero-title {
    font-size: 28px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .tech-badges {
    justify-content: center;
  }
}
</style>