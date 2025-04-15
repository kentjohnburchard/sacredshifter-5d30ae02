
import React, { useState } from 'react';
import SacredAudioPlayer from './SacredAudioPlayer';
import { JourneyProps } from '@/types/journey';
import { useAppStore } from '@/store';
import { getChakraColorScheme } from '@/lib/chakraColors';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import CanvasAudioVisualizer from './CanvasAudioVisualizer';

interface SacredAudioPlayerWithVisualizerProps {
  journey?: JourneyProps;
  audioUrl?: string;
}

// Define the visualization modes as a union type that can be used throughout the app
export type VisualizerMode = 'bars' | 'wave' | 'circle' | 'particles';

const SacredAudioPlayerWithVisualizer: React.FC<SacredAudioPlayerWithVisualizerProps> = ({
  journey,
  audioUrl
}) => {
  const { audioData, isPlaying } = useAppStore();
  const [showVisualizer, setShowVisualizer] = useState(true);
  const [visualizerMode, setVisualizerMode] = useState<VisualizerMode>('bars');

  // Determine which chakra to use (use first if multiple are provided)
  const chakra = journey?.chakras?.[0]?.toLowerCase() as any;
  
  // Define shouldShowVisualizer variable to control when visualizer is displayed
  const shouldShowVisualizer = 
    isPlaying === true &&
    showVisualizer === true &&
    !!audioData;

  // Get chakra colors for styling
  const colorSchemeObj = journey?.chakras ? getChakraColorScheme(journey.chakras) : undefined;
  // Convert colorScheme to string if it's an object
  const colorScheme = typeof colorSchemeObj === 'string' ? colorSchemeObj : 
    (colorSchemeObj ? colorSchemeObj.primary : '#a855f7');
  
  const containerClass = `sacred-audio-player-with-visualizer w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg ${chakra ? `chakra-${chakra}` : ''}`;

  const toggleVisualizer = () => {
    setShowVisualizer(prev => !prev);
  };

  const cycleVisualizerMode = () => {
    const modes: VisualizerMode[] = ['bars', 'wave', 'circle', 'particles'];
    const currentIndex = modes.indexOf(visualizerMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setVisualizerMode(modes[nextIndex]);
  };

  return (
    <div className={containerClass}>
      <div className="flex justify-between p-2 bg-gradient-to-r from-purple-900/20 to-indigo-900/20">
        {shouldShowVisualizer && (
          <Button
            variant="ghost"
            size="sm"
            onClick={cycleVisualizerMode}
            className="text-white/80 hover:text-white flex items-center gap-1"
          >
            Change Style
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleVisualizer}
          className="text-white/80 hover:text-white flex items-center gap-1"
        >
          {showVisualizer ? (
            <>
              <EyeOff className="h-4 w-4 mr-1" />
              Hide Visualizer
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-1" />
              Show Visualizer
            </>
          )}
        </Button>
      </div>
      
      {shouldShowVisualizer ? (
        <div className="h-64 relative rounded-t-xl overflow-hidden shadow-inner">
          <CanvasAudioVisualizer 
            audioData={audioData}
            colorScheme={colorScheme}
            visualizerMode={visualizerMode}
            isPlaying={isPlaying}
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
