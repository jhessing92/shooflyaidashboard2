import React, { useState, useEffect } from 'react';
import { Bot, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { OPENAI_CONFIG } from '../../config/openai';

interface OpenAIConnectionProps {
  onClose: () => void;
}

const OpenAIConnection = ({ onClose }: OpenAIConnectionProps) => {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const storedApiKey = OPENAI_CONFIG.apiKey;
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setIsConnected(true);
    }
  }, []);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Store the API key (in a real app, you would validate it first)
      localStorage.setItem('openai_api_key', apiKey);
      setIsConnected(true);
      toast.success('Successfully configured OpenAI!');
      onClose();
    } catch (error) {
      console.error('OpenAI configuration error:', error);
      toast.error('Failed to configure OpenAI');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('openai_api_key');
    setApiKey('');
    setIsConnected(false);
    toast.success('Disconnected from OpenAI');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-[#2d2d2d] rounded-lg flex items-center justify-center mr-3">
            <Bot className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              {isConnected ? 'OpenAI Settings' : 'Configure OpenAI'}
            </h2>
            <p className="text-sm text-gray-400">
              {isConnected ? 'Manage your connection' : 'Enter your OpenAI API key'}
            </p>
          </div>
        </div>

        <form onSubmit={handleConnect} className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-200 mb-1">
              API Key
            </label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3 py-2 bg-[#2d2d2d] rounded-lg border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your OpenAI API key"
              required
            />
          </div>

          <div className="pt-4 flex space-x-4">
            {isConnected ? (
              <>
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="flex-1 py-2 px-4 border border-red-600 rounded-lg text-red-500 hover:bg-red-600 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Disconnect
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  Update
                </button>
              </>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Configuring...' : 'Configure'}
              </button>
            )}
          </div>
        </form>

        <div className="mt-4 text-sm text-gray-400">
          <p>Need an API key? <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">Get one here</a></p>
        </div>
      </div>
    </div>
  );
};

export default OpenAIConnection;