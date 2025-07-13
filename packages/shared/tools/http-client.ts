import { axios } from '@bundled-es-modules/axios';
import { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { showToast, showFailToast } from 'vant';

// 常量定义
const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  SERVER_ERROR: 500
} as const;

const RESPONSE_CODES = {
  TOKEN_EXPIRED: '14401',
  SUCCESS: '00000'
} as const;

const DEFAULT_CONFIG = {
  timeout: 30000,
  contentType: 'application/json;charset=UTF-8'
} as const;

// 类型定义
type ErrorMode = 'modal' | 'toast' | 'hidden';

interface AuthConfig {
  accessToken: string;
  refreshToken?: string;
}

interface ApiResponse<T = any> {
  code: string;
  data: T;
  message: string;
}

interface RefreshTokenCallbacks {
  refreshTokenUrl: string;
}

interface HttpClientConfig {
  auth: AuthConfig;
  baseUrl: string;
  timeout?: number;
  enableLogging?: boolean;
  refreshTokenUrl?: string;
}

interface AxiosRequestConfig<D = any> extends InternalAxiosRequestConfig<D> {
  isReturnNativeData?: boolean;
  errorMode?: ErrorMode;
  isRefreshToken?: boolean;
}

// 错误消息映射
const ERROR_MESSAGES = new Map([
  [HTTP_STATUS.SERVER_ERROR, '服务器内部错误'],
  [HTTP_STATUS.BAD_REQUEST, '没有权限'],
  [HTTP_STATUS.UNAUTHORIZED, '登录已过期，请重新登录!']
]);

// 工具函数
const errorMsgHandler = (errStatus: number): string => {
  return ERROR_MESSAGES.get(errStatus as any) || '未知错误';
};

// 错误处理器
export const errorHandler = (errMsg: string, mode: ErrorMode = 'modal'): void => {
  const msg = errMsg || '未知错误';

  switch (mode) {
    case 'modal':
      showToast(msg);
      break;
    case 'toast':
      showFailToast(msg);
      break;
    case 'hidden':
      console.log(msg);
      break;
    default:
      console.warn(`Unknown error mode: ${mode}`);
  }
};

// 日志工具
class Logger {
  constructor(private enableLogging: boolean = false) { }

  info(message: string, data?: any): void {
    if (this.enableLogging) {
      console.log(`[HttpClient] ${message}`, data);
    }
  }

  warn(message: string, data?: any): void {
    if (this.enableLogging) {
      console.log(`[HttpClient] ${message}`, data);
    }
  }

  error(message: string, error?: any): void {
    if (this.enableLogging) {
      console.log(`[HttpClient] ${message}`, error);
    }
  }
}

// Token刷新状态管理
interface PendingRequest {
  url?: string,
  method?: string,
  data?: any,
  config: Partial<AxiosRequestConfig>;
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}

class HttpRequest {
  private auth: AuthConfig;
  private baseUrl: string;
  private refreshTokenUrl: string;
  private service: AxiosInstance;
  private logger: Logger;

  // Token刷新相关状态
  private isRefreshing = false;
  private pendingRequests: PendingRequest[] = [];
  
  // Token刷新频率限制
  private lastRefreshTime = 0;
  private refreshCooldown = 10000; // 10秒内不允许重复刷新

  constructor(config: HttpClientConfig) {
    const { auth, baseUrl, timeout = DEFAULT_CONFIG.timeout, enableLogging = false, refreshTokenUrl } = config;

    this.auth = auth;
    this.baseUrl = baseUrl;
    this.refreshTokenUrl = refreshTokenUrl || '';
    this.logger = new Logger(enableLogging);

    this.service = axios.create({
      timeout,
      baseURL: baseUrl,
    });

    this.initInterceptors();
    this.logger.info('HttpClient initialized', { baseUrl, timeout });
  }

