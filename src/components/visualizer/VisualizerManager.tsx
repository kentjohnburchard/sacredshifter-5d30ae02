
import React, { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Only import SimpleFallbackVisualizer directly
import SimpleFallbackVisualizer from './SimpleFallbackVisualizer';

// Don't even lazy-load the KaleidoscopeVisualizer for now
// const KaleidoscopeVisualizer = lazy(() => import('./KaleidoscopeVisualizer'));

interface VisualizerManagerProps {
  type?: 'kaleidoscope' | 'simple';
  audioRef?: React.RefObject<HTMLAudioElement>;
  isAudioReactive?: boolean;
  colorScheme?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onError?: (error: Error) => void;
}

const VisualizerManager: React.FC<VisualizerManagerProps> = ({
  type = 'simple', // Default to simple visualizer
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

  // For now, always use the SimpleFallbackVisualizer to avoid Three.js errors
  return (
    <Suspense fallback={
      <Skeleton className="w-full h-full rounded-lg animate-pulse bg-purple-100/10" />
    }>
      <SimpleFallbackVisualizer colorScheme={colorScheme} />
    </Suspense>
  );
};

export { VisualizerManager };
