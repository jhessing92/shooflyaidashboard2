import React from 'react';
import { useSpring, animated } from '@react-spring/web';
import { Building } from 'lucide-react';
import type { PipedriveDeal } from '../../utils/pipedrive';

interface DealCardProps {
  deal: PipedriveDeal;
}

export const DealCard = ({ deal }: DealCardProps) => {
  const { value: animatedValue } = useSpring({
    value: deal.weighted_value || deal.value,
    from: { value: 0 },
  });

  return (
    <div className="w-full p-2 lg:w-1/3">
      <div className="rounded-lg bg-card flex justify-between p-3 h-32">
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-white mb-1">{deal.title}</h2>
            <div className="flex items-center">
              <Building className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-sm text-gray-400">{deal.org_name}</span>
            </div>
          </div>

          <div className="mt-2">
            <div className="inline-flex px-3 py-1 rounded-full text-sm bg-purple-400/20 text-purple-400">
              {deal.stage_name}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end justify-center">
          <animated.div className="text-green-500 font-bold text-lg">
            {animatedValue.to((i) => `$${i.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)}
          </animated.div>
        </div>
      </div>
    </div>
  );
};