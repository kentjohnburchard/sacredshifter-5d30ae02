
import React, { useState, useEffect } from 'react';
import SacredAudioPlayer from './SacredAudioPlayer';
import { JourneyProps } from '@/types/journey';
import { useAppStore } from '@/store';
import { getChakraColorScheme } from '@/lib/chakraColors';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Zap, Sparkles, Grid3X3, Hexagon, Waves, CircleDashed, Flower } from 'lucide-react';
import CanvasAudioVisualizer from './CanvasAudioVisualizer';
import PixiJSVisualizer from '@/components/visualizer/PixiJSVisualizer'; 
import { isPrime } from '@/utils/primeCalculations';
import { toast } from 'sonner';

interface SacredAudioPlayerWithVisualizerProps {
  journey?: JourneyProps;
  audioUrl?: string;
  isFullscreen?: boolean;
  forcePlay?: boolean;
}

// Define the visualization modes as a union type that can be used throughout the app
export type VisualizerMode = 'bars' | 'wave' | 'circle' | 'particles' | 'primeFlow' | 'sacred' | 'flower' | 'pixel';

const SacredAudioPlayerWithVisualizer: React.FC<SacredAudioPlayerWithVisualizerProps> = ({
  journey,
  audioUrl,
  isFullscreen = false,
  forcePlay = false
}) => {
  const { audioData, isPlaying, setIsPlaying, setPrimeSequence, visualizationMode, setVisualizationMode } = useAppStore();
  const [showVisualizer, setShowVisualizer] = useState(true);
  const [visualizerMode, setVisualizerMode] = useState<VisualizerMode>('primeFlow');
  const [primeFrequencies, setPrimeFrequencies] = useState<number[]>([]);
  const [showPrimeIndicator, setShowPrimeIndicator] = useState(false);
  const [usePixiVisualizer, setUsePixiVisualizer] = useState(false);
  
  // Update local visualizer mode when global mode changes
  useEffect(() => {
    if (visualizationMode) {
      if (visualizationMode === 'pixel') {
        setUsePixiVisualizer(true);
      } else {
        setVisualizerMode(visualizationMode as VisualizerMode);
      }
    }
  }, [visualizationMode]);
  
  // Auto-play when forcePlay is true
  useEffect(() => {
    if (forcePlay && !isPlaying) {
      setTimeout(() => {
        setIsPlaying(true);
      }, 500);
    }
  }, [forcePlay, isPlaying, setIsPlaying]);

  // Determine which chakra to use (use first if multiple are provided)
  const chakra = journey?.chakras?.[0]?.toLowerCase() as any;
  
  // Define shouldShowVisualizer variable to control when visualizer is displayed
  const shouldShowVisualizer = 
    isPlaying === true &&
    showVisualizer === true;

  // Get chakra colors for styling
  const colorSchemeObj = journey?.chakras ? getChakraColorScheme(journey.chakras) : undefined;
  // Convert colorScheme to string if it's an object
  const colorScheme = typeof colorSchemeObj === 'string' ? colorSchemeObj : 
    (colorSchemeObj ? colorSchemeObj.primary : '#a855f7');
  
  const containerClass = `sacred-audio-player-with-visualizer w-full mx-auto rounded-xl overflow-hidden shadow-lg ${chakra ? `chakra-${chakra}` : ''}`;

  // Prime number detection logic
  useEffect(() => {
    if (!audioData || !isPlaying) return;
    
    // Analyze audio data for dominant frequencies
    // This is a simple implementation - in a real app you'd use FFT analysis
    const dominantFrequencies: number[] = [];
    
    // Find peaks in the frequency data (simple approach)
    const threshold = 200; // Adjust as needed
    for (let i = 0; i < audioData.length; i++) {
      if (audioData[i] > threshold) {
        // Map index to frequency (rough approximation)
        // Assuming audioData represents 0-20000Hz range
        const freq = Math.round(i * (20000 / audioData.length));
        if (isPrime(freq)) {
          dominantFrequencies.push(freq);
        }
      }
    }
    
    // Only take up to 10 frequencies to avoid overwhelming
    const significantPrimes = dominantFrequencies.slice(0, 10);
    
    if (significantPrimes.length > 0) {
      setPrimeFrequencies(significantPrimes);
      setPrimeSequence(significantPrimes);
      
      // Flash the prime indicator when primes are detected
      setShowPrimeIndicator(true);
      setTimeout(() => setShowPrimeIndicator(false), 800);
    }
  }, [audioData, isPlaying, setPrimeSequence]);

  const toggleVisualizer = () => {
    setShowVisualizer(prev => !prev);
  };

  const cycleVisualizerMode = () => {
    const modes: VisualizerMode[] = ['primeFlow', 'sacred', 'flower', 'bars', 'wave', 'circle', 'particles'];
    const currentIndex = modes.indexOf(visualizerMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setVisualizerMode(modes[nextIndex]);
    setUsePixiVisualizer(false);
    setVisualizationMode(modes[nextIndex] as any);
  };

  const togglePixiVisualizer = () => {
    const newValue = !usePixiVisualizer;
    setUsePixiVisualizer(newValue);
    
    if (newValue) {
      setVisualizationMode('pixel');
      toast.info("Using enhanced PixiJS visualizer");
    } else {
      setVisualizationMode('sacred');
    }
  };

  return (
    <div className={containerClass}>
      <div className="flex justify-between p-2 bg-gradient-to-r from-purple-900/20 to-indigo-900/20">
        {shouldShowVisualizer && (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={cycleVisualizerMode}
              className="text-white/80 hover:text-white flex items-center gap-1"
            >
              Change Visualization
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePixiVisualizer}
              className={`text-white/80 hover:text-white flex items-center gap-1 ${usePixiVisualizer ? 'bg-purple-500/20' : ''}`}
            >
              {usePixiVisualizer ? 'Standard' : 'Enhanced'} Visuals
            </Button>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleVisualizer}
          className="text-white/80 hover:text-white flex items-center gap-1"
        >
          {showVisualizer ? (
            <>
              <EyeOff className="h-4 w-4 mr-1" />
              Hide Visualizer
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-1" />
              Show Visualizer
            </>
          )}
        </Button>
      </div>
      
      {shouldShowVisualizer ? (
        <div className={`relative overflow-hidden shadow-inner ${isFullscreen ? 'h-[80vh]' : 'h-64'} rounded-t-xl`}>
          {/* Prime detected indicator */}
          {showPrimeIndicator && (
            <div className="absolute top-4 left-4 z-10 bg-purple-600/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-full flex items-center gap-1 animate-pulse">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Prime Frequencies Detected!</span>
            </div>
          )}
          
          {/* Visualization mode indicator */}
          <div className="absolute bottom-4 right-4 z-10 bg-black/40 backdrop-blur-sm text-white px-2 py-1 rounded-full flex items-center gap-1.5">
            {visualizationMode === 'sacred' && <Grid3X3 className="h-3.5 w-3.5" />}
            {visualizationMode === 'prime' && <Hexagon className="h-3.5 w-3.5" />}
            {visualizationMode === 'equalizer' && <Waves className="h-3.5 w-3.5" />}
            {visualizationMode === 'flow' && <CircleDashed className="h-3.5 w-3.5" />}
            {visualizationMode === 'flower' && <Flower className="h-3.5 w-3.5" />}
            <span className="text-xs font-medium capitalize">{visualizationMode}</span>
          </div>
          
          {usePixiVisualizer ? (
            <PixiJSVisualizer
              width={800}
              height={isFullscreen ? 600 : 300}
              colorScheme={colorScheme}
              isPlaying={isPlaying}
              isFullscreen={isFullscreen}
            />
          ) : (
            <CanvasAudioVisualizer 
              audioData={audioData}
              colorScheme={colorScheme}
              visualizerMode={visualizerMode}
              isPlaying={isPlaying}
              primeFrequencies={primeFrequencies}
              isFullscreen={isFullscreen}
            />
          )}
        </div>
      ) : (
        // Fallback when visualizer shouldn't be shown but we want to keep the space
        <div className="h-0 md:h-16 bg-gradient-to-r from-purple-900/20 to-indigo-900/20 rounded-t-xl transition-all duration-500 ease-in-out"></div>
      )}
      
      <SacredAudioPlayer 
        journey={journey}
        audioUrl={audioUrl || journey?.audioUrl}
        forcePlay={forcePlay}
      />
    </div>
  );
};

export default SacredAudioPlayerWithVisualizer;
