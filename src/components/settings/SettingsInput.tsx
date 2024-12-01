import React from 'react';

interface SettingsInputProps {
  type: 'text' | 'email';
  value: string;
}

export const SettingsInput = ({ type, value }: SettingsInputProps) => {
  return (
    <input
      type={type}
      defaultValue={value}
      className="bg-[#2d2d2d] text-gray-200 px-3 py-2 rounded-lg border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
    />
  );
};