import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/dashboard/Sidebar';
import { IntegrationCards } from '../components/dashboard/IntegrationCards';
import { Graph } from '../components/dashboard/Graph';
import { PerformanceMetrics } from '../components/dashboard/PerformanceMetrics';
import { MakeScenariosList } from '../components/dashboard/MakeScenariosList';
import { DealCard } from '../components/dashboard/DealCard';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import { fetchPipedriveDeals, type PipedriveDeal } from '../utils/pipedrive';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [deals, setDeals] = useState<PipedriveDeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadDeals = async () => {
      try {
        const pipedriveDeals = await fetchPipedriveDeals();
        setDeals(pipedriveDeals);
      } catch (error) {
        console.error('Error loading deals:', error);
        toast.error('Failed to load deals');
      } finally {
        setIsLoading(false);
      }
    };

    loadDeals();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#1e1e1e] text-[#676767] font-['Nunito']">
      <Sidebar
        onSidebarHide={() => setShowSidebar(false)}
        showSidebar={showSidebar}
      />
      
      <div className="flex w-full">
        <div className="w-full h-screen hidden sm:block sm:w-20 xl:w-60 flex-shrink-0">.</div>
        
        <div className="h-screen flex-grow overflow-x-hidden overflow-auto flex flex-wrap content-start p-2">
          <div className="w-full sm:flex p-2 items-end">
            <DashboardHeader
              userName={user?.name || 'User'}
              onMenuClick={() => setShowSidebar(true)}
            />
            <div className="w-full sm:w-56 mt-4 sm:mt-0 relative">
              <input
                type="text"
                className="bg-card w-full pl-12 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Search..."
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Rest of the dashboard content */}
          {isLoading ? (
            <div className="w-full p-4 text-center text-gray-400">
              Loading deals...
            </div>
          ) : deals.length > 0 ? (
            <div className="w-full flex flex-wrap">
              {deals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          ) : (
            <div className="w-full p-4 text-center text-gray-400">
              No deals found. Connect Pipedrive to see your deals here.
            </div>
          )}

          <div className="w-full p-2">
            <IntegrationCards />
          </div>

          <div className="w-full p-2 lg:w-2/3">
            <div className="rounded-lg bg-card sm:h-80 h-60">
              <Graph />
            </div>
          </div>

          <div className="w-full p-2 lg:w-1/3">
            <PerformanceMetrics />
          </div>

          <MakeScenariosList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;