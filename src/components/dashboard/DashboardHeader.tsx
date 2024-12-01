import React from 'react';
import { Menu } from 'lucide-react';
import EditableText from './EditableText';
import LogoUploader from './LogoUploader';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface DashboardHeaderProps {
  userName: string;
  onMenuClick: () => void;
}

const DashboardHeader = ({ userName, onMenuClick }: DashboardHeaderProps) => {
  const [dashboardName, setDashboardName] = useLocalStorage('dashboardName', 'Automation');
  const [userDisplayName, setUserDisplayName] = useLocalStorage('userDisplayName', userName);
  const [logo, setLogo] = useLocalStorage('dashboardLogo', '');

  return (
    <div className="sm:flex-grow flex justify-between">
      <div>
        <div className="flex items-center">
          <LogoUploader currentLogo={logo} onLogoChange={setLogo} />
          <div className="ml-2">
            <EditableText
              value={dashboardName}
              onSave={setDashboardName}
              className="text-3xl font-bold text-white"
            />
          </div>
          <div className="flex items-center p-2 bg-card ml-2 rounded-xl">
            <div className="ml-2 font-bold text-premium-yellow">PRO</div>
          </div>
        </div>
        <div className="flex items-center mt-1">
          <EditableText
            value={userDisplayName}
            onSave={setUserDisplayName}
            className="text-gray-400 hover:text-gray-300"
          />
          <div className="mx-2 text-gray-600">•</div>
          <div className="text-gray-400">{new Date().toLocaleDateString()}</div>
        </div>
      </div>
      <button
        className="block sm:hidden"
        onClick={onMenuClick}
      >
        <Menu className="w-6 h-6 text-gray-400" />
      </button>
    </div>
  );
};

export default DashboardHeader;