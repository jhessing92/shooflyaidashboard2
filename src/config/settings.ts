import { User, Shield, Bell, Globe, Key, Wallet } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Setting {
  title: string;
  description: string;
  type: 'toggle' | 'text' | 'email' | 'button' | 'profile-picture';
  enabled?: boolean;
  value?: string;
  buttonText?: string;
}

interface SettingsSection {
  title: string;
  icon: LucideIcon;
  settings: Setting[];
}

export const settingsSections: SettingsSection[] = [
  {
    title: 'Account',
    icon: User,
    settings: [
      {
        title: 'Profile Picture',
        description: 'Upload a profile picture for chat and your profile',
        type: 'profile-picture',
      },
      {
        title: 'Email Notifications',
        description: 'Manage your email preferences',
        type: 'toggle',
        enabled: true,
      },
    ],
  },
  // ... rest of the settings sections remain unchanged
];