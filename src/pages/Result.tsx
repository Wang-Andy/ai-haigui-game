import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { stories, Story } from '../data/stories';

const Result = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [showBottom, setShowBottom] = useState(false);

  useEffect(() => {
    // 查找当前故事
    const currentStory = stories.find(s => s.id === id);
    if (currentStory) {
      setStory(currentStory);
      // 延迟显示汤底，增加仪式感
      setTimeout(() => {
        setShowBottom(true);
      }, 1000);
    }
  }, [id]);

  const handlePlayAgain = () => {
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
    <div className="min-h-screen bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-amber-400 drop-shadow-lg">汤底揭晓</h1>
          <h2 className="text-2xl font-semibold text-slate-200">{story.title}</h2>
        </div>
        
        <div className="bg-slate-800 rounded-lg p-8 shadow-lg mb-8">
          <div className="mb-8">
            <h3 className="text-xl font-medium mb-4 text-amber-400">汤面</h3>
            <p className="text-slate-300">{story.surface}</p>
          </div>
          
          <div className="relative">
            <h3 className="text-xl font-medium mb-4 text-amber-400">汤底</h3>
            <div className={`bg-slate-700 rounded-lg p-6 transition-all duration-1000 ${showBottom ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <p className="text-white text-lg leading-relaxed">{story.bottom}</p>
            </div>
            {!showBottom && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-700 rounded-lg">
                <div className="flex space-x-3">
                  <div className="w-3 h-3 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '200ms' }}></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '400ms' }}></div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={handlePlayAgain}
            className="bg-amber-400 text-slate-900 px-10 py-4 rounded-lg font-medium hover:bg-amber-500 transition-colors text-lg transform hover:scale-105"
          >
            再来一局
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;