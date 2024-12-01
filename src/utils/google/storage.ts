import { GoogleCredentials } from './types';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'google_credentials';

export const getGoogleCredentials = (): GoogleCredentials | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error reading Google credentials:', error);
    return null;
  }
};

export const storeGoogleCredentials = (credentials: GoogleCredentials): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
  } catch (error) {
    console.error('Error storing Google credentials:', error);
    toast.error('Failed to store Google credentials');
  }
};

export const clearGoogleCredentials = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing Google credentials:', error);
  }
};