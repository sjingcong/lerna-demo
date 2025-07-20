# JusTalk - 可视化页面编辑SDK

> 无业务代码侵入的"指哪改哪"可视化页面编辑解决方案

## 🎯 项目愿景

让任何人都能通过简单的点击和自然语言描述来修改网页，实现真正的所见即所得编辑体验。开发者只需引入SDK，无需修改任何业务代码即可获得强大的可视化编辑能力。

## ✨ 核心特性

- 🚀 **零侵入集成**：一行代码引入，无需修改现有业务逻辑
- 🎨 **智能组件识别**：自动识别页面所有组件并生成交互蒙层
- 💬 **自然语言编辑**：通过自然语言描述实现组件修改
- 🔗 **AI编辑器集成**：与Cursor、Trae AI等编辑器无缝对接
- 🌐 **多框架支持**：支持React、Vue、Angular等主流框架
- ⚡ **实时预览**：修改即时生效，支持撤销重做

## 🏗️ 技术架构

### 整体架构图

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   浏览器端SDK    │◄──►│   MCP服务端     │◄──►│   AI编辑器      │
│                 │    │                 │    │                 │
│ • 组件识别引擎   │    │ • 上下文收集     │    │ • Cursor        │
│ • 蒙层渲染系统   │    │ • 消息转发       │    │ • Trae AI       │
│ • 交互处理器     │    │ • 框架检测       │    │ • VS Code       │
│ • MCP通信模块    │    │ • 组件信息整理   │    │ • WebStorm      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 核心模块设计

#### 1. 浏览器端SDK (`@justalk/client`)

```typescript
// 主入口 - 零侵入集成
class JusTalkSDK {
  constructor(options?: JusTalkOptions) {
    this.componentScanner = new ComponentScanner();
    this.overlayRenderer = new OverlayRenderer();
    this.communicator = new MCPCommunicator();
    this.init();
  }

  // 自动初始化，无需业务代码调用
  private async init() {
    await this.scanAndRenderOverlays();
    this.setupEventListeners();
    this.connectToMCP();
  }
}

// 组件识别引擎
class ComponentScanner {
  // 扫描页面组件
  scanComponents(): ComponentInfo[] {
    // 1. 利用React/Vue DevTools API
    // 2. DOM树遍历和分析
    // 3. 源码映射建立
  }

  // 建立组件与源码的映射关系
  buildSourceMap(component: ComponentInfo): SourceMap {
    // 利用Source Map + 组件元信息
  }
}

// 蒙层渲染系统
class OverlayRenderer {
  // 创建可交互蒙层
  createOverlays(components: ComponentInfo[]): void {
    // 1. 计算组件边界
    // 2. 创建蒙层元素
    // 3. 绑定交互事件
  }

  // 处理组件点击
  handleComponentClick(component: ComponentInfo): void {
    // 显示编辑面板
  }
}
```

#### 2. MCP服务端 (`@justalk/mcp-server`)

```typescript
// MCP服务核心
class JusTalkMCPServer {
  // 处理编辑请求
  async handleEditRequest(request: EditRequest): Promise<EditResponse> {
    const { component, instruction, sourceMap } = request;
    
    // 直接将用户意图和组件信息传递给Cursor
    const editContext = {
      instruction,
      component: {
        name: component.name,
        filePath: sourceMap.filePath,
        lineNumber: sourceMap.lineNumber,
        props: component.props,
        styles: component.computedStyles
      },
      context: {
        framework: this.detectFramework(),
        componentLibrary: this.detectComponentLibrary()
      }
    };
    
    // 通过MCP协议发送给Cursor，让Cursor的AI来处理
    await this.sendToCursor(editContext);
    
    return { success: true, message: '编辑请求已发送到Cursor' };
  }

  // 发送编辑上下文到Cursor
  private async sendToCursor(editContext: EditContext): Promise<void> {
    // 通过MCP协议与Cursor通信
    // Cursor的AI会根据上下文信息理解用户意图并生成代码
  }
}
```

#### 3. MCP通信模块 (`@justalk/mcp-client`)

