
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import KaleidoscopeVisualizer from './KaleidoscopeVisualizer';

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

  if (hasError) {
    return (
      <div className="w-full h-full bg-black/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
        <p className="text-white/50">Visualizer error occurred</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <KaleidoscopeVisualizer
        audioRef={audioRef}
        isAudioReactive={isAudioReactive}
        colorScheme={colorScheme}
        size={size}
      />
    </div>
  );
};

export { VisualizerManager };
