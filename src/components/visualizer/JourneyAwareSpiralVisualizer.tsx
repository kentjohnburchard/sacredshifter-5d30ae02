
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useJourney } from '@/context/JourneyContext';
import SpiralVisualizer from '@/components/visualizer/SpiralVisualizer';
import useSpiralParams from '@/hooks/useSpiralParams';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

interface JourneyAwareSpiralVisualizerProps {
  journeyId?: string | number;
  autoSync?: boolean;
  className?: string;
  showControls?: boolean;
  containerId?: string;
}

const JourneyAwareSpiralVisualizer: React.FC<JourneyAwareSpiralVisualizerProps> = ({
  journeyId,
  autoSync = true,
  className = '',
  showControls = true,
  containerId = 'journeySpiral'
}) => {
  const { user } = useAuth();
  const { activeJourney, recordActivity } = useJourney();
  const [isVisible, setIsVisible] = useState(true);

  // Ensure journeyId is always a string when passed to useSpiralParams
  const stringJourneyId = journeyId ? String(journeyId) : undefined;
  
  // Either use provided journeyId or get from context if autoSync is true
  const effectiveJourneyId = stringJourneyId || (autoSync && activeJourney?.id);
  
  // Log for debugging
  console.log("JourneyAwareSpiralVisualizer - journeyId:", journeyId, 
              "type:", typeof journeyId,
              "effectiveJourneyId:", effectiveJourneyId);
  
  // Get spiral parameters for current journey
  const spiralParams = useSpiralParams(effectiveJourneyId?.toString());
  
  // Log parameters for debugging
  useEffect(() => {
    console.log("JourneyAwareSpiralVisualizer - Got spiral params:", spiralParams, 
                "for journeyId:", effectiveJourneyId);
  }, [spiralParams, effectiveJourneyId]);

  // Log visibility changes
  useEffect(() => {
    if (user?.id && effectiveJourneyId && isVisible !== undefined) {
      recordActivity('spiral_toggle', { 
        enabled: isVisible,
        journeyId: effectiveJourneyId.toString()
      });
    }
  }, [isVisible, user?.id, effectiveJourneyId, recordActivity]);
  
  const toggleVisibility = () => {
    setIsVisible(prev => !prev);
  };

  if (!isVisible) {
    return (
      <div className={`flex justify-center items-center p-4 ${className}`}>
        {showControls && (
          <Button 
            onClick={toggleVisibility}
            variant="outline" 
            size="sm"
            className="bg-purple-900/30 border-purple-400/30 text-purple-100 hover:bg-purple-900/50"
          >
            <Eye className="h-4 w-4 mr-2" />
            Show Spiral
          </Button>
        )}
      </div>
    );
  }

  // Ensure parameters have all required fields before passing to SpiralVisualizer
  const completeParams = {
    coeffA: spiralParams.coeffA,
    coeffB: spiralParams.coeffB,
    coeffC: spiralParams.coeffC,
    freqA: spiralParams.freqA,
    freqB: spiralParams.freqB,
    freqC: spiralParams.freqC,
    color: spiralParams.color,
    opacity: spiralParams.opacity,
    strokeWeight: spiralParams.strokeWeight,
    maxCycles: spiralParams.maxCycles,
    speed: spiralParams.speed
  };

  return (
    <div className={`relative ${className}`}>
      <SpiralVisualizer 
        params={completeParams} 
        containerId={containerId}
      />
      
      {showControls && (
        <div className="absolute top-2 right-2">
          <Button 
            onClick={toggleVisibility} 
            variant="outline" 
            size="sm"
            className="bg-purple-900/30 border-purple-400/30 text-purple-100 hover:bg-purple-900/50"
          >
            <EyeOff className="h-4 w-4 mr-2" />
            Hide Spiral
          </Button>
        </div>
      )}
    </div>
  );
};

export default JourneyAwareSpiralVisualizer;
