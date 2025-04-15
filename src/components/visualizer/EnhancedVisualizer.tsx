
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PrimeNumberVisualizer from './PrimeNumberVisualizer';
import FrequencyEqualizer from './FrequencyEqualizer';
import SacredVisualizerCanvas from './SacredVisualizerCanvas';
import { useAppStore } from '@/store';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';
import { SacredGeometryType } from './sacred-geometries';
import { 
  Waves, 
  Hexagon, 
  Grid3X3, 
  CircleDashed,
  Maximize2,
  Minimize2,
  Sparkles,
  Flower
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
  const { liftTheVeil } = useTheme();
  const [localFrequencyData, setLocalFrequencyData] = useState<Uint8Array | undefined>(frequencyData);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [intensity, setIntensity] = useState(0);
  
  useEffect(() => {
    if (frequencyData) {
      setLocalFrequencyData(frequencyData);
      
      // Calculate audio intensity for animations
      if (frequencyData.length > 0) {
        const sum = Array.from(frequencyData).reduce((acc, val) => acc + val, 0);
        const avg = sum / frequencyData.length;
        setIntensity(avg / 255); // Normalize to 0-1
      }
    }
  }, [frequencyData]);
  
  const changeMode = (mode: 'sacred' | 'prime' | 'equalizer' | 'flow' | 'flower') => {
    setVisualizationMode(mode);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Determine glow color based on consciousness mode
  const getGlowColor = () => {
    return liftTheVeil ? 'rgba(255, 105, 180, 0.4)' : 'rgba(138, 43, 226, 0.4)';
  };
  
  return (
    <div 
      className={`w-full h-full relative overflow-hidden rounded-xl ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}
      style={{
        boxShadow: `0 0 20px ${getGlowColor()}`,
        transition: 'box-shadow 0.5s ease'
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div 
          key={visualizationMode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {visualizationMode === 'sacred' && (
            <SacredVisualizerCanvas 
              frequencyData={localFrequencyData}
              chakra={chakra as any}
              visualizerMode="flowerOfLife"
              intensity={intensity}
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
              visualizerMode={"primeFlow" as SacredGeometryType}
              intensity={intensity}
            />
          )}
          
          {visualizationMode === 'flower' && (
            <SacredVisualizerCanvas 
              frequencyData={localFrequencyData}
              chakra={chakra as any}
              visualizerMode={"chakraSpiral" as SacredGeometryType}
              intensity={intensity}
            />
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Dynamic background effect */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle at center, transparent 0%, ${getGlowColor()} 100%)`,
          opacity: 0.2 + (intensity * 0.3),
          transition: 'opacity 0.5s ease'
        }}
      />
      
      {showControls && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 bg-black/60 backdrop-blur-md rounded-full p-1 z-10">
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 rounded-full ${visualizationMode === 'sacred' ? 
              (liftTheVeil ? 'bg-pink-500/30' : 'bg-purple-500/30') : 
              'bg-transparent'}`}
            onClick={() => changeMode('sacred')}
            title="Sacred Geometry"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 rounded-full ${visualizationMode === 'prime' ? 
              (liftTheVeil ? 'bg-pink-500/30' : 'bg-purple-500/30') : 
              'bg-transparent'}`}
            onClick={() => changeMode('prime')}
            title="Prime Number Visualizer"
          >
            <Hexagon className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 rounded-full ${visualizationMode === 'equalizer' ? 
              (liftTheVeil ? 'bg-pink-500/30' : 'bg-purple-500/30') : 
              'bg-transparent'}`}
            onClick={() => changeMode('equalizer')}
            title="Frequency Equalizer"
          >
            <Waves className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 rounded-full ${visualizationMode === 'flow' ? 
              (liftTheVeil ? 'bg-pink-500/30' : 'bg-purple-500/30') : 
              'bg-transparent'}`}
            onClick={() => changeMode('flow')}
            title="Energy Flow"
          >
            <CircleDashed className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 rounded-full ${visualizationMode === 'flower' ? 
              (liftTheVeil ? 'bg-pink-500/30' : 'bg-purple-500/30') : 
              'bg-transparent'}`}
            onClick={() => changeMode('flower')}
            title="Flower of Life"
          >
            <Flower className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 rounded-full ${liftTheVeil ? 'text-pink-400 hover:text-pink-300' : 'text-purple-400 hover:text-purple-300'}`}
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}
      
      {/* Consciousness mode indicator */}
      {liftTheVeil && (
        <div className="absolute top-2 right-2 z-10">
          <Sparkles className="h-4 w-4 text-pink-400 opacity-70" />
        </div>
      )}
    </div>
  );
};

export default EnhancedVisualizer;
