
import React, { useState } from 'react';
import KaleidoscopeVisualizer from './KaleidoscopeVisualizer';
import PrimePulseVisualizer from './PrimePulseVisualizer';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Eye, Hexagon, CircleDashed } from 'lucide-react';

export interface VisualizerManagerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isAudioReactive?: boolean;
  colorScheme?: string | { 
    primary: string; 
    secondary: string; 
    tertiary: string; 
    accent: string; 
    background: string; 
  };
  chakra?: string[];  // Expecting string array
  frequency?: number;
  analyzerNode?: AnalyserNode | null;
  audioRef?: React.RefObject<HTMLAudioElement>;
  frequencies?: number[];
  chakras?: string[];
  visualTheme?: string;
  isPlaying?: boolean;
  liftedVeil?: boolean;
}

const VisualizerManager: React.FC<VisualizerManagerProps> = ({
  size = 'md',
  isAudioReactive = false,
  colorScheme = 'purple',
  chakra = [], // Default empty array
  frequency,
  analyzerNode,
  audioRef,
  frequencies = [],
  chakras = [],
  visualTheme,
  isPlaying = false,
  liftedVeil = false
}) => {
  const [visualizerType, setVisualizerType] = useState<string>("kaleidoscope");
  const [showVisualizer, setShowVisualizer] = useState(true);
  
  // Prepare frequencies array - include the single frequency if provided
  const freqArray = frequencies.length > 0 ? 
    frequencies : 
    (frequency ? [frequency] : [432]);
    
  // Prepare chakras array - include chakras from both sources
  const chakraArray = chakras.length > 0 ? 
    chakras : 
    (chakra.length > 0 ? chakra : ["Crown"]);
  
  // Convert complex colorScheme object to string if needed for KaleidoscopeVisualizer
  const kaleidoscopeColorScheme = typeof colorScheme === 'object' 
    ? colorScheme.primary 
    : colorScheme;
  
  // Define shouldShowVisualizer variable to control when visualizer is displayed
  const shouldShowVisualizer = 
    !!visualizerType && 
    showVisualizer && 
    (isAudioReactive ? !!analyzerNode : true) &&
    (isPlaying || liftedVeil);
  
  return (
    <div className="visualizer-container relative">
      <div className="visualizer-content w-full h-full">
        {shouldShowVisualizer && visualizerType === "kaleidoscope" && (
          <KaleidoscopeVisualizer
            size={size}
            isAudioReactive={isAudioReactive}
            colorScheme={kaleidoscopeColorScheme}
            audioRef={audioRef}
            frequency={frequency}
          />
        )}
        
        {shouldShowVisualizer && visualizerType === "primePulse" && (
          <PrimePulseVisualizer
            analyzerNode={analyzerNode}
            isPlaying={isPlaying}
            frequencies={freqArray}
            chakras={chakraArray}
            visualTheme={visualTheme}
          />
        )}
      </div>
      
      <div className="visualizer-controls absolute bottom-2 right-2">
        <ToggleGroup type="single" value={visualizerType} onValueChange={(value) => value && setVisualizerType(value)}>
          <ToggleGroupItem value="kaleidoscope" aria-label="Kaleidoscope Visualizer">
            <CircleDashed className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="primePulse" aria-label="Prime Pulse Visualizer">
            <Hexagon className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};

export { VisualizerManager };
