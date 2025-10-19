import { defineStore } from 'pinia';
import {
  Message,
  MessageType,
  ProcessStatus,
  ProcessStep,
} from '../types/chat';
import { getChatHistory, sendMessage, clearChat } from '../api/chat';
import { getAnswer } from '../api/qa';

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [] as Message[],
  }),
  actions: {
    isComplexQuestion(text: string): boolean {
      const q = (text || '').toLowerCase();
      const keywords = [
        '报错',
        '异常',
        '错误',
        '失败',
        '无法',
        '日志',
        '错误码',
        '立即缴费',
        '复杂',
        '分析',
      ];
      return keywords.some((k) => q.includes(k));
    },
    async initHistory() {
      try {
        const data: any = await getChatHistory({ page: 1, size: 50 });
        if (data && Array.isArray(data.messages)) {
          this.messages = data.messages;
        } else if (this.messages.length === 0) {
          this.messages = [
            {
              id: '1',
              content: '您好，有什么可以帮助您的？',
              type: MessageType.TEXT,
              isUser: false,
              time: Date.now(),
            },
          ];
        }
      } catch (e) {
        if (this.messages.length === 0) {
          this.messages = [
            {
              id: '1',
              content: '您好，有什么可以帮助您的？',
              type: MessageType.TEXT,
              isUser: false,
              time: Date.now(),
            },
          ];
        }
        console.error('获取聊天历史失败:', e);
      }
    },
    add(message: Message) {
      this.messages.push(message);
    },
    replaceLast(message: Message) {
      if (this.messages.length > 0) {
        this.messages[this.messages.length - 1] = message;
      } else {
        this.messages.push(message);
      }
    },
    async persistUserMessage(message: Message) {
      try {
        await sendMessage({
          content: message.content,
          type: message.type,
          fileUrl: message.fileUrl,
          fileName: message.fileName,
          fileSize: message.fileSize,
          isUser: true,
        });
      } catch (e) {
        console.error('发送消息落库失败:', e);
      }
    },
    async persistBotMessage(payload: string | Message) {
      try {
        if (typeof payload === 'string') {
          await sendMessage({ content: payload, type: 'text', isUser: false });
        } else {
          await sendMessage({
            content: payload.content,
            type: payload.type,
            fileUrl: payload.fileUrl,
            fileName: payload.fileName,
            fileSize: payload.fileSize,
            isUser: false,
            processId: payload.processId,
            processStatus: payload.processStatus,
            stepsPreview: payload.stepsPreview,
            linkPath: payload.linkPath,
          });
        }
      } catch (e) {
        console.error('落库机器人消息失败:', e);
      }
    },
    async newSession() {
      try {
        await clearChat();
      } catch (e) {
        console.warn('清空历史失败（mock/后端未响应），继续重置本地：', e);
      }
      // 本地清空
      this.messages = [];
      // 新建会话提示
      const init: Message = {
        id: Date.now().toString(),
        content: '您好，有什么可以帮助您？',
        type: MessageType.TEXT,
        isUser: false,
        time: Date.now(),
      };
      this.add(init);
      // 同步到服务端
      try {
        await this.persistBotMessage(init);
      } catch {}
    },
    createProcessCard(question: string): Message {
      const pid = `pc_${Date.now()}`;
      const steps: ProcessStep[] = [
        { id: 's1', name: '代码分析', status: ProcessStatus.IN_PROGRESS },
        { id: 's2', name: '报错信息查询', status: ProcessStatus.PENDING },
        { id: 's3', name: '日志云检索', status: ProcessStatus.PENDING },
        { id: 's4', name: '关联系统分析', status: ProcessStatus.PENDING },
      ];
      return {
        id: Date.now().toString(),
        content:
          '我们已收到您的问题，正在进行复杂问题处理。您可前往详情页查看进度和结果。',
        type: MessageType.PROCESS,
        isUser: false,
        time: Date.now(),
        processId: pid,
        processStatus: ProcessStatus.IN_PROGRESS,
        stepsPreview: steps,
        linkPath: `/process/${pid}`,
      };
    },
    async ask(question: string): Promise<string> {
      const resp: any = await getAnswer(question);
      const answerText = resp?.answer || '抱歉，未获取到有效回答。';
      return answerText;
    },
    updateProcessPreview(
      processId: string,
      updates: {
        steps?: ProcessStep[];
        processStatus?: ProcessStatus;
        content?: string;
      }
    ) {
      const idx = this.messages.findIndex(
        (m) => m.type === MessageType.PROCESS && m.processId === processId
      );
      if (idx !== -1) {
        const m = { ...this.messages[idx] } as Message;
        if (updates.steps) m.stepsPreview = updates.steps;
        if (updates.processStatus) m.processStatus = updates.processStatus;
        if (typeof updates.content === 'string') m.content = updates.content;
        this.messages[idx] = m;
        // 持久化更新后的处理卡片，便于刷新后仍可见
        this.persistBotMessage(m).catch(() => {});
      }
    },
  },
});
