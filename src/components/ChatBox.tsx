import { useState, useRef, useEffect } from 'react';
import Message from './Message';

interface ChatBoxProps {
  messages: { role: 'user' | 'assistant'; content: string }[];
  onSend: (message: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const ChatBox = ({ messages, onSend, isLoading = false, disabled = false }: ChatBoxProps) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 当消息列表更新时，滚动到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = () => {
    if (!input.trim() || isLoading || disabled) return;
    onSend(input);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading && !disabled) {
      handleSend();
    }
  };

  return (
    <div className="w-full">
      {/* 消息列表 */}
      <div className="bg-slate-800 rounded-lg p-4 shadow-lg mb-6 h-96 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className="animate-fade-in-up"
            style={{
              animationDelay: `${index * 0.1}s`,
              animationFillMode: 'both'
            }}
          >
            <Message message={msg} />
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="flex items-end gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-700 text-white">
                AI
              </div>
              <div className="bg-slate-700 text-white px-4 py-2 rounded-lg">
                思考中...
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* 输入区域 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading || disabled}
          className="flex-1 bg-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-70"
          placeholder={disabled ? '游戏已结束' : '输入你的问题...'}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || disabled}
          className="bg-amber-400 text-slate-900 px-6 py-3 rounded-lg font-medium hover:bg-amber-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed sm:whitespace-nowrap"
        >
          {isLoading ? '发送中...' : disabled ? '游戏结束' : '发送'}
        </button>
      </div>
    </div>
  );
};

export default ChatBox;