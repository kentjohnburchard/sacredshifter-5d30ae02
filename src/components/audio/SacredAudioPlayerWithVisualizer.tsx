import React, { useState, useEffect } from 'react';
import SacredAudioPlayer from './SacredAudioPlayer';
import { JourneyProps } from '@/types/journey';
import { useAppStore } from '@/store';
import { AdvancedVisualizerManager } from '../visualizer/AdvancedVisualizerManager';
import { getChakraColorScheme } from '@/lib/chakraColors';

interface SacredAudioPlayerWithVisualizerProps {
  journey?: JourneyProps;
  audioUrl?: string;
}

// Define the visualization modes as a union type that can be used throughout the app
export type VisualizerMode = 'flowerOfLife' | 'merkaba' | 'torus' | 'customPrimePulse' | 'primeFlow' | 'chakraSpiral';

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
  let visualizerMode: VisualizerMode = 'customPrimePulse';
  
  if (journey?.visualTheme) {
    switch (journey.visualTheme) {
      case 'merkaba':
        visualizerMode = 'merkaba';
        break;
      case 'flower-of-life':
        visualizerMode = 'flowerOfLife';
        break;
      case 'torus':
      case 'vesica-piscis': // Add more mappings if needed
        visualizerMode = 'torus';
        break;
      case 'sri-yantra':
        visualizerMode = 'chakraSpiral';
        break;
      case 'cosmic-ocean':
        visualizerMode = 'primeFlow';
        break;
      default:
        visualizerMode = 'customPrimePulse';
    }
  }

  // Define shouldShowVisualizer variable to control when visualizer is displayed
  const shouldShowVisualizer = !!visualizerMode && isPlaying && showVisualizer;

  // Get chakra colors for styling
  const colorScheme = journey?.chakras ? getChakraColorScheme(journey.chakras) : undefined;
  const containerClass = `sacred-audio-player-with-visualizer w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg ${chakra ? `chakra-${chakra}` : ''}`;

  return (
    <div className={containerClass}>
      {shouldShowVisualizer ? (
        <div className="h-64 relative rounded-t-xl overflow-hidden shadow-inner">
          <AdvancedVisualizerManager
            frequencyData={audioData || undefined}
            chakra={chakra}
            initialMode={visualizerMode}
            showControls={false}
            audioReactive={true}
            isPlaying={isPlaying}
            enableModeSelection={false}
          />
        </div>
      ) : (
        // Fallback when visualizer shouldn't be shown but we want to keep the space
        <div className="h-0 md:h-16 bg-gradient-to-r from-purple-900/20 to-indigo-900/20 rounded-t-xl transition-all duration-500 ease-in-out"></div>
      )}
      
      <SacredAudioPlayer 
        journey={journey}
        audioUrl={audioUrl || journey?.audioUrl}
      />
    </div>
  );
};

export default SacredAudioPlayerWithVisualizer;
