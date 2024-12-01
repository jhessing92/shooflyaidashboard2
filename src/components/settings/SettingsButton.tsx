import React from 'react';

interface SettingsButtonProps {
  text: string;
}

export const SettingsButton = ({ text }: SettingsButtonProps) => {
  return (
    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
      {text}
    </button>
  );
};