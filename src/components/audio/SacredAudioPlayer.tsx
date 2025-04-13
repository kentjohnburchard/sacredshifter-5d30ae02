
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Eye, 
  EyeOff,
  BarChart4,
  Waveform
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useTheme } from '@/context/ThemeContext';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import useAudioAnalyzer from '@/hooks/useAudioAnalyzer';
import FractalAudioVisualizer from './FractalAudioVisualizer';

interface SacredAudioPlayerProps {
  audioUrl?: string;
  title?: string;
  artist?: string;
  frequency?: number;
  chakra?: string;
  initiallyExpanded?: boolean;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

// Array of visualizer modes with labels
const VISUALIZER_MODES = [
  { value: 'purple', label: 'Fractal Flow' },
  { value: 'blue', label: 'Cosmic Ocean' },
  { value: 'rainbow', label: 'Full Spectrum' },
  { value: 'gold', label: 'Sacred Geometry' }
] as const;

// Type for visualizer modes
type VisualizerMode = typeof VISUALIZER_MODES[number]['value'];

const SacredAudioPlayer: React.FC<SacredAudioPlayerProps> = ({
  audioUrl,
  title = 'Sacred Sound',
  artist,
  frequency,
  chakra,
  initiallyExpanded = false,
  onPlayStateChange
}) => {
  const { liftTheVeil } = useTheme();
  const [expanded, setExpanded] = useState(initiallyExpanded);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(true);
  const [primes, setPrimes] = useState<number[]>([]);
  const [detectedFrequency, setDetectedFrequency] = useState<number | null>(null);
  const [visualizerMode, setVisualizerMode] = useState<VisualizerMode>(
    liftTheVeil ? 'rainbow' : chakraToVisualMode(chakra) || 'purple'
  );
  const [activeTooltipPrime, setActiveTooltipPrime] = useState<number | null>(null);
  
  const playerRef = useRef<HTMLDivElement>(null);
  const visualizerRef = useRef<HTMLDivElement>(null);
  const tooltipTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const {
    isAudioPlaying,
    duration,
    currentAudioTime,
    togglePlayPause,
    seekTo,
    setAudioSource,
    audioRef,
    audioLoaded,
  } = useAudioPlayer();
  
  // Get analyzer for visualization
  const { audioContext, analyser } = useAudioAnalyzer(audioRef.current);
  
  // Update audio source when url changes
  useEffect(() => {
    if (audioUrl) {
      setAudioSource(audioUrl);
    }
  }, [audioUrl, setAudioSource]);
  
  // Apply volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted, audioRef]);
  
  // Notify parent component of play state changes
  useEffect(() => {
    if (onPlayStateChange) {
      onPlayStateChange(isAudioPlaying);
    }
  }, [isAudioPlaying, onPlayStateChange]);

  // Update visualizer mode when theme changes
  useEffect(() => {
    if (liftTheVeil) {
      setVisualizerMode('rainbow');
    } else {
      setVisualizerMode(chakraToVisualMode(chakra) || 'purple');
    }
  }, [liftTheVeil, chakra]);
  
  // Setup for tooltip display when prime numbers are detected
  useEffect(() => {
    if (primes.length > 0) {
      // Get the last detected prime
      const latestPrime = primes[primes.length - 1];
      
      // Only show tooltip for new primes
      if (latestPrime !== activeTooltipPrime) {
        setActiveTooltipPrime(latestPrime);
        
        // Clear any existing timer
        if (tooltipTimerRef.current) {
          clearTimeout(tooltipTimerRef.current);
        }
        
        // Set timer to hide tooltip after 3 seconds
        tooltipTimerRef.current = setTimeout(() => {
          setActiveTooltipPrime(null);
        }, 3000);
      }
    }
    
    // Cleanup timer on unmount
    return () => {
      if (tooltipTimerRef.current) {
        clearTimeout(tooltipTimerRef.current);
      }
    };
  }, [primes]);
  
  // Toggle playback
  const handlePlayPause = () => {
    togglePlayPause();
  };
  
  // Toggle expanded view
  const handleExpand = () => {
    setExpanded(!expanded);
    if (isFullscreen) {
      setIsFullscreen(false);
    }
  };
  
  // Toggle fullscreen view
  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setExpanded(true); // Always expand when toggling fullscreen
  };
  
