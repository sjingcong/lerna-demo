import { axios } from '@bundled-es-modules/axios';
import qs from 'qs';
import { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { showToast, showFailToast } from 'vant';

// 根据错误代码，获取对应文字
const errorMsgHandler = (errStatus: number): string => {
  if (errStatus === 500) return '服务器内部错误';
  if (errStatus === 400) return '没有权限';
  if (errStatus === 401) return '登录已过期，请重新登录!';
  return '未知错误';
};

// 根据mode，返回错误信息
export const errorHandler = (errMsg: string, mode = 'modal') => {
  const msg = errMsg || '未知错误';
  
  if (mode === 'modal') {
    showToast(`${msg}`);
  }
  if (mode === 'toast') {
    showFailToast(`${msg}`);
  }
  if (mode === 'hidden') {
    console.log(msg);
  }
};

interface AxiosRequestConfig<D = any> extends InternalAxiosRequestConfig<D> {
  isReturnNativeData?: boolean; // 是否返回原数据
  errorMode?: string; // 错误提示展示方式
  needBlackbox?: boolean
  repeatRequest?: boolean; // 允许重复请求
}

const pendingMap = new Map();

function getRequestKey(config: AxiosRequestConfig) {
  return (config.method || '') + config.url + '?' + qs.stringify(config.data);
}

//获取url参数
const getUrlParameter = (name: string): string | null => {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  return params.get(name) || null; // 使用 || 替代三元运算符，更简洁明了。
};

function setPendingMap(config: AxiosRequestConfig) {
  const controller = new AbortController();
  config.signal = controller.signal;
  const key = getRequestKey(config);
  if (pendingMap.has(key)) {
    pendingMap.get(key).abort();
    pendingMap.delete(key);
  } else {
    pendingMap.set(key, controller);
  }
}

function extractToken(bearerString: string) {
  if (bearerString.startsWith('Bearer ')) {
    return bearerString.split('Bearer ')[1];
  }
  return null;
}

class HttpRequest {
  private onRefreshTokenCompleted?: () => void
  private onRefreshTokenHandler?: () => Promise<any>
  private onRefreshTokenFailed?: () => void
  private auth: any
  private baseUrl: string
  private service: AxiosInstance
  
  constructor(params: {
    auth: any,
    baseUrl: string,
  }) {
    const { auth, baseUrl, } = params
    this.auth = auth
    this.baseUrl = baseUrl
    this.service = axios.create({
      timeout: 1000 * 30,
      baseURL: baseUrl,
    });
    this.initInterceptors()
  }

  private initInterceptors() {
    this.service.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        if (!config.repeatRequest) {
          setPendingMap(config);
        }
        // @ts-ignore
        config.headers = Object.assign(
          {},
          {
            'Content-Type': 'application/json;charset=UTF-8',
            Authorization: `Bearer ${this.auth.accessToken}`,
            ...config.headers
          },
        );
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject();
      },
    );

    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        const config = response.config as AxiosRequestConfig;
        const key = getRequestKey(config);
        pendingMap.delete(key);
        if (response.status === 200) {
          // 假如14401表示token失效，则刷新token回调逻辑
          if (response.data.code === '14401') {
            this.asyncRefreshToken();
          }
          if (config?.isReturnNativeData) {
            return response.data;
          } else {
            const { data, code, message } = response.data;
            if (code === '0') {
              return data;
            } else {
              errorHandler(message || errorMsgHandler(code), config.errorMode);
            }
          }
        } else {
          const errMsg = errorMsgHandler(response.status);
          errorHandler(errMsg, config.errorMode);
          return Promise.reject();
        }
      },
      (error: AxiosError) => {
        return Promise.reject();
      },
    );
   }

   public get(url: string, params = {}, config = {}) {
      return this.service.get(url, { params: params, ...config });
    }

    public post(url: string, params = {}, config = {}) {
      return this.service.post(url, params, config);
    }

    public setRefreshToken(params: {
      onRefreshTokenCompleted: () => void
      onRefreshTokenHandler: () => Promise<any>
      onRefreshTokenFailed: () => void
    }) {
      this.onRefreshTokenCompleted = params.onRefreshTokenCompleted
      this.onRefreshTokenHandler = params.onRefreshTokenHandler
      this.onRefreshTokenFailed = params.onRefreshTokenFailed
    }

    private async asyncRefreshToken() {
       if (this.onRefreshTokenHandler) {
         try {
           const result = await this.onRefreshTokenHandler();
           if (this.onRefreshTokenCompleted) {
             this.onRefreshTokenCompleted();
           }
         } catch (error) {
           if (this.onRefreshTokenFailed) {
             this.onRefreshTokenFailed();
           }
         }
       }
     }
 }
 export default HttpRequest