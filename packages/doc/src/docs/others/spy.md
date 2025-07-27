# PageSpy 远程调试框架落地调研

## 概述

PageSpy 是货拉拉开源的远程调试框架，支持实时查看页面日志、网络请求、元素信息等，本文档调研其在项目中的落地方案。

## 1. 开关控制策略

### 1.1 用户维度控制

#### 配置规则设计

```typescript
interface ProjectDebugConfig {
  projectId: string;
  enabled: boolean;
  rules: {
    [key: string]: string[]; // 支持任意自定义规则字段
  };
}

// 常用规则示例（用户可自定义）
interface CommonDebugRules {
  phones?: string[]; // 手机号白名单
  userIds?: string[]; // 用户ID白名单
  productIds?: string[]; // 商品ID白名单
  ips?: string[]; // IP地址白名单
  roles?: string[]; // 用户角色白名单
  departments?: string[]; // 部门白名单
  versions?: string[]; // 应用版本白名单
  // 用户可以继续添加任意规则字段
}
```

#### 实现方案

1. **精确匹配**：采用简单的精确匹配策略，任一条件命中即启用
2. **项目隔离**：基于项目ID获取对应的规则配置
3. **缓存策略**：本地缓存规则，减少接口调用
4. **降级机制**：规则服务异常时的默认策略

#### 用户上下文类型定义

```typescript
// 支持自定义属性的用户上下文
interface UserContext {
  [key: string]: any; // 允许任意自定义属性
}

// 常用的预定义属性（可选）
interface CommonUserContext extends UserContext {
  phone?: string;
  userId?: string;
  productId?: string;
  ip?: string;
  // 用户可以继续添加任意属性
}
```

#### 核心逻辑

```typescript
class DebugController {
  async shouldEnableDebug(
    projectId: string,
    context: UserContext
  ): Promise<boolean> {
    const config = await this.getProjectConfig(projectId);
    if (!config?.enabled) return false;

    const { rules } = config;

    // 遍历所有规则，检查是否有匹配的条件
    for (const [ruleKey, ruleValues] of Object.entries(rules)) {
      if (Array.isArray(ruleValues) && ruleValues.length > 0) {
        const contextValue = context[ruleKey];
        if (contextValue && ruleValues.includes(contextValue)) {
          return true; // 任一条件匹配即启用调试
        }
      }
    }

    return false;
  }

  private async getProjectConfig(
    projectId: string
  ): Promise<ProjectDebugConfig | null> {
    // 从缓存或接口获取项目配置
    return await this.configService.getProjectDebugConfig(projectId);
  }
}
```

### 1.2 触发时机

- **页面加载时**：根据用户信息判断是否启用
- **动态切换**：支持运行时开启/关闭调试
- **会话保持**：调试状态在会话期间保持

## 2. 项目接入方案

### 2.1 SDK 封装

#### 统一接入层

