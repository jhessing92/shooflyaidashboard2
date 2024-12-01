import React, { useState, useEffect } from 'react';
import { Database } from 'lucide-react';
import { IntegrationCard } from './IntegrationCard';
import PipedriveConnection from '../integrations/PipedriveIntegration';
import { getPipedriveCredentials, type PipedriveDeal } from '../../utils/pipedrive';

interface PipedriveCardProps {
  onDealsUpdate?: (deals: PipedriveDeal[]) => void;
}

export const PipedriveCard = ({ onDealsUpdate }: PipedriveCardProps) => {
  const [showConnection, setShowConnection] = useState(false);
  const [status, setStatus] = useState<'connected' | 'error' | 'pending'>('error');
  const [metrics, setMetrics] = useState<{ apiConnection?: string; syncStatus?: string } | null>(null);

  useEffect(() => {
    const checkConnection = () => {
      const credentials = getPipedriveCredentials();
      if (credentials) {
        setStatus('connected');
        setMetrics({
          apiConnection: 'Active',
          syncStatus: 'Ready'
        });
      } else {
        setStatus('error');
        setMetrics(null);
      }
    };

    checkConnection();
  }, [showConnection]);

  const handleDealsUpdate = (deals: PipedriveDeal[]) => {
    onDealsUpdate?.(deals);
  };

  return (
    <>
      <IntegrationCard
        title="Pipedrive CRM"
        status={status}
        icon={<Database className="w-6 h-6 text-blue-400" />}
        onConfigure={() => setShowConnection(true)}
        metrics={metrics}
      />

      {showConnection && (
        <PipedriveConnection 
          onClose={() => setShowConnection(false)}
          onDealsUpdate={handleDealsUpdate}
        />
      )}
    </>
  );
};