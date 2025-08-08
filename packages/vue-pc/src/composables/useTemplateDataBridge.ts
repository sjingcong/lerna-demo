import { watch, type Ref } from 'vue';
import { usePostMessageSender } from './usePostMessage';

/**
 * 模板数据发送方
 * 用于模板编辑页面向预览页面发送数据
 */
export function useTemplateDataSender(iframeRef: Ref<HTMLIFrameElement | undefined>) {
  const { sendMessage, onIframeLoad, isReady } = usePostMessageSender(iframeRef);

  // 发送模板数据
  const sendTemplateData = (moduleData: any) => {
    sendMessage({
      type: 'TEMPLATE_DATA_UPDATE',
      data: moduleData
    });
  };

  // 监听数据变化自动发送
  const watchTemplateData = (dataRef: Ref<any>, transformer?: (data: any) => any) => {
    watch(
      dataRef,
      (newData) => {
        const moduleData = transformer ? transformer(newData) : newData;
        sendTemplateData(moduleData);
      },
      { deep: true }
    );
  };

  return {
    isReady,
    sendTemplateData,
    watchTemplateData,
    onIframeLoad
  };
}

/**
 * 模板数据接收方
 * 用于预览页面接收编辑页面的数据
 */
export function useTemplateDataReceiver() {
  // 注册数据变化回调
  const onDataChange = (callback: (moduleData: any) => void) => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'TEMPLATE_DATA_UPDATE') {
        callback(event.data.data);
      }
    };

    window.addEventListener('message', handleMessage);
    
    // 返回取消监听函数
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  };

  return {
    onDataChange
  };
}