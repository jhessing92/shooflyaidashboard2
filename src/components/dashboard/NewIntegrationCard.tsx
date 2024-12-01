import React from 'react';
import { FileText } from 'lucide-react';
import { initiateGoogleAuth } from '../../utils/google';
import toast from 'react-hot-toast';

export const NewIntegrationCard = () => {
  const handleConnect = () => {
    if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
      toast.error('Google Client ID is not configured');
      return;
    }
    initiateGoogleAuth();
  };

  return (
    <button 
      onClick={handleConnect}
      className="w-full h-full bg-card rounded-lg p-4 border-2 border-dashed border-gray-600 hover:border-blue-500 transition-colors group"
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