```typescript
// MCP客户端 - 与Cursor等AI编辑器通信
class MCPClient {
  constructor(private serverUrl: string) {
    this.connect();
  }

  // 连接到MCP服务器
  private async connect(): Promise<void> {
    // 建立WebSocket连接
  }

  // 发送编辑请求
  async sendEditRequest(editContext: EditContext): Promise<void> {
    const message = {
      type: 'COMPONENT_EDIT_REQUEST',
      payload: editContext,
      timestamp: Date.now()
    };
    
    await this.send(message);
  }

  // 发送消息到MCP服务器
  private async send(message: any): Promise<void> {
    // 通过WebSocket发送消息
  }
}
```

## 🔧 无侵入实现方案

### 1. 自动注入机制

```typescript
// 通过多种方式实现零侵入
class AutoInjector {
  static inject() {
    // 方案1: Webpack/Vite插件自动注入
    // 方案2: 浏览器扩展注入
    // 方案3: 开发服务器中间件注入
    // 方案4: CDN脚本标签注入
  }
}

// Webpack插件示例
class JusTalkWebpackPlugin {
  apply(compiler: Compiler) {
    compiler.hooks.compilation.tap('JusTalkPlugin', (compilation) => {
      // 在HTML中自动注入SDK脚本
    });
  }
}
```

### 2. 框架无关的组件识别

```typescript
// 通用组件识别策略
class UniversalComponentDetector {
  detect(): ComponentInfo[] {
    const strategies = [
      new ReactDetectionStrategy(),
      new VueDetectionStrategy(),
      new AngularDetectionStrategy(),
      new GenericDOMStrategy()
    ];
    
    return strategies
      .map(strategy => strategy.detect())
      .flat()
      .filter(this.deduplicateComponents);
  }
}

// React检测策略
class ReactDetectionStrategy {
  detect(): ComponentInfo[] {
    // 利用React DevTools Global Hook
    const reactDevTools = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    // 遍历Fiber树获取组件信息
  }
}

// Vue检测策略
class VueDetectionStrategy {
  detect(): ComponentInfo[] {
    // 利用Vue DevTools API
    const vueDevTools = window.__VUE_DEVTOOLS_GLOBAL_HOOK__;
    // 遍历组件树获取组件信息
  }
}
```

### 3. 智能源码映射

```typescript
// 源码映射服务
class SourceMapService {
  // 建立运行时组件与源码的映射
  buildMapping(component: ComponentInfo): SourceMapping {
    return {
      filePath: this.resolveFilePath(component),
      lineNumber: this.resolveLineNumber(component),
      columnNumber: this.resolveColumnNumber(component),
      componentName: component.displayName || component.name
    };
  }

  private resolveFilePath(component: ComponentInfo): string {
    // 1. 从Source Map解析
    // 2. 从组件元信息推断
    // 3. 从文件名模式匹配
  }
}
```

## 📦 SDK集成方式

### 方式1: NPM包引入（推荐）

```bash
npm install @justalk/client
```

```typescript
// 在应用入口文件中
import { JusTalk } from '@justalk/client';

// 开发环境自动启用
if (process.env.NODE_ENV === 'development') {
  new JusTalk({
    mcpServerUrl: 'ws://localhost:3001',
    enabledInProduction: false
  });
}
```

### 方式2: Webpack/Vite插件

```typescript
// vite.config.ts
import { jusTalkPlugin } from '@justalk/vite-plugin';

export default defineConfig({
  plugins: [
    jusTalkPlugin({
      enabled: process.env.NODE_ENV === 'development'
    })
  ]
});
```

### 方式3: 浏览器扩展

```typescript
// 用户安装浏览器扩展后自动在所有页面注入
// 无需修改任何代码
```

### 方式4: CDN脚本

```html
<!-- 在HTML中直接引入 -->
<script src="https://cdn.justalk.dev/latest/justalk.min.js"></script>
<script>
  if (window.JusTalk) {
    new window.JusTalk();
  }
</script>
```

## 🎨 用户交互流程

### 1. 组件识别与蒙层显示

```
用户访问页面 → SDK自动扫描组件 → 生成可交互蒙层 → 显示编辑提示
```

### 2. 编辑操作流程

```
点击组件蒙层 → 显示编辑面板 → 输入自然语言描述 → 发送到MCP服务 → AI解析并生成代码 → 应用到编辑器 → 页面实时更新
```

### 3. 编辑面板设计

