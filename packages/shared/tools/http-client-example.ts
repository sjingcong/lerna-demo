import { HttpRequest, HttpClientConfig, RefreshTokenCallbacks } from './http-client';

// 基础配置
const config: HttpClientConfig = {
  auth: {
    accessToken: 'your-access-token',
    refreshToken: 'your-refresh-token'
  },
  baseUrl: 'https://api.example.com',
  timeout: 10000,
  enableLogging: true
};

// 创建HTTP客户端实例
const httpClient = new HttpRequest(config);

// Token刷新回调配置 - 支持请求队列机制
httpClient.setRefreshToken({
  onRefreshTokenHandler: async () => {
    console.log('开始刷新Token...');
    
    // 刷新token的逻辑
    const response = await fetch('/api/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${httpClient.getAuth().refreshToken}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Token刷新失败');
    }
    
    const data = await response.json();
    
    // 更新认证信息
    httpClient.updateAuth({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken
    });
    
    console.log('Token刷新成功，准备重试待处理请求');
    return data;
  },
  onRefreshTokenCompleted: () => {
    console.log('Token刷新完成，所有待处理请求已重新发送');
  },
  onRefreshTokenFailed: () => {
    console.log('Token刷新失败，清空待处理请求队列，跳转到登录页');
    // 跳转到登录页面
    window.location.href = '/login';
  }
});

// 使用示例

// 1. GET请求
httpClient.get('/api/users').then(data => {
  console.log('用户列表:', data);
}).catch(error => {
  console.error('请求失败:', error);
});

// 2. POST请求
httpClient.post('/api/users', {
  name: 'John Doe',
  email: 'john@example.com'
}).then(data => {
  console.log('创建用户成功:', data);
}).catch(error => {
  console.error('创建用户失败:', error);
});

// 3. 模拟Token过期场景 - 多个并发请求
async function simulateTokenExpiredScenario() {
  console.log('模拟Token过期场景...');
  
  // 同时发送多个请求，当Token过期时，这些请求会被加入队列
  const promises = [
    httpClient.get('/api/profile'),
    httpClient.get('/api/settings'),
    httpClient.post('/api/logs', { action: 'login' }),
    httpClient.get('/api/notifications'),
    httpClient.put('/api/profile', { name: 'Updated Name' })
  ];
  
  try {
    // 所有请求都会在Token刷新后自动重试
    const results = await Promise.all(promises);
    console.log('所有请求完成:', results);
  } catch (error) {
    console.error('请求失败:', error);
  }
}

// 4. 返回原始响应数据
httpClient.get('/api/raw-data', { isReturnNativeData: true }).then(response => {
  console.log('原始响应:', response);
});

// 5. 隐藏错误提示
httpClient.get('/api/silent-request', { errorMode: 'silent' }).then(data => {
  console.log('静默请求结果:', data);
});

// 6. 其他HTTP方法
httpClient.put('/api/users/1', { name: 'Updated Name' });
httpClient.delete('/api/users/1');
httpClient.patch('/api/users/1', { status: 'active' });

// 7. 获取当前认证信息
const currentAuth = httpClient.getAuth();
console.log('当前认证信息:', currentAuth);

// 8. 更新认证信息
httpClient.updateAuth({
  accessToken: 'new-access-token',
  refreshToken: 'new-refresh-token'
});

// 9. 销毁实例（清理资源和待处理请求队列）
// httpClient.destroy();

// Token刷新队列机制说明：
// 1. 当检测到Token过期时，新的请求会被暂停并加入队列
// 2. 只有一个Token刷新操作会执行，避免重复刷新
// 3. Token刷新成功后，队列中的所有请求会自动重新发送
// 4. 如果Token刷新失败，队列中的所有请求都会被拒绝
// 5. 实例销毁时会清理所有待处理的请求，避免内存泄漏

export { httpClient };