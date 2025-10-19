<template>
  <div class="chat-view">
    <van-nav-bar
      title="助手"
      left-arrow
      @click-left="onClickLeft"
    />

    <div
      class="chat-container"
      ref="chatContainerRef"
    >
      <div class="message-list">
        <message-item
          v-for="(message, index) in messageList"
          :key="index"
          :message="message"
        />
      </div>
    </div>

    <!-- 功能入口小卡片（输入框上方） -->
    <div class="entry-cards">
      <button
        class="entry-card"
        v-for="item in entryCards"
        :key="item.key"
        @click="handleEntryClick(item.key)"
      >
        <van-icon
          :name="item.icon"
          class="entry-icon"
        />
        <span class="entry-label">{{ item.label }}</span>
      </button>
    </div>

    <div class="input-area">
      <chat-input
        ref="chatInputRef"
        @send="handleSendMessage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, nextTick, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import MessageItem from '../components/chat/MessageItem.vue';
  import ChatInput from '../components/chat/ChatInput.vue';
  import { Message, MessageType } from '../types/chat';
  import { useChatStore } from '../store/chat';
  import { Toast } from 'vant';
  import { clearChat } from '../api/chat';

  const router = useRouter();
  const chatContainerRef = ref<HTMLElement | null>(null);
  const chatStore = useChatStore();
  const messageList = computed(() => chatStore.messages);
  const chatInputRef = ref<InstanceType<typeof ChatInput> | null>(null);

  const toast = (msg: string) => {
    try {
      (Toast as any)(msg);
    } catch (e) {
      try {
        (Toast as any).show?.({ message: msg });
      } catch {
        /* noop */
      }
    }
  };

  // 功能入口卡片数据
  const entryCards = [
    { key: 'quick-ask', label: '快速提问', icon: 'chat-o' },
    { key: 'new-products', label: '上新产品', icon: 'apps-o' },
    { key: 'history', label: '历史会话', icon: 'notes-o' },
    { key: 'new', label: '新建会话', icon: 'plus' },
    { key: 'feedback', label: '投诉建议', icon: 'comment-o' },
  ];

  // 入口点击处理
  const handleEntryClick = async (key: string) => {
    switch (key) {
      case 'quick-ask':
        toast('快速提问：请输入你的问题');
        chatInputRef.value?.focus?.();
        break;
      case 'new':
        if (typeof (chatStore as any).newSession === 'function') {
          await chatStore.newSession();
        } else {
          try {
            await clearChat();
          } catch (e) {
            console.warn('清空历史失败（视图fallback）:', e);
          }
          chatStore.messages = [];
          const init: Message = {
            id: Date.now().toString(),
            content: '新会话已创建，您好，有什么可以帮助您？',
            type: MessageType.TEXT,
            isUser: false,
            time: Date.now(),
          };
          chatStore.add(init);
          try {
            await chatStore.persistBotMessage(init);
          } catch {}
        }
        break;
      case 'history':
        toast('历史会话功能待接入');
        break;
      case 'new-products':
        toast('上新产品功能待接入');
        break;
      case 'feedback':
        toast('投诉与建议已记录，感谢反馈');
        break;
    }
  };

  // 发送消息
  const handleSendMessage = async (message: Message) => {
    chatStore.add(message);
    await chatStore.persistUserMessage(message);

    // 如果是文本消息，可能触发复杂问题处理
    if (message.type === MessageType.TEXT) {
      // 复杂问题检测
      if (chatStore.isComplexQuestion(message.content)) {
        // 先展示一个“思考过程”占位消息，随后替换为处理详情卡片
        const thinkingId = Date.now().toString();
        const thinkingTime = new Date().getTime();
        const phases = [
          '正在识别问题内容',
          '正在构建处理计划',
          '正在准备详情卡片',
        ];
        let phaseIdx = 0;
        let dotCount = 0;
        const intervalMs = 500;
        const maxDurationMs = 2000; // 约2秒后切换为处理卡片
        let elapsed = 0;

        chatStore.add({
          id: thinkingId,
          content: `${phases[phaseIdx]}...`,
          type: MessageType.TEXT,
          isUser: false,
          time: thinkingTime,
        });
        scrollToBottom();

        const timer = setInterval(() => {
          dotCount = (dotCount % 3) + 1;
          // 每700ms切换一次阶段文案，配合动态省略号
          if (elapsed >= 700 && phaseIdx < phases.length - 1) {
            phaseIdx = Math.min(phases.length - 1, Math.floor(elapsed / 700));
          }
          const content = `${phases[phaseIdx]}${'.'.repeat(dotCount)}`;
          chatStore.replaceLast({
            id: thinkingId,
            content,
            type: MessageType.TEXT,
            isUser: false,
            time: thinkingTime,
          });
          scrollToBottom();

          elapsed += intervalMs;
          if (elapsed >= maxDurationMs) {
            clearInterval(timer);
            const card = chatStore.createProcessCard(message.content);
            // 直接用卡片替换“思考过程”占位消息
            chatStore.replaceLast(card);
            chatStore.persistBotMessage(card).catch(() => {});
            scrollToBottom();
          }
        }, intervalMs);
      } else {
        // 思考过程占位与延后展示回答（与复杂问题一致的动效节奏）
        const thinkingId = Date.now().toString();
        const thinkingTime = new Date().getTime();
        const phases = ['正在识别问题内容', '正在生成回答', '正在准备展示'];
        let phaseIdx = 0;
        let dotCount = 0;
        const intervalMs = 500; // 动效帧间隔
        const maxDurationMs = 2000; // 思考过程总时长（约2秒）
        let elapsed = 0;

        // 插入占位消息
        chatStore.add({
          id: thinkingId,
          content: `${phases[phaseIdx]}...`,
          type: MessageType.TEXT,
          isUser: false,
          time: thinkingTime,
        });
        scrollToBottom();

        // 并行准备答案，但只在思考结束后展示
        let answerText = '';
        let askError: any = null;
        const answerPromise = chatStore
          .ask(message.content)
          .then((ans) => {
            answerText = ans || '';
          })
          .catch((err) => {
            askError = err;
          });

        const timer = setInterval(async () => {
          dotCount = (dotCount % 3) + 1;
          // 每700ms切换一次阶段文案，配合动态省略号
          if (elapsed >= 700 && phaseIdx < phases.length - 1) {
            phaseIdx = Math.min(phases.length - 1, Math.floor(elapsed / 700));
          }
          const content = `${phases[phaseIdx]}${'.'.repeat(dotCount)}`;
          chatStore.replaceLast({
            id: thinkingId,
            content,
            type: MessageType.TEXT,
            isUser: false,
            time: thinkingTime,
          });
          scrollToBottom();

          elapsed += intervalMs;
          if (elapsed >= maxDurationMs) {
            clearInterval(timer);

            // 等待答案（如果尚未完成）
            try {
              if (!answerText && !askError) {
                await answerPromise;
              }
            } catch (e) {
              askError = e;
            }

            if (askError) {
              chatStore.replaceLast({
                id: thinkingId,
                content: '抱歉，我遇到了一些问题，请稍后再试。',
                type: MessageType.TEXT,
                isUser: false,
                time: thinkingTime,
              });
              scrollToBottom();
              return;
            }

            const final = answerText || '抱歉，未获取到有效回答。';

            // 回复较短：直接替换完成
            if (final.length <= 20) {
              chatStore.replaceLast({
                id: thinkingId,
                content: final,
                type: MessageType.TEXT,
                isUser: false,
                time: thinkingTime,
              });
              chatStore.persistBotMessage(final).catch(() => {});
              scrollToBottom();
            } else {
              // 回复较长：逐字增量加载（在思考过程结束后开始呈现）
              let shown = '';
              const full = final;
              const chunkSize = 1; // 每次追加1个字符
              const typeIntervalMs = 50; // 50ms一帧，约每秒20字
              const stimer = setInterval(() => {
                const nextLen = Math.min(shown.length + chunkSize, full.length);
                shown = full.slice(0, nextLen);
                chatStore.replaceLast({
                  id: thinkingId,
                  content: shown,
                  type: MessageType.TEXT,
                  isUser: false,
                  time: thinkingTime,
                });
                scrollToBottom();
                if (nextLen >= full.length) {
                  clearInterval(stimer);
                  chatStore.persistBotMessage(full).catch(() => {});
                }
              }, typeIntervalMs);
            }
          }
        }, intervalMs);
      }
    } else {
      // 非文本消息的回复
      chatStore.add({
        id: Date.now().toString(),
        content: '我已收到您的文件，但目前我只能回答文本问题。',
        type: MessageType.TEXT,
        isUser: false,
        time: new Date().getTime(),
      });
      // 落库系统提示
      await chatStore.persistBotMessage(
        '我已收到您的文件，但目前我只能回答文本问题。'
      );
    }

    scrollToBottom();

    nextTick(() => {
      scrollToBottom();
    });
  };

  // 滚动到底部
  const scrollToBottom = () => {
    if (chatContainerRef.value) {
      chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight;
    }
  };

  // 返回
  const onClickLeft = () => {
    router.back();
  };

  onMounted(async () => {
    await chatStore.initHistory();
    scrollToBottom();
  });
