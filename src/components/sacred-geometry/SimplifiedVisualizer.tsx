
import React from 'react';
import { VisualizerManager } from '@/components/visualizer/VisualizerManager';

interface SimplifiedVisualizerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isAudioReactive?: boolean;
  analyser?: AnalyserNode | null;
  colorScheme?: string;
  chakra?: string;
}

const SimplifiedVisualizer: React.FC<SimplifiedVisualizerProps> = ({
  size = 'md',
  isAudioReactive = false,
  analyser,
  colorScheme = 'purple',
  chakra
}) => {
  // Map chakra to color scheme if provided
  let effectiveColorScheme = colorScheme;
  if (chakra) {
    switch (chakra.toLowerCase()) {
      case 'root': effectiveColorScheme = 'red'; break;
      case 'sacral': effectiveColorScheme = 'orange'; break;
      case 'solar plexus': effectiveColorScheme = 'yellow'; break;
      case 'heart': effectiveColorScheme = 'green'; break;
      case 'throat': effectiveColorScheme = 'blue'; break;
      case 'third eye': effectiveColorScheme = 'indigo'; break;
      case 'crown': effectiveColorScheme = 'purple'; break;
    }
  }

  return (
    <VisualizerManager
      isAudioReactive={isAudioReactive}
      colorScheme={effectiveColorScheme}
      size={size}
    />
  );
};

export default SimplifiedVisualizer;
