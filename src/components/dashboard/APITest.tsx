import React, { useState } from 'react';
import { testOpenAIConnection } from '../../utils/openai';
import toast from 'react-hot-toast';

export const APITest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');

  const handleTest = async () => {
    setIsLoading(true);
    try {
      const result = await testOpenAIConnection('Hello, OpenAI! How are you?');
      setResponse(result);
      toast.success('API test successful!');
    } catch (error) {
      toast.error('API test failed. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg bg-card p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">API Test</h3>
        <button
          onClick={handleTest}
          disabled={isLoading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Test Connection'}
        </button>
      </div>
      {response && (
        <div className="mt-4 p-4 bg-[#1e1e1e] rounded-lg">
          <p className="text-gray-300">{response}</p>
        </div>
      )}
    </div>
  );
};