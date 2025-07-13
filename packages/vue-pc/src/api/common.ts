import httpInstance from './index';

// 获取列表数据
export function getList(params?: any): Promise<any> {
  return httpInstance.post('/api/list', params);
}

// 获取用户信息
export function getUser(params?: any): Promise<any> {
  const url = '/api/user';
  return httpInstance.post(url, params);
}

// 获取公司信息
export function getCompany(params?: any): Promise<any> {
  const url = '/api/company';
  return httpInstance.post(url, params);
}

// 获取未知信息
export function getPosition(params?: any): Promise<any> {
  const url = '/api/position';
  return httpInstance.post(url, params);
}