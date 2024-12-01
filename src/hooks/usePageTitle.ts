import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export const usePageTitle = (suffix?: string) => {
  const [dashboardName] = useLocalStorage('dashboardName', 'Automation');

  useEffect(() => {
    const title = suffix 
      ? `Shooflyai | ${dashboardName} | ${suffix}`
      : `Shooflyai | ${dashboardName}`;
    document.title = title;
  }, [dashboardName, suffix]);

  return null;
};