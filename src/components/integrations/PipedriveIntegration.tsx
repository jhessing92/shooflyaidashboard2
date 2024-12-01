import React, { useState, useEffect } from 'react';
import { Database, X, Plus, Trash2, KeyRound, Building2, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { validatePipedriveCredentials, storePipedriveCredentials, getPipedriveCredentials, fetchPipedriveDeals, type PipedriveCredentials, type PipedriveDeal } from '../../utils/pipedrive';

interface PipedriveConnectionProps {
  onClose: () => void;
  onDealsUpdate?: (deals: PipedriveDeal[]) => void;
}

const PipedriveConnection = ({ onClose, onDealsUpdate }: PipedriveConnectionProps) => {
  const [credentials, setCredentials] = useState<PipedriveCredentials>({
    apiKey: '',
    orgId: '',
    userId: '',
    dealIds: [],
  });
  const [newDealId, setNewDealId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const storedCredentials = getPipedriveCredentials();
    if (storedCredentials) {
      setCredentials(storedCredentials);
      setIsConnected(true);
    }
  }, []);

  const updateDealsUI = async () => {
    try {
      const deals = await fetchPipedriveDeals();
      onDealsUpdate?.(deals);
    } catch (error) {
      console.error('Failed to fetch updated deals:', error);
    }
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const isValid = await validatePipedriveCredentials(credentials);
      if (!isValid) {
        throw new Error('Invalid credentials');
      }

      await storePipedriveCredentials(credentials);
      setIsConnected(true);
      await updateDealsUI();
      toast.success('Successfully connected to Pipedrive!');
    } catch (error) {
      console.error('Pipedrive connection error:', error);
      toast.error('Failed to connect to Pipedrive. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      localStorage.removeItem('pipedrive_credentials');
      setCredentials({
        apiKey: '',
        orgId: '',
        userId: '',
        dealIds: [],
      });
      setIsConnected(false);
      onDealsUpdate?.([]);
      toast.success('Disconnected from Pipedrive');
      onClose();
    } catch (error) {
      console.error('Failed to disconnect:', error);
      toast.error('Failed to disconnect from Pipedrive');
    }
  };

  const handleAddDeal = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!newDealId) return;

    if (credentials.dealIds?.includes(newDealId)) {
      toast.error('This deal is already being tracked');
      return;
    }

    setIsLoading(true);
    try {
      const updatedCredentials = {
        ...credentials,
        dealIds: [...(credentials.dealIds || []), newDealId],
      };
      
      await storePipedriveCredentials(updatedCredentials);
      setCredentials(updatedCredentials);
      await updateDealsUI();
      setNewDealId('');
      toast.success('Deal added successfully');
    } catch (error) {
      console.error('Failed to add deal:', error);
      toast.error('Failed to add deal');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      await handleAddDeal();
    }
  };

  const handleRemoveDeal = async (dealId: string) => {
    setIsLoading(true);
    try {
      const updatedCredentials = {
        ...credentials,
        dealIds: credentials.dealIds?.filter(id => id !== dealId) || [],
      };
      
      await storePipedriveCredentials(updatedCredentials);
      setCredentials(updatedCredentials);
      await updateDealsUI();
      toast.success('Deal removed successfully');
    } catch (error) {
      console.error('Failed to remove deal:', error);
      toast.error('Failed to remove deal');
    } finally {
      setIsLoading(false);
    }
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
            <Database className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              {isConnected ? 'Pipedrive Settings' : 'Connect Pipedrive'}
            </h2>
            <p className="text-sm text-gray-400">
              {isConnected ? 'Manage your connection' : 'Enter your Pipedrive credentials'}
            </p>
          </div>
        </div>

        {!isConnected && (
          <form onSubmit={handleConnect} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                <div className="flex items-center">
                  <KeyRound className="w-4 h-4 mr-2" />
                  API Key
                </div>
              </label>
              <input
                type="password"
                value={credentials.apiKey}
                onChange={(e) => setCredentials({ ...credentials, apiKey: e.target.value })}
                className="w-full px-3 py-2 bg-[#2d2d2d] rounded-lg border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your Pipedrive API key"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                <div className="flex items-center">
                  <Building2 className="w-4 h-4 mr-2" />
                  Organization ID
                </div>
              </label>
              <input
                type="text"
                value={credentials.orgId}
                onChange={(e) => setCredentials({ ...credentials, orgId: e.target.value })}
                className="w-full px-3 py-2 bg-[#2d2d2d] rounded-lg border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your organization ID"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  User ID
                </div>
              </label>
              <input
                type="text"
                value={credentials.userId}
                onChange={(e) => setCredentials({ ...credentials, userId: e.target.value })}
                className="w-full px-3 py-2 bg-[#2d2d2d] rounded-lg border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter your user ID"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Connecting...' : 'Connect'}
            </button>
          </form>
        )}

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

        {isConnected && (
          <>
            <form onSubmit={handleAddDeal} className="space-y-4">
              <div>
                <label htmlFor="dealId" className="block text-sm font-medium text-gray-200 mb-1">
                  Add Deal
                </label>
                <div className="flex space-x-2">
                  <input
                    id="dealId"
                    type="text"
                    value={newDealId}
                    onChange={(e) => setNewDealId(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-3 py-2 bg-[#2d2d2d] rounded-lg border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter deal ID"
                  />
                  <button
                    type="submit"
                    disabled={!newDealId || isLoading}
                    className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </form>

            {credentials.dealIds && credentials.dealIds.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-200 mb-2">Tracked Deals</h3>
                <div className="space-y-2">
                  {credentials.dealIds.map((dealId) => (
                    <div
                      key={dealId}
                      className="flex items-center justify-between p-2 bg-[#2d2d2d] rounded-lg"
                    >
                      <span className="text-gray-300">Deal ID: {dealId}</span>
                      <button
                        onClick={() => handleRemoveDeal(dealId)}
                        disabled={isLoading}
                        className="p-1 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <div className="mt-4 text-sm text-gray-400">
          <p>Need help? <a href="https://pipedrive.readme.io/docs" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">View Pipedrive API documentation</a></p>
        </div>
      </div>
    </div>
  );
};

export default PipedriveConnection;