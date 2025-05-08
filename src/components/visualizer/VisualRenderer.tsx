
import React, { useState, useEffect } from 'react';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';
import SpiralVisualizer from './SpiralVisualizer';
import { Button } from '@/components/ui/button';
import { Settings, RotateCw, Maximize2, Minimize2 } from 'lucide-react';

interface VisualRendererProps {
  className?: string;
  height?: string | number;
  showControls?: boolean;
  containerId?: string;
}

const VisualRenderer: React.FC<VisualRendererProps> = ({
  className = '',
  height = '100%',
  showControls = true,
  containerId = 'visualRenderer',
}) => {
  // Local state for settings that were previously in context
  const [settings] = useState({
    speed: 1,
    brightness: 0.8
  });
  const { currentAudio, registerPlayerVisuals } = useGlobalAudioPlayer();
  const [visualMode, setVisualMode] = useState<string>('spiral');
  const [expanded, setExpanded] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);

  // Get spiral parameters based on current audio frequency
  const getSpiralParams = () => {
    // Default spiral parameters - adjusted to create proper spiral
    const params = {
      coeffA: 1.2,
      coeffB: 0.8,
      coeffC: 1.0,
      freqA: 3.2,
      freqB: 4.1,
      freqC: 2.7,
      color: '255,255,255', // Default white
      opacity: 80,
      strokeWeight: 1.5,
      maxCycles: 5,
      speed: 0.5
    };

    // Modify based on frequency if available
    if (currentAudio?.frequency) {
      const freq = currentAudio.frequency;
      
      // Adjusted parameter mapping for better spirals
      params.coeffA = Math.max(0.8, Math.min(1.5, freq / 500));
      params.freqA = Math.max(2.0, Math.min(5.0, freq / 200));
      
      // Adjust color based on frequency range
      if (freq < 300) {
        params.color = '100,100,220'; // Blue for low frequencies
      } else if (freq < 500) {
        params.color = '100,220,100'; // Green for mid frequencies
      } else if (freq < 700) {
        params.color = '220,180,100'; // Yellow-orange for higher frequencies
      } else {
        params.color = '220,100,220'; // Purple for highest frequencies
      }
    }

    // Apply settings overrides if provided
    if (settings.speed) {
      params.speed = settings.speed * 0.5; // Adjusted for better spiral motion
    }
    
    if (settings.brightness) {
      params.opacity = settings.brightness * 100;
    }

    return params;
  };

  // Register with the global audio player on mount
  React.useEffect(() => {
    const unregister = registerPlayerVisuals({
      setAudioSource: (url, info) => {
        console.log("Visual renderer received new audio source:", url);
        // Any visual-specific handling of audio source changes
      }
    });

    return () => {
      if (unregister) unregister();
    };
  }, [registerPlayerVisuals]);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const toggleControls = () => {
    setControlsVisible(!controlsVisible);
  };

  const containerStyle = {
    height: typeof height === 'number' ? `${height}px` : height,
    position: expanded ? 'fixed' : 'relative',
    inset: expanded ? 0 : 'auto',
    zIndex: expanded ? 50 : 'auto'
  } as React.CSSProperties;

  return (
    <div 
      className={`visual-renderer ${expanded ? 'fixed inset-0 z-50' : 'relative'} ${className}`}
      style={containerStyle}
    >
      {/* Visual content based on mode */}
      <div className="w-full h-full">
        {visualMode === 'spiral' && (
          <SpiralVisualizer 
            params={getSpiralParams()}
            containerId={containerId}
            className="w-full h-full"
          />
        )}
        
        {visualMode === 'mandala' && (
          <div className="w-full h-full flex items-center justify-center bg-black">
            <div className="text-white text-center">
              <p>Mandala visualization would appear here</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Controls overlay */}
      {showControls && controlsVisible && (
        <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleExpanded}
            className="bg-black/50 border-purple-500/50 text-white hover:bg-purple-900/30"
          >
            {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setVisualMode(visualMode === 'spiral' ? 'mandala' : 'spiral')}
            className="bg-black/50 border-purple-500/50 text-white hover:bg-purple-900/30"
          >
            <RotateCw size={16} />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleControls}
            className="bg-black/50 border-purple-500/50 text-white hover:bg-purple-900/30"
          >
            <Settings size={16} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default VisualRenderer;
