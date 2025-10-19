import request from './request'
import { Message } from '../types/chat'

// 获取聊天历史记录
export function getChatHistory(params: { page: number; size: number }) {
  return request({
    url: '/chat/history',
    method: 'get',
    params
  })
}

// 发送消息
export function sendMessage(data: { content: string; type: string; fileUrl?: string; fileName?: string; fileSize?: number; isUser?: boolean }) {
  return request({
    url: '/chat/send',
    method: 'post',
    data
  })
}

// 上传文件
export function uploadFile(data: any) {
  const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined
  return request({
    url: '/upload',
    method: 'post',
    data,
    headers
  })
}