```typescript
// 编辑面板组件
class EditPanel {
  render() {
    return (
      <div className="justalk-edit-panel">
        <div className="component-info">
          <h3>{component.name}</h3>
          <p>{component.filePath}</p>
        </div>
        
        <div className="quick-actions">
          <button onClick={() => this.deleteComponent()}>删除组件</button>
          <button onClick={() => this.duplicateComponent()}>复制组件</button>
          <button onClick={() => this.moveComponent()}>移动组件</button>
        </div>
        
        <div className="natural-language-input">
          <textarea 
            placeholder="描述你想要的修改，例如：\n- 把背景色改成蓝色\n- 增加10px的内边距\n- 隐藏这个组件\n- 把字体大小改成16px"
            value={this.state.instruction}
            onChange={this.handleInstructionChange}
          />
          <button onClick={this.handleSubmit}>应用修改</button>
        </div>
        
        <div className="style-inspector">
          {/* 显示当前组件的样式信息 */}
        </div>
      </div>
    );
  }
}
```

## 🧠 自然语言处理

### 支持的指令类型

我们将用户的自然语言指令直接传递给Cursor的AI，支持各种类型的编辑操作：

#### 1. 样式修改
```
- "把背景色改成红色"
- "增加10px的边距"
- "设置字体大小为16px"
- "添加阴影效果"
- "设置圆角为5px"
```

#### 2. 布局调整
```
- "把这个组件移到右边"
- "增加组件之间的间距"
- "让这个组件居中显示"
- "调整组件的宽度为50%"
```

#### 3. 组件操作
```
- "删除这个组件"
- "复制这个组件"
- "隐藏这个组件"
- "在这里添加一个按钮"
```

#### 4. 内容修改
```
- "把文字改成'点击这里'"
- "更换这个图片"
- "修改链接地址"
```

### 上下文信息收集

```typescript
// 收集完整的编辑上下文，让Cursor的AI更好地理解用户意图
class ContextCollector {
  collectEditContext(component: ComponentInfo, instruction: string): EditContext {
    return {
      // 用户的原始指令
      instruction,
      
      // 组件信息
      component: {
        name: component.name,
        type: component.type,
        props: component.props,
        styles: component.computedStyles,
        children: component.children
      },
      
      // 文件信息
      file: {
        path: component.sourceMap.filePath,
        line: component.sourceMap.lineNumber,
        column: component.sourceMap.columnNumber
      },
      
      // 项目上下文
      project: {
        framework: this.detectFramework(),
        componentLibrary: this.detectComponentLibrary(),
        styleFramework: this.detectStyleFramework()
      }
    };
  }
}
```

## 🔗 MCP协议设计

### 消息格式定义

```typescript
// MCP消息基础结构
interface MCPMessage {
  id: string;
  type: MessageType;
  payload: any;
  timestamp: number;
}

enum MessageType {
  // 组件编辑请求
  COMPONENT_EDIT_REQUEST = 'component_edit_request',
  
  // 响应消息
  RESPONSE = 'response',
  
  // 错误消息
  ERROR = 'error'
}

// 组件编辑请求
interface ComponentEditRequest {
  // 用户的原始指令
  instruction: string;
  
  // 组件信息
  component: {
    id: string;
    name: string;
    type: string;
    props: Record<string, any>;
    styles: CSSStyleDeclaration;
    children?: ComponentInfo[];
    sourceMap: {
      filePath: string;
      lineNumber: number;
      columnNumber: number;
    };
  };
  
  // 项目上下文
  context: {
    framework: string;           // React, Vue, Angular等
    componentLibrary: string;    // Ant Design, Element UI等
    styleFramework: string;      // Tailwind, Styled Components等
    projectRoot: string;         // 项目根目录
  };
  
  // 页面上下文
  pageContext: {
    url: string;                 // 当前页面URL
    title: string;               // 页面标题
    viewport: {                  // 视口信息
      width: number;
      height: number;
    };
  };
}

// 响应消息
interface MCPResponse {
  success: boolean;
  message?: string;
  data?: any;
}
```

### MCP服务器实现

```typescript
// MCP服务器主类
class JusTalkMCPServer {
  constructor() {
    this.setupMCPHandlers();
  }

  private setupMCPHandlers() {
    // 注册MCP工具
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'edit_component',
            description: '编辑页面组件',
            inputSchema: {
              type: 'object',
              properties: {
                component: { type: 'object' },
                instruction: { type: 'string' },
                sourceMap: { type: 'object' }
              }
            }
          }
        ]
      };
    });

    // 处理工具调用
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name === 'edit_component') {
        return await this.handleEditComponent(request.params.arguments);
      }
    });
  }
}
```

