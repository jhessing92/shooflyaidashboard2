import React from 'react';
import { OpenAICard } from './OpenAICard';
import { MakeCard } from './MakeCard';
import { PipedriveCard } from './PipedriveCard';
import { GoogleDocsCard } from './GoogleDocsCard';

export const IntegrationCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div>
        <OpenAICard />
      </div>
      <div>
        <MakeCard />
      </div>
      <div>
        <PipedriveCard />
      </div>
      <div>
        <GoogleDocsCard />
      </div>
    </div>
  );
};