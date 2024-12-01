export interface GoogleCredentials {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface GoogleFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  iconLink: string;
  lastModified: string;
}

export interface GoogleDriveState {
  isConnected: boolean;
  isLoading: boolean;
  files: GoogleFile[];
  error: string | null;
}