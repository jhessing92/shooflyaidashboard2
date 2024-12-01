import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings } from 'lucide-react';
import { testOpenAIConnection } from '../utils/openai';
import toast from 'react-hot-toast';
import ChatMessage from '../components/chat/ChatMessage';
import ChatInput from '../components/chat/ChatInput';
import FloatingOrb from '../components/chat/FloatingOrb';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm your AI assistant. How can I help you today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [primaryOrbPosition, setPrimaryOrbPosition] = useState({ x: 25, y: 25 });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (input: string) => {
    if (!input.trim() || isLoading) return;

    const newMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const response = await testOpenAIConnection(input);
      const aiMessage: Message = { role: 'assistant', content: response };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      let errorMessage = 'Failed to get AI response. Please try again.';
      if (error instanceof Error && error.message.includes('API key not configured')) {
        errorMessage = 'Please configure your OpenAI API key in settings first.';
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Background gradient orbs */}
      <FloatingOrb color="blue" initialPosition={primaryOrbPosition} />
      <FloatingOrb color="green" initialPosition={{ x: 75, y: 75 }} mirrorOf={primaryOrbPosition} />

      <div className="relative flex flex-col h-screen backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-lg border-b border-white/10">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <h1 className="ml-4 text-xl font-semibold text-white">AI Chat</h1>
          </div>
          <button
            onClick={() => navigate('/settings')}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Settings className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Chat messages container */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Chat input */}
        <div className="border-t border-white/10 bg-black/20 backdrop-blur-lg p-4">
          <div className="max-w-3xl mx-auto">
            <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;