import React, { useState } from 'react';
import { FileText, ExternalLink } from 'lucide-react';
import { initiateGoogleAuth } from '../../utils/google';
import { getGoogleCredentials, clearGoogleCredentials } from '../../utils/google/storage';
import toast from 'react-hot-toast';

export const GoogleDocsCard = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const credentials = getGoogleCredentials();

  const handleConnect = () => {
    if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
      toast.error('Google Client ID is not configured');
      return;
    }
    setIsConnecting(true);
    initiateGoogleAuth();
  };

  const handleDisconnect = () => {
    clearGoogleCredentials();
    toast.success('Disconnected from Google Docs');
  };

  if (credentials) {
    return (
      <div className="w-full h-full bg-card rounded-lg p-4">
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-[#2d2d2d] rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-white font-semibold">Google Docs</h3>
                <p className="text-sm text-gray-400">Connected</p>
              </div>
            </div>
            <button
              onClick={handleDisconnect}
              className="px-3 py-1 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
            >
              Disconnect
            </button>
          </div>
          <div className="flex-grow flex items-center justify-center">
            <a
              href="https://docs.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span className="mr-2">Open Google Docs</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button 
      onClick={handleConnect}
      disabled={isConnecting}
      className="w-full h-full bg-card rounded-lg p-4 border-2 border-dashed border-gray-600 hover:border-blue-500 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="h-full flex flex-col items-center justify-center">
        <div className="w-10 h-10 bg-[#2d2d2d] rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-500 transition-colors">
          <FileText className="w-6 h-6 text-gray-400 group-hover:text-white" />
        </div>
        <h3 className="text-white font-semibold">Connect Google Docs</h3>
        <p className="text-sm text-gray-400 mt-1">Integrate with your documents</p>
      </div>
    </button>
  );
};