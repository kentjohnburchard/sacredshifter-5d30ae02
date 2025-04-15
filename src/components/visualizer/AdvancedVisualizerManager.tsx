
import React, { useState } from 'react';
import SacredVisualizerCanvas from './SacredVisualizerCanvas';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { 
  Flower, 
  Shapes, 
  Dna, 
  RotateCw, 
  Sparkles
} from 'lucide-react';
import PrimeIcon from '@/components/icons/PrimeIcon';
import { VisualizerMode } from '@/components/audio/SacredAudioPlayerWithVisualizer';

export interface AdvancedVisualizerManagerProps {
  frequencyData?: Uint8Array;
  chakra?: string;
  initialMode?: VisualizerMode;
  showControls?: boolean;
  audioReactive?: boolean;
  className?: string;
  enableModeSelection?: boolean;
  isPlaying?: boolean;
}

const AdvancedVisualizerManager: React.FC<AdvancedVisualizerManagerProps> = ({
  frequencyData,
  chakra = 'crown',
  initialMode = 'customPrimePulse',
  showControls = true,
  audioReactive = true,
  className = '',
  enableModeSelection = true,
  isPlaying = false
}) => {
  const [visualizerMode, setVisualizerMode] = useState<VisualizerMode>(initialMode);
  const [showVisualizer, setShowVisualizer] = useState(true);
  
  const handleVisualizerModeChange = (value: string) => {
    if (value) {
      setVisualizerMode(value as VisualizerMode);
    }
  };

  // Define shouldShowVisualizer variable to control when visualizer is displayed
  const shouldShowVisualizer = 
    showVisualizer && 
    typeof visualizerMode === 'string' && 
    (audioReactive ? !!frequencyData : true) && 
    isPlaying;

  return (
    <div className={`sacred-visualizer-container relative w-full h-full ${className}`}>
      {/* Visualizer */}
      <div className="w-full h-full">
        {shouldShowVisualizer && (
          <SacredVisualizerCanvas
            frequencyData={audioReactive ? frequencyData : undefined}
            chakra={chakra as any}
            visualizerMode={visualizerMode}
            enableControls={showControls}
          />
        )}
      </div>
      
      {/* Controls */}
      {enableModeSelection && (
        <div className="absolute bottom-2 right-2 z-10">
          <ToggleGroup
            type="single"
            value={visualizerMode}
            onValueChange={handleVisualizerModeChange}
            className="bg-black/30 backdrop-blur-sm rounded-lg p-1 border border-white/10"
          >
            <ToggleGroupItem 
              value="customPrimePulse" 
              className="data-[state=on]:bg-purple-600 data-[state=on]:text-white"
              aria-label="Prime Pulse"
            >
              <PrimeIcon size={16} />
            </ToggleGroupItem>
            
            <ToggleGroupItem 
              value="merkaba" 
              className="data-[state=on]:bg-purple-600 data-[state=on]:text-white"
              aria-label="Merkaba"
            >
              <Shapes size={16} />
            </ToggleGroupItem>
            
            <ToggleGroupItem 
              value="flowerOfLife" 
              className="data-[state=on]:bg-purple-600 data-[state=on]:text-white"
              aria-label="Flower of Life"
            >
              <Flower size={16} />
            </ToggleGroupItem>
            
            <ToggleGroupItem 
              value="torus" 
              className="data-[state=on]:bg-purple-600 data-[state=on]:text-white"
              aria-label="Torus"
            >
              <RotateCw size={16} />
            </ToggleGroupItem>
            
            <ToggleGroupItem 
              value="primeFlow" 
              className="data-[state=on]:bg-purple-600 data-[state=on]:text-white"
              aria-label="Prime Flow"
            >
              <Sparkles size={16} />
            </ToggleGroupItem>
            
            <ToggleGroupItem 
              value="chakraSpiral" 
              className="data-[state=on]:bg-purple-600 data-[state=on]:text-white"
              aria-label="Chakra Spiral"
            >
              <Dna size={16} />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      )}
    </div>
  );
};

export { AdvancedVisualizerManager };
