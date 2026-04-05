interface MessageProps {
  message: {
    role: 'user' | 'assistant';
    content: string;
  };
}

const Message = ({ message }: MessageProps) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex items-end ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
        {/* 头像或图标 */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isUser ? 'bg-amber-400 text-slate-900' : 'bg-slate-700 text-white'}`}>
          {isUser ? '用户' : 'AI'}
        </div>
        {/* 消息内容 */}
        <div className={`max-w-[70%] ${isUser ? 'text-right' : 'text-left'}`}>
          <div className={`px-4 py-2 rounded-lg ${isUser ? 'bg-amber-400 text-slate-900' : 'bg-slate-700 text-white'}`}>
            {message.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;