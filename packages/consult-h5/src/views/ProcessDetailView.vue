<template>
  <div class="process-detail">
    <van-nav-bar
      title="问题处理详情"
      left-arrow
      @click-left="goBack"
    />

    <!-- 最近问答 -->
    <div class="qa-section">
      <div
        class="qa-item user"
        v-if="recentQuestion"
      >
        <div class="bubble">{{ recentQuestion?.content }}</div>
        <div class="time">{{ formatDisplayTime(recentQuestion?.time) }}</div>
      </div>
      <div
        class="qa-item bot"
        v-if="recentAnswer"
      >
        <div class="bubble">{{ recentAnswer?.content }}</div>
        <div class="time">{{ formatDisplayTime(recentAnswer?.time) }}</div>
      </div>
    </div>

    <!-- 处理进度总览 -->
    <div class="progress-card">
      <div class="stages">
        <div
          class="stage"
          v-for="(st, idx) in stages"
          :key="st.key"
          :class="[st.status]"
        >
          <div class="time">{{ st.time }}</div>
          <div class="circle">
            <van-icon
              v-if="st.status === 'done'"
              name="success"
            />
            <van-icon
              v-else-if="st.status === 'current'"
              name="success"
            />
            <van-icon
              v-else
              name="clock-o"
            />
          </div>
          <div class="name">{{ st.name }}</div>
        </div>
      </div>
    </div>

    <!-- 当前进度内容卡片（贴近截图风格） -->
    <div class="current-card">
      <!-- 顶部阶段标签 -->
      <div class="tabs">
        <div
          class="tab"
          v-for="st in stages"
          :key="st.key"
          :class="{
            active: st.status === 'current',
            done: st.status === 'done',
          }"
        >
          <van-icon
            v-if="st.status === 'done'"
            name="success"
            class="tab-icon"
          />
          <van-icon
            v-else-if="st.status === 'current'"
            name="success"
            class="tab-icon"
          />
          <span class="tab-text">{{ st.name }}</span>
        </div>
      </div>

      <!-- 次级标题：提问中 + 向上箭头 -->
      <div class="card-subtitle">
        <span class="label">提问中</span>
        <van-icon name="arrow-up" />
      </div>

      <!-- 正文内容 -->
      <div class="card-body">
        <div class="content-text">
          {{
            currentStep?.detail ||
            '内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容'
          }}
        </div>
      </div>

      <!-- 底部动作位 -->
      <div class="card-actions">
        <van-icon name="photo-o" />
        <van-icon name="edit" />
        <van-icon name="notes-o" />
        <van-icon name="replay" />
      </div>
    </div>

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
              <van-tag :type="statusType(s.status)">
                {{ statusText(s.status) }}
              </van-tag>
            </div>
          </div>
        </div>
      </div>

      <div class="detail-column">
        <div class="detail-header">
          <div class="detail-title">{{ currentStep?.name || '步骤详情' }}</div>
          <van-tag :type="statusType(currentStep?.status)">
            {{ statusText(currentStep?.status) }}
          </van-tag>
        </div>
        <div class="detail-body">
          <div class="detail-section">
            <div class="section-title">处理说明</div>
            <div class="section-content">
              {{ currentStep?.detail || '暂无详情' }}
            </div>
          </div>
          <div
            class="detail-section"
            v-if="currentStep?.result"
          >
            <div class="section-title">处理结果</div>
            <div class="section-content">{{ currentStep?.result }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { getProcessDetail } from '../api/process';
  import { useChatStore } from '../store/chat';

  const router = useRouter();
  const route = useRoute();
  const chatStore = useChatStore();

  const steps = ref<
    Array<{
      id: string;
      name: string;
      status: string;
      detail?: string;
      result?: string;
    }>
  >([]);
  const currentIndex = ref(0);
  const currentStep = computed(() => steps.value[currentIndex.value]);

  // 最近问答（从聊天历史中取最新的用户问题与机器人回答）
  const recentQuestion = computed(() => {
    const msgs = chatStore.messages || [];
    for (let i = msgs.length - 1; i >= 0; i--) {
      const m: any = msgs[i];
      if (m && m.isUser && m.type === 'text') return m;
    }
    return null as any;
  });

  const recentAnswer = computed(() => {
    const msgs = chatStore.messages || [];
    for (let i = msgs.length - 1; i >= 0; i--) {
      const m: any = msgs[i];
      if (m && !m.isUser && m.type === 'text') return m;
    }
    return null as any;
  });

  const formatDisplayTime = (ts?: number) => {
    if (!ts) return '';
    const d = new Date(ts);
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    return `${m}月${day}日 ${hh}:${mm}:${ss}`;
  };

  type Stage = {
    key: string;
    name: string;
    time: string;
    status: 'done' | 'current' | 'todo';
  };
  const stages = ref<Stage[]>([]);

  const goBack = () => router.back();

  const statusText = (s?: string) => {
    switch (s) {
      case 'in_progress':
        return '进行中';
      case 'success':
        return '处理成功';
      case 'failed':
        return '处理失败';
      case 'pending':
      default:
        return '待处理';
    }
  };

  const statusType = (s?: string) => {
    switch (s) {
      case 'in_progress':
        return 'primary';
      case 'success':
        return 'success';
      case 'failed':
        return 'danger';
      case 'pending':
      default:
        return 'warning';
    }
  };

  const computeStages = () => {
    const base = Date.now();
    const hasInProgress = steps.value.some((s) => s.status === 'in_progress');
    const hasSuccess = steps.value.some((s) => s.status === 'success');
    const st: Stage[] = [
      {
        key: 'ask',
        name: '提问',
        time: formatDisplayTime(base - 5 * 60 * 1000),
        status: 'done',
      },
      {
        key: 'accept',
        name: '受理',
        time: formatDisplayTime(base - 4 * 60 * 1000),
        status: hasSuccess ? 'done' : hasInProgress ? 'current' : 'todo',
      },
      {
        key: 'assign',
        name: '分配',
        time: formatDisplayTime(base - 3 * 60 * 1000),
        status: hasSuccess ? 'done' : 'todo',
      },
      {
        key: 'answer',
        name: '解答',
        time: formatDisplayTime(base - 2 * 60 * 1000),
        status: hasSuccess ? 'done' : 'todo',
      },
    ];
    stages.value = st;
  };

  onMounted(async () => {
    await chatStore.initHistory();
    const id = String(route.params.id || '');
    try {
      const data: any = await getProcessDetail(id);
      steps.value = Array.isArray(data?.steps) ? data.steps : [];
    } catch (e) {
      steps.value = [
        {
          id: 's1',
          name: '代码分析',
          status: 'in_progress',
          detail: '正在分析相关代码模块，定位可能的问题区域。',
        },
        {
          id: 's2',
          name: '报错信息查询',
          status: 'pending',
          detail: '根据关键字与错误码查询相关文档与社区问答。',
        },
        {
          id: 's3',
          name: '日志云检索',
          status: 'pending',
          detail: '检索日志与指标，查看异常发生的上下文与调用链。',
        },
        {
          id: 's4',
          name: '关联系统分析',
          status: 'pending',
          detail: '分析外部依赖与关联系统状态，排查跨系统影响。',
        },
      ];
    } finally {
      computeStages();
    }
  });
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
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    padding: 12px;

    .steps-title {
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
      font-size: 16px;
    }

    .steps-list {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .step-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: 1px solid rgba(0, 0, 0, 0.06);
        border-radius: 10px;
        padding: 8px 10px;
        cursor: pointer;
        background: #fff;
      }

      .step-item.active {
        border-color: #1989fa;
        box-shadow: 0 2px 6px rgba(25, 137, 250, 0.15);
      }

      .item-left {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .step-index {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: #f2f3f5;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: #666;
      }
      .step-name {
        font-size: 14px;
        color: #333;
      }
    }
  }

  .detail-column {
    flex: 1;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    padding: 12px;

    .detail-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    .detail-title {
      font-weight: 600;
      color: #333;
      font-size: 16px;
    }
    .detail-body {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .detail-section {
      background: #fafafa;
      border-radius: 8px;
      padding: 10px;
    }
    .section-title {
      font-weight: 600;
      color: #333;
      margin-bottom: 6px;
      font-size: 14px;
    }
    .section-content {
      font-size: 13px;
      color: #555;
      line-height: 1.7;
    }
  }

  @media (max-width: 768px) {
    .content {
      flex-direction: column;
    }
    .steps-column {
      flex: auto;
    }
  }
  .qa-section {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .qa-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .qa-item.user {
    align-items: flex-end;
  }
  .qa-item.bot {
    align-items: flex-start;
  }
  .qa-item .bubble {
    max-width: 86%;
    border-radius: 12px;
    padding: 10px 12px;
    line-height: 1.7;
    font-size: 14px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }
  .qa-item.user .bubble {
    background: #1989fa;
    color: #fff;
  }
  .qa-item.bot .bubble {
    background: #fff;
    color: #333;
    border: 1px solid rgba(0, 0, 0, 0.06);
  }
  .qa-item .time {
    font-size: 12px;
    color: #999;
  }

  .progress-card {
    margin: 0 12px;
    margin-bottom: 12px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    padding: 10px 12px;
  }
  .progress-card .stages {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
  }
  .progress-card .stage {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
  }
  .progress-card .stage .time {
    font-size: 11px;
    color: #8c8c8c;
    margin-bottom: 6px;
  }
  .progress-card .stage .circle {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: #f2f3f5;
    border: 2px solid #c9d5f1;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1989fa;
  }
  .progress-card .stage .circle .van-icon {
    font-size: 14px;
  }
  .progress-card .stage.done .circle {
    background: #1989fa;
    border-color: #1989fa;
    color: #fff;
  }
  .progress-card .stage.current .circle {
    border-color: #1989fa;
    background: #eef6ff;
  }
  .progress-card .stage .name {
    font-size: 12px;
    color: #333;
    margin-top: 6px;
  }

  .current-card {
    margin: 0 12px 12px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    padding: 12px;
  }
  .current-card .tabs {
    display: flex;
    align-items: center;
    gap: 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  }
  .current-card .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  .current-card .card-header .title {
    font-weight: 600;
    color: #333;
  }
  .current-card .card-body {
    background: #fafafa;
    border-radius: 8px;
    padding: 10px;
  }
  .current-card .content-text {
    font-size: 13px;
    color: #555;
    line-height: 1.7;
  }
  .current-card .card-actions {
    display: flex;
    gap: 12px;
    padding-top: 10px;
    color: #1989fa;
  }
  .current-card .card-actions .van-icon {
    font-size: 18px;
  }
  .current-card .tab {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 8px;
    border-radius: 12px;
    color: #666;
  }
  .current-card .tab.active,
  .current-card .tab.done {
    color: #1989fa;
    background: #eef6ff;
  }
  .current-card .tab-icon {
    font-size: 12px;
  }
  .current-card .tab-text {
    font-size: 12px;
  }
  .current-card .card-subtitle {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 0;
    color: #666;
  }
  .current-card .card-subtitle .label {
    font-size: 12px;
  }
  .current-card .card-subtitle .van-icon {
    font-size: 12px;
  }
</style>
