import { GoogleCredentials, GoogleFile } from './types';
import { refreshGoogleToken } from './auth';
import { getGoogleCredentials } from './storage';

export const fetchGoogleDriveFiles = async (): Promise<GoogleFile[]> => {
  let credentials = getGoogleCredentials();
  
  if (!credentials) {
    throw new Error('Not authenticated with Google');
  }

  // Refresh token if expired
  if (Date.now() >= credentials.expiresAt) {
    credentials = await refreshGoogleToken(credentials.refreshToken);
  }

  const response = await fetch(
    'https://www.googleapis.com/drive/v3/files?' + new URLSearchParams({
      fields: 'files(id,name,mimeType,webViewLink,iconLink,modifiedTime)',
      orderBy: 'modifiedTime desc',
      pageSize: '10',
      q: "mimeType='application/vnd.google-apps.document'",
    }),
    {
      headers: {
        'Authorization': `Bearer ${credentials.accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch Google Drive files');
  }

  const data = await response.json();
  
  return data.files.map((file: any) => ({
    id: file.id,
    name: file.name,
    mimeType: file.mimeType,
    webViewLink: file.webViewLink,
    iconLink: file.iconLink,
    lastModified: file.modifiedTime,
  }));
};