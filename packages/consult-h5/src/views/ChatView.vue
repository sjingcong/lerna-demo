<template>
  <div class="chat-view">
    <van-nav-bar
      title="助手"
      left-arrow
      @click-left="onClickLeft"
    />
    
    <div class="chat-container" ref="chatContainerRef">
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
        <van-icon :name="item.icon" class="entry-icon" />
        <span class="entry-label">{{ item.label }}</span>
      </button>
    </div>

    <div class="input-area">
      <chat-input @send="handleSendMessage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import MessageItem from '../components/chat/MessageItem.vue'
import ChatInput from '../components/chat/ChatInput.vue'
import { Message, MessageType } from '../types/chat'
import { useChatStore } from '../store/chat'
import { Toast } from 'vant'

const router = useRouter()
const chatContainerRef = ref<HTMLElement | null>(null)
const chatStore = useChatStore()
const messageList = computed(() => chatStore.messages)

// 功能入口卡片数据
const entryCards = [
  { key: 'new-products', label: '上新产品', icon: 'apps-o' },
  { key: 'history', label: '历史会话', icon: 'notes-o' },
  { key: 'new', label: '新建会话', icon: 'plus' },
  { key: 'feedback', label: '投诉与建议', icon: 'comment-o' }
]

// 入口点击处理
const handleEntryClick = (key: string) => {
  switch (key) {
    case 'new':
      chatStore.messages = []
      chatStore.add({
        id: Date.now().toString(),
        content: '新会话已创建，您好，有什么可以帮助您？',
        type: MessageType.TEXT,
        isUser: false,
        time: Date.now()
      })
      break
    case 'history':
      Toast('历史会话功能待接入')
      break
    case 'new-products':
      Toast('上新产品功能待接入')
      break
    case 'feedback':
      Toast('投诉与建议已记录，感谢反馈')
      break
  }
}

// 发送消息
const handleSendMessage = async (message: Message) => {
  chatStore.add(message)
  await chatStore.persistUserMessage(message)
  
  // 如果是文本消息，可能触发复杂问题处理
  if (message.type === MessageType.TEXT) {
    // 复杂问题检测
    if (chatStore.isComplexQuestion(message.content)) {
      const card = chatStore.createProcessCard(message.content)
      chatStore.add(card)
      await chatStore.persistBotMessage(card)
    } else {
      // 显示正在输入状态
      chatStore.add({
        id: Date.now().toString(),
        content: '正在思考中...',
        type: MessageType.TEXT,
        isUser: false,
        time: new Date().getTime()
      })

      scrollToBottom()

      try {
        const answerText = await chatStore.ask(message.content)
        // 替换"正在思考中..."消息
        chatStore.replaceLast({
          id: Date.now().toString(),
          content: answerText,
          type: MessageType.TEXT,
          isUser: false,
          time: new Date().getTime()
        })
        // 落库机器人回复
        await chatStore.persistBotMessage(answerText)
      } catch (error) {
        // 替换"正在思考中..."消息为错误提示
        chatStore.replaceLast({
          id: Date.now().toString(),
          content: '抱歉，我遇到了一些问题，请稍后再试。',
          type: MessageType.TEXT,
          isUser: false,
          time: new Date().getTime()
        })
        console.error('问答API调用失败:', error)
      }
    }
  } else {
    // 非文本消息的回复
    chatStore.add({
      id: Date.now().toString(),
      content: '我已收到您的文件，但目前我只能回答文本问题。',
      type: MessageType.TEXT,
      isUser: false,
      time: new Date().getTime()
    })
    // 落库系统提示
    await chatStore.persistBotMessage('我已收到您的文件，但目前我只能回答文本问题。')
  }
  
  scrollToBottom()
  
  nextTick(() => {
    scrollToBottom()
  })
}

// 滚动到底部
const scrollToBottom = () => {
  if (chatContainerRef.value) {
    chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight
  }
}

// 返回
const onClickLeft = () => {
  router.back()
}

onMounted(async () => {
  await chatStore.initHistory()
  scrollToBottom()
})
</script>

<style lang="scss" scoped>
.chat-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background:
    radial-gradient(1200px 600px at 12% 6%, rgba(140, 195, 255, 0.32), rgba(140, 195, 255, 0) 62%),
    radial-gradient(900px 460px at 88% 18%, rgba(110, 180, 255, 0.26), rgba(110, 180, 255, 0) 60%),
    radial-gradient(800px 420px at 30% 85%, rgba(90, 165, 255, 0.22), rgba(90, 165, 255, 0) 58%),
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
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding: 8px 0;
    z-index: 90; /* 低于输入框，避免遮挡 */
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
    border: 1px solid rgba(25, 137, 250, 0.30);
    background-color: rgba(255, 255, 255, 0.95);
    color: #2b4a66;
    box-shadow: 0 4px 12px rgba(0,0,0,0.06);
    cursor: pointer;
    transition: transform 0.16s ease, box-shadow 0.16s ease;
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
    bottom: calc(8px + env(safe-area-inset-bottom, 0px));
    border-radius: 14px;
    padding: 8px 12px;
    background-color: #fff;
    box-shadow: 0 8px 24px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.06);
    z-index: 100;
    border: 1.5px solid rgba(25, 137, 250, 0.45);
  }
}
</style>