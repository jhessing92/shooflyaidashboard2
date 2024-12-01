import React, { useState, useEffect } from 'react';
import { Play, Pause, AlertCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MakeScenario, fetchMakeScenarios, getMakeCredentials } from '../../utils/make';
import toast from 'react-hot-toast';

export const MakeScenariosList = () => {
  const [scenarios, setScenarios] = useState<MakeScenario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadScenarios = async () => {
      try {
        const data = await fetchMakeScenarios();
        setScenarios(data);
      } catch (err) {
        console.error('Error loading scenarios:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadScenarios();
  }, []);

  const displayedScenarios = showAll ? scenarios : scenarios.slice(0, 3);
  const credentials = getMakeCredentials();

  if (isLoading) {
    return (
      <div className="w-full p-2 lg:w-2/3">
        <div className="rounded-lg bg-card p-6">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!credentials) {
    return (
      <div className="w-full p-2 lg:w-2/3">
        <div className="rounded-lg bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Active Scenarios</h2>
          </div>
          <div className="flex items-center justify-center p-6 text-gray-400">
            <p>Connect Make.com to view your scenarios</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-2 lg:w-2/3">
      <div className="rounded-lg bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Active Scenarios</h2>
          <span className="text-sm text-gray-400">{scenarios.length} scenarios</span>
        </div>

        {scenarios.length === 0 ? (
          <div className="flex items-center justify-center p-6 text-gray-400">
            <p>No scenarios found</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {displayedScenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  className="flex items-center justify-between p-4 bg-[#1e1e1e] rounded-lg hover:bg-[#252525] transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    {scenario.status === 'active' ? (
                      <Play className="w-4 h-4 text-green-400" />
                    ) : (
                      <Pause className="w-4 h-4 text-yellow-400" />
                    )}
                    <div>
                      <h3 className="text-white font-medium">{scenario.name}</h3>
                      {scenario.lastRun && (
                        <div className="flex items-center text-sm text-gray-400 mt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>Last run: {new Date(scenario.lastRun).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        scenario.status === 'active'
                          ? 'bg-green-500/20 text-green-400'
                          : scenario.status === 'error'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {scenario.status.charAt(0).toUpperCase() + scenario.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-4">
              {scenarios.length > 3 && (
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="flex items-center py-2 px-4 bg-[#2d2d2d] hover:bg-[#353535] rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                  <span className="mr-2">
                    {showAll ? 'Show Less' : `View ${scenarios.length - 3} More`}
                  </span>
                  {showAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              )}
              <button
                onClick={() => navigate('/make-scenarios')}
                className="flex items-center py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-colors"
              >
                View All Scenarios
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};