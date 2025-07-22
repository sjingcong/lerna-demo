/**
 * JusTalk MCP Server
 * 主入口文件
 */

import { JusTalkMCPServer } from './server/MCPServer.js';
import { ServerConfig } from './types/index.js';
import { Logger, LogLevel } from './utils/Logger.js';

// 导出核心类和类型
export { JusTalkMCPServer } from './server/MCPServer.js';
export { ContextCollector } from './services/ContextCollector.js';
export { Logger, LogLevel } from './utils/Logger.js';
export * from './types/index.js';

/**
 * 默认服务器配置
 */
const DEFAULT_CONFIG: ServerConfig = {
  port: 3001,
  host: 'localhost',
  corsOrigins: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080'],
  maxConnections: 100,
  enableLogging: true
};

/**
 * 创建MCP服务器实例
 */
export function createMCPServer(config?: Partial<ServerConfig>): JusTalkMCPServer {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  return new JusTalkMCPServer(finalConfig);
}

/**
 * 启动MCP服务器（同时支持STDIO和WebSocket）
 */
export async function startMCPServer(config?: Partial<ServerConfig>): Promise<JusTalkMCPServer> {
  const server = createMCPServer(config);
  const logger = new Logger(config?.enableLogging ?? true);
  
  try {
    // 启动WebSocket服务器（用于浏览器端SDK）
    await server.startWebSocketServer();
    logger.info('WebSocket server started successfully');
    
    // 启动STDIO传输（用于Cursor等MCP客户端）
    await server.startStdioTransport();
    logger.info('STDIO transport started successfully');
    
    return server;
  } catch (error) {
    logger.error('Failed to start MCP server:', error);
    throw error;
  }
}

/**
 * 主函数 - 当直接运行此文件时执行
 */
async function main(): Promise<void> {
  const logger = new Logger();
  
  try {
    // 从环境变量读取配置
    const config: Partial<ServerConfig> = {
      port: parseInt(process.env.JUSTALK_MCP_PORT || '3001'),
      host: process.env.JUSTALK_MCP_HOST || 'localhost',
      corsOrigins: process.env.JUSTALK_MCP_CORS_ORIGINS?.split(',') || DEFAULT_CONFIG.corsOrigins,
      enableLogging: process.env.JUSTALK_MCP_LOGGING !== 'false'
    };
    
    logger.info('Starting JusTalk MCP Server...');
    logger.info('Configuration:', config);
    
    const server = await startMCPServer(config);
    
    // 优雅关闭处理
    const gracefulShutdown = async (signal: string) => {
      logger.info(`Received ${signal}, shutting down gracefully...`);
      await server.close();
      process.exit(0);
    };
    
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
    logger.info('JusTalk MCP Server is running');
    logger.info(`WebSocket server: ws://${config.host}:${config.port}`);
    logger.info('STDIO transport: Ready for MCP client connections');
    
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// 如果直接运行此文件，则启动服务器
if (require.main === module) {
  main().catch(console.error);
}