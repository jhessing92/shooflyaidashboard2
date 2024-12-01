import React from 'react';
import { Settings } from 'lucide-react';

interface IntegrationCardProps {
  title: string;
  status: 'connected' | 'error' | 'pending';
  icon: React.ReactNode;
  onConfigure?: () => void;
  metrics?: {
    apiConnection?: string;
    webhookStatus?: string;
    usage?: string;
  };
}

export const IntegrationCard = ({ title, status, icon, onConfigure, metrics }: IntegrationCardProps) => {
  return (
    <div className="bg-card rounded-lg p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-[#2d2d2d] rounded-lg flex items-center justify-center mr-3">
            {icon}
          </div>
          <div>
            <h3 className="text-white font-semibold">{title}</h3>
            <div className="flex items-center mt-1">
              <div className={`w-2 h-2 rounded-full ${
                status === 'connected' ? 'bg-green-500' :
                status === 'error' ? 'bg-red-500' :
                'bg-yellow-500'
              } mr-2`} />
              <span className="text-sm text-gray-400">
                {status === 'connected' ? 'Connected' : 
                 status === 'error' ? 'Configuration required' : 
                 'Connecting...'}
              </span>
            </div>
          </div>
        </div>
        {onConfigure && (
          <button
            onClick={onConfigure}
            className="p-2 rounded-lg transition-all duration-200 bg-[#2d2d2d] hover:bg-[#353535] text-gray-400 hover:text-white"
          >
            <Settings className="w-4 h-4" />
          </button>
        )}
      </div>

      {metrics && (
        <div className="space-y-2 mt-4">
          {metrics.apiConnection && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">API Connection</span>
              <span className={`${metrics.apiConnection === 'Active' ? 'text-green-400' : 'text-red-400'}`}>
                {metrics.apiConnection}
              </span>
            </div>
          )}
          {metrics.webhookStatus && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Webhook Status</span>
              <span className={`${metrics.webhookStatus === 'Ready' ? 'text-green-400' : 'text-yellow-400'}`}>
                {metrics.webhookStatus}
              </span>
            </div>
          )}
          {metrics.usage && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Usage</span>
              <span className="text-blue-400">{metrics.usage}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};