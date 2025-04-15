
import React, { useState } from 'react';
import { VisualizerMode, ChakraType, SacredGeometryType } from './sacred-geometries';
import CanvasBasedVisualizer from './CanvasBasedVisualizer';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2, ChevronRight } from 'lucide-react';

interface SacredVisualizerCanvasProps {
  frequencyData?: Uint8Array;
  chakra?: ChakraType;
  visualizerMode?: VisualizerMode;
  enableControls?: boolean;
  enablePostProcessing?: boolean;
  intensity?: number;
  isActive?: boolean;
}

const SacredVisualizerCanvas: React.FC<SacredVisualizerCanvasProps> = ({
  frequencyData,
  chakra = 'crown',
  visualizerMode: initialMode = 'flowerOfLife',
  enableControls = true,
  enablePostProcessing = false,
  intensity = 0,
  isActive = true
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentMode, setCurrentMode] = useState<VisualizerMode>(initialMode);
  
  // Define the available visualization modes for cycling
  const visualizationModes: SacredGeometryType[] = [
    'flowerOfLife',
    'merkaba', 
    'metatronCube', 
    'sriYantra', 
    'fibonacciSpiral',
    'chakraBeam',
    'primeFlow',
    'chakraSpiral'
  ];
  
  // Find current mode index and get next mode
  const cycleVisualizerMode = () => {
    const currentIndex = visualizationModes.indexOf(currentMode as SacredGeometryType);
    const nextIndex = (currentIndex + 1) % visualizationModes.length;
    setCurrentMode(visualizationModes[nextIndex]);
  };
  
  // Toggle fullscreen state
  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'w-full h-full'}`}>
      <CanvasBasedVisualizer 
        frequencyData={frequencyData}
        chakra={chakra}
        visualizerMode={currentMode}
        intensity={intensity}
        isActive={isActive}
      />
      
      {enableControls && (
        <div className="absolute bottom-3 right-3 flex space-x-2">
          <Button
            onClick={cycleVisualizerMode}
            variant="secondary"
            size="sm"
            className="bg-black/30 hover:bg-black/50 text-white border border-white/20"
          >
            <ChevronRight className="h-4 w-4 mr-1" />
            Change Visual
          </Button>
          
          <Button
            onClick={toggleFullscreen}
            variant="secondary"
            size="icon"
            className="bg-black/30 hover:bg-black/50 text-white border border-white/20"
          >
            {isFullscreen ? 
              <Minimize2 className="h-4 w-4" /> : 
              <Maximize2 className="h-4 w-4" />
            }
          </Button>
        </div>
      )}
    </div>
  );
};

export default SacredVisualizerCanvas;
