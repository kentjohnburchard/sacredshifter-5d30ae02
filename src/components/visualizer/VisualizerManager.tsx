
import React from 'react';
import KaleidoscopeVisualizer from './KaleidoscopeVisualizer';

interface VisualizerManagerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isAudioReactive?: boolean;
  analyser?: AnalyserNode | null;
  colorScheme?: string;
  chakra?: string;
}

const VisualizerManager: React.FC<VisualizerManagerProps> = ({
  size = 'md',
  isAudioReactive = false,
  analyser = null,
  colorScheme = 'purple',
  chakra
}) => {
  return (
    <KaleidoscopeVisualizer
      size={size}
      isAudioReactive={isAudioReactive}
      analyser={analyser}
      colorScheme={colorScheme}
      chakra={chakra}
    />
  );
};

export { VisualizerManager };