  // Toggle visualizer visibility
  const handleToggleVisualizer = () => {
    setShowVisualizer(!showVisualizer);
  };
  
  // Toggle mute
  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  // Change visualizer mode
  const handleChangeVisualizer = () => {
    const modes = VISUALIZER_MODES.map(m => m.value);
    const currentIndex = modes.indexOf(visualizerMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setVisualizerMode(modes[nextIndex] as VisualizerMode);
  };
  
  // Format time display (minutes:seconds)
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };
  
  // Handle prime sequence updates from visualizer
  const handlePrimeSequence = (newPrimes: number[]) => {
    if (newPrimes.length > 0) {
      setPrimes(newPrimes);
    }
  };
  
  // Handle frequency detection updates from visualizer
  const handleFrequencyDetected = (freq: number) => {
    setDetectedFrequency(freq);
  };
  
  // Map chakra to visualizer mode
  function chakraToVisualMode(chakraName?: string): VisualizerMode | undefined {
    if (!chakraName) return undefined;
    
    switch (chakraName.toLowerCase()) {
      case 'root': return 'purple';
      case 'sacral': 
      case 'solar plexus': return 'gold';
      case 'heart': return 'purple';
      case 'throat':
      case 'third eye': return 'blue';
      case 'crown': return 'rainbow';
      default: return undefined;
    }
  }
  
  // Get current visualizer mode label
  const getCurrentVisualizerLabel = (): string => {
    const currentMode = VISUALIZER_MODES.find(m => m.value === visualizerMode);
    return currentMode?.label || 'Visualizer';
  };
  
  // Determine chakra-specific color classes
  const getChakraColorClasses = (): {bg: string, text: string, border: string} => {
    if (liftTheVeil) {
      return {
        bg: 'from-pink-900/90 to-purple-900/90',
        text: 'text-pink-100',
        border: 'border-pink-800'
      };
    }
    
    if (!chakra) {
      return {
        bg: 'from-indigo-900/90 to-purple-900/90',
        text: 'text-purple-100',
        border: 'border-purple-800'
      };
    }
    
    // Return chakra-specific colors
    switch(chakra.toLowerCase()) {
      case 'root':
        return {
          bg: 'from-red-900/90 to-red-700/90',
          text: 'text-red-100',
          border: 'border-red-800'
        };
      case 'sacral':
        return {
          bg: 'from-orange-900/90 to-orange-700/90',
          text: 'text-orange-100',
          border: 'border-orange-800'
        };
      case 'solar plexus':
        return {
          bg: 'from-amber-900/90 to-yellow-700/90',
          text: 'text-amber-100',
          border: 'border-amber-800'
        };
      case 'heart':
        return {
          bg: 'from-green-900/90 to-emerald-700/90',
          text: 'text-green-100',
          border: 'border-green-800'
        };
      case 'throat':
        return {
          bg: 'from-blue-900/90 to-blue-700/90',
          text: 'text-blue-100',
          border: 'border-blue-800'
        };
      case 'third eye':
        return {
          bg: 'from-indigo-900/90 to-violet-700/90',
          text: 'text-indigo-100',
          border: 'border-indigo-800'
        };
      case 'crown':
        return {
          bg: 'from-violet-900/90 to-purple-700/90',
          text: 'text-violet-100',
          border: 'border-violet-800'
        };
      default:
        return {
          bg: 'from-indigo-900/90 to-purple-900/90',
          text: 'text-purple-100',
          border: 'border-purple-800'
        };
    }
  };
  
  const colors = getChakraColorClasses();
  
