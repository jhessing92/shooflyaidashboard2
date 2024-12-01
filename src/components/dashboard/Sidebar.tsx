import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useNavigate, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { SidebarIcon } from './SidebarIcon';

interface MenuItem {
  id: string;
  title: string;
  notifications: number | false;
  path?: string;
}

interface SidebarProps {
  onSidebarHide: () => void;
  showSidebar: boolean;
}

const sidebarItems: MenuItem[][] = [
  [
    { id: '0', title: 'Dashboard', notifications: false, path: '/dashboard' },
    { id: '1', title: 'Overview', notifications: false },
    { id: '2', title: 'Chat', notifications: false, path: '/chat' },
    { id: '3', title: 'Team', notifications: false },
  ],
  [
    { id: '4', title: 'Tasks', notifications: false },
    { id: '5', title: 'Reports', notifications: false },
    { id: '6', title: 'Settings', notifications: false, path: '/settings' },
  ],
];

export const Sidebar = ({ onSidebarHide, showSidebar }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [selected, setSelected] = React.useState(() => {
    const currentPath = location.pathname;
    const item = sidebarItems.flat().find(item => item.path === currentPath);
    return item ? item.id : '0';
  });

  const handleItemClick = (item: MenuItem) => {
    setSelected(item.id);
    if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <div
      className={clsx(
        'fixed inset-y-0 left-0 bg-card w-20 flex flex-col z-10',
        showSidebar ? 'flex' : 'hidden'
      )}
    >
      <div className="flex-shrink-0 overflow-hidden p-2">
        <div className="flex items-center h-full justify-center p-2 sidebar-separator-top">
          <div className="w-10 h-10 rounded bg-[#353535] flex items-center justify-center">
            <span className="text-white text-xl font-bold">A</span>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-x-hidden overflow-y-auto flex flex-col">
        <div className="w-full p-3 h-20 flex-shrink-0">
          <div className="bg-sidebar-card-top rounded-xl w-full h-full flex items-center justify-center">
            <SidebarIcon id="card" className="w-8 h-8" />
          </div>
        </div>

        {sidebarItems[0].map((item) => (
          <button
            key={item.id}
            onClick={() => handleItemClick(item)}
            className={clsx(
              'w-full mt-6 flex items-center justify-center cursor-pointer',
              selected === item.id ? 'sidebar-item-selected' : 'sidebar-item'
            )}
          >
            <SidebarIcon id={item.id} className="w-8 h-8" />
          </button>
        ))}

        <div className="flex-grow" />

        {sidebarItems[1].map((item) => (
          <button
            key={item.id}
            onClick={() => handleItemClick(item)}
            className={clsx(
              'w-full mt-6 flex items-center justify-center cursor-pointer',
              selected === item.id ? 'sidebar-item-selected' : 'sidebar-item'
            )}
          >
            <SidebarIcon id={item.id} className="w-8 h-8" />
          </button>
        ))}

        <div className="flex-grow" />
      </div>
    </div>
  );
};