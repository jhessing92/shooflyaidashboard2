import React from 'react';
import {
  LayoutDashboard,
  PieChart,
  MessageSquare,
  Users,
  CheckSquare,
  FileText,
  Settings,
  CreditCard
} from 'lucide-react';

interface SidebarIconProps {
  id: string;
  className?: string;
}

export const SidebarIcon = ({ id, className = "w-8 h-8 xl:w-5 xl:h-5" }: SidebarIconProps) => {
  const icons: Record<string, React.ReactNode> = {
    '0': <LayoutDashboard className={className} />,
    '1': <PieChart className={className} />,
    '2': <MessageSquare className={className} />,
    '3': <Users className={className} />,
    '4': <CheckSquare className={className} />,
    '5': <FileText className={className} />,
    '6': <Settings className={className} />,
    'card': <CreditCard className={className} />,
  };

  return <>{icons[id] || null}</>;
};