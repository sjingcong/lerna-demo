import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// 自定义配置接口
interface CustomConfig {
  showLoading?: boolean;
  showError?: boolean;
  skipAuth?: boolean;
  timeout?: number;
  retryCount?: number;
  retryDelay?: number;
}

// 扩展 AxiosRequestConfig
declare module 'axios' {
  interface AxiosRequestConfig {
    customConfig?: CustomConfig;
    metadata?: {
      startTime?: Date;
    };
  }
}

// 请求队列项接口
interface PendingRequest {
  resolve: (value: any) => void;
  reject: (reason: any) => void;
  config: AxiosRequestConfig;
}

class HttpClient {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private pendingRequests: PendingRequest[] = [];
  private refreshTokenPromise: Promise<string> | null = null;

  constructor(baseURL?: string, timeout = 10000) {
    this.instance = axios.create({
      baseURL: baseURL || process.env.VUE_APP_API_BASE_URL || '/api',
      timeout,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        const customConfig = config.customConfig;
        
        console.log('请求拦截器 - 自定义配置:', customConfig);
        
        // 显示加载状态
        if (customConfig?.showLoading) {
          this.showLoading();
        }
        
        // 设置自定义超时时间
        if (customConfig?.timeout) {
          config.timeout = customConfig.timeout;
        }
        
        // 添加认证头
        if (!customConfig?.skipAuth) {
          const token = this.getToken();
          if (token) {
            config.headers = {
              ...config.headers,
              Authorization: `Bearer ${token}`,
            };
          }
        }
        
        // 添加请求时间戳
        config.metadata = { startTime: new Date() };
        
        return config;
      },
      (error: AxiosError) => {
        console.error('请求拦截器错误:', error);
        return Promise.reject(error);
      }
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        const customConfig = response.config.customConfig;
        
        // 计算请求耗时
        this.logRequestDuration(response);
        
        // 隐藏加载状态
        if (customConfig?.showLoading) {
          this.hideLoading();
        }
        
        // 处理响应数据
        return this.handleResponse(response, customConfig);
      },
      async (error: AxiosError) => {
        const customConfig = error.config?.customConfig;
        
        // 隐藏加载状态
        if (customConfig?.showLoading) {
          this.hideLoading();
        }
        
        // 处理token失效
        if (error.response?.status === 401 && !customConfig?.skipAuth) {
          return this.handleTokenExpired(error);
        }
        
        // 处理重试逻辑
        if (this.shouldRetry(error, customConfig)) {
          return this.retryRequest(error);
        }
        
        // 显示错误信息
        if (customConfig?.showError !== false) {
          this.showError(error);
        }
        
        return Promise.reject(error);
      }
    );
  }

  // 处理token失效
  private async handleTokenExpired(error: AxiosError): Promise<any> {
    const originalRequest = error.config!;
    
    // 如果已经在刷新token，将请求加入队列
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.pendingRequests.push({
          resolve,
          reject,
          config: originalRequest,
        });
      });
    }
    
    // 开始刷新token
    this.isRefreshing = true;
    
    try {
      // 如果没有正在进行的刷新请求，创建一个新的
      if (!this.refreshTokenPromise) {
        this.refreshTokenPromise = this.refreshToken();
      }
      
      const newToken = await this.refreshTokenPromise;
      
      // 更新token
      this.setToken(newToken);
      
      // 重新发起原始请求
      originalRequest.headers = {
        ...originalRequest.headers,
        Authorization: `Bearer ${newToken}`,
      };
      
      const response = await this.instance.request(originalRequest);
      
      // 处理队列中的请求
      this.processPendingRequests(newToken);
      
      return response;
    } catch (refreshError) {
      // 刷新token失败，清空队列并跳转登录
      this.rejectPendingRequests(refreshError);
      this.handleRefreshTokenError();
      return Promise.reject(refreshError);
    } finally {
      this.isRefreshing = false;
      this.refreshTokenPromise = null;
    }
  }

  // 处理队列中的请求
  private async processPendingRequests(newToken: string) {
    const requests = [...this.pendingRequests];
    this.pendingRequests = [];
    
    for (const { resolve, reject, config } of requests) {
      try {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${newToken}`,
        };
        const response = await this.instance.request(config);
        resolve(response);
      } catch (error) {
        reject(error);
      }
    }
  }

  // 拒绝队列中的请求
  private rejectPendingRequests(error: any) {
    const requests = [...this.pendingRequests];
    this.pendingRequests = [];
    
    requests.forEach(({ reject }) => {
      reject(error);
    });
  }

  // 刷新token
  private async refreshToken(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    try {
      const response = await axios.post('/api/auth/refresh', {
        refreshToken,
      });
      
      const { token, refreshToken: newRefreshToken } = response.data;
      
      // 更新refresh token
      if (newRefreshToken) {
        this.setRefreshToken(newRefreshToken);
      }
      
      return token;
    } catch (error) {
      console.error('刷新token失败:', error);
      throw error;
    }
  }

  // 判断是否需要重试
  private shouldRetry(error: AxiosError, customConfig?: CustomConfig): boolean {
    return (
      customConfig?.retryCount !== undefined &&
      customConfig.retryCount > 0 &&
      error.response?.status !== 401 &&
      error.code !== 'ECONNABORTED' // 不重试超时错误
    );
  }

  // 重试请求
  private async retryRequest(error: AxiosError): Promise<any> {
    const customConfig = error.config?.customConfig!;
    const retryDelay = customConfig.retryDelay || 1000;
    
    // 等待指定时间后重试
    await new Promise(resolve => setTimeout(resolve, retryDelay));
    
    const retryConfig = { ...error.config };
    retryConfig.customConfig = {
      ...customConfig,
      retryCount: customConfig.retryCount! - 1,
    };
    
    console.log(`重试请求，剩余次数: ${retryConfig.customConfig.retryCount}`);
    return this.instance.request(retryConfig);
  }

  // 处理响应数据
  private handleResponse(response: AxiosResponse, customConfig?: CustomConfig) {
    if (response.data && response.data.code !== undefined) {
      if (response.data.code === 200) {
        return response.data.data || response.data;
      } else {
        const error = new Error(response.data.message || '请求失败');
        if (customConfig?.showError !== false) {
          console.error('API错误:', response.data.message);
        }
        throw error;
      }
    }
    
    return response.data;
  }

  // 记录请求耗时
  private logRequestDuration(response: AxiosResponse) {
    const endTime = new Date();
    const startTime = response.config.metadata?.startTime;
    if (startTime) {
      const duration = endTime.getTime() - startTime.getTime();
      console.log(`请求耗时: ${duration}ms`);
    }
  }

  // Token管理方法
  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  private setRefreshToken(refreshToken: string): void {
    localStorage.setItem('refreshToken', refreshToken);
  }

  private clearTokens(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

  // 处理刷新token失败
  private handleRefreshTokenError(): void {
    this.clearTokens();
    console.log('Token刷新失败，需要重新登录');
    // 这里可以跳转到登录页
    // router.push('/login');
  }

  // UI交互方法（可以根据实际UI框架调整）
  private showLoading(): void {
    console.log('显示加载中...');
    // 这里可以调用您的loading组件
  }

  private hideLoading(): void {
    console.log('隐藏加载中...');
    // 这里可以调用您的loading组件
  }

  private showError(error: AxiosError): void {
    const errorMessage = error.response?.data?.message || error.message || '网络错误';
    console.error('请求错误:', errorMessage);
    // 这里可以调用您的错误提示组件
  }

  // 公共方法
  public get<T = any>(
    url: string,
    config?: AxiosRequestConfig & { customConfig?: CustomConfig }
  ): Promise<T> {
    return this.instance.get(url, config);
  }

  public post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig & { customConfig?: CustomConfig }
  ): Promise<T> {
    return this.instance.post(url, data, config);
  }

  public put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig & { customConfig?: CustomConfig }
  ): Promise<T> {
    return this.instance.put(url, data, config);
  }

  public delete<T = any>(
    url: string,
    config?: AxiosRequestConfig & { customConfig?: CustomConfig }
  ): Promise<T> {
    return this.instance.delete(url, config);
  }

  // 设置基础URL
  public setBaseURL(baseURL: string): void {
    this.instance.defaults.baseURL = baseURL;
  }

  // 设置默认超时时间
  public setTimeout(timeout: number): void {
    this.instance.defaults.timeout = timeout;
  }
}

// 创建默认实例
const httpClient = new HttpClient();

export default httpClient;
export { HttpClient };