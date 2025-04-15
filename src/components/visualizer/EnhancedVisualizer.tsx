
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PrimeNumberVisualizer from './PrimeNumberVisualizer';
import FrequencyEqualizer from './FrequencyEqualizer';
import SacredVisualizerCanvas from './SacredVisualizerCanvas';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/button';
import { 
  WaveformIcon, 
  Hexagon, 
  Grid3X3, 
  CircleDashed 
} from 'lucide-react';

interface EnhancedVisualizerProps {
  frequencyData?: Uint8Array;
  chakra?: string;
  isPlaying?: boolean;
  showControls?: boolean;
}

const EnhancedVisualizer: React.FC<EnhancedVisualizerProps> = ({
  frequencyData,
  chakra = 'crown',
  isPlaying = false,
  showControls = true
}) => {
  const { visualizationMode, setVisualizationMode } = useAppStore();
  const [localFrequencyData, setLocalFrequencyData] = useState<Uint8Array | undefined>(frequencyData);
  
  // Update local data when props change
  useEffect(() => {
    if (frequencyData) {
      setLocalFrequencyData(frequencyData);
    }
  }, [frequencyData]);
  
  // Change visualization mode
  const changeMode = (mode: 'sacred' | 'prime' | 'equalizer' | 'flow') => {
    setVisualizationMode(mode);
  };
  
  return (
    <div className="w-full h-full relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div 
          key={visualizationMode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {visualizationMode === 'sacred' && (
            <SacredVisualizerCanvas 
              frequencyData={localFrequencyData}
              chakra={chakra as any}
              visualizerMode={isPlaying ? 'customPrimePulse' : 'flowerOfLife'}
            />
          )}
          
          {visualizationMode === 'prime' && (
            <PrimeNumberVisualizer
              frequencyData={localFrequencyData}
              chakra={chakra}
              isPlaying={isPlaying}
            />
          )}
          
          {visualizationMode === 'equalizer' && (
            <FrequencyEqualizer
              frequencyData={localFrequencyData || new Uint8Array()}
              barCount={48}
              chakraColor={chakra}
            />
          )}
          
          {visualizationMode === 'flow' && (
            <SacredVisualizerCanvas 
              frequencyData={localFrequencyData}
              chakra={chakra as any}
              visualizerMode="primeFlow"
            />
          )}
        </motion.div>
      </AnimatePresence>
      
      {showControls && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 bg-black/40 backdrop-blur-md rounded-full p-1">
          <Button
            variant="ghost"
            size="icon"
            className={`h-7 w-7 rounded-full ${visualizationMode === 'sacred' ? 'bg-white/20' : 'bg-transparent'}`}
            onClick={() => changeMode('sacred')}
            title="Sacred Geometry"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className={`h-7 w-7 rounded-full ${visualizationMode === 'prime' ? 'bg-white/20' : 'bg-transparent'}`}
            onClick={() => changeMode('prime')}
            title="Prime Number Visualizer"
          >
            <Hexagon className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className={`h-7 w-7 rounded-full ${visualizationMode === 'equalizer' ? 'bg-white/20' : 'bg-transparent'}`}
            onClick={() => changeMode('equalizer')}
            title="Frequency Equalizer"
          >
            <WaveformIcon className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className={`h-7 w-7 rounded-full ${visualizationMode === 'flow' ? 'bg-white/20' : 'bg-transparent'}`}
            onClick={() => changeMode('flow')}
            title="Energy Flow"
          >
            <CircleDashed className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default EnhancedVisualizer;
