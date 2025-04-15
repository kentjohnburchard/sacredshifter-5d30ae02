
import React, { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const KaleidoscopeVisualizer = lazy(() => import('./KaleidoscopeVisualizer'));
const SimpleFallbackVisualizer = lazy(() => import('./SimpleFallbackVisualizer'));

interface VisualizerManagerProps {
  type?: 'kaleidoscope' | 'simple';
  audioRef?: React.RefObject<HTMLAudioElement>;
  isAudioReactive?: boolean;
  colorScheme?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onError?: (error: Error) => void;
}

const VisualizerManager: React.FC<VisualizerManagerProps> = ({
  type = 'kaleidoscope',
  audioRef,
  isAudioReactive = true,
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
    return <SimpleFallbackVisualizer colorScheme={colorScheme} />;
  }

  return (
    <Suspense fallback={
      <Skeleton className="w-full h-full rounded-lg animate-pulse bg-purple-100/10" />
    }>
      {type === 'kaleidoscope' ? (
        <KaleidoscopeVisualizer
          audioRef={audioRef}
          isAudioReactive={isAudioReactive}
          colorScheme={colorScheme}
          size={size}
        />
      ) : (
        <SimpleFallbackVisualizer colorScheme={colorScheme} />
      )}
    </Suspense>
  );
};

export default VisualizerManager;