  private initInterceptors(): void {
    // 请求拦截器
    this.service.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        // 只处理请求头设置，保持幂等性
        config.headers = {
          'Content-Type': DEFAULT_CONFIG.contentType,
          Authorization: `Bearer ${this.auth.accessToken}`,
          ...config.headers
        };

        this.logger.info('Request sent', {
          method: config.method,
          url: config.url,
          data: config.data
        });

        return config;
      },
      (error: AxiosError) => {
        this.logger.error('Request error', error);
        return Promise.reject(error);
      },
    );

    // 响应拦截器
    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        const config = response.config as AxiosRequestConfig;
        return this.handleSuccessResponse(response, config);
      },
      (error: AxiosError) => {
        this.logger.error('Response error', error);
        return this.handleErrorResponse(error);
      },
    );
  }

  private handleSuccessResponse(response: AxiosResponse, config: AxiosRequestConfig): any {
    if (response.status !== HTTP_STATUS.OK) {
      const errMsg = errorMsgHandler(response.status);
      errorHandler(errMsg, config.errorMode);
      return Promise.reject(new Error(errMsg));
    }

    const responseData = response.data as ApiResponse;

    // Token过期处理 - 加入队列等待刷新
    if (responseData.code === RESPONSE_CODES.TOKEN_EXPIRED) {
      return this.handleTokenExpired(config);
    }

    // 返回原始数据
    if (config.isReturnNativeData) {
      return responseData;
    }

    // 业务逻辑处理
    if (responseData.code === RESPONSE_CODES.SUCCESS) {
      return responseData.data;
    } else {
      const errorMsg = responseData.message || errorMsgHandler(Number(responseData.code));
      errorHandler(errorMsg, config.errorMode);
      return Promise.reject(new Error(errorMsg));
    }
  }

  private handleErrorResponse(error: AxiosError): Promise<never> {
    const config = error.config as AxiosRequestConfig;
    let errorMessage = '网络请求失败';

    if (error.response) {
      errorMessage = errorMsgHandler(error.response.status);
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = '请求超时';
    } else if (error.message) {
      errorMessage = error.message;
    }

    if (config?.errorMode !== 'hidden') {
      errorHandler(errorMessage, config?.errorMode);
    }

    return Promise.reject(error);
  }

  // HTTP方法 - 类型安全
  public get<T = any>(url: string, params?: Record<string, any>, config?: Partial<AxiosRequestConfig>): Promise<T> {
    this.logger.info('GET request', { url, params });

    // 如果正在刷新Token且不是refreshToken请求，加入队列
    if (this.isRefreshing && !this.isRefreshTokenRequest(url)) {
      this.logger.info(`Token refresh in progress, queuing GET request: ${url}`);
      return this.queueRequestDuringRefresh({ url, method: 'GET', data: params, config: config || {} });
    }

    return this.service.get(url, { params, ...(config || {}) });
  }

  public post<T = any>(url: string, data?: any, config?: Partial<AxiosRequestConfig>): Promise<T> {
    this.logger.info('POST request', { url, data });

    // 如果正在刷新Token且不是refreshToken请求，加入队列
    if (this.isRefreshing && !this.isRefreshTokenRequest(url)) {
      this.logger.info(`Token refresh in progress, queuing POST request: ${url}`);
      return this.queueRequestDuringRefresh({ url, method: 'POST', data, config: config || {} });
    }

    return this.service.post(url, data, config);
  }

  // 判断是否为refreshToken请求
  private isRefreshTokenRequest(url: string): boolean {
    // 检查URL是否包含refreshToken相关路径
    return url.includes(this.refreshTokenUrl);
  }

  // 在Token刷新期间将请求加入队列
  private queueRequestDuringRefresh(params: { url: string, method: string, data: any, config: Partial<AxiosRequestConfig> }): Promise<any> {
    return new Promise((resolve, reject) => {
      const { url, method, data, config } = params
      this.logger.info(`Queuing request during token refresh: ${method?.toUpperCase?.()} ${url}`);

      // 将请求加入待处理队列
      this.pendingRequests.push({ url, method, data, config, resolve, reject });
      this.logger.info(`Request queued during refresh, current queue size: ${this.pendingRequests.length}`);
    });
  }

  // 处理Token过期的请求
  private handleTokenExpired(config: AxiosRequestConfig): Promise<any> {
    return new Promise((resolve, reject) => {
      this.logger.warn(`Token expired detected for ${config.method?.toUpperCase?.()} ${config.url}`);

      // 将请求加入待处理队列
      this.pendingRequests.push({ config, resolve, reject });
      this.logger.info(`Request queued due to token expiry, current queue size: ${this.pendingRequests.length}`);

      // 如果没有正在刷新，则开始刷新
      if (!this.isRefreshing) {
        // 检查刷新频率限制
        const now = Date.now();
        if (!this.lastRefreshTime) {
          this.lastRefreshTime = now
        }
        const timeSinceLastRefresh = now - this.lastRefreshTime;
        
        if (timeSinceLastRefresh < this.refreshCooldown) {
          this.logger.error(`Token refresh too frequent. Last refresh was ${timeSinceLastRefresh}ms ago, minimum interval is ${this.refreshCooldown}ms`);
          const error = new Error('登录已失效，请重新登录');
          this.clearPendingRequests(error);
          return;
        }
        
        this.logger.info('Starting token refresh process...');
        this.lastRefreshTime = now;
        this.asyncRefreshToken();
      } else {
        this.logger.info('Token refresh already in progress, request added to queue');
      }
    });
  }

  // 重新发送待处理的请求 - 并行处理
  private async retryPendingRequests(): Promise<void> {
    const requests = [...this.pendingRequests];
    this.pendingRequests = [];

    if (requests.length === 0) {
      this.logger.info('No pending requests to retry');
      return;
    }

    this.logger.info(`Starting to retry ${requests.length} pending requests in parallel`);

    // 并行处理所有待处理的请求
    const retryPromises = requests.map(async ({ url, method, data, config, resolve, reject }, index) => {

      const requestId = `${config.method?.toUpperCase?.()} ${config.url}`;
      try {
        this.logger.info(`[${index + 1}/${requests.length}] Retrying request: ${requestId}`);

        // 更新请求头中的token
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${this.auth.accessToken}`
        };
        // 两种情况特殊处理
        if (url) {
          const response = method == 'POST' ? this.post(url, data, config) : this.get(url, data, config);
          resolve(response);
          return
        }
        const response = await this.service.request(config);
        resolve(response);
      } catch (error) {
        this.logger.error(`[${index + 1}/${requests.length}] Request retry failed: ${requestId}`, error);
        reject(error);
      }
    });

    // 等待所有请求完成（不管成功还是失败）
    const results = await Promise.allSettled(retryPromises);

    // 统计重试结果
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    this.logger.info(`Retry completed: ${successful} successful, ${failed} failed out of ${requests.length} requests`);
  }

  // 清空待处理请求队列
  private clearPendingRequests(error: Error): void {
    const requests = [...this.pendingRequests];
    this.pendingRequests = [];

    if (requests.length === 0) {
      this.logger.info('No pending requests to clear');
      return;
    }

    this.logger.warn(`Clearing ${requests.length} pending requests due to: ${error.message}`);

    // 拒绝所有待处理的请求
    requests.forEach(({ config, reject }, index) => {
      const requestId = `${config.method?.toUpperCase?.()} ${config.url}`;
      this.logger.warn(`[${index + 1}/${requests.length}] Rejecting request: ${requestId}`);
      reject(error);
    });

    this.logger.info(`Successfully cleared ${requests.length} pending requests`);
  }

  refreshTokenApi(): Promise<any> {
    return this.post(this.refreshTokenUrl, {}, {
      errorMode: 'hidden',
      isRefreshToken: true,
    }).then((res: any) => {
      this.auth.accessToken = res.accessToken;
      this.auth.refreshToken = res.refreshToken;
      return res
    });
  }
  private async asyncRefreshToken(): Promise<void> {
    if (!this.refreshTokenUrl) {
      this.logger.error('No refresh token api configured');
      const error = new Error('登录已失效，请重新登录');
      this.clearPendingRequests(error);
      return;
    }

    this.isRefreshing = true;

    try {
      this.logger.info('Calling refresh token handler...');
      await this.refreshTokenApi()
      console.log('token 刷新成功')
      this.logger.info('Token refresh completed successfully');
      

      this.isRefreshing = false;

      this.logger.info('Processing pending requests after successful token refresh...');
      // 重新发送待处理的请求
      await this.retryPendingRequests();

    } catch (error) {
      this.isRefreshing = false;
      this.logger.error('Token refresh failed:', error);

      // 清空待处理请求队列 - 登录失效
      const loginExpiredError = new Error('登录已失效，请重新登录');
      this.clearPendingRequests(loginExpiredError);
      console.log('token 刷新失败');
      this.logger.warn('All pending requests have been rejected due to token refresh failure');
    } finally {
      this.logger.info('Token refresh process ended, isRefreshing reset to false');
    }
  }

  // 实例销毁
  public destroy(): void {
    this.logger.info('Destroying HttpClient instance...');

    // 清理待处理的请求队列
    if (this.pendingRequests.length > 0) {
      const error = new Error('HttpRequest instance destroyed');
      this.clearPendingRequests(error);
    }

    // 重置刷新状态
    this.isRefreshing = false;

    this.logger.info('HttpClient instance destroyed successfully');
  }
}

export default HttpRequest;
export { HttpRequest, type HttpClientConfig, type AuthConfig, type ErrorMode, type ApiResponse };