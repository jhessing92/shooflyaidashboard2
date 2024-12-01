import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, AlertCircle, Clock, ArrowLeft, Search, Filter } from 'lucide-react';
import { MakeScenario, fetchMakeScenarios, getMakeCredentials } from '../utils/make';

const MakeScenariosPage = () => {
  const [scenarios, setScenarios] = useState<MakeScenario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadScenarios = async () => {
      const credentials = getMakeCredentials();
      if (!credentials) {
        setError('No Make.com credentials found');
        setIsLoading(false);
        return;
      }

      try {
        const data = await fetchMakeScenarios(credentials);
        setScenarios(data);
      } catch (err) {
        console.error('Error loading scenarios:', err);
        setError('Failed to fetch scenarios');
      } finally {
        setIsLoading(false);
      }
    };

    loadScenarios();
  }, []);

  const filteredScenarios = scenarios
    .filter(scenario => !showActiveOnly || scenario.status === 'active')
    .filter(scenario => 
      scenario.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-[#1e1e1e] text-gray-300 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-gray-400 hover:text-white transition-colors mr-4"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Make.com Scenarios</h1>
              <p className="text-gray-400">View and manage all your automation scenarios</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search scenarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[#2d2d2d] rounded-lg border border-gray-600 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>

            <div className="flex items-center bg-[#2d2d2d] rounded-lg p-2">
              <Filter className="w-5 h-5 text-gray-400 mr-2" />
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={showActiveOnly}
                  onChange={() => setShowActiveOnly(!showActiveOnly)}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-500/25 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-400">Active only</span>
              </label>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-card rounded-lg p-8">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-[#2d2d2d] rounded-lg" />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="bg-card rounded-lg p-8">
            <div className="flex items-center text-red-400">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span>{error}</span>
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-lg p-6">
            <div className="grid gap-4">
              {filteredScenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  className="flex items-center justify-between p-4 bg-[#1e1e1e] rounded-lg hover:bg-[#252525] transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    {scenario.status === 'active' ? (
                      <Play className="w-5 h-5 text-green-400" />
                    ) : (
                      <Pause className="w-5 h-5 text-yellow-400" />
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
                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
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
          </div>
        )}
      </div>
    </div>
  );
};

export default MakeScenariosPage;