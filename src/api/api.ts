import { Story } from '../data/stories';

// AI API 调用函数
export const askAI = async (question: string, story: Story): Promise<string> => {
  try {
    // 调用后端 API 接口
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        question,
        story
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    const data = await response.json();
    
    // 检查响应状态
    if (data.status === 'error') {
      throw new Error(data.error || 'API error');
    }

    const answer = data.answer;

    // 确保回答只有"是"、"否"、"无关"三种之一
    if (!['是', '否', '无关'].includes(answer)) {
      throw new Error('Invalid AI response format');
    }

    return answer;
  } catch (error) {
    console.error('AI API error:', error);
    // 错误处理：返回默认回答
    return '无关';
  }
};