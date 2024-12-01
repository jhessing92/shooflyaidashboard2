import React, { useState, useEffect } from 'react';
import { Workflow } from 'lucide-react';
import { IntegrationCard } from './IntegrationCard';
import MakeConnection from '../integrations/MakeIntegration';
import { getMakeCredentials } from '../../utils/make';

export const MakeCard = () => {
  const [showConnection, setShowConnection] = useState(false);
  const [status, setStatus] = useState<'connected' | 'error' | 'pending'>('pending');
  const [metrics, setMetrics] = useState<{ apiConnection?: string; webhookStatus?: string } | null>(null);

  useEffect(() => {
    const checkConnection = () => {
      const credentials = getMakeCredentials();
      if (credentials) {
        setStatus('connected');
        setMetrics({
          apiConnection: 'Active',
          webhookStatus: 'Ready'
        });
      } else {
        setStatus('error');
        setMetrics(null);
      }
    };

    checkConnection();
  }, [showConnection]);

  return (
    <>
      <IntegrationCard
        title="Make.com"
        status={status}
        icon={<Workflow className="w-6 h-6 text-yellow-400" />}
        onConfigure={() => setShowConnection(true)}
        metrics={metrics}
      />

      {showConnection && (
        <MakeConnection 
          onClose={() => {
            setShowConnection(false);
          }} 
        />
      )}
    </>
  );
};