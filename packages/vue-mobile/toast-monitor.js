(function() {
  'use strict';
  
  // Toast 统计数据
  const toastStats = {
    count: 0,
    lastAction: null,
    lastShowTime: 0,
    lastHideTime: 0, // 新增：记录上次隐藏时间
    intervals: [],
    anomalyCount: 0
  };
  
  // 异常检测配置
  const ANOMALY_THRESHOLD = 1000; // 1秒
  const MAX_ANOMALY_COUNT = 2; // 连续异常次数阈值
  
   // 统一的异常弹框实例
   let currentAlert = null;

   // 创建统一异常提示元素
   function createUnifiedAlert() {
     const alertDiv = document.createElement('div');
     alertDiv.id = 'toast-unified-alert';
     
     alertDiv.style.cssText = `
       position: fixed;
       top: 20px;
       left: 20px;
       right: 20px;

       background: #ff4444;
       color: white;
       padding: 16px;
       border-radius: 10px;
       box-shadow: 0 4px 12px rgba(0,0,0,0.3);
       z-index: 10000;
       font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
       font-size: 14px;
       max-width: 350px;
       animation: slideIn 0.3s ease-out;
     `;
     
     return alertDiv;
   }
 
   // 显示异常提示 - 简化版本
   function showAnomalyAlert(icon, scenario, description) {
     // 移除已存在的提示
     if (currentAlert) {
       currentAlert.remove();
       currentAlert = null;
     }
     
     const alertDiv = createUnifiedAlert();
    
     
     // 标准化内容格式
     const content = `
      <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
        <span style="font-size: 24px; margin-right: 12px;">${icon}</span>
        <div style="font-size: 16px; font-weight: bold; text-align: center;">${scenario}</div>
      </div>
      
      <div style="margin-bottom: 15px;">
        <div style="font-size: 13px; line-height: 1.5; color: #ffcdd2; text-align: center;">${description}</div>
      </div>  
       
       <div style="display: flex; gap: 8px;">
         <button id="dismiss-unified-alert" style="
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 12px;
          flex: 1;
        ">关闭</button>
       </div>
     `;
     
     alertDiv.innerHTML = content;
     document.body.appendChild(alertDiv);
     currentAlert = alertDiv;
     
     // 添加关闭按钮事件
     const dismissBtn = document.getElementById('dismiss-unified-alert');
     dismissBtn.addEventListener('click', () => {
        alertDiv.remove();
     });
   }
  // 检测异常
  function checkAnomaly(currentTime) {
    // 修改：使用上次隐藏时间到当前显示时间的间隔
    if (toastStats.lastHideTime > 0) {
      const interval = currentTime - toastStats.lastHideTime;
      toastStats.intervals.push(interval);
      
      // 保持最近10次记录
      if (toastStats.intervals.length > 10) {
        toastStats.intervals.shift();
      }
      
      if (interval < ANOMALY_THRESHOLD) {
        toastStats.anomalyCount++;
        // 显示频繁调用异常提示
        showAnomalyAlert(
          '⚠️',
          'Toast 间隔太短',
          `间隔小于 ${ANOMALY_THRESHOLD} 毫秒，当前间隔: ${interval}ms，总计: ${toastStats.count} 次`,
          false,
          false
        );
        
        // 如果连续异常次数过多，显示连续异常警告
        if (toastStats.anomalyCount >= MAX_ANOMALY_COUNT) {
          showAnomalyAlert(
            '🔥',
            '连续toast展示',
            `连续 ${toastStats.anomalyCount} 次检测到间隔异常，可能存在无限循环调用，建议立即检查相关代码逻辑`,
            true,
            true
          );
        }
      } else {
        // 重置异常计数
        toastStats.anomalyCount = 0;
      }
    }
  }
  
  // 拦截 Toast 方法的核心逻辑
  function initVantToastCheck() {
    // 监听 DOM 变化和属性变化来检测 Toast 的显示和隐藏
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // 监听新增的节点
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // 检测 Vant Toast loading 元素
            if (node.classList && (node.classList.contains('van-toast') || node.classList.contains('van-toast--loading'))) {
              const isLoading = node.querySelector('.van-toast--loading') || node.classList.contains('van-toast--loading');
              if (isLoading) {
                onToastLoadingShow(node);
              }
            }
          }
        });
  
        // 监听属性变化（style变化）
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          const target = mutation.target;
          if (target.classList && (target.classList.contains('van-toast') || target.classList.contains('van-toast--loading'))) {
            const isLoading = target.querySelector('.van-toast--loading') || target.classList.contains('van-toast--loading');
            if (isLoading) {
              const computedStyle = window.getComputedStyle(target);
              console.log('display', computedStyle.display)
              if (computedStyle.display === 'none') {
                if (toastStats.lastAction !== 'hide') {
                  onToastLoadingHide(target);
                }
              } else {
                if (toastStats.lastAction !== 'show') {
                  onToastLoadingShow(target);
                }
              }
            }
          }
        }
      });
    });
  
    // 开始观察 DOM 变化，包括属性变化
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true, // 监听属性变化
      attributeFilter: ['style', 'class'] // 只监听style和class属性
    });
  
    console.log('🔍 Toast Loading Monitor: DOM observer started with style monitoring');
  }
  // 清理/重置统计数据的函数
  function clearToastStats() {
    toastStats.count = 0;
    toastStats.lastShowTime = 0;
    toastStats.lastHideTime = 0;
    toastStats.intervals = [];
    toastStats.anomalyCount = 0;
    console.log('🧹 Toast 统计数据已清理重置');
  }
  // Toast Loading 显示时的回调
  function onToastLoadingShow(element) {
    const currentTime = Date.now();
    const message = element.querySelector('.van-toast__text')?.textContent || 'Loading...';
    // 重置统计数据（如果时间间隔超过阈值）
    if (toastStats.lastHideTime > 0) {
      const interval = currentTime - toastStats.lastHideTime;
      if (interval > ANOMALY_THRESHOLD) {
        clearToastStats();
      }
    }
    // 更新统计数据
    toastStats.count++;
    toastStats.lastAction = 'show';
    
    // 检测异常（基于上次隐藏时间）
    checkAnomaly(currentTime);
    
    // 更新最后显示时间
    toastStats.lastShowTime = currentTime;
    
    console.log('🔄 Toast Loading 显示:', {
      message: message,
      element: element,
      timestamp: new Date().toISOString(),
      count: toastStats.count,
      interval: toastStats.intervals[toastStats.intervals.length - 1] || 0
    });

    // 触发自定义事件
    window.dispatchEvent(new CustomEvent('vant-toast-loading-show', {
      detail: {
        message: message,
        element: element,
        timestamp: currentTime,
        count: toastStats.count,
        stats: { ...toastStats }
      }
    }));
  }

  // Toast Loading 隐藏时的回调
  function onToastLoadingHide(element) {
    const currentTime = Date.now();
    
    // 记录隐藏时间
    toastStats.lastHideTime = currentTime;
    toastStats.lastAction = 'hide';
    console.log('✅ Toast Loading 隐藏:', {
      element: element,
      timestamp: new Date().toISOString(),
      totalCount: toastStats.count,
      hideTime: currentTime
    });

    // 触发自定义事件
    window.dispatchEvent(new CustomEvent('vant-toast-loading-hide', {
      detail: {
        element: element,
        timestamp: currentTime,
        stats: { ...toastStats }
      }
    }));
  }
  
  // 提供全局 API
  window.VantToastMonitor = {
    // 获取统计数据
    getStats: function() {
      return { ...toastStats };
    },
    
    // 重置统计数据
    resetStats: function() {
      toastStats.count = 0;
      toastStats.lastShowTime = 0;
      toastStats.lastHideTime = 0; // 重置隐藏时间
      toastStats.intervals = [];
      toastStats.anomalyCount = 0;
      console.log('📊 Toast 统计数据已重置');
    },
    
    // 设置异常阈值
    setAnomalyThreshold: function(threshold) {
      ANOMALY_THRESHOLD = threshold;
      console.log(`⚙️ 异常阈值已设置为: ${threshold}ms`);
    },
    
    // 手动触发异常检测
    checkAnomaly: function() {
      return toastStats.intervals.filter(interval => interval < ANOMALY_THRESHOLD).length;
    },
    
    // 添加监听器
    onShow: function(callback) {
      window.addEventListener('vant-toast-loading-show', callback);
    },
    onHide: function(callback) {
      window.addEventListener('vant-toast-loading-hide', callback);
    },
    
    // 移除监听器
    offShow: function(callback) {
      window.removeEventListener('vant-toast-loading-show', callback);
    },
    offHide: function(callback) {
      window.removeEventListener('vant-toast-loading-hide', callback);
    }
  };

  // 初始化
  initVantToastCheck();
  console.log('🚀 Vant Toast Loading Monitor with Anomaly Detection initialized');
})();