  return (
    <div ref={playerRef} className={`relative z-40 ${isFullscreen ? 'fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm' : ''}`}>
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`
          ${isFullscreen 
            ? 'w-full h-full max-w-full rounded-none' 
            : expanded 
              ? 'w-full md:w-[600px] rounded-lg' 
              : 'w-full max-w-[320px] rounded-lg'
          } 
          overflow-hidden shadow-lg relative
        `}
      >
        {/* Visualizer container - positioned absolutely to fill the player */}
        <div 
          ref={visualizerRef}
          className={`absolute inset-0 z-0 transition-opacity duration-300 ${
            showVisualizer && isAudioPlaying 
              ? 'opacity-100' 
              : 'opacity-0'
          }`}
        >
          <AnimatePresence>
            {showVisualizer && isAudioPlaying && audioContext && analyser && (
              <motion.div 
                key="visualizer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full"
              >
                <FractalAudioVisualizer 
                  audioContext={audioContext}
                  analyser={analyser}
                  isVisible={true}
                  colorScheme={visualizerMode}
                  pauseWhenStopped={false}
                  frequency={frequency}
                  chakra={chakra}
                  onPrimeSequence={handlePrimeSequence}
                  onFrequencyDetected={handleFrequencyDetected}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Prime number tooltip */}
        <AnimatePresence>
          {activeTooltipPrime && isAudioPlaying && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`absolute top-14 left-1/2 transform -translate-x-1/2 z-50
                px-4 py-2 rounded-full 
                ${liftTheVeil 
                  ? 'bg-pink-600/80 text-pink-50' 
                  : 'bg-purple-600/80 text-purple-50'} 
                backdrop-blur-sm shadow-lg`}
            >
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full animate-pulse ${liftTheVeil ? 'bg-pink-300' : 'bg-purple-300'}`}></div>
                <span className="text-xs font-medium">Prime Harmonic Activated: {activeTooltipPrime}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Player UI - with gradient background */}
        <div className={`
          relative z-10 flex flex-col bg-gradient-to-r ${colors.bg}
          ${(!showVisualizer || !isAudioPlaying) ? 'bg-opacity-100' : 'bg-opacity-50 backdrop-blur-sm'}
          ${isFullscreen ? 'h-full' : ''}
          border ${colors.border}
        `}>
          {/* Player header */}
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${colors.text} mr-2`}
                onClick={handleExpand}
                title={expanded ? "Minimize" : "Expand"}
              >
                {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <div className="truncate max-w-[200px]">
                <p className={`font-medium text-sm ${colors.text} truncate`}>
                  {title}
                </p>
                {artist && (
                  <p className="text-xs text-gray-300 truncate">{artist}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {expanded && (
                <>
                  {isAudioPlaying && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-7 w-7 text-white/70 hover:text-white`}
                      onClick={handleToggleVisualizer}
                      title={showVisualizer ? "Hide visualizer" : "Show visualizer"}
                    >
                      {showVisualizer ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  )}
                  
                  {isAudioPlaying && showVisualizer && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-7 w-7 text-white/70 hover:text-white`}
                          onClick={handleChangeVisualizer}
                          title="Change visualizer style"
                        >
                          <BarChart4 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Mode: {getCurrentVisualizerLabel()}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                className={`h-7 w-7 text-white/70 hover:text-white`}
                onClick={handleFullscreen}
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          {/* Player content - only visible when expanded */}
          {expanded && (
            <div className="p-4 space-y-4 flex-1 flex flex-col">
              {/* Frequency and chakra info */}
              <div className="flex flex-wrap gap-2">
                {frequency && (
                  <Badge variant="outline" className={`border-white/20 ${colors.text}`}>
                    {frequency} Hz
                  </Badge>
                )}
                {chakra && (
                  <Badge variant="outline" className={`border-white/20 ${colors.text}`}>
                    {chakra} Chakra
                  </Badge>
                )}
                {detectedFrequency && (
                  <Badge variant="outline" className="border-white/20 text-white/80">
                    Current: ~{detectedFrequency} Hz
                  </Badge>
                )}
                {primes.length > 0 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge className={`bg-white/20 hover:bg-white/30 cursor-help ${colors.text}`}>
                        {primes.length} Primes Found
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-sm">Prime Harmonics Detected: {primes.slice(-5).join(', ')}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Prime frequencies align with sacred harmonic fields for resonance with natural consciousness
                      </p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>

              {/* Audio player center area */}
              <div className={`flex-1 flex flex-col justify-center items-center min-h-[200px] ${isFullscreen ? 'min-h-[60vh]' : ''}`}>
                {/* Center play/pause button (shown when not playing or visualizer hidden) */}
                {(!isAudioPlaying || !showVisualizer) && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`relative rounded-full ${liftTheVeil ? 'bg-pink-600/20' : 'bg-purple-600/20'} p-8`}
                  >
                    <Button
                      variant="default"
                      size="icon"
                      className={`h-16 w-16 rounded-full ${liftTheVeil ? 'bg-pink-600 hover:bg-pink-700' : 'bg-purple-600 hover:bg-purple-700'}`}
                      onClick={handlePlayPause}
                      disabled={!audioLoaded}
                    >
                      {isAudioPlaying ? (
                        <Pause className="h-8 w-8" />
                      ) : (
                        <Play className="h-8 w-8 ml-1" />
                      )}
                    </Button>
                    <div className={`absolute inset-0 rounded-full ${liftTheVeil ? 'bg-pink-600/10' : 'bg-purple-600/10'} animate-ping`} />
                  </motion.div>
                )}
                
                {/* Visualizer player status indicator (minimized visualizer representation) */}
                {isAudioPlaying && showVisualizer && (
                  <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none">
                    <Badge 
                      className={`px-3 py-1.5 flex items-center gap-2 ${
                        liftTheVeil 
                          ? 'bg-pink-700/50 text-pink-50' 
                          : 'bg-purple-700/50 text-purple-50'
                      } backdrop-blur-sm`}
                    >
                      <Waveform className="h-3 w-3 animate-pulse" />
                      <span>{visualizerMode === 'rainbow' ? 'Full Spectrum' : 'Chakra Flow'}</span>
                    </Badge>
                  </div>
                )}
              </div>

              {/* Audio controls */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-300">
                  <span>{formatTime(currentAudioTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <Slider
                  value={[currentAudioTime]}
                  max={duration || 100}
                  step={0.1}
                  onValueChange={(values) => seekTo(values[0])}
                  className="w-full"
                />
              </div>

              {/* Bottom controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white/70 hover:text-white"
                    onClick={handleToggleMute}
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>
                  
                  <div className="w-20">
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      max={1}
                      step={0.01}
                      onValueChange={(values) => {
                        setVolume(values[0]);
                        if (values[0] > 0 && isMuted) {
                          setIsMuted(false);
                        }
                      }}
                    />
                  </div>
                </div>
                
                <Button
                  variant="default"
                  size="sm"
                  className={`rounded-full ${liftTheVeil ? 'bg-pink-600 hover:bg-pink-700' : 'bg-purple-600 hover:bg-purple-700'}`}
                  onClick={handlePlayPause}
                  disabled={!audioLoaded}
                >
                  {isAudioPlaying ? (
                    <Pause className="h-4 w-4 mr-2" />
                  ) : (
                    <Play className="h-4 w-4 mr-2 ml-0.5" />
                  )}
                  {isAudioPlaying ? 'Pause' : 'Play'}
                </Button>
              </div>
            </div>
          )}
          
          {/* Minimized player controls - only visible when not expanded */}
          {!expanded && (
            <div className="p-2 flex items-center justify-center">
              {/* Small pulsing waveform when playing */}
              {isAudioPlaying && showVisualizer && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                  <div className={`w-8 h-8 ${liftTheVeil ? 'text-pink-400' : 'text-purple-400'} opacity-60`}>
                    <Waveform className="w-full h-full animate-pulse" />
                  </div>
                </div>
              )}
              
              {/* Play/pause button */}
              <Button
                variant="default"
                size="icon"
                className={`h-10 w-10 rounded-full ${liftTheVeil ? 'bg-pink-600 hover:bg-pink-700' : 'bg-purple-600 hover:bg-purple-700'}`}
                onClick={handlePlayPause}
                disabled={!audioLoaded}
              >
                {isAudioPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" />
                )}
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SacredAudioPlayer;
