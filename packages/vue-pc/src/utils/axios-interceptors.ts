import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// 创建 axios 实例
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || '/api',
  timeout: 10000,
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 获取自定义配置
    const customConfig = config.customConfig;
    
    console.log('请求拦截器 - 自定义配置:', customConfig);
    
    // 根据自定义配置处理请求
    if (customConfig?.showLoading) {
      // 显示加载状态
      console.log('显示加载中...');
      // 这里可以调用您的 loading 组件
    }
    
    if (customConfig?.timeout) {
      // 设置自定义超时时间
      config.timeout = customConfig.timeout;
    }
    
    if (!customConfig?.skipAuth) {
      // 添加认证头
      const token = localStorage.getItem('token');
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
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 获取自定义配置
    const customConfig = response.config.customConfig;
    
    console.log('响应拦截器 - 自定义配置:', customConfig);
    
    // 计算请求耗时
    const endTime = new Date();
    const duration = endTime.getTime() - response.config.metadata?.startTime?.getTime();
    console.log(`请求耗时: ${duration}ms`);
    
    if (customConfig?.showLoading) {
      // 隐藏加载状态
      console.log('隐藏加载中...');
    }
    
    // 处理响应数据
    if (response.data && response.data.code !== undefined) {
      if (response.data.code === 200) {
        return response.data.data || response.data;
      } else {
        const error = new Error(response.data.message || '请求失败');
        if (customConfig?.showError !== false) {
          console.error('API错误:', response.data.message);
          // 这里可以调用您的错误提示组件
        }
        return Promise.reject(error);
      }
    }
    
    return response.data;
  },
  async (error: AxiosError) => {
    const customConfig = error.config?.customConfig;
    
    console.log('响应错误拦截器 - 自定义配置:', customConfig);
    
    if (customConfig?.showLoading) {
      // 隐藏加载状态
      console.log('隐藏加载中...');
    }
    
    // 重试逻辑
    if (customConfig?.retryCount && customConfig.retryCount > 0) {
      const retryConfig = { ...error.config };
      retryConfig.customConfig = {
        ...customConfig,
        retryCount: customConfig.retryCount - 1,
      };
      
      console.log(`重试请求，剩余次数: ${retryConfig.customConfig.retryCount}`);
      return apiClient.request(retryConfig);
    }
    
    // 错误处理
    if (error.response?.status === 401) {
      // 未授权，跳转到登录页
      console.log('未授权，需要重新登录');
      // router.push('/login');
    }
    
    if (customConfig?.showError !== false) {
      const errorMessage = error.response?.data?.message || error.message || '网络错误';
      console.error('请求错误:', errorMessage);
      // 这里可以调用您的错误提示组件
    }
    
    return Promise.reject(error);
  }
);

// 扩展 axios 实例，支持自定义配置
interface CustomAxiosInstance extends AxiosInstance {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

export default apiClient as CustomAxiosInstance;