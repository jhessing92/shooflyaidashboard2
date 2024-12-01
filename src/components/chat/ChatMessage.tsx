import React from 'react';
import { Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface ChatMessageProps {
  message: {
    role: 'user' | 'assistant';
    content: string;
  };
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === 'user';
  const [profilePicture] = useLocalStorage<string>('user_profile_picture', '');

  return (
    <div className={`clear-both flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center overflow-hidden ${
          isUser ? 'ml-3' : 'mr-3'
        } ${isUser ? (profilePicture ? '' : 'bg-indigo-600') : 'bg-emerald-600'}`}>
          {isUser ? (
            profilePicture ? (
              <img src={profilePicture} alt="User" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-indigo-600 flex items-center justify-center">
                <span className="text-white text-sm font-bold">U</span>
              </div>
            )
          ) : (
            <Bot className="w-6 h-6 text-white" />
          )}
        </div>
        <div 
          className={`flex-1 px-6 py-4 rounded-2xl backdrop-blur-xl ${
            isUser 
              ? 'bg-indigo-600/30 border border-indigo-500/30 float-right' 
              : 'bg-emerald-600/30 border border-emerald-500/30 float-left'
          }`}
          style={{
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;