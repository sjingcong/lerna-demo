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
              name="clock-o"
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
            name="clock-o"
            class="tab-icon"
          />
          <span class="tab-text">{{ st.name }}</span>
        </div>
      </div>

      <!-- 次级标题：状态提示 -->
      <div class="card-subtitle">
        <span class="label">{{ isCompleted ? '处理完成' : '处理中' }}</span>
        <van-icon name="arrow-up" />
      </div>

      <!-- 正文内容：处理提示 + 处理结果（完成后显示） -->
      <div class="card-body">
        <div class="content-text">
          {{ displayPrompt }}
        </div>
        <div
          v-if="isCompleted && finalResult"
          class="content-text"
        >
          处理结果：{{ finalResult }}
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
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { getProcessDetail } from '../api/process';
  import { useChatStore } from '../store/chat';
  import { ProcessStatus, ProcessStep } from '../types/chat';

  const router = useRouter();
  const route = useRoute();
  const chatStore = useChatStore();
  const pid = String(route.params.id || '');

  const steps = ref<
    Array<{
      id: string;
      name: string;
      status: string;
      detail?: string;
      result?: string;
      startedAt?: number;
      finishedAt?: number;
    }>
  >([]);
  const currentIndex = ref(0);
  const activeIndex = computed(() => {
    const idx = steps.value.findIndex((s) => s.status === 'in_progress');
    if (idx !== -1) return idx;
    const lastSuccess = [...steps.value]
      .map((s, i) => ({ s, i }))
      .filter((x) => x.s.status === 'success')
      .pop();
    if (lastSuccess) return lastSuccess.i;
    return 0;
  });
  const currentStep = computed(() => steps.value[activeIndex.value]);
  const isCompleted = computed(
    () =>
      steps.value.length > 0 && steps.value.every((s) => s.status === 'success')
  );
  const finalResult = computed(() => {
    if (!steps.value.length) return '';
    return steps.value[steps.value.length - 1].result || '';
  });

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

  // 处理提示动效：进行中时，为 detail 增加动态省略号
  const dotCount = ref(0);
  let promptTimer: any = null;
  const displayPrompt = computed(() => {
    const base = currentStep.value?.detail || '正在处理中，请稍候…';
    if (!currentStep.value) return base;
    if (currentStep.value.status === 'in_progress') {
      const dots = '.'.repeat((dotCount.value % 3) + 1);
      return `${base}${dots}`;
    }
    return base;
  });
  watch(
    () => currentStep.value?.status,
    (status) => {
      if (promptTimer) {
        clearInterval(promptTimer);
        promptTimer = null;
      }
      if (status === 'in_progress') {
        promptTimer = setInterval(() => {
          dotCount.value = (dotCount.value + 1) % 3;
        }, 500);
      }
    },
    { immediate: true }
  );

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
    const s0 = steps.value[0];
    const s1 = steps.value[1];
    const slast = steps.value.length ? steps.value[steps.value.length - 1] : undefined;

    const askTime = recentQuestion.value?.time;
    // 受理/分配/解答的时间只用于展示，不决定“完成”状态
    const acceptTimeRaw = s0?.startedAt ?? s0?.finishedAt ?? askTime;
    const assignTimeRaw = s1?.startedAt ?? s1?.finishedAt ?? s0?.finishedAt ?? askTime;
    const answerTimeRaw = slast?.finishedAt ?? slast?.startedAt ?? assignTimeRaw ?? acceptTimeRaw ?? askTime;

    const askStatus: Stage['status'] = recentQuestion.value ? 'done' : 'todo';
    const acceptStatus: Stage['status'] =
      s0?.status === 'in_progress' ? 'current' : s0?.status === 'success' ? 'done' : 'todo';
    const assignStatus: Stage['status'] =
      s1?.status === 'in_progress' ? 'current' : s1?.status === 'success' ? 'done' : 'todo';
    const answerStatus: Stage['status'] =
      slast?.status === 'in_progress' ? 'current' : slast?.status === 'success' ? 'done' : 'todo';

    const st: Stage[] = [
      { key: 'ask', name: '提问', time: formatDisplayTime(askTime), status: askStatus },
      { key: 'accept', name: '受理', time: formatDisplayTime(acceptTimeRaw), status: acceptStatus },
      { key: 'assign', name: '分配', time: formatDisplayTime(assignTimeRaw), status: assignStatus },
      { key: 'answer', name: '解答', time: formatDisplayTime(answerTimeRaw), status: answerStatus },
    ];
    stages.value = st;
  };

  const syncPreview = async (status: ProcessStatus, content?: string) => {
    const mappedSteps: ProcessStep[] = steps.value.map((s) => ({
      id: s.id,
      name: s.name,
      status: s.status as ProcessStatus,
      result: s.result,
      detail: s.detail,
    }));
    chatStore.updateProcessPreview(pid, {
      steps: mappedSteps,
      processStatus: status,
      content,
    });
  };

  let timer: any = null;
  const startProgress = () => {
    const tickMs = 2500; // 2.5秒推进一步
    const advance = async () => {
      const idx = steps.value.findIndex((s) => s.status === 'in_progress');
      if (idx === -1) {
        const p = steps.value.findIndex((s) => s.status === 'pending');
        if (p !== -1) {
          steps.value[p].status = 'in_progress';
          steps.value[p].startedAt = Date.now();
          await syncPreview(ProcessStatus.IN_PROGRESS);
        }
      } else if (idx < steps.value.length - 1) {
        // 先更新内容与完成时间，再变更状态，避免“状态先完成、内容后更新”的错位
        if (steps.value[idx].detail) {
          steps.value[idx].detail = `${steps.value[idx].detail}（已完成）`;
        }
        steps.value[idx].finishedAt = Date.now();
        steps.value[idx].status = 'success';

        steps.value[idx + 1].status = 'in_progress';
        steps.value[idx + 1].startedAt = Date.now();
        await syncPreview(ProcessStatus.IN_PROGRESS);
      } else {
        // 最后一步完成，生成结论/答案
        const question = recentQuestion.value?.content || '';
        let answer = '';
        try {
          answer = await chatStore.ask(question);
        } catch (e) {
          answer = '综合分析完成：请检查组件库版本与API使用兼容性。';
        }
        steps.value[idx].result = answer;
        steps.value[idx].finishedAt = Date.now();
        steps.value[idx].status = 'success';
        await syncPreview(ProcessStatus.SUCCESS, `处理完成：${answer}`);
        clearInterval(timer);
      }
      computeStages();
    };
    timer = setInterval(advance, tickMs);
  };

  onMounted(async () => {
    await chatStore.initHistory();
    const id = pid;
    try {
      const data: any = await getProcessDetail(id);
      steps.value = Array.isArray(data?.steps) ? data.steps : [];
    } catch (e) {
      steps.value = [
        {
          id: 's1',
          name: '代码分析',
          status: 'in_progress',
          detail: '正在分析问题内容',
          startedAt: Date.now(),
        },
        {
          id: 's2',
          name: '报错信息查询',
          status: 'pending',
          detail: '相关问题已受理',
        },
        {
          id: 's3',
          name: '日志云检索',
          status: 'pending',
          detail: '正在分析并处理该问题',
        },
        {
          id: 's4',
          name: '关联系统分析',
          status: 'pending',
          detail: '相关问题解答中',
        },
      ];
    } finally {
      computeStages();
      startProgress();
    }
  });

  onUnmounted(() => {
    if (timer) clearInterval(timer);
    if (promptTimer) clearInterval(promptTimer);
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
    text-align: center;
    width: 100%;
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
    text-align: center;
    width: 100%;
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
    overflow-x: auto;
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
    word-break: break-word;
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
    white-space: nowrap;
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

  /* 固定顶部标题栏 */
  :deep(.van-nav-bar) {
    position: sticky;
    top: 0;
    z-index: 1000;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }
</style>
