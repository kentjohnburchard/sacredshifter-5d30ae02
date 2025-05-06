
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useJourney } from '@/context/JourneyContext';
import SpiralVisualizer, { SpiralParams } from '@/components/visualizer/SpiralVisualizer';
import useSpiralParams from '@/hooks/useSpiralParams';
import { logTimelineEvent } from '@/services/timelineService';
import { JourneyAwareComponentProps } from '@/types/journey';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

interface JourneyAwareSpiralVisualizerProps extends JourneyAwareComponentProps {
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

  // Log visibility changes to timeline
  useEffect(() => {
    if (user?.id && effectiveJourneyId && isVisible !== undefined) {
      logTimelineEvent(
        user.id,
        'SpiralVisualizer',
        'spiral_toggle',
        effectiveJourneyId.toString(),
        { enabled: isVisible }
      );
      
      // Also record in journey activity log
      recordActivity('spiral_toggle', { 
        enabled: isVisible,
        journeyId: effectiveJourneyId.toString()
      });
    }
  }, [isVisible, user?.id, effectiveJourneyId]);
  
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
