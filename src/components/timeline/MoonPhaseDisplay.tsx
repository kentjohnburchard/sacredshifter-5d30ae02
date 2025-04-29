
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { getMoonPhase, getZodiacSign, formatCosmicTimestamp } from '@/utils/moonPhaseUtils';

interface MoonPhaseDisplayProps {
  timestamp: string;
  compact?: boolean;
}

const MoonPhaseDisplay: React.FC<MoonPhaseDisplayProps> = ({ timestamp, compact = false }) => {
  const date = new Date(timestamp);
  const { icon, name } = getMoonPhase(date);
  const zodiacSign = getZodiacSign(date);
  const formattedTime = formatCosmicTimestamp(timestamp);
  
  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center space-x-1">
              <span className="text-base">{icon}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>{name} in {zodiacSign} Season</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return (
    <div className="flex flex-col">
      <div className="flex items-center space-x-2 text-sm text-purple-200">
        <span className="text-lg">{icon}</span>
        <span>{name} • {zodiacSign} Season</span>
      </div>
      <div className="text-xs text-purple-200/70 mt-1">
        {formattedTime}
      </div>
    </div>
  );
};

export default MoonPhaseDisplay;
