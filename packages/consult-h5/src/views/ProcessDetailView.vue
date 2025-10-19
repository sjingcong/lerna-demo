<template>
  <div class="process-detail">
    <van-nav-bar title="问题处理详情" left-arrow @click-left="goBack" />

    <div class="content">
      <div class="steps-column">
        <div class="steps-title">处理步骤</div>
        <div class="steps-list">
          <div
            v-for="(s, idx) in steps"
            :key="s.id"
            class="step-item"
            :class="{ active: idx === currentIndex }"
            @click="currentIndex = idx"
          >
            <div class="item-left">
              <div class="step-index">{{ idx + 1 }}</div>
              <div class="step-name">{{ s.name }}</div>
            </div>
            <div class="item-right">
              <van-tag :type="statusType(s.status)">{{ statusText(s.status) }}</van-tag>
            </div>
          </div>
        </div>
      </div>

      <div class="detail-column">
        <div class="detail-header">
          <div class="detail-title">{{ currentStep?.name || '步骤详情' }}</div>
          <van-tag :type="statusType(currentStep?.status)">{{ statusText(currentStep?.status) }}</van-tag>
        </div>
        <div class="detail-body">
          <div class="detail-section">
            <div class="section-title">处理说明</div>
            <div class="section-content">{{ currentStep?.detail || '暂无详情' }}</div>
          </div>
          <div class="detail-section" v-if="currentStep?.result">
            <div class="section-title">处理结果</div>
            <div class="section-content">{{ currentStep?.result }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getProcessDetail } from '../api/process'

const router = useRouter()
const route = useRoute()
const steps = ref<Array<{ id: string; name: string; status: string; detail?: string; result?: string }>>([])
const currentIndex = ref(0)
const currentStep = computed(() => steps.value[currentIndex.value])

const goBack = () => router.back()

const statusText = (s?: string) => {
  switch (s) {
    case 'in_progress': return '进行中'
    case 'success': return '处理成功'
    case 'failed': return '处理失败'
    case 'pending':
    default: return '待处理'
  }
}

const statusType = (s?: string) => {
  switch (s) {
    case 'in_progress': return 'primary'
    case 'success': return 'success'
    case 'failed': return 'danger'
    case 'pending':
    default: return 'warning'
  }
}

onMounted(async () => {
  const id = String(route.params.id || '')
  try {
    const data: any = await getProcessDetail(id)
    steps.value = Array.isArray(data?.steps) ? data.steps : []
  } catch (e) {
    steps.value = [
      { id: 's1', name: '代码分析', status: 'in_progress', detail: '正在分析相关代码模块，定位可能的问题区域。' },
      { id: 's2', name: '报错信息查询', status: 'pending', detail: '根据关键字与错误码查询相关文档与社区问答。' },
      { id: 's3', name: '日志云检索', status: 'pending', detail: '检索日志与指标，查看异常发生的上下文与调用链。' },
      { id: 's4', name: '关联系统分析', status: 'pending', detail: '分析外部依赖与关联系统状态，排查跨系统影响。' }
    ]
  }
})
</script>

<style scoped lang="scss">
.process-detail {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f7f8fa;
}

.content {
  display: flex;
  flex: 1;
  padding: 12px;
  gap: 12px;
}

.steps-column {
  flex: 0 0 42%;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 12px;

  .steps-title { font-weight: 600; color: #333; margin-bottom: 8px; }

  .steps-list {
    display: flex; flex-direction: column; gap: 8px;

    .step-item {
      display: flex; align-items: center; justify-content: space-between;
      border: 1px solid rgba(0,0,0,0.06); border-radius: 10px; padding: 8px 10px;
      cursor: pointer; background: #fff;
    }

    .step-item.active { border-color: #1989fa; box-shadow: 0 2px 6px rgba(25, 137, 250, 0.15); }

    .item-left { display: flex; align-items: center; gap: 8px; }
    .step-index { width: 22px; height: 22px; border-radius: 50%; background: #f2f3f5; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #666; }
    .step-name { font-size: 14px; color: #333; }
  }
}

.detail-column {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 12px;

  .detail-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  .detail-title { font-weight: 600; color: #333; font-size: 16px; }
  .detail-body { display: flex; flex-direction: column; gap: 12px; }

  .detail-section { background: #fafafa; border-radius: 8px; padding: 10px; }
  .section-title { font-weight: 600; color: #333; margin-bottom: 6px; font-size: 14px; }
  .section-content { font-size: 13px; color: #555; line-height: 1.7; }
}

@media (max-width: 768px) {
  .content { flex-direction: column; }
  .steps-column { flex: auto; }
}
</style>