```typescript
// PageSpy 官方 InitConfig 接口
interface InitConfig {
  api?: string; // PageSpy 服务端地址
  clientOrigin?: string; // 调试端地址
  project?: string; // 项目标识，用于在调试端房间列表中搜索
  title?: string; // 项目标题
  autoRender?: boolean; // 是否自动渲染控制按钮
  enableSSL?: boolean | null; // 是否启用 SSL
}

class PageSpyManager {
  private instance: PageSpy | null = null;
  private projectConfig: ProjectConfig | null = null;
  private userContext: UserContext | null = null;
  private configCheckTimer: NodeJS.Timeout | null = null;
  private isEnabled: boolean = false;
  private debugController: DebugController;

  constructor() {
    this.debugController = new DebugController();
  }

  async init(projectConfig: ProjectConfig, userContext: UserContext) {
    this.projectConfig = projectConfig;
    this.userContext = userContext;

    // 初始检查
    await this.checkAndUpdateDebugStatus();

    // 启动定时检查（每20秒）
    this.startConfigPolling();
  }

  private async checkAndUpdateDebugStatus(): Promise<void> {
    if (!this.projectConfig || !this.userContext) return;

    const shouldEnable = await this.checkDebugRules(
      this.projectConfig.id,
      this.userContext
    );

    if (shouldEnable && !this.isEnabled) {
      // 需要开启但当前未开启
      this.enablePageSpy();
    } else if (!shouldEnable && this.isEnabled) {
      // 需要关闭但当前已开启
      this.disablePageSpy();
    }
  }

  private enablePageSpy(): void {
    if (!this.projectConfig || this.instance) return;

    // SDK内部根据environment自动选择配置
    const apiUrl =
      this.projectConfig.environment === 'production'
        ? 'https://pagespy.company.com'
        : 'https://pagespy-dev.company.com';

    // 使用 PageSpy 官方 InitConfig 接口
    this.instance = new PageSpy({
      api: apiUrl,
      project: this.projectConfig.name, // project 参数确实存在
      title: this.projectConfig.title,
      autoRender: true,
      enableSSL: null, // 让 SDK 自动判断
    });
    this.isEnabled = true;
    console.log(
      `[PageSpy] 调试已开启，用户: ${this.userContext?.userId || this.userContext?.phone || 'anonymous'}`
    );
  }

  private disablePageSpy(): void {
    if (this.instance) {
      // 注意：PageSpy 官方 API 中没有 abort() 或 destroy() 方法
      // 只能通过重新加载页面或设置为 null 来禁用
      this.instance = null;
    }
    this.isEnabled = false;
    console.log('[PageSpy] 调试已关闭');
  }

  private startConfigPolling(): void {
    // 清除已存在的定时器
    if (this.configCheckTimer) {
      clearInterval(this.configCheckTimer);
    }

    // 每20秒检查一次配置
    this.configCheckTimer = setInterval(async () => {
      try {
        await this.checkAndUpdateDebugStatus();
      } catch (error) {
        console.error('[PageSpy] 配置检查失败:', error);
      }
    }, 20000);
  }

  private async checkDebugRules(
    projectId: string,
    context: UserContext
  ): Promise<boolean> {
    // SDK内部根据environment和allowedRoles自动判断权限
    if (this.projectConfig?.environment === 'production') {
      const allowedRoles = this.projectConfig.allowedRoles || [];
      const userRole = context.role;
      if (!allowedRoles.includes(userRole)) {
        return false;
      }
    }
    return await this.debugController.shouldEnableDebug(projectId, context);
  }

  // 手动停止配置检查
  destroy(): void {
    if (this.configCheckTimer) {
      clearInterval(this.configCheckTimer);
      this.configCheckTimer = null;
    }
    this.disablePageSpy();
  }
}
```

#### 项目配置管理

```typescript
// 简化的项目配置接口
interface ProjectConfig {
  id: string;
  name: string;
  title: string;
  environment: 'development' | 'production'; // SDK根据此参数自动配置
  allowedRoles?: string[]; // 生产环境权限控制
}

// 用户上下文接口 - 支持自定义属性
interface UserContext {
  [key: string]: any; // 支持任意自定义属性
  // 常用属性示例
  userId?: string;
  phone?: string;
  productId?: string;
  ip?: string;
  role?: string;
  department?: string;
  version?: string;
}

// 调试规则配置接口 - 支持自定义规则
interface ProjectDebugConfig {
  projectId: string;
  enabled: boolean;
  rules: {
    [key: string]: string[]; // 支持任意自定义规则
    // 常用规则示例
    phones?: string[];
    userIds?: string[];
    productIds?: string[];
    ips?: string[];
    roles?: string[];
    departments?: string[];
    versions?: string[];
    environments?: string[];
  };
}
```

### 2.2 多项目架构

#### 配置中心化

- **项目注册**：统一的项目配置管理
- **环境隔离**：开发/测试/生产环境独立配置
- **权限控制**：基于项目的访问权限管理

#### 服务端架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   配置管理服务   │    │   规则引擎服务   │    │  PageSpy 服务   │
│                │    │                │    │                │
│ - 项目配置      │    │ - 用户规则      │    │ - 调试会话      │
│ - 环境管理      │    │ - 条件匹配      │    │ - 数据收集      │
│ - 权限控制      │    │ - 实时下发      │    │ - 远程调试      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 2.3 接入流程

#### 环境配置策略

用户只需在初始化时指定环境类型，SDK会自动选择合适的配置：

```typescript
// 简化的环境配置 - 用户只需指定环境
const debugManager = new PageSpyManager();
await debugManager.init(
  {
    id: 'mobile-app-001',
    name: 'mobile-app',
    title: '移动端应用',
    environment: 'development', // 或 'production'
  },
  userContext
);

// SDK内部会根据environment自动选择：
// development: 启用所有功能，使用开发环境API
// production: 限制功能，使用生产环境API，默认关闭
```

#### 客户端接入

1. **安装 SDK**：`npm install @company/pagespy-sdk`
2. **项目初始化**：

