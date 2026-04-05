import { Link } from 'react-router-dom';
import { Story } from '../data/stories';

interface GameCardProps {
  story: Story;
}

const GameCard = ({ story }: GameCardProps) => {
  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'hard':
        return 'text-red-400';
      default:
        return '';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '简单';
      case 'medium':
        return '中等';
      case 'hard':
        return '困难';
      default:
        return difficulty;
    }
  };

  return (
    <Link
      to={`/game/${story.id}`}
      className="bg-slate-800 rounded-lg p-6 shadow-lg hover:bg-slate-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
    >
      <h2 className="text-xl font-semibold mb-2 text-white">{story.title}</h2>
      <div className="flex items-center mb-4">
        <span className={`font-medium ${getDifficultyClass(story.difficulty)}`}>
          {getDifficultyText(story.difficulty)}
        </span>
      </div>
      <p className="text-slate-300 line-clamp-3">{story.surface}</p>
    </Link>
  );
};

export default GameCard;