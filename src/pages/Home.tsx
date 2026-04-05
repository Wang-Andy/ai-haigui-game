import { stories } from '../data/stories';
import GameCard from '../components/GameCard';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-amber-400 drop-shadow-lg">AI海龟汤</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            欢迎来到神秘的海龟汤世界，通过提问揭开故事背后的真相。
            选择一个故事，开始你的推理之旅吧！
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {stories.map((story) => (
            <GameCard key={story.id} story={story} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;