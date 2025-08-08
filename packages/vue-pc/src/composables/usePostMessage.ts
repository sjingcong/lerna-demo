import { ref, type Ref } from 'vue';

/**
 * PostMessage通信服务
 * 提供iframe与父页面之间的双向通信能力
 */
export interface PostMessageData {
  type: string;
  data: any;
}

export interface PostMessageOptions {
  targetOrigin?: string;
}

/**
 * 发送方 - 用于父页面向iframe发送消息
 */
export function usePostMessageSender(iframeRef: Ref<HTMLIFrameElement | undefined>) {
  const isReady = ref(false);
  const messageQueue = ref<PostMessageData[]>([]);

  // 发送消息
  const sendMessage = (message: PostMessageData, options: PostMessageOptions = {}) => {
    const { targetOrigin = '*' } = options;
    
    if (!iframeRef.value?.contentWindow) {
      // iframe未准备好，加入队列
      messageQueue.value.push(message);
      return;
    }

    iframeRef.value.contentWindow.postMessage(message, targetOrigin);
  };

  // iframe加载完成后发送队列中的消息
  const onIframeLoad = () => {
    isReady.value = true;
    
    // 延迟发送，确保iframe内容完全加载
    setTimeout(() => {
      messageQueue.value.forEach(message => {
        sendMessage(message);
      });
      messageQueue.value = [];
    }, 100);
  };

  return {
    isReady,
    sendMessage,
    onIframeLoad
  };
}

/**
 * 接收方 - 用于iframe接收父页面消息
 */
export function usePostMessageReceiver() {
  // 注册消息处理器
  const onMessage = (type: string, handler: (data: any) => void) => {
    const handleMessage = (event: MessageEvent<PostMessageData>) => {
      if (event.data?.type === type) {
        handler(event.data.data);
      }
    };

    window.addEventListener('message', handleMessage);
    
    // 返回取消监听函数
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  };

  return {
    onMessage
  };
}

/**
 * 双向通信 - 同时支持发送和接收
 */
export function usePostMessageBridge(iframeRef: Ref<HTMLIFrameElement | undefined>) {
  const sender = usePostMessageSender(iframeRef);
  const receiver = usePostMessageReceiver();

  return {
    ...sender,
    ...receiver
  };
}