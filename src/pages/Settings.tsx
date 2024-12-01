import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SettingsSection } from '../components/settings/SettingsSection';
import { settingsSections } from '../config/settings';

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-gray-300 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-gray-400 hover:text-white transition-colors mr-4"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
            <p className="text-gray-400">Manage your account settings and preferences</p>
          </div>
        </div>

        <div className="space-y-8">
          {settingsSections.map((section, index) => (
            <SettingsSection
              key={index}
              title={section.title}
              icon={section.icon}
              settings={section.settings}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;