
import React from 'react';
import { VisualizerMode, ChakraType } from './sacred-geometries';
import CanvasBasedVisualizer from './CanvasBasedVisualizer';

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
  visualizerMode = 'flowerOfLife',
  enableControls = true,
  enablePostProcessing = false,
  intensity = 0,
  isActive = true
}) => {
  return (
    <CanvasBasedVisualizer 
      frequencyData={frequencyData}
      chakra={chakra}
      visualizerMode={visualizerMode}
      intensity={intensity}
      isActive={isActive}
    />
  );
};

export default SacredVisualizerCanvas;
