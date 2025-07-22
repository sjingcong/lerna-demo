# Cursor 接入 JusTalk MCP 服务指南

## 概述

JusTalk MCP 服务作为中间层，接收来自浏览器的编辑请求，然后通过 MCP (Model Context Protocol) 协议转发给 Cursor，实现可视化页面编辑功能。

**架构流程：**
```
浏览器端SDK → WebSocket → JusTalk MCP服务器 → MCP协议 → Cursor
```

## 快速开始

### 1. 启动 MCP 服务

```bash
# 开发模式（带调试日志）
npm run start:mcp

# 或者使用自定义配置
npm run start:mcp -- --host 0.0.0.0 --port 3001 --log-level debug

# 仅生成配置信息（不启动服务）
npm run config
```

### 2. 浏览器端测试

打开 `examples/browser-example.html` 文件在浏览器中测试：

```bash
# 在项目根目录下
open examples/browser-example.html
# 或者直接在浏览器中打开该文件
```

浏览器端功能：
- 🔌 连接/断开 MCP 服务器
- 🎯 选择要编辑的组件类型
- 📝 输入编辑指令
- 🚀 发送编辑请求到 Cursor
- 📋 实时查看消息日志

## 配置步骤

### 1. 安装和启动 JusTalk MCP 服务

```bash
# 进入项目目录
cd packages/justalk

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 2. 配置 Cursor MCP 设置

在 Cursor 中，你需要配置 MCP 服务器连接。创建或编辑 Cursor 的配置文件：

#### 方法一：通过 Cursor 设置界面

1. 打开 Cursor
2. 进入 `Settings` > `Features` > `Model Context Protocol`
3. 添加新的 MCP 服务器配置

#### 方法二：直接编辑配置文件

在 Cursor 配置目录中创建或编辑 `mcp_servers.json` 文件：

**Windows 路径：**
```
%APPDATA%\Cursor\User\mcp_servers.json
```

**macOS 路径：**
```
~/Library/Application Support/Cursor/User/mcp_servers.json
```

**Linux 路径：**
```
~/.config/Cursor/User/mcp_servers.json
```

### 3. MCP 配置文件内容

```json
{
  "mcpServers": {
    "justalk": {
      "command": "node",
      "args": [
        "c:/Users/13818/project/lerna-demo/packages/justalk/dist/index.js"
      ],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

或者使用开发模式（推荐开发时使用）：

```json
{
  "mcpServers": {
    "justalk": {
      "command": "npx",
      "args": [
        "tsx",
        "c:/Users/13818/project/lerna-demo/packages/justalk/src/index.ts"
      ],
      "env": {
        "NODE_ENV": "development"
      }
    }
  }
}
```

### 4. 验证连接

1. 重启 Cursor
2. 在 Cursor 中打开任意项目
3. 在聊天界面中，你应该能看到 JusTalk MCP 服务器已连接
4. 可以使用以下命令测试：

```
@justalk 帮我编辑这个按钮组件
```

## 工作流程

### 1. 浏览器发起编辑请求

浏览器端通过 WebSocket 连接到 JusTalk MCP 服务器，发送编辑请求：

```javascript
// 浏览器端代码示例
const ws = new WebSocket('ws://localhost:3001');

ws.send(JSON.stringify({
  id: 'edit-123',
  type: 'COMPONENT_EDIT_REQUEST',
  payload: {
    instruction: '把这个按钮的背景色改成红色',
    component: {
      id: 'btn-example',
      name: 'Button',
      type: 'button',
      props: { children: '点击我' },
      styles: { backgroundColor: '#1890ff' },
      sourceMap: {
        filePath: '/src/components/Button.tsx',
        lineNumber: 15
      }
    },
    context: {
      framework: 'React',
      componentLibrary: 'Ant Design'
    },
    pageContext: {
      url: 'http://localhost:3000',
      title: 'Test Page'
    }
  },
  timestamp: Date.now()
}));
```

### 2. MCP 服务器转发给 Cursor

JusTalk MCP 服务器接收到浏览器请求后，通过 MCP 通知机制转发给 Cursor：

```json
{
  "method": "justalk/edit_request",
  "params": {
    "id": "edit-123",
    "instruction": "把这个按钮的背景色改成红色",
    "component": { ... },
    "context": { ... }
  }
}
```

### 3. Cursor 处理并响应

Cursor 接收到通知后，可以使用 MCP 工具进行响应：

**可用的 MCP 工具：**

#### edit_component
编辑页面组件的工具（Cursor 调用）。

**参数：**
- `instruction`: 编辑指令（自然语言）
- `component`: 组件信息
- `context`: 项目上下文
- `pageContext`: 页面上下文

#### get_component_info
获取组件详细信息的工具（Cursor 调用）。

**参数：**
- `componentId`: 组件ID

### 4. 结果返回浏览器

Cursor 的处理结果会通过 MCP 服务器转发回浏览器端。

## 高级配置

### 环境变量配置

你可以通过环境变量自定义服务配置：

```json
{
  "mcpServers": {
    "justalk": {
      "command": "npx",
      "args": ["tsx", "src/index.ts"],
      "cwd": "c:/Users/13818/project/lerna-demo/packages/justalk",
      "env": {
        "JUSTALK_HOST": "localhost",
        "JUSTALK_PORT": "3001",
        "JUSTALK_LOG_LEVEL": "info"
      }
    }
  }
}
```

### 网络模式配置（可选）

如果你想使用网络连接而不是 STDIO：

```json
{
  "mcpServers": {
    "justalk": {
      "url": "http://localhost:3001/mcp",
      "transport": "http"
    }
  }
}
```

## 故障排除

### 1. 服务器无法启动

- 检查 Node.js 版本（需要 >= 18.0.0）
- 确保所有依赖已安装：`npm install`
- 检查端口 3001 是否被占用

### 2. Cursor 无法连接

- 确保配置文件路径正确
- 检查 JSON 格式是否有效
- 重启 Cursor
- 查看 Cursor 的开发者工具控制台

### 3. 工具无法使用

- 确保 MCP 服务器正在运行
- 检查 Cursor 中是否显示 "justalk" 服务器已连接
- 尝试使用 `@justalk` 前缀调用工具

### 4. 查看日志

JusTalk MCP 服务器会输出详细日志，帮助诊断问题：

```bash
# 启动时查看日志
npm run dev

# 或者设置详细日志级别
JUSTALK_LOG_LEVEL=debug npm run dev
```

## 开发模式 vs 生产模式

### 开发模式
- 使用 `tsx` 直接运行 TypeScript
- 支持热重载
- 详细的调试信息

### 生产模式
- 使用编译后的 JavaScript
- 更好的性能
- 精简的日志输出

## 示例工作流

### 完整的编辑流程

1. **启动 MCP 服务：**
   ```bash
   cd packages/justalk
   npm run start:mcp
   ```

2. **浏览器发送编辑请求：**
   ```javascript
   // 在网页中执行
   const ws = new WebSocket('ws://localhost:3001');
   
   ws.onopen = () => {
     ws.send(JSON.stringify({
       id: 'edit-' + Date.now(),
       type: 'COMPONENT_EDIT_REQUEST',
       payload: {
         instruction: '把这个按钮改成圆角，背景色改成蓝色',
         component: {
           id: 'my-button',
           name: 'Button',
           type: 'button',
           // ... 其他组件信息
         }
       }
     }));
   };
   
   ws.onmessage = (event) => {
     const response = JSON.parse(event.data);
     console.log('收到响应:', response);
   };
   ```

3. **MCP 服务器处理：**
   - 接收浏览器的编辑请求
   - 通过 MCP 通知发送给 Cursor
   - 等待 Cursor 的处理结果

4. **Cursor 响应：**
   - 接收到 `justalk/edit_request` 通知
   - 分析编辑指令和组件信息
   - 调用 `edit_component` 工具返回结果

5. **结果返回：**
   - MCP 服务器接收 Cursor 的响应
   - 通过 WebSocket 发送给浏览器
   - 浏览器更新组件显示

## 注意事项

- 确保 JusTalk MCP 服务在 Cursor 使用前已启动
- 配置文件中的路径使用绝对路径
- Windows 用户注意路径分隔符的转义
- 开发时建议使用开发模式配置