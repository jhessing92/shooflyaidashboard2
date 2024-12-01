export const PIPEDRIVE_CONFIG = {
  clientId: import.meta.env.VITE_PIPEDRIVE_CLIENT_ID || '',
  clientSecret: import.meta.env.VITE_PIPEDRIVE_CLIENT_SECRET || '',
  redirectUri: `${window.location.origin}/settings`,
  authUrl: 'https://oauth.pipedrive.com/oauth/authorize',
  tokenUrl: 'https://oauth.pipedrive.com/oauth/token',
  apiUrl: 'https://api.pipedrive.com/v1',
  scope: 'deals:read contacts:read activities:read',
};