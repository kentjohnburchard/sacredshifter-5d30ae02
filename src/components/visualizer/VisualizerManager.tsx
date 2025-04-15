
import React from 'react';
import KaleidoscopeVisualizer from './KaleidoscopeVisualizer';

export interface VisualizerManagerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isAudioReactive?: boolean;
  colorScheme?: string;
  chakra?: string;
  frequency?: number;
}

const VisualizerManager: React.FC<VisualizerManagerProps> = ({
  size = 'md',
  isAudioReactive = false,
  colorScheme = 'purple',
  chakra,
  frequency
}) => {
  return (
    <KaleidoscopeVisualizer
      size={size}
      isAudioReactive={isAudioReactive}
      colorScheme={colorScheme}
      frequency={frequency}
    />
  );
};

export { VisualizerManager };
