// 用户管理API服务

import httpInstance from '@/api/index'
import type { 
  User, 
  UserSearchForm, 
  UserListResponse, 
  UserRequest, 
  PaginationParams 
} from './types'

/**
 * 获取用户列表
 */
export async function getUserList(
  params: UserSearchForm & PaginationParams
): Promise<UserListResponse> {
    return await httpInstance.post('/base/sales/channel/list', params)
}

/**
 * 创建用户
 */
export async function saveUser(
  data: UserRequest
): Promise<User> {
  return await httpInstance.post('/base/sales/channel/addOrUpdate', data)
}


/**
 * 导入用户数据
 */
export async function importUsers(params: any): Promise<{
  success: number;
  failed: number;
  total: number;
}> {
    return await httpInstance.post('/base/sales/channel/import', params)
}

export async function enableSalesChannel(params: any): Promise<any> {
    return await httpInstance.post('/base/sales/channel/enabled', params)
}

export async function getSalesChannelList(params: any): Promise<any> {
    return await httpInstance.post('/base/sales/channel/getSalesChannelList', params)
}