## 🎯 开发路线图

### Phase 1: 核心功能实现 (4-6周)
- [ ] 基础SDK架构搭建
- [ ] React组件识别引擎
- [ ] 简单蒙层渲染系统
- [ ] 基础自然语言处理
- [ ] MCP服务器框架
- [ ] Cursor编辑器集成

### Phase 2: 功能完善 (4-6周)
- [ ] Vue/Angular支持
- [ ] 复杂样式修改支持
- [ ] 布局调整功能
- [ ] 组件操作（删除、复制、移动）
- [ ] 实时预览和撤销重做
- [ ] 更多编辑器支持

### Phase 3: 体验优化 (3-4周)
- [ ] 智能提示和建议
- [ ] 批量操作支持
- [ ] 可视化样式编辑器
- [ ] 组件库集成
- [ ] 性能优化

### Phase 4: 生态建设 (持续)
- [ ] 插件系统
- [ ] 第三方组件库适配
- [ ] 设计工具集成
- [ ] 云端协作功能
- [ ] 企业版功能

## 🛠️ 技术栈选择

### 前端SDK
- **核心框架**: TypeScript + 原生DOM API
- **构建工具**: Rollup (支持多格式输出)
- **样式处理**: PostCSS + CSS Modules
- **测试框架**: Jest + Playwright

### MCP服务端
- **运行时**: Node.js + TypeScript
- **MCP框架**: @modelcontextprotocol/sdk
- **NLP处理**: 本地模型 + OpenAI API
- **代码解析**: Babel + TypeScript Compiler API

### 开发工具
- **Monorepo管理**: Lerna + Yarn Workspaces
- **代码规范**: ESLint + Prettier
- **CI/CD**: GitHub Actions
- **文档**: VitePress

## 📊 性能考虑

### 1. 组件扫描优化
```typescript
// 使用防抖和节流优化扫描频率
class OptimizedScanner {
  private scanDebounced = debounce(this.scan.bind(this), 300);
  
  // 增量扫描，只处理变化的部分
  incrementalScan(mutations: MutationRecord[]) {
    // 只扫描发生变化的DOM节点
  }
}
```

### 2. 蒙层渲染优化
```typescript
// 虚拟化渲染，只渲染可视区域的蒙层
class VirtualizedOverlay {
  renderVisibleOverlays() {
    // 只渲染视口内的组件蒙层
  }
}
```

### 3. 内存管理
```typescript
// 自动清理不再需要的资源
class ResourceManager {
  cleanup() {
    // 清理事件监听器、DOM节点等
  }
}
```

## 🔒 安全考虑

### 1. 权限控制
- 只在开发环境启用
- 支持域名白名单
- API密钥验证

### 2. 代码安全
- 输入验证和清理
- XSS防护
- CSP策略支持

### 3. 隐私保护
- 本地处理优先
- 敏感信息脱敏
- 用户数据加密

## 📈 商业化考虑

### 开源版本
- 基础编辑功能
- 单人使用
- 社区支持

### 专业版本
- 高级编辑功能
- 团队协作
- 优先技术支持
- 企业级安全

### 企业版本
- 私有部署
- 定制开发
- SLA保障
- 专属客服

## 🤝 贡献指南

### 开发环境搭建
```bash
# 克隆仓库
git clone https://github.com/your-org/justalk.git
cd justalk

# 安装依赖
yarn install

# 启动开发服务器
yarn dev

# 运行测试
yarn test
```

### 项目结构
```
justalk/
├── packages/
│   ├── client/          # 浏览器端SDK
│   ├── mcp-server/      # MCP服务器
│   ├── editor-adapters/ # 编辑器适配器
│   ├── shared/          # 共享工具库
│   └── examples/        # 示例项目
├── docs/                # 文档
├── scripts/             # 构建脚本
└── tests/               # 测试用例
```

## 📞 联系我们

- **GitHub**: https://github.com/your-org/justalk
- **文档**: https://justalk.dev
- **社区**: https://discord.gg/justalk
- **邮箱**: hello@justalk.dev

---

**JusTalk** - 让页面编辑变得简单而强大 🚀