import React, { useState } from 'react';
import { Switch } from '@headlessui/react';

interface SettingsToggleProps {
  enabled: boolean;
}

export const SettingsToggle = ({ enabled: initialEnabled }: SettingsToggleProps) => {
  const [enabled, setEnabled] = useState(initialEnabled);

  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className={`${
        enabled ? 'bg-indigo-600' : 'bg-gray-700'
      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
    >
      <span
        className={`${
          enabled ? 'translate-x-6' : 'translate-x-1'
        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
      />
    </Switch>
  );
};