const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

const app = express();
const port = 3000;

// 配置 CORS
app.use(cors({
  origin: '*', // 在生产环境中应该设置具体的前端域名
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 解析 JSON 请求体
app.use(express.json());

// 请求日志中间件
app.use((req, res, next) => {
  const startTime = Date.now();
  
  // 记录请求开始
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  
  // 监听响应完成事件
  res.on('finish', () => {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} ${res.statusCode} ${responseTime}ms`);
  });
  
  next();
});

// 提供 API 文档
app.get('/test-docs', (req, res) => {
  res.json({
    message: 'API 文档测试',
    status: 'ok'
  });
});

// 测试接口
app.get('/api/test', (req, res) => {
  res.json({
    message: '测试接口成功',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// AI 对话接口
app.post('/api/chat', async (req, res) => {
  try {
    const { question, story } = req.body;

    // 验证参数
    if (!question || !story) {
      return res.status(400).json({
        error: '缺少必要参数',
        status: 'error'
      });
    }

    // 从环境变量读取 API Key
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'API Key 未配置',
        status: 'error'
      });
    }

    // 构建 Prompt
    const prompt = `你是一个海龟汤游戏的主持人。

当前故事的汤面是：${story.surface}
故事的汤底是：${story.bottom}

玩家会向你提问，你只能回答以下三种之一：
1."是"：玩家的猜测与汤底一致
2."否"：玩家的猜测与汤底矛盾
3."无关"：玩家的猜测与汤底无关，无法判断

示例：
玩家问：男人是不是生病了？
请回答：是

玩家问：酒保是不是想杀了男人？
请回答：否

玩家问：男人是不是喜欢喝酒？
请回答：无关

注意：
1.严格根据汤底判断，不要额外推理
2.只回答"是"、"否"、"无关"，不要解释
3.保持神秘感，不要透露汤底
4.必须从上述三个选项中选择一个，不能有其他回答

玩家问：${question}
请回答：`;

    // 调用 DeepSeek API
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.1,
        max_tokens: 10
      })
    });

    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.status}`);
    }

    const data = await response.json();
    const answer = data.choices[0].message.content.trim();

    // 验证回答是否符合规范
    if (!['是', '否', '无关'].includes(answer)) {
      return res.json({
        answer: '抱歉，我无法理解你的问题，请尝试用更简洁的方式提问。',
        status: 'ok'
      });
    }

    res.json({
      answer: answer,
      status: 'ok'
    });
  } catch (error) {
    console.error('AI 对话接口错误:', error);
    res.status(500).json({
      answer: '无关',
      status: 'error',
      error: error.message
    });
  }
});

// 全局错误处理中间件
app.use((err, req, res, next) => {
  console.error('全局错误:', err);
  
  // 确保响应状态码
  if (!res.headersSent) {
    res.status(500).json({
      status: 'error',
      error: err.message || '服务器内部错误',
      timestamp: new Date().toISOString()
    });
  }
});

// 404 处理中间件
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    error: '接口不存在',
    timestamp: new Date().toISOString()
  });
});

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
  console.log(`测试接口: http://localhost:${port}/api/test`);
  console.log(`AI 对话接口: http://localhost:${port}/api/chat`);
  console.log(`API 文档: http://localhost:${port}/api-docs`);
});
