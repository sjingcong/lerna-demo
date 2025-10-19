import type { Plugin } from 'vite';

/**
 * 开发环境本地 Mock API 插件
 * 抽离自 vite.config.ts，便于维护与切换真实后端
 */
export function devMockApi(): Plugin {
  return {
    name: 'dev-mock-api',
    configureServer(server) {
      const messages = [
        {
          id: '1',
          content: '您好，有什么可以帮助您的？',
          type: 'text',
          isUser: false,
          time: Date.now(),
        },
      ];

      const readBody = (req: any) =>
        new Promise<string>((resolve) => {
          const chunks: Buffer[] = [];
          req.on('data', (c: Buffer) => chunks.push(c));
          req.on('end', () => resolve(Buffer.concat(chunks).toString()));
        });

      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';
        const pathname = url.split('?')[0];
        if (!url.startsWith('/api')) return next();

        res.setHeader('Content-Type', 'application/json');
        const method = (req.method || 'GET').toUpperCase();
        const raw = method === 'POST' ? await readBody(req) : '';
        let body: any = {};
        try {
          body = raw ? JSON.parse(raw) : {};
        } catch {
          body = {};
        }

        // 获取聊天历史
        if (pathname === '/api/chat/history' && method === 'GET') {
          res.end(JSON.stringify({ code: 200, data: { messages } }));
          return;
        }

        // 清空聊天历史
        if (pathname === '/api/chat/clear' && method === 'POST') {
          messages.length = 0;
          res.end(JSON.stringify({ code: 200, data: true }));
          return;
        }

        // 发送消息并落库
        if (pathname === '/api/chat/send' && method === 'POST') {
          const {
            content,
            type,
            fileUrl,
            fileName,
            fileSize,
            isUser,
            processId,
            processStatus,
            stepsPreview,
            linkPath,
          } = body || {};
          const msg = {
            id: Date.now().toString(),
            content: content || '',
            type: type || 'text',
            isUser: typeof isUser === 'boolean' ? isUser : true,
            time: Date.now(),
            fileUrl,
            fileName,
            fileSize,
            processId,
            processStatus,
            stepsPreview,
            linkPath,
          };
          messages.push(msg);
          res.end(JSON.stringify({ code: 200, data: msg }));
          return;
        }

        // 问答接口
        if (pathname === '/api/qa/answer' && method === 'POST') {
          const { question } = body || {};
          let answer = '';
          const q = String(question || '');
          if (q.includes('你好') || q.includes('您好')) {
            answer = '您好！我是智能问答助手，有什么可以帮助您的吗？';
          } else if (q.includes('名字') || q.includes('叫什么')) {
            answer = '我是智能问答助手，很高兴为您服务！';
          } else if (q.includes('天气')) {
            answer =
              '抱歉，我暂时无法获取实时天气信息。您可以通过天气APP或网站查询最新天气状况。';
          } else if (q.includes('保费上涨') && q.includes('多')) {
            answer =
              '您好，我们查询到您的保单号为 92002010003718477、9200230000179307。其中前者为「平安e生保互联网2023升级版」，后者为「平安e生保互联网意外伤害保险E」。根据系统记录，2024年度保费分别为 683元 与 139元，续保后对应保费分别为 810元 和 139元。经比对，涨价部分主要集中在前者，差额约 127元。根据产品费率表及客户年龄条件分析，属于跨档续保所致，属正常费率调整范围。您的保费变动主要因产品升级和年龄档调整导致，并非个别涨价。系统每年会根据监管费率及精算模型动态调整价格，保障内容未减少。建议客户可登录App“我的→保单详情”查看续保计划，或联系人工客服了解更多优惠续保方案。';
          } else if (q.includes('时间') || q.includes('日期')) {
            answer = `当前时间是：${new Date().toLocaleString()}`;
          } else if (
            q.includes('立即缴费') &&
            (q.includes('异常') || q.includes('无法'))
          ) {
            answer = `您反馈的问题我们已提交至相关技术团队进行分析，处理结果确认后会第一时间通知您。建议您可在 App【我的→智能客服】中关注进度，感谢您的理解与耐心`;
          } else if (q.includes('谢谢') || q.includes('感谢')) {
            answer =
              '不客气，很高兴能帮到您！如果还有其他问题，随时可以咨询我。';
          } else {
            answer =
              '感谢您的提问。我是基础问答机器人，目前只能回答简单问题。您可以尝试问我其他问题，我会尽力回答。';
          }
          const reply = { answer };
          // 将机器人回复也落库
          messages.push({
            id: Date.now().toString(),
            content: answer,
            type: 'text',
            isUser: false,
            time: Date.now(),
          });
          res.end(JSON.stringify({ code: 200, data: reply }));
          return;
        }

        // 上传接口（返回可用的 URL）
        if (pathname === '/api/upload' && method === 'POST') {
          const { type, content, name, size } = body || {};
          const urlResp = content || '';
          res.end(
            JSON.stringify({ code: 200, data: { url: urlResp, name, size } })
          );
          return;
        }

        // 处理流程详情
        const processDetailMatch = pathname.match(/^\/api\/process\/(.+)$/);
        if (processDetailMatch && method === 'GET') {
          const pid = processDetailMatch[1];
          const steps = [
            {
              id: 's1',
              name: '代码分析',
              status: 'in_progress',
              detail: '正在分析问题内容',
            },
            {
              id: 's2',
              name: '报错信息查询',
              status: 'pending',
              detail: '相关问题已受理',
            },
            {
              id: 's3',
              name: '日志云检索',
              status: 'pending',
              detail: '正在分析并处理该问题',
            },
            {
              id: 's4',
              name: '关联系统分析',
              status: 'pending',
              detail: '相关问题解答中',
            },
          ];
          res.end(JSON.stringify({ code: 200, data: { id: pid, steps } }));
          return;
        }

        next();
      });
    },
  };
}
