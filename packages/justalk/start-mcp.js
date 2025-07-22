#!/usr/bin/env node

/**
 * JusTalk MCP 服务快速启动脚本
 * 用于简化 Cursor 接入和测试
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// 配置
const CONFIG = {
  host: process.env.JUSTALK_HOST || 'localhost',
  port: process.env.JUSTALK_PORT || 3001,
  logLevel: process.env.JUSTALK_LOG_LEVEL || 'info',
  mode: process.env.NODE_ENV || 'development'
};

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader() {
  log('\n' + '='.repeat(60), 'cyan');
  log('🎯 JusTalk MCP Server - Quick Start', 'bright');
  log('='.repeat(60), 'cyan');
  log(`📍 Host: ${CONFIG.host}`, 'blue');
  log(`🔌 Port: ${CONFIG.port}`, 'blue');
  log(`📊 Log Level: ${CONFIG.logLevel}`, 'blue');
  log(`⚙️  Mode: ${CONFIG.mode}`, 'blue');
  log('='.repeat(60), 'cyan');
}

function logCursorConfig() {
  const configPath = process.platform === 'win32' 
    ? path.join(process.env.APPDATA, 'Cursor', 'User', 'mcp_servers.json')
    : process.platform === 'darwin'
    ? path.join(process.env.HOME, 'Library', 'Application Support', 'Cursor', 'User', 'mcp_servers.json')
    : path.join(process.env.HOME, '.config', 'Cursor', 'User', 'mcp_servers.json');

  const currentDir = __dirname;
  const scriptPath = CONFIG.mode === 'development' 
    ? path.join(currentDir, 'src', 'index.ts')
    : path.join(currentDir, 'dist', 'index.js');

  const mcpConfig = {
    mcpServers: {
      justalk: CONFIG.mode === 'development' ? {
        command: 'npx',
        args: ['tsx', scriptPath],
        cwd: currentDir,
        env: {
          NODE_ENV: 'development',
          JUSTALK_HOST: CONFIG.host,
          JUSTALK_PORT: CONFIG.port,
          JUSTALK_LOG_LEVEL: CONFIG.logLevel
        }
      } : {
        command: 'node',
        args: [scriptPath],
        cwd: currentDir,
        env: {
          NODE_ENV: 'production',
          JUSTALK_HOST: CONFIG.host,
          JUSTALK_PORT: CONFIG.port,
          JUSTALK_LOG_LEVEL: CONFIG.logLevel
        }
      }
    }
  };

  log('\n📋 Cursor MCP 配置信息:', 'yellow');
  log('-'.repeat(40), 'yellow');
  log(`配置文件路径: ${configPath}`, 'blue');
  log('\n配置内容:', 'blue');
  log(JSON.stringify(mcpConfig, null, 2), 'green');
  log('-'.repeat(40), 'yellow');
}

function checkDependencies() {
  log('\n🔍 检查依赖...', 'yellow');
  
  const packageJsonPath = path.join(__dirname, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    log('❌ package.json 不存在', 'red');
    process.exit(1);
  }

  const nodeModulesPath = path.join(__dirname, 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    log('❌ node_modules 不存在，请先运行: npm install', 'red');
    process.exit(1);
  }

  if (CONFIG.mode === 'production') {
    const distPath = path.join(__dirname, 'dist');
    if (!fs.existsSync(distPath)) {
      log('❌ dist 目录不存在，请先运行: npm run build', 'red');
      process.exit(1);
    }
  }

  log('✅ 依赖检查通过', 'green');
}

function startServer() {
  log('\n🚀 启动 MCP 服务器...', 'yellow');
  
  const command = CONFIG.mode === 'development' ? 'npx' : 'node';
  const args = CONFIG.mode === 'development' 
    ? ['tsx', 'src/index.ts']
    : ['dist/index.js'];

  const env = {
    ...process.env,
    NODE_ENV: CONFIG.mode,
    JUSTALK_HOST: CONFIG.host,
    JUSTALK_PORT: CONFIG.port,
    JUSTALK_LOG_LEVEL: CONFIG.logLevel
  };

  const child = spawn(command, args, {
    cwd: __dirname,
    env,
    stdio: 'inherit'
  });

  child.on('error', (error) => {
    log(`❌ 启动失败: ${error.message}`, 'red');
    process.exit(1);
  });

  child.on('exit', (code) => {
    if (code !== 0) {
      log(`❌ 服务器异常退出，代码: ${code}`, 'red');
    } else {
      log('👋 服务器已停止', 'yellow');
    }
  });

  // 优雅关闭
  process.on('SIGINT', () => {
    log('\n🛑 正在关闭服务器...', 'yellow');
    child.kill('SIGINT');
  });

  process.on('SIGTERM', () => {
    log('\n🛑 正在关闭服务器...', 'yellow');
    child.kill('SIGTERM');
  });
}

function showUsageInstructions() {
  log('\n📖 使用说明:', 'magenta');
  log('-'.repeat(40), 'magenta');
  log('1. 复制上面的配置到 Cursor 的 mcp_servers.json 文件', 'blue');
  log('2. 重启 Cursor', 'blue');
  log('3. 在 Cursor 中使用: @justalk <你的编辑指令>', 'blue');
  log('\n示例指令:', 'magenta');
  log('  @justalk 把这个按钮的背景色改成红色', 'green');
  log('  @justalk 获取组件信息', 'green');
  log('-'.repeat(40), 'magenta');
}

// 主函数
function main() {
  logHeader();
  checkDependencies();
  logCursorConfig();
  showUsageInstructions();
  
  log('\n⏳ 3秒后启动服务器...', 'yellow');
  setTimeout(() => {
    startServer();
  }, 3000);
}

// 处理命令行参数
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  log('\nJusTalk MCP Server 快速启动脚本\n', 'bright');
  log('用法:', 'yellow');
  log('  node start-mcp.js                    # 启动服务器', 'blue');
  log('  node start-mcp.js --help             # 显示帮助', 'blue');
  log('\n环境变量:', 'yellow');
  log('  JUSTALK_HOST=localhost               # 服务器主机', 'blue');
  log('  JUSTALK_PORT=3001                    # 服务器端口', 'blue');
  log('  JUSTALK_LOG_LEVEL=info               # 日志级别', 'blue');
  log('  NODE_ENV=development                 # 运行模式', 'blue');
  process.exit(0);
}

if (process.argv.includes('--config-only')) {
  logHeader();
  logCursorConfig();
  showUsageInstructions();
  process.exit(0);
}

// 启动
main();