/**
 * JusTalk MCP Server 基础使用示例
 */

import { createMCPServer, ComponentInfo, EditContext } from '../src/index.js';

// 创建服务器实例
const server = createMCPServer({
  port: 3001,
  host: 'localhost',
  enableLogging: true
});

// 模拟组件信息
const mockComponent: ComponentInfo = {
  id: 'btn-example-123',
  name: 'Button',
  type: 'button',
  props: {
    children: '点击我',
    type: 'primary',
    size: 'medium'
  },
  styles: {
    backgroundColor: '#1890ff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '14px'
  },
  sourceMap: {
    filePath: '/src/components/Button.tsx',
    lineNumber: 15,
    columnNumber: 8,
    endLineNumber: 25,
    endColumnNumber: 12
  }
};

// 启动服务器
async function startExample() {
  try {
    console.log('🚀 启动JusTalk MCP服务器示例...');
    
    // 启动WebSocket服务器
    await server.startWebSocketServer();
    console.log('✅ WebSocket服务器已启动: ws://localhost:3001');
    
    // 启动STDIO传输
    await server.startStdioTransport();
    console.log('✅ STDIO传输已启动，等待MCP客户端连接...');
    
    // 模拟编辑完成通知
    setTimeout(async () => {
      await server.notifyEditComplete({
        editId: 'edit-123',
        success: true,
        message: '按钮背景色已成功修改为红色',
        changes: [
          'Modified: /src/components/Button.tsx:18 - backgroundColor: "#ff4d4f"'
        ]
      });
      console.log('📢 发送编辑完成通知');
    }, 5000);
    
    // 模拟组件变更通知
    setTimeout(async () => {
      await server.notifyComponentChanged({
        componentId: 'btn-example-123',
        changeType: 'modified',
        component: {
          ...mockComponent,
          styles: {
            ...mockComponent.styles,
            backgroundColor: '#ff4d4f'
          }
        }
      });
      console.log('📢 发送组件变更通知');
    }, 6000);
    
    console.log('\n🎯 服务器运行中，可以通过以下方式测试:');
    console.log('1. 在Cursor中配置MCP服务器');
    console.log('2. 使用WebSocket客户端连接 ws://localhost:3001');
    console.log('3. 发送组件编辑请求');
    
  } catch (error) {
    console.error('❌ 启动服务器失败:', error);
    process.exit(1);
  }
}

// 优雅关闭
process.on('SIGINT', async () => {
  console.log('\n🛑 正在关闭服务器...');
  await server.close();
  console.log('✅ 服务器已关闭');
  process.exit(0);
});

// 启动示例
startExample();

// 导出用于测试
export { server, mockComponent };