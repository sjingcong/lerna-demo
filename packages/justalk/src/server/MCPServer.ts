/**
 * JusTalk MCP Server
 * 核心MCP服务器实现，处理与Cursor等AI编辑器的通信
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { WebSocket, WebSocketServer } from 'ws';
import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import {
  ComponentEditRequest,
  EditContext,
  MCPMessage,
  MessageType,
  ClientConnection,
  ServerConfig,
  EditCompleteNotification,
  ComponentChangedNotification
} from '../types/index.js';
import { ContextCollector } from '../services/ContextCollector.js';
import { Logger } from '../utils/Logger.js';

export class JusTalkMCPServer {
  private server: Server;
  private wsServer?: WebSocketServer;
  private expressApp?: express.Application;
  private clients: Map<string, ClientConnection> = new Map();
  private contextCollector: ContextCollector;
  private logger: Logger;
  private config: ServerConfig;

  constructor(config: ServerConfig) {
    this.config = config;
    this.logger = new Logger(config.enableLogging);
    this.contextCollector = new ContextCollector();
    
    // 初始化MCP服务器
    this.server = new Server(
      {
        name: 'justalk-mcp-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
          notifications: {
            subscribe: true,
            unsubscribe: true
          }
        },
      }
    );

    this.setupMCPHandlers();
  }

  /**
   * 设置MCP协议处理器
   */
  private setupMCPHandlers(): void {
    // 注册工具列表
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'edit_component',
            description: 'Edit a component based on natural language instruction',
            inputSchema: {
              type: 'object',
              properties: {
                instruction: {
                  type: 'string',
                  description: 'Natural language instruction for editing the component'
                },
                component: {
                  type: 'object',
                  description: 'Component information including props, styles, and source mapping'
                },
                context: {
                  type: 'object',
                  description: 'Project context including framework and libraries'
                },
                pageContext: {
                  type: 'object',
                  description: 'Current page context'
                }
              },
              required: ['instruction', 'component', 'context', 'pageContext']
            }
          },
          {
            name: 'get_component_info',
            description: 'Get detailed information about a component',
            inputSchema: {
              type: 'object',
              properties: {
                componentId: {
                  type: 'string',
                  description: 'Unique identifier of the component'
                }
              },
              required: ['componentId']
            }
          }
        ]
      };
    });

    // 处理工具调用
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'edit_component':
          return await this.handleEditComponent(args as ComponentEditRequest);
        
        case 'get_component_info':
          return await this.handleGetComponentInfo(args.componentId);
        
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  /**
   * 处理组件编辑请求（来自Cursor的响应）
   */
  private async handleEditComponent(request: ComponentEditRequest): Promise<any> {
    try {
      const editId = uuidv4();
      this.logger.info(`Processing edit response from Cursor: ${editId}`, request);

      // 收集完整的编辑上下文
      const editContext: EditContext = {
        instruction: request.instruction,
        component: request.component,
        context: request.context,
        pageContext: request.pageContext,
        timestamp: Date.now()
      };

      // 将Cursor的编辑结果广播给浏览器客户端
      await this.broadcastToClients({
        id: editId,
        type: MessageType.COMPONENT_CHANGED,
        payload: {
          editId,
          component: request.component,
          changes: {
            instruction: request.instruction,
            timestamp: Date.now()
          }
        },
        timestamp: Date.now()
      });

      return {
        content: [
          {
            type: 'text',
            text: `Edit completed and sent to browser. Edit ID: ${editId}\n\nInstruction: ${request.instruction}\nComponent: ${request.component.name} (${request.component.type})\nFile: ${request.component.sourceMap.filePath}:${request.component.sourceMap.lineNumber}`
          }
        ]
      };
    } catch (error) {
      this.logger.error('Error handling edit component request:', error);
      throw error;
    }
  }

  /**
   * 处理获取组件信息请求
   */
  private async handleGetComponentInfo(componentId: string): Promise<any> {
    try {
      // 这里可以实现组件信息查询逻辑
      // 目前返回模拟数据
      return {
        content: [
          {
            type: 'text',
            text: `Component information for ID: ${componentId}\n\nThis feature will be implemented to provide detailed component analysis.`
          }
        ]
      };
    } catch (error) {
      this.logger.error('Error getting component info:', error);
      throw error;
    }
  }

  /**
   * 启动WebSocket服务器（用于浏览器端SDK连接）
   */
  public async startWebSocketServer(): Promise<void> {
    this.expressApp = express();
    this.expressApp.use(cors({ origin: this.config.corsOrigins }));
    
    const httpServer = this.expressApp.listen(this.config.port, this.config.host);
    
    this.wsServer = new WebSocketServer({ server: httpServer });
    
    this.wsServer.on('connection', (ws: WebSocket, request) => {
      const clientId = uuidv4();
      const client: ClientConnection = {
        id: clientId,
        socket: ws,
        connectedAt: new Date(),
        lastActivity: new Date()
      };
      
      this.clients.set(clientId, client);
      this.logger.info(`Client connected: ${clientId}`);
      
      ws.on('message', async (data) => {
        try {
          const message = JSON.parse(data.toString()) as MCPMessage;
          await this.handleWebSocketMessage(clientId, message);
        } catch (error) {
          this.logger.error('Error handling WebSocket message:', error);
        }
      });
      
      ws.on('close', () => {
        this.clients.delete(clientId);
        this.logger.info(`Client disconnected: ${clientId}`);
      });
      
      ws.on('error', (error) => {
        this.logger.error(`WebSocket error for client ${clientId}:`, error);
      });
    });
    
    this.logger.info(`WebSocket server started on ${this.config.host}:${this.config.port}`);
  }

  /**
   * 处理WebSocket消息（来自浏览器）
   */
  private async handleWebSocketMessage(clientId: string, message: MCPMessage): Promise<void> {
    const client = this.clients.get(clientId);
    if (!client) return;
    
    client.lastActivity = new Date();
    
    switch (message.type) {
      case MessageType.COMPONENT_EDIT_REQUEST:
        // 接收来自浏览器的编辑请求，转发给Cursor
        await this.forwardEditRequestToCursor(message);
        break;
        
      default:
        this.logger.warn(`Unknown message type: ${message.type}`);
    }
  }

  /**
   * 将浏览器的编辑请求转发给Cursor
   */
  private async forwardEditRequestToCursor(message: MCPMessage): Promise<void> {
    try {
      const editRequest = message.payload as EditContext;
      this.logger.info('Received edit request from browser, forwarding to Cursor:', editRequest);
      
      // 通过MCP通知机制发送给Cursor
      await this.server.notification({
        method: 'justalk/edit_request',
        params: {
          id: message.id,
          instruction: editRequest.instruction,
          component: editRequest.component,
          context: editRequest.context,
          pageContext: editRequest.pageContext,
          timestamp: message.timestamp
        }
      });
      
      // 向浏览器确认请求已转发
      await this.sendToClient(message.id.split('-')[0], {
        id: uuidv4(),
        type: MessageType.EDIT_COMPLETE,
        payload: {
          editId: message.id,
          success: true,
          message: 'Edit request forwarded to Cursor successfully'
        },
        timestamp: Date.now()
      });
      
    } catch (error) {
      this.logger.error('Error forwarding edit request to Cursor:', error);
      
      // 向浏览器发送错误通知
      await this.sendToClient(message.id.split('-')[0], {
        id: uuidv4(),
        type: MessageType.EDIT_COMPLETE,
        payload: {
          editId: message.id,
          success: false,
          message: `Error: ${error.message}`
        },
        timestamp: Date.now()
      });
    }
  }

  /**
   * 发送消息给特定客户端
   */
  private async sendToClient(clientId: string, message: MCPMessage): Promise<void> {
    const client = this.clients.get(clientId);
    if (!client || client.socket.readyState !== WebSocket.OPEN) {
      this.logger.warn(`Client ${clientId} not found or not connected`);
      return;
    }
    
    try {
      client.socket.send(JSON.stringify(message));
    } catch (error) {
      this.logger.error(`Error sending message to client ${clientId}:`, error);
    }
  }

  /**
   * 广播消息给所有WebSocket客户端
   */
  private async broadcastToClients(message: MCPMessage): Promise<void> {
    const messageStr = JSON.stringify(message);
    
    for (const [clientId, client] of this.clients) {
      try {
        if (client.socket.readyState === WebSocket.OPEN) {
          client.socket.send(messageStr);
        }
      } catch (error) {
        this.logger.error(`Error sending message to client ${clientId}:`, error);
      }
    }
  }

  /**
   * 发送编辑完成通知
   */
  public async notifyEditComplete(notification: EditCompleteNotification): Promise<void> {
    await this.broadcastToClients({
      id: uuidv4(),
      type: MessageType.EDIT_COMPLETE,
      payload: notification,
      timestamp: Date.now()
    });
  }

  /**
   * 发送组件变更通知
   */
  public async notifyComponentChanged(notification: ComponentChangedNotification): Promise<void> {
    await this.broadcastToClients({
      id: uuidv4(),
      type: MessageType.COMPONENT_CHANGED,
      payload: notification,
      timestamp: Date.now()
    });
  }

  /**
   * 启动STDIO传输（用于Cursor等MCP客户端）
   */
  public async startStdioTransport(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    this.logger.info('MCP Server started with STDIO transport');
  }

  // 获取客户端数量
  public getClientCount(): number {
    return this.clients.size;
  }

  /**
   * 关闭服务器
   */
  public async close(): Promise<void> {
    if (this.wsServer) {
      this.wsServer.close();
    }
    
    for (const [clientId, client] of this.clients) {
      client.socket.close();
    }
    
    this.clients.clear();
    this.logger.info('MCP Server closed');
  }
}