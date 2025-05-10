
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
  const { activeJourney, isJourneyActive, recordActivity } = useJourney();
  const [isVisible, setIsVisible] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Ensure journeyId is always a string when passed to useSpiralParams
  const stringJourneyId = journeyId ? String(journeyId) : undefined;
  
  // Either use provided journeyId or get from context if autoSync is true
  const effectiveJourneyId = stringJourneyId || (autoSync && activeJourney?.id);
  
  // Log for debugging
  console.log("JourneyAwareSpiralVisualizer - journeyId:", journeyId, 
              "type:", typeof journeyId,
              "effectiveJourneyId:", effectiveJourneyId);
  
  // Get spiral parameters for current journey
  const { params: spiralParams } = useSpiralParams(effectiveJourneyId);
  
  // Initialize component
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Log parameters for debugging
  useEffect(() => {
    console.log("JourneyAwareSpiralVisualizer - Got spiral params:", spiralParams, 
                "for journeyId:", effectiveJourneyId);
  }, [spiralParams, effectiveJourneyId]);

  // Log visibility changes and record activity
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

  // Only render if the journey is active or we're not auto-syncing
  const shouldRenderSpiral = !autoSync || isJourneyActive || !!journeyId;

  if (!shouldRenderSpiral) {
    return (
      <div className={`flex justify-center items-center p-4 ${className} bg-black/70`}>
        <div className="text-purple-300/60 text-center p-6">
          <p className="text-sm">Spiral visualization will appear when journey begins</p>
        </div>
      </div>
    );
  }

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
    coeffA: spiralParams?.coeffA || 1.2,
    coeffB: spiralParams?.coeffB || 0.8,
    coeffC: spiralParams?.coeffC || 1.0,
    freqA: spiralParams?.freqA || 3.2,
    freqB: spiralParams?.freqB || 4.1, 
    freqC: spiralParams?.freqC || 2.7,
    color: spiralParams?.color || '220,220,255',
    opacity: spiralParams?.opacity || 80,
    strokeWeight: spiralParams?.strokeWeight || 1.5,
    maxCycles: spiralParams?.maxCycles || 5,
    speed: isInitialized ? (spiralParams?.speed || 0.5) : 0.01 // Start with slow speed until initialized
  };

  return (
    <div className={`relative ${className}`} style={{minHeight: "200px"}}>
      <SpiralVisualizer 
        params={completeParams} 
        containerId={containerId}
        className="absolute inset-0"
      />
      
      {showControls && (
        <div className="absolute top-2 right-2 z-20">
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
