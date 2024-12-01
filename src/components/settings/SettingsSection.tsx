import React from 'react';
import { LucideIcon } from 'lucide-react';
import { SettingsToggle } from './SettingsToggle';
import { SettingsInput } from './SettingsInput';
import { SettingsButton } from './SettingsButton';
import ProfilePictureUpload from './ProfilePictureUpload';

interface SettingItem {
  title: string;
  description: string;
  type: 'toggle' | 'text' | 'email' | 'button' | 'profile-picture';
  enabled?: boolean;
  value?: string;
  buttonText?: string;
}

interface SettingsSectionProps {
  title: string;
  icon: LucideIcon;
  settings: SettingItem[];
}

export const SettingsSection = ({ title, icon: Icon, settings }: SettingsSectionProps) => {
  return (
    <div className="bg-card rounded-lg p-6">
      <div className="flex items-center mb-6">
        <div className="bg-[#2d2d2d] p-2 rounded-lg mr-4">
          <Icon className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
      </div>

      <div className="space-y-6">
        {settings.map((setting, index) => (
          <div key={index} className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-white font-medium">{setting.title}</h3>
              <p className="text-gray-400 text-sm mt-1">{setting.description}</p>
            </div>
            <div className="ml-4">
              {setting.type === 'toggle' && (
                <SettingsToggle enabled={setting.enabled || false} />
              )}
              {(setting.type === 'text' || setting.type === 'email') && (
                <SettingsInput type={setting.type} value={setting.value || ''} />
              )}
              {setting.type === 'button' && (
                <SettingsButton text={setting.buttonText || 'Update'} />
              )}
              {setting.type === 'profile-picture' && (
                <ProfilePictureUpload />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};