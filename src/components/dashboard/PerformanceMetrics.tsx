import React, { useEffect, useState } from 'react';
import { APICallMetrics, getAPICallMetrics } from '../../config/openai';
import { Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PerformanceMetrics = () => {
  const [metrics, setMetrics] = useState<APICallMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getAPICallMetrics();
        setMetrics(data);
      } catch (error) {
        console.error('Failed to fetch API metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-lg bg-card h-80">
        <div className="p-4 h-full flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Loading metrics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-card h-80">
      <div className="p-4 h-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">API Performance</h3>
          <button
            onClick={() => navigate('/settings')}
            className="p-2 hover:bg-[#2d2d2d] rounded-lg transition-colors"
            title="Configure API Settings"
          >
            <Settings className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <MetricItem
              label="API Calls"
              value={metrics?.total || 0}
              percentage={(metrics?.successful || 0) / (metrics?.total || 1) * 100}
            />
            <MetricItem
              label="Success Rate"
              value={`${((metrics?.successful || 0) / (metrics?.total || 1) * 100).toFixed(1)}%`}
              percentage={(metrics?.successful || 0) / (metrics?.total || 1) * 100}
              color="green"
            />
            <MetricItem
              label="Tokens Used"
              value={metrics?.tokensUsed?.toLocaleString() || 0}
              percentage={(metrics?.tokensUsed || 0) / 150000 * 100} // Assuming 150k monthly limit
              color="blue"
            />
          </div>

          <div className="mt-6 p-4 bg-[#1e1e1e] rounded-lg">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Estimated Cost</span>
              <span className="text-white font-semibold">
                ${metrics?.costEstimate?.toFixed(2) || '0.00'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface MetricItemProps {
  label: string;
  value: string | number;
  percentage: number;
  color?: 'blue' | 'green' | 'default';
}

const MetricItem = ({ label, value, percentage, color = 'default' }: MetricItemProps) => {
  const getColorClass = () => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500';
      case 'green':
        return 'bg-green-500';
      default:
        return 'bg-indigo-500';
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="flex justify-between mb-1">
          <span className="text-sm text-gray-400">{label}</span>
          <span className="text-sm text-white">{value}</span>
        </div>
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${getColorClass()} transition-all duration-500`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};