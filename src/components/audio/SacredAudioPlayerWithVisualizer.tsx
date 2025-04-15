
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
  const { audioData } = useAppStore();
  const [showVisualizer, setShowVisualizer] = useState(false);

  useEffect(() => {
    // Show visualizer when journey is playing
    setShowVisualizer(!!audioData);
  }, [audioData]);

  return (
    <div className="sacred-audio-player-with-visualizer">
      {showVisualizer && journey?.chakras?.[0] && (
        <SacredVisualizerCanvas
          frequencyData={audioData || undefined}
          chakra={journey.chakras[0].toLowerCase() as any}
          visualizerMode={journey.visualTheme === 'merkaba' ? 'merkaba' : 'customPrimePulse'}
        />
      )}
      
      <SacredAudioPlayer 
        journey={journey}
        audioUrl={audioUrl || journey?.audioUrl}
      />
    </div>
  );
};

export default SacredAudioPlayerWithVisualizer;
