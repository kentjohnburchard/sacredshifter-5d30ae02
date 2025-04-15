
import React, { useState, useEffect } from 'react';
import SacredAudioPlayer from './SacredAudioPlayer';
import { JourneyProps } from '@/types/journey';
import { useAppStore } from '@/store';
import SacredVisualizerCanvas from '../visualizer/SacredVisualizerCanvas';

interface SacredAudioPlayerWithVisualizerProps {
  journey?: JourneyProps;
  audioUrl?: string;
}

const SacredAudioPlayerWithVisualizer: React.FC<SacredAudioPlayerWithVisualizerProps> = ({
  journey,
  audioUrl
}) => {
  const { audioData, isPlaying } = useAppStore();
  const [showVisualizer, setShowVisualizer] = useState(false);

  useEffect(() => {
    // Show visualizer when journey is playing and we have audio data
    setShowVisualizer(!!audioData && isPlaying);
  }, [audioData, isPlaying]);

  // Determine which chakra to use (use first if multiple are provided)
  const chakra = journey?.chakras?.[0]?.toLowerCase() as any;
  
  // Determine which visualizer mode to use based on journey theme
  let visualizerMode: 'flowerOfLife' | 'merkaba' | 'torus' | 'customPrimePulse' = 'customPrimePulse';
  
  if (journey?.visualTheme === 'merkaba') {
    visualizerMode = 'merkaba';
  } else if (journey?.visualTheme === 'flower-of-life') {
    visualizerMode = 'flowerOfLife';
  } else if (journey?.visualTheme === 'torus') { 
    // Check if 'torus' is included in the visual theme
    visualizerMode = 'torus';
  }

  return (
    <div className="sacred-audio-player-with-visualizer">
      {showVisualizer && chakra && (
        <div className="mb-4">
          <SacredVisualizerCanvas
            frequencyData={audioData || undefined}
            chakra={chakra}
            visualizerMode={visualizerMode}
          />
        </div>
      )}
      
      <SacredAudioPlayer 
        journey={journey}
        audioUrl={audioUrl || journey?.audioUrl}
      />
    </div>
  );
};

export default SacredAudioPlayerWithVisualizer;
