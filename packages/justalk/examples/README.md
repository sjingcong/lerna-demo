# JusTalk 示例文件

这个目录包含了 JusTalk MCP 服务的使用示例。

## 文件说明

### 📁 文件列表

- **`browser-sdk.js`** - 浏览器端 SDK，用于与 MCP 服务器通信
- **`browser-example.html`** - 完整的浏览器端示例页面
- **`websocket-client.html`** - WebSocket 连接测试工具

## 🚀 快速开始

### 1. 启动 MCP 服务器

首先确保 MCP 服务器正在运行：

```bash
# 在项目根目录下
cd packages/justalk
npm run start:mcp
```

服务器将在 `ws://localhost:3001` 启动 WebSocket 服务。

### 2. 配置 Cursor

按照 `CURSOR_INTEGRATION.md` 中的说明配置 Cursor 的 MCP 设置。

### 3. 使用浏览器示例

#### 方法一：直接打开 HTML 文件

```bash
# 在浏览器中打开
open browser-example.html
```

#### 方法二：使用本地服务器（推荐）

```bash
# 使用 Python 启动本地服务器
python -m http.server 8080

# 或使用 Node.js
npx serve .

# 然后在浏览器中访问
# http://localhost:8080/browser-example.html
```

## 📖 使用说明

### browser-example.html

这是一个完整的浏览器端示例，展示了如何：

1. **连接 MCP 服务器**
   - 点击"连接"按钮建立 WebSocket 连接
   - 实时显示连接状态

2. **选择组件**
   - 点击示例组件进行选择
   - 支持按钮、输入框、卡片等组件类型

3. **发送编辑请求**
   - 输入编辑指令（如："将按钮颜色改为蓝色"）
   - 点击"发送编辑请求"按钮
   - 请求将通过 MCP 服务器转发给 Cursor

4. **查看结果**
   - 实时日志显示所有消息
   - 编辑完成后会收到通知

### browser-sdk.js

浏览器端 SDK 提供了以下功能：

```javascript
// 创建 SDK 实例
const sdk = new JusTalkBrowserSDK({
  wsUrl: 'ws://localhost:3001',
  onConnect: () => console.log('连接成功'),
  onDisconnect: () => console.log('连接断开'),
  onError: (error) => console.error('错误:', error),
  onMessage: (message) => console.log('消息:', message)
});

// 连接到服务器
await sdk.connect();

// 发送编辑请求
const result = await sdk.editComponent({
  instruction: '将按钮颜色改为蓝色',
  component: {
    id: 'my-button',
    type: 'button',
    // ... 其他组件信息
  }
});
```

### websocket-client.html

简单的 WebSocket 测试工具，用于：
- 测试与 MCP 服务器的连接
- 发送自定义消息
- 查看服务器响应

## 🔧 开发指南

### 自定义组件信息

在实际项目中，你需要提供准确的组件信息：

```javascript
const component = {
  id: 'unique-component-id',
  name: 'MyButton',
  type: 'button',
  props: {
    className: 'btn btn-primary',
    children: '点击我',
    onClick: 'handleClick'
  },
  sourceMap: {
    filePath: '/src/components/MyButton.tsx',
    lineNumber: 15,
    columnNumber: 8
  },
  styles: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '8px 16px'
  }
};
```

### 错误处理

```javascript
try {
  const result = await sdk.editComponent(options);
  console.log('编辑成功:', result);
} catch (error) {
  console.error('编辑失败:', error.message);
}
```

### 消息监听

```javascript
// 监听特定类型的消息
sdk.on('COMPONENT_CHANGED', (message) => {
  console.log('组件已更新:', message.payload);
});

// 监听编辑完成
sdk.on('EDIT_COMPLETE', (message) => {
  if (message.payload.success) {
    console.log('编辑成功');
  } else {
    console.error('编辑失败:', message.payload.message);
  }
});
```

## 🐛 故障排除

### 常见问题

1. **无法连接到 MCP 服务器**
   - 确保 MCP 服务器正在运行
   - 检查端口是否正确（默认 3001）
   - 查看浏览器控制台的错误信息

2. **编辑请求没有响应**
   - 确保 Cursor 已正确配置 MCP
   - 检查 MCP 服务器日志
   - 验证组件信息是否正确

3. **CORS 错误**
   - 使用本地服务器而不是直接打开 HTML 文件
   - 确保 MCP 服务器允许跨域请求

### 调试技巧

1. **查看网络请求**
   - 打开浏览器开发者工具
   - 切换到 Network 标签
   - 查看 WebSocket 连接状态

2. **查看控制台日志**
   - SDK 会输出详细的调试信息
   - 查看错误堆栈跟踪

3. **使用 WebSocket 测试工具**
   - 使用 `websocket-client.html` 测试基础连接
   - 发送简单的测试消息

## 📚 更多资源

- [MCP 协议文档](https://modelcontextprotocol.io/)
- [Cursor 集成指南](../CURSOR_INTEGRATION.md)
- [项目主 README](../README.md)