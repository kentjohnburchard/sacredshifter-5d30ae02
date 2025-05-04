
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
          <TooltipContent side="top" className="bg-black/70 backdrop-blur-sm border-purple-500/30">
            <p className="text-white text-shadow-sm">{name} in {zodiacSign} Season</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return (
    <div className="flex flex-col">
      <div className="flex items-center space-x-2 text-sm text-purple-200 text-shadow-sm">
        <span className="text-lg">{icon}</span>
        <span>{name} • {zodiacSign} Season</span>
      </div>
      <div className="text-xs text-purple-200/80 mt-1 text-shadow-xs">
        {formattedTime}
      </div>
    </div>
  );
};

export default MoonPhaseDisplay;
