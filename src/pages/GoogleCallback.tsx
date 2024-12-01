import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { handleGoogleCallback } from '../utils/google';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const GoogleCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        setError('Failed to connect to Google');
        toast.error('Google authentication failed');
        setTimeout(() => navigate('/dashboard'), 2000);
        return;
      }

      if (!code) {
        setError('No authorization code received');
        toast.error('No authorization code received');
        setTimeout(() => navigate('/dashboard'), 2000);
        return;
      }

      try {
        await handleGoogleCallback(code);
        toast.success('Successfully connected to Google Docs!');
        navigate('/dashboard');
      } catch (error) {
        console.error('Failed to handle Google callback:', error);
        setError('Failed to complete Google authentication');
        toast.error('Failed to complete Google authentication');
        setTimeout(() => navigate('/dashboard'), 2000);
      }
    };

    handleCallback();
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-[#1e1e1e] flex items-center justify-center">
      <div className="bg-card rounded-lg p-8 max-w-md w-full mx-4">
        {error ? (
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <p className="text-gray-400">Redirecting to dashboard...</p>
          </div>
        ) : (
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-200">Connecting to Google Docs...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleCallback;