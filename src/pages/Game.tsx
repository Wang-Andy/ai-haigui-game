import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { stories, Story } from '../data/stories';
import ChatBox from '../components/ChatBox';
import { askAI } from '../api/api';
import { useLoading } from '../contexts/LoadingContext';
import { useError } from '../contexts/ErrorContext';

const Game = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoading, setIsLoading } = useLoading();
  const { setError } = useError();
  const [story, setStory] = useState<Story | null>(null);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [gameStatus, setGameStatus] = useState<'playing' | 'ended'>('playing');

  useEffect(() => {
    // 查找当前故事
    const currentStory = stories.find(s => s.id === id);
    if (currentStory) {
      setStory(currentStory);
      // 初始化消息，显示汤面
      setMessages([
        { role: 'assistant', content: `汤面：${currentStory.surface}` }
      ]);
    }
  }, [id]);

  const handleSend = async (message: string) => {
    if (!story) return;

    // 添加用户消息
    const newMessages = [...messages, { role: 'user' as const, content: message }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // 调用 AI API 获取回答
      const aiResponse = await askAI(message, story);
      
      // 验证 AI 回答是否符合规范
      if (['是', '否', '无关'].includes(aiResponse)) {
        setMessages([...newMessages, { role: 'assistant' as const, content: aiResponse }]);
      } else {
        // 如果回答不符合规范，提示用户重新提问
        setMessages([...newMessages, { role: 'assistant' as const, content: '抱歉，我无法理解你的问题，请尝试用更简洁的方式提问。' }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('AI 接口调用失败，请稍后重试');
      setMessages([...newMessages, { role: 'assistant' as const, content: '无关' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReveal = () => {
    setGameStatus('ended');
    navigate(`/result/${id}`);
  };

  const handleEndGame = () => {
    setGameStatus('ended');
    navigate('/');
  };

  if (!story) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-300">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-amber-400">{story.title}</h1>
        <div className="bg-slate-800 rounded-lg p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4 text-amber-400">汤面</h2>
          <p className="text-slate-300">{story.surface}</p>
        </div>
        <ChatBox messages={messages} onSend={handleSend} isLoading={isLoading} disabled={gameStatus === 'ended'} />
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={handleEndGame}
            className="bg-slate-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-600 transition-colors sm:w-auto w-full"
          >
            结束游戏
          </button>
          <button
            onClick={handleReveal}
            className="bg-amber-400 text-slate-900 px-6 py-3 rounded-lg font-medium hover:bg-amber-500 transition-colors sm:w-auto w-full"
          >
            查看汤底
          </button>
        </div>
      </div>
    </div>
  );
};

export default Game;