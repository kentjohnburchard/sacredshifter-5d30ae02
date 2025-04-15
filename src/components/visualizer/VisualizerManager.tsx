
import React, { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface VisualizerManagerProps {
  type?: 'kaleidoscope' | 'simple';
  audioRef?: React.RefObject<HTMLAudioElement>;
  isAudioReactive?: boolean;
  colorScheme?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onError?: (error: Error) => void;
}

const VisualizerManager: React.FC<VisualizerManagerProps> = ({
  audioRef,
  isAudioReactive = false,
  colorScheme = 'purple',
  size = 'md',
  onError
}) => {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Visualizer error:', error);
      setHasError(true);
      if (onError) {
        onError(error.error);
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, [onError]);

  // Using a simple visualizer placeholder instead of any complex components
  // We're completely avoiding KaleidoscopeVisualizer for now until we resolve the issues
  
  const baseColor = colorScheme === 'purple' ? '#9370db' : 
                    colorScheme === 'blue' ? '#1e90ff' :
                    colorScheme === 'pink' ? '#ff69b4' : '#9370db';

  const sizeClass = {
    'sm': 'h-40',
    'md': 'h-64',
    'lg': 'h-96',
    'xl': 'h-screen'
  }[size] || 'h-64';

  if (hasError) {
    return (
      <div className="w-full h-full bg-black/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
        <p className="text-white/50">Visualizer error occurred</p>
      </div>
    );
  }

  return (
    <div className={`w-full ${sizeClass} overflow-hidden rounded-lg bg-gradient-to-br from-black/40 to-black/10 backdrop-blur-sm flex items-center justify-center`}>
      <div 
        className="w-24 h-24 rounded-full animate-pulse" 
        style={{ backgroundColor: `${baseColor}40` }}
      />
    </div>
  );
};

export { VisualizerManager };
