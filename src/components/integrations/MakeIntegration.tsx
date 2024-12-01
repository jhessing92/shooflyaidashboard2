import React, { useState, useEffect } from 'react';
import { Workflow, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { validateMakeCredentials, storeMakeCredentials, getMakeCredentials } from '../../utils/make';

interface MakeConnectionProps {
  onClose: () => void;
}

const MakeConnection = ({ onClose }: MakeConnectionProps) => {
  const [apiKey, setApiKey] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const credentials = getMakeCredentials();
    if (credentials) {
      setApiKey(credentials.apiKey);
      setOrganizationId(credentials.organizationId);
      setIsConnected(true);
    }
  }, []);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const credentials = { apiKey, organizationId };
      const isValid = await validateMakeCredentials(credentials);

      if (!isValid) {
        throw new Error('Invalid credentials');
      }

      storeMakeCredentials(credentials);
      setIsConnected(true);
      toast.success('Successfully connected to Make.com!');
      onClose();
    } catch (error) {
      console.error('Make.com connection error:', error);
      toast.error('Failed to connect to Make.com. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('make_credentials');
    setApiKey('');
    setOrganizationId('');
    setIsConnected(false);
    toast.success('Disconnected from Make.com');
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
            <Workflow className="w-6 h-6 text-yellow-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              {isConnected ? 'Make.com Settings' : 'Connect Make.com'}
            </h2>
            <p className="text-sm text-gray-400">
              {isConnected ? 'Manage your connection' : 'Enter your Make.com credentials'}
            </p>
          </div>
        </div>

        {isConnected && (
          <div className="mb-6">
            <button
              onClick={handleDisconnect}
              className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
            >
              Disconnect
            </button>
          </div>
        )}

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
              placeholder="Enter your Make.com API key"
              required={!isConnected}
              disabled={isConnected}
            />
          </div>

          <div>
            <label htmlFor="organizationId" className="block text-sm font-medium text-gray-200 mb-1">
              Organization ID
            </label>
            <input
              id="organizationId"
              type="text"
              value={organizationId}
              onChange={(e) => setOrganizationId(e.target.value)}
              className="w-full px-3 py-2 bg-[#2d2d2d] rounded-lg border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your organization ID"
              required={!isConnected}
              disabled={isConnected}
            />
          </div>

          {!isConnected && (
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Connecting...' : 'Connect'}
              </button>
            </div>
          )}
        </form>

        <div className="mt-4 text-sm text-gray-400">
          <p>Don't have an API key? <a href="https://www.make.com/en/api-tokens" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">Get one here</a></p>
          <p className="mt-2">Your Organization ID can be found in your Make.com account settings.</p>
        </div>
      </div>
    </div>
  );
};

export default MakeConnection;