```typescript
import { PageSpyManager } from '@company/pagespy-sdk';

const debugManager = new PageSpyManager();
await debugManager.init(
  {
    id: 'mobile-app-001',
    name: 'mobile-app',
    title: '移动端应用',
    environment: process.env.NODE_ENV || 'development', // SDK自动处理配置
  },
  {
    userId: getCurrentUserId(),
    phone: getCurrentUserPhone(),
  }
);
```

#### 使用示例

```typescript
// 项目初始化
const pageSpyManager = new PageSpyManager();

// 应用启动时 - 支持自定义属性
const userContext = {
  phone: '13800138000',
  userId: 'user123',
  productId: 'product456',
  ip: '192.168.1.100',
  // 自定义属性
  role: 'admin',
  department: 'frontend',
  version: '1.2.3',
  environment: 'production',
  customField: 'customValue',
};

// 初始化PageSpy - 简化配置
await pageSpyManager.init(
  {
    id: 'mobile-app-001',
    name: 'mobile-app',
    title: '移动端应用',
    environment: process.env.NODE_ENV || 'development',
  },
  userContext
);

// 应用退出时清理资源
window.addEventListener('beforeunload', () => {
  pageSpyManager.destroy();
});

// 动态配置变更示例
// 当用户登录状态改变时，重新初始化
function onUserLogin(newUserContext) {
  pageSpyManager.destroy(); // 先清理旧的实例
  pageSpyManager.init(
    {
      id: 'mobile-app-001',
      name: 'mobile-app',
      title: '移动端应用',
      environment: process.env.NODE_ENV || 'development',
    },
    newUserContext
  ); // 重新初始化
}

// 日志隔离的实际应用
// 方案1：按部门创建不同的project
function initPageSpyByDepartment(userContext) {
  const projectId = `mobile-app-${userContext.department}`;
  pageSpyManager.init(projectId, userContext);
}

// 方案2：在关键日志中添加用户标识
function logWithUserInfo(message, data) {
  const userTag = `[${userContext.userId}|${userContext.name}]`;
  console.log(`${userTag} ${message}`, data);
}

// 配置示例（后台管理）- 支持自定义规则
const projectConfig: ProjectDebugConfig = {
  projectId: 'mobile-app-001',
  enabled: true,
  rules: {
    // 常用规则
    phones: ['13800138000', '13900139000'],
    userIds: ['admin', 'tester'],
    productIds: ['test-product'],
    ips: ['192.168.1.100'],
    // 自定义规则
    roles: ['admin', 'developer', 'qa'],
    departments: ['frontend', 'backend', 'mobile'],
    versions: ['1.2.3', '1.2.4-beta'],
    environments: ['development', 'staging'],
    customField: ['customValue', 'anotherValue'],
  },
};

// 动态配置变更场景：
// 1. 管理员在后台移除用户手机号 -> 20秒内自动关闭调试
// 2. 管理员在后台添加用户手机号 -> 20秒内自动开启调试
// 3. 项目整体禁用调试 -> 20秒内自动关闭调试
```

#### 管理后台配置

1. **项目注册**：在管理后台注册新项目
2. **规则配置**：设置调试规则和触发条件
3. **权限分配**：分配项目访问权限

## 3. 技术实现要点

### 3.1 用户标识与日志隔离

当多个用户同时命中调试规则时，需要确保后端能够正确区分和隔离不同用户的日志：

#### PageSpy原生配置

```typescript
// PageSpy原生支持的配置项（基于官方 InitConfig 接口）
const pageSpy = new PageSpy({
  api: 'localhost:6752', // 注意：不需要 ws:// 前缀，SDK会自动处理
  clientOrigin: undefined, // 可选，SDK会自动解析
  project: 'mobile-app-001', // 项目标识，用于在调试端房间列表中搜索
  title: 'Mobile App Debug',
  autoRender: true,
  enableSSL: null, // null 表示让 SDK 自动判断
});

// 注意：PageSpy原生不支持userId、sessionId、userInfo等用户标识配置
// 如需用户维度的日志隔离，需要通过以下方式实现：
// 1. 在业务代码中手动添加用户标识到日志
// 2. 通过project参数区分不同用户组
// 3. 自定义PageSpy服务端来支持用户标识
```

#### 日志隔离策略

1. **用户维度隔离**：每个用户的日志独立存储和展示
2. **会话维度隔离**：同一用户的不同会话分别管理
3. **项目维度隔离**：不同项目的日志完全隔离

