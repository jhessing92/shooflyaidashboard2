import { GOOGLE_CONFIG } from '../../config/google';
import { GoogleCredentials } from './types';
import { storeGoogleCredentials } from './storage';
import toast from 'react-hot-toast';

export const initiateGoogleAuth = () => {
  try {
    const params = new URLSearchParams({
      client_id: GOOGLE_CONFIG.clientId,
      redirect_uri: GOOGLE_CONFIG.redirectUri,
      response_type: 'code',
      scope: GOOGLE_CONFIG.scope,
      access_type: 'offline',
      prompt: 'consent',
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    window.location.href = authUrl;
  } catch (error) {
    console.error('Failed to initiate Google auth:', error);
    toast.error('Failed to connect to Google');
  }
};

export const handleGoogleCallback = async (code: string): Promise<GoogleCredentials> => {
  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CONFIG.clientId,
        client_secret: GOOGLE_CONFIG.clientSecret,
        redirect_uri: GOOGLE_CONFIG.redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for tokens');
    }

    const data = await tokenResponse.json();
    
    const credentials: GoogleCredentials = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: Date.now() + (data.expires_in * 1000),
    };

    storeGoogleCredentials(credentials);
    return credentials;
  } catch (error) {
    console.error('Failed to handle Google callback:', error);
    throw error;
  }
};

export const refreshGoogleToken = async (refreshToken: string): Promise<GoogleCredentials> => {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        client_id: GOOGLE_CONFIG.clientId,
        client_secret: GOOGLE_CONFIG.clientSecret,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const data = await response.json();
    
    const credentials: GoogleCredentials = {
      accessToken: data.access_token,
      refreshToken: refreshToken,
      expiresAt: Date.now() + (data.expires_in * 1000),
    };

    storeGoogleCredentials(credentials);
    return credentials;
  } catch (error) {
    console.error('Failed to refresh Google token:', error);
    throw error;
  }
};