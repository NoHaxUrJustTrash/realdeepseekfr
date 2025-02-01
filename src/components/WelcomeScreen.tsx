import React from 'react';
import { MessageSquare } from 'lucide-react';

interface Props {
  onNewChat: () => void;
  theme?: 'light' | 'dark';
}

export const WelcomeScreen: React.FC<Props> = ({ onNewChat, theme = 'dark' }) => {
  const isLight = theme === 'light';

  return (
    <div className={`h-full flex flex-col items-center justify-center ${
      isLight ? 'text-gray-600' : 'text-gray-300'
    }`}>
      <h1 className={`text-3xl font-bold mb-8 ${
        isLight ? 'text-gray-900' : 'text-white'
      }`}>Welcome to Deepseek R1 AI Chat</h1>
      
      <button
        onClick={onNewChat}
        className="bg-blue-600 text-white rounded-lg px-6 py-3 flex items-center gap-2 hover:bg-blue-700 transition-colors"
      >
        <MessageSquare size={20} />
        Start New Chat
      </button>
    </div>
  );
};
