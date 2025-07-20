/**
 * JusTalk 浏览器端 SDK
 * 用于与 MCP 服务器通信，发送组件编辑请求
 */

class JusTalkBrowserSDK {
  constructor(options = {}) {
    this.wsUrl = options.wsUrl || 'ws://localhost:3001';
    this.ws = null;
    this.isConnected = false;
    this.messageHandlers = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = options.maxReconnectAttempts || 5;
    this.reconnectDelay = options.reconnectDelay || 1000;
    
    // 事件回调
    this.onConnect = options.onConnect || (() => {});
    this.onDisconnect = options.onDisconnect || (() => {});
    this.onError = options.onError || ((error) => console.error('JusTalk SDK Error:', error));
    this.onMessage = options.onMessage || (() => {});
  }

  /**
   * 连接到 MCP 服务器
   */
  async connect() {
    try {
      this.ws = new WebSocket(this.wsUrl);
      
      this.ws.onopen = () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        console.log('✅ JusTalk SDK connected to MCP server');
        this.onConnect();
      };
      
      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          this.onError(new Error(`Failed to parse message: ${error.message}`));
        }
      };
      
      this.ws.onclose = () => {
        this.isConnected = false;
        console.log('❌ JusTalk SDK disconnected from MCP server');
        this.onDisconnect();
        this.attemptReconnect();
      };
      
      this.ws.onerror = (error) => {
        this.onError(new Error(`WebSocket error: ${error.message || 'Unknown error'}`));
      };
      
    } catch (error) {
      this.onError(new Error(`Failed to connect: ${error.message}`));
    }
  }

  /**
   * 断开连接
   */
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }

  /**
   * 尝试重连
   */
  attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.onError(new Error('Max reconnection attempts reached'));
      return;
    }
    
    this.reconnectAttempts++;
    console.log(`🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
    
    setTimeout(() => {
      this.connect();
    }, this.reconnectDelay * this.reconnectAttempts);
  }

  /**
   * 处理接收到的消息
   */
  handleMessage(message) {
    this.onMessage(message);
    
    // 处理特定类型的消息
    const handler = this.messageHandlers.get(message.type);
    if (handler) {
      handler(message);
    }
    
    // 处理响应消息
    if (message.id && this.messageHandlers.has(message.id)) {
      const responseHandler = this.messageHandlers.get(message.id);
      responseHandler(message);
      this.messageHandlers.delete(message.id);
    }
  }

  /**
   * 发送消息
   */
  sendMessage(message) {
    if (!this.isConnected || !this.ws) {
      throw new Error('Not connected to MCP server');
    }
    
    this.ws.send(JSON.stringify(message));
  }

  /**
   * 编辑组件
   * @param {Object} options 编辑选项
   * @param {string} options.instruction 编辑指令
   * @param {Object} options.component 组件信息
   * @param {Object} options.context 项目上下文
   * @param {Object} options.pageContext 页面上下文
   * @returns {Promise} 编辑结果
   */
  async editComponent(options) {
    const { instruction, component, context, pageContext } = options;
    
    if (!instruction) {
      throw new Error('Instruction is required');
    }
    
    if (!component) {
      throw new Error('Component information is required');
    }
    
    const messageId = `edit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const message = {
      id: messageId,
      type: 'COMPONENT_EDIT_REQUEST',
      payload: {
        instruction,
        component,
        context: context || this.getDefaultContext(),
        pageContext: pageContext || this.getDefaultPageContext(),
        timestamp: Date.now()
      },
      timestamp: Date.now()
    };
    
    return new Promise((resolve, reject) => {
      // 设置响应处理器
      this.messageHandlers.set(messageId, (response) => {
        if (response.type === 'EDIT_COMPLETE') {
          if (response.payload.success) {
            resolve(response.payload);
          } else {
            reject(new Error(response.payload.message || 'Edit failed'));
          }
        } else {
          resolve(response.payload);
        }
      });
      
      // 设置超时
      setTimeout(() => {
        if (this.messageHandlers.has(messageId)) {
          this.messageHandlers.delete(messageId);
          reject(new Error('Edit request timeout'));
        }
      }, 30000); // 30秒超时
      
      try {
        this.sendMessage(message);
      } catch (error) {
        this.messageHandlers.delete(messageId);
        reject(error);
      }
    });
  }

  /**
   * 监听消息类型
   */
  on(messageType, handler) {
    this.messageHandlers.set(messageType, handler);
  }

  /**
   * 移除消息监听器
   */
  off(messageType) {
    this.messageHandlers.delete(messageType);
  }

  /**
   * 获取默认项目上下文
   */
  getDefaultContext() {
    return {
      framework: this.detectFramework(),
      componentLibrary: this.detectComponentLibrary(),
      styleFramework: this.detectStyleFramework(),
      projectRoot: window.location.origin
    };
  }

  /**
   * 获取默认页面上下文
   */
  getDefaultPageContext() {
    return {
      url: window.location.href,
      title: document.title,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
  }

  /**
   * 检测前端框架
   */
  detectFramework() {
    if (window.React) return 'React';
    if (window.Vue) return 'Vue';
    if (window.angular) return 'Angular';
    return 'Unknown';
  }

  /**
   * 检测组件库
   */
  detectComponentLibrary() {
    if (window.antd) return 'Ant Design';
    if (document.querySelector('[class*="el-"]')) return 'Element UI';
    if (document.querySelector('[class*="van-"]')) return 'Vant';
    return 'Unknown';
  }

  /**
   * 检测样式框架
   */
  detectStyleFramework() {
    const stylesheets = Array.from(document.styleSheets);
    
    for (const sheet of stylesheets) {
      try {
        const href = sheet.href || '';
        if (href.includes('tailwind')) return 'Tailwind CSS';
        if (href.includes('bootstrap')) return 'Bootstrap';
      } catch (e) {
        // 跨域样式表无法访问
      }
    }
    
    return 'CSS';
  }

  /**
   * 从DOM元素提取组件信息
   */
  extractComponentInfo(element) {
    if (!element) {
      throw new Error('Element is required');
    }
    
    const rect = element.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(element);
    
    return {
      id: element.id || `component-${Date.now()}`,
      name: element.tagName.toLowerCase(),
      type: element.type || element.tagName.toLowerCase(),
      props: this.extractProps(element),
      styles: this.extractStyles(computedStyle),
      sourceMap: {
        filePath: this.guessFilePath(element),
        lineNumber: 0, // 无法从DOM获取确切行号
        columnNumber: 0
      },
      position: {
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height
      }
    };
  }

  /**
   * 提取元素属性
   */
  extractProps(element) {
    const props = {};
    
    // 提取常见属性
    ['id', 'className', 'title', 'alt', 'src', 'href', 'value', 'placeholder'].forEach(attr => {
      if (element[attr]) {
        props[attr] = element[attr];
      }
    });
    
    // 提取文本内容
    if (element.textContent && element.textContent.trim()) {
      props.children = element.textContent.trim();
    }
    
    return props;
  }

  /**
   * 提取样式信息
   */
  extractStyles(computedStyle) {
    const styles = {};
    
    // 提取常见样式属性
    [
      'backgroundColor', 'color', 'fontSize', 'fontWeight', 'fontFamily',
      'padding', 'margin', 'border', 'borderRadius', 'width', 'height',
      'display', 'position', 'top', 'left', 'right', 'bottom'
    ].forEach(prop => {
      const value = computedStyle[prop];
      if (value && value !== 'initial' && value !== 'auto') {
        styles[prop] = value;
      }
    });
    
    return styles;
  }

  /**
   * 猜测文件路径（基于类名或其他线索）
   */
  guessFilePath(element) {
    const className = element.className;
    if (typeof className === 'string') {
      // 尝试从类名推断组件名
      const matches = className.match(/([A-Z][a-z]+)/g);
      if (matches && matches.length > 0) {
        return `/src/components/${matches[0]}.tsx`;
      }
    }
    
    return `/src/components/${element.tagName.toLowerCase()}.tsx`;
  }
}

// 使用示例
if (typeof window !== 'undefined') {
  window.JusTalkBrowserSDK = JusTalkBrowserSDK;
  
  // 创建全局实例
  window.justalk = new JusTalkBrowserSDK({
    onConnect: () => console.log('🎯 JusTalk SDK Ready!'),
    onDisconnect: () => console.log('🔌 JusTalk SDK Disconnected'),
    onError: (error) => console.error('❌ JusTalk SDK Error:', error),
    onMessage: (message) => console.log('📨 JusTalk Message:', message)
  });
  
  // 自动连接
  window.justalk.connect();
}

// 导出（如果在模块环境中）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = JusTalkBrowserSDK;
}