#### 生产环境权限控制

```typescript
// 生产环境权限控制 - SDK内部处理
const config = {
  id: 'mobile-app-001',
  name: 'mobile-app',
  title: '移动端应用',
  environment: 'production',
  allowedRoles: ['admin', 'tester'], // SDK会自动验证用户权限
};

await pageSpyManager.init(config, userContext);
```

#### 日志隔离的替代方案

由于PageSpy原生不支持用户标识，可以通过以下方式实现日志隔离：

```typescript
// 方案1：通过project参数区分用户组
const pageSpy = new PageSpy({
  api: 'localhost:6752',
  project: `mobile-app-${userContext.department}`, // 按部门隔离
  title: `${userContext.name} Debug Console`,
  autoRender: true,
  enableSSL: null,
});

// 方案2：在日志中手动添加用户标识
console.log(`[User:${userContext.userId}] 业务日志内容`);

// 方案3：自定义PageSpy服务端（需要二次开发）
// 在WebSocket连接时传递用户信息
// 在服务端解析和存储用户标识
```

### 3.2 性能优化

- **按需加载**：仅在需要时加载 PageSpy 代码
- **资源隔离**：调试代码不影响业务性能
- **内存控制**：限制日志和数据收集的内存占用
- **日志分片传输**：避免大量数据阻塞

### 3.3 安全考虑

- **数据脱敏**：敏感信息自动脱敏处理
- **访问控制**：基于 Token 的访问验证
- **审计日志**：记录调试操作日志
- **用户数据隔离**：确保不同用户数据完全隔离

### 3.4 监控告警

- **使用统计**：调试会话的使用情况统计
- **异常监控**：SDK 异常和性能监控
- **资源监控**：服务端资源使用监控
- **并发用户数监控**：实时监控同时在线的调试用户数

## 4. 系统架构

### 4.1 整体架构图

![PageSpy系统架构](./pagespy-architecture.puml)

系统采用分层架构设计，包含以下核心组件：

- **客户端层**：业务应用集成PageSpy SDK，支持多种客户端类型
- **服务端层**：配置管理、规则引擎、PageSpy服务三大核心服务
- **调试端层**：Web调试界面，支持实时日志、网络监控等功能
- **管理端层**：项目管理、规则配置、权限控制等管理功能

### 4.2 工作流程图

![PageSpy工作流程](./pagespy-sequence.puml)

核心工作流程包括：

1. **初始化阶段**：SDK初始化、权限验证、连接建立
2. **调试阶段**：数据收集、实时传输、调试交互
3. **配置检查**：定时轮询、动态配置、状态更新
4. **异常处理**：错误恢复、降级处理、重试机制

### 4.3 部署架构图

![PageSpy部署架构](./pagespy-deployment.puml)

部署架构特点：

- **环境隔离**：开发、生产环境完全分离
- **高可用性**：生产环境集群部署、负载均衡
- **安全加固**：HTTPS/WSS加密、权限控制、数据脱敏
- **统一管理**：共享配置服务、集中监控告警

### 4.4 数据流图

![PageSpy数据流](./pagespy-dataflow.puml)

数据流转过程：

- **数据收集**：多源数据采集、实时监听、异常捕获
- **数据处理**：过滤脱敏、格式化、压缩传输
- **数据存储**：实时缓存、历史存储、索引优化
- **数据展示**：实时推送、多维展示、历史查询

### 4.5 环境配置

```bash
# .env文件
NODE_ENV=production  # 或 development
```

```typescript
// 使用环境变量 - 简化配置
pageSpyManager.init(
  {
    id: 'mobile-app-001',
    name: 'mobile-app',
    title: '移动端应用',
    environment: process.env.NODE_ENV || 'development',
  },
  userContext
);
```

### 4.6 部署要点

- **服务端**：独立部署PageSpy服务集群
- **客户端**：通过npm安装统一SDK
- **环境隔离**：开发、生产环境完全分离
- **安全控制**：多层权限验证、数据加密传输

## 5. 落地建议

### 5.1 实施建议

1. **基础接入**：安装SDK，配置基本参数
2. **权限控制**：生产环境权限验证
3. **功能优化**：根据需求调整调试功能

### 5.2 注意事项

- **生产环境**：谨慎开启，仅对特定用户
- **性能影响**：定期评估对应用性能的影响
- **数据安全**：避免敏感信息泄露
