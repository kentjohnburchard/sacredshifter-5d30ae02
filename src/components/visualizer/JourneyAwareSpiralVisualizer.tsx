
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useJourney } from '@/context/JourneyContext';
import SpiralVisualizer, { SpiralParams } from '@/components/visualizer/SpiralVisualizer';
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

  // Either use provided journeyId or get from context if autoSync is true
  const effectiveJourneyId = journeyId || (autoSync && activeJourney?.id);
  
  // Get spiral parameters for current journey
  const spiralParams = useSpiralParams(effectiveJourneyId?.toString());

  // Log visibility changes - remove dependency on logTimelineEvent
  useEffect(() => {
    if (user?.id && effectiveJourneyId && isVisible !== undefined) {
      // Replace logTimelineEvent with recordActivity
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

  return (
    <div className={`relative ${className}`}>
      <SpiralVisualizer 
        params={spiralParams} 
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