</script>

<style lang="scss" scoped>
  .chat-view {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background:
      radial-gradient(
        1200px 600px at 12% 6%,
        rgba(140, 195, 255, 0.32),
        rgba(140, 195, 255, 0) 62%
      ),
      radial-gradient(
        900px 460px at 88% 18%,
        rgba(110, 180, 255, 0.26),
        rgba(110, 180, 255, 0) 60%
      ),
      radial-gradient(
        800px 420px at 30% 85%,
        rgba(90, 165, 255, 0.22),
        rgba(90, 165, 255, 0) 58%
      ),
      linear-gradient(180deg, #f5faff 0%, #e9f3ff 45%, #f5faff 100%);
    background-attachment: fixed;
    .chat-container {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      padding-bottom: calc(188px + env(safe-area-inset-bottom, 0px));
      -webkit-overflow-scrolling: touch;

      .message-list {
        display: flex;
        flex-direction: column;
        padding-bottom: 10px;
      }
    }

    /* 功能入口小卡片容器 */
    .entry-cards {
      position: fixed;
      left: 12px;
      right: 12px;
      bottom: calc(136px + env(safe-area-inset-bottom, 0px));
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: nowrap;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      padding: 8px 0;
      z-index: 90; /* 低于输入框，避免遮挡 */

      /* 隐藏横向滚动条，仍可滑动 */
      -ms-overflow-style: none; /* IE/Edge */
      scrollbar-width: none; /* Firefox */
      &::-webkit-scrollbar {
        width: 0;
        height: 0;
        display: none;
      }
    }
    .entry-card {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 8px 10px;
      min-width: 76px;
      border-radius: 12px;
      border: 1px solid rgba(25, 137, 250, 0.3);
      background-color: rgba(255, 255, 255, 0.95);
      color: #2b4a66;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
      cursor: pointer;
      transition:
        transform 0.16s ease,
        box-shadow 0.16s ease;
    }
    .entry-card:active {
      transform: translateY(1px);
    }
    .entry-icon {
      font-size: 22px;
      color: #1989fa;
      line-height: 1;
    }
    .entry-label {
      font-size: 12px;
      color: #4b6a88;
    }

    .input-area {
      position: fixed;
      left: 12px;
      right: 12px;
      bottom: calc(18px + env(safe-area-inset-bottom, 0px));
      border-radius: 14px;
      padding: 8px 12px;
      background-color: #fff;
      box-shadow:
        0 8px 24px rgba(0, 0, 0, 0.08),
        0 2px 8px rgba(0, 0, 0, 0.06);
      z-index: 100;
      border: 1.5px solid rgba(25, 137, 250, 0.45);
    }
  }
</style>
