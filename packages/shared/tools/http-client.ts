import { axios } from '@bundled-es-modules/axios';
import qs from 'qs';
import { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { showToast, showFailToast } from 'vant';

// 常量定义
const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  SERVER_ERROR: 500
} as const;

const ERROR_CODES = {
  TOKEN_EXPIRED: '14401',
  SUCCESS: '0'
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
  onRefreshTokenCompleted: () => void;
  onRefreshTokenHandler: () => Promise<any>;
  onRefreshTokenFailed: () => void;
}

interface HttpClientConfig {
  auth: AuthConfig;
  baseUrl: string;
  timeout?: number;
  enableLogging?: boolean;
}

interface AxiosRequestConfig<D = any> extends InternalAxiosRequestConfig<D> {
  isReturnNativeData?: boolean;
  errorMode?: ErrorMode;
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



// 工具函数
const getUrlParameter = (name: string): string | null => {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  return params.get(name) || null;
};

const extractToken = (bearerString: string): string | null => {
  if (bearerString.startsWith('Bearer ')) {
    return bearerString.split('Bearer ')[1];
  }
  return null;
};

// 日志工具
class Logger {
  constructor(private enableLogging: boolean = false) {}
  
  info(message: string, data?: any): void {
    if (this.enableLogging) {
      console.log(`[HttpClient] ${message}`, data);
    }
  }
  
  error(message: string, error?: any): void {
    if (this.enableLogging) {
      console.error(`[HttpClient] ${message}`, error);
    }
  }
}

class HttpRequest {
  private refreshTokenCallbacks?: RefreshTokenCallbacks;
  private auth: AuthConfig;
  private baseUrl: string;
  private service: AxiosInstance;
  private logger: Logger;
  
  constructor(config: HttpClientConfig) {
    const { auth, baseUrl, timeout = DEFAULT_CONFIG.timeout, enableLogging = false } = config;
    
    this.auth = auth;
    this.baseUrl = baseUrl;
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
    
    // Token过期处理
    if (responseData.code === ERROR_CODES.TOKEN_EXPIRED) {
      this.asyncRefreshToken();
      return Promise.reject(new Error('Token expired'));
    }
    
    // 返回原始数据
    if (config.isReturnNativeData) {
      return responseData;
    }
    
    // 业务逻辑处理
    if (responseData.code === ERROR_CODES.SUCCESS) {
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
  public get<T = any>(url: string, params?: Record<string, any>, config?: AxiosRequestConfig): Promise<T> {
    this.logger.info('GET request', { url, params });
    return this.service.get(url, { params, ...config });
  }

  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    this.logger.info('POST request', { url, data });
    return this.service.post(url, data, config);
  }

  // Token管理
  public setRefreshToken(callbacks: RefreshTokenCallbacks): void {
    this.refreshTokenCallbacks = callbacks;
    this.logger.info('Refresh token callbacks set');
  }

  private async asyncRefreshToken(): Promise<void> {
    if (!this.refreshTokenCallbacks?.onRefreshTokenHandler) {
      this.logger.error('No refresh token handler configured');
      return;
    }

    try {
      this.logger.info('Refreshing token...');
      const result = await this.refreshTokenCallbacks.onRefreshTokenHandler();
      
      if (this.refreshTokenCallbacks.onRefreshTokenCompleted) {
        this.refreshTokenCallbacks.onRefreshTokenCompleted();
      }
      
      this.logger.info('Token refreshed successfully');
    } catch (error) {
      this.logger.error('Token refresh failed', error);
      
      if (this.refreshTokenCallbacks.onRefreshTokenFailed) {
        this.refreshTokenCallbacks.onRefreshTokenFailed();
      }
    }
  }

  // 实例销毁
  public destroy(): void {
    this.logger.info('HttpClient destroyed');
  }
}

export default HttpRequest;
export { HttpRequest, type HttpClientConfig, type AuthConfig, type ErrorMode, type ApiResponse };