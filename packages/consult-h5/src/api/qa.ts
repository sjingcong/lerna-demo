import request from './request'

/**
 * 问答机器人API接口
 * 调用公开知识库模型获取回答
 */
export function getAnswer(question: string) {
  // 使用真实请求到本地 API
  return request({
    url: '/qa/answer',
    method: 'post',
    data: { question }
  })
}

// 模拟问答服务，实际项目中应替换为真实API调用
export function mockGetAnswer(question: string): Promise<{ answer: string }> {
  return new Promise((resolve) => {
    // 模拟网络延迟
    setTimeout(() => {
      // 简单的问答逻辑
      let answer = ''
      
      if (question.includes('你好') || question.includes('您好')) {
        answer = '您好！我是智能问答助手，有什么可以帮助您的吗？'
      } else if (question.includes('名字') || question.includes('叫什么')) {
        answer = '我是智能问答助手，很高兴为您服务！'
      } else if (question.includes('天气')) {
        answer = '抱歉，我暂时无法获取实时天气信息。您可以通过天气APP或网站查询最新天气状况。'
      } else if (question.includes('时间') || question.includes('日期')) {
        answer = `当前时间是：${new Date().toLocaleString()}`
      } else if (question.includes('谢谢') || question.includes('感谢')) {
        answer = '不客气，很高兴能帮到您！如果还有其他问题，随时可以咨询我。'
      } else {
        answer = '感谢您的提问。我是基础问答机器人，目前只能回答简单问题。您可以尝试问我其他问题，我会尽力回答。'
      }
      
      resolve({ answer })
    }, 500)
  })
}