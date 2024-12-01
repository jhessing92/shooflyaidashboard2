import React, { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';
import { IntegrationCard } from './IntegrationCard';
import OpenAIConnection from '../integrations/OpenAIIntegration';
import { getAPICallMetrics } from '../../config/openai';

export const OpenAICard = () => {
  const [showConnection, setShowConnection] = useState(false);
  const [status, setStatus] = useState<'connected' | 'error' | 'pending'>('pending');
  const [metrics, setMetrics] = useState<{ apiConnection?: string; usage?: string } | null>(null);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const apiKey = localStorage.getItem('openai_api_key');
        if (!apiKey) {
          setStatus('error');
          return;
        }

        const apiMetrics = await getAPICallMetrics();
        const usagePercentage = Math.round((apiMetrics.tokensUsed / 150000) * 100);
        
        setStatus('connected');
        setMetrics({
          apiConnection: 'Active',
          usage: `${usagePercentage}% Used`
        });
      } catch (error) {
        setStatus('error');
        console.error('Failed to load OpenAI metrics:', error);
      }
    };

    loadMetrics();
  }, [showConnection]);

  return (
    <>
      <IntegrationCard
        title="OpenAI"
        status={status}
        icon={<Bot className="w-6 h-6 text-green-400" />}
        onConfigure={() => setShowConnection(true)}
        metrics={metrics}
      />

      {showConnection && (
        <OpenAIConnection onClose={() => setShowConnection(false)} />
      )}
    </>
  );
};