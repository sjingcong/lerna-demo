import request from './request'

export function getProcessDetail(id: string) {
  return request({
    url: `/process/${id}`,
    method: 'get'
  })
}