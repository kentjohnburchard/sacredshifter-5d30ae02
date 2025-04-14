
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
  Activity,
  X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useTheme } from '@/context/ThemeContext';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import useAudioAnalyzer from '@/hooks/useAudioAnalyzer';
import SacredGeometryCanvas from '@/components/visualizer/SacredGeometryCanvas';

interface SacredAudioPlayerProps {
  audioUrl?: string;
  title?: string;
  artist?: string;
  frequency?: number;
  chakra?: string;
  initiallyExpanded?: boolean;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

const VISUALIZER_MODES = [
  { value: 'purple', label: 'Fractal Flow' },
  { value: 'blue', label: 'Cosmic Ocean' },
  { value: 'rainbow', label: 'Full Spectrum' },
  { value: 'gold', label: 'Sacred Geometry' }
] as const;

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
  
  const { audioContext, analyser } = useAudioAnalyzer(audioRef.current);
  
  useEffect(() => {
    if (audioUrl) {
      setAudioSource(audioUrl);
    }
  }, [audioUrl, setAudioSource]);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted, audioRef]);
  
  useEffect(() => {
    if (onPlayStateChange) {
      onPlayStateChange(isAudioPlaying);
    }
  }, [isAudioPlaying, onPlayStateChange]);

  useEffect(() => {
    if (liftTheVeil) {
      setVisualizerMode('rainbow');
    } else {
      setVisualizerMode(chakraToVisualMode(chakra) || 'purple');
    }
  }, [liftTheVeil, chakra]);
  
  useEffect(() => {
    if (primes.length > 0) {
      const latestPrime = primes[primes.length - 1];
      
      if (latestPrime !== activeTooltipPrime) {
        setActiveTooltipPrime(latestPrime);
        
        if (tooltipTimerRef.current) {
          clearTimeout(tooltipTimerRef.current);
        }
        
        tooltipTimerRef.current = setTimeout(() => {
          setActiveTooltipPrime(null);
        }, 3000);
      }
    }
    
    return () => {
      if (tooltipTimerRef.current) {
        clearTimeout(tooltipTimerRef.current);
      }
    };
  }, [primes]);
  
  const handlePlayPause = () => {
    togglePlayPause();
  };
  
  const handleExpand = () => {
    setExpanded(!expanded);
    if (isFullscreen) {
      setIsFullscreen(false);
    }
  };
  
  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setExpanded(true);
  };
  
  const handleToggleVisualizer = () => {
    setShowVisualizer(!showVisualizer);
  };
  
  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const handleChangeVisualizer = () => {
    const modes = VISUALIZER_MODES.map(m => m.value);
    const currentIndex = modes.indexOf(visualizerMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setVisualizerMode(modes[nextIndex] as VisualizerMode);
  };
  
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };
  
  const handlePrimeSequence = (newPrime: number) => {
    setPrimes(prev => {
      // Only add if it's a new prime
      if (prev.length === 0 || prev[prev.length - 1] !== newPrime) {
        return [...prev, newPrime];
      }
      return prev;
    });
  };
  
  const handleFrequencyDetected = (freq: number) => {
    setDetectedFrequency(freq);
  };
  
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
  
  const getCurrentVisualizerLabel = (): string => {
    const currentMode = VISUALIZER_MODES.find(m => m.value === visualizerMode);
    return currentMode?.label || 'Visualizer';
  };

  // Dynamically compute background styles to prevent transparency issues
  const getBgStyle = () => {
    if (liftTheVeil) {
      return isFullscreen 
        ? 'bg-black' 
        : 'bg-gradient-to-r from-pink-900 to-purple-900 shadow-lg shadow-pink-900/50';
    } else {
      return isFullscreen 
        ? 'bg-black'
        : 'bg-gradient-to-r from-purple-900 to-indigo-900 shadow-lg shadow-purple-900/50';
    }
  };

  const handleClose = () => {
    // Stop audio playback
    if (isAudioPlaying) {
      togglePlayPause();
    }
    
    // Clear session storage
    sessionStorage.removeItem('currentAudio');
    sessionStorage.removeItem('isAudioPlaying');
    
    // Hide player - optional if you have a parent component that controls visibility
    if (playerRef.current) {
      playerRef.current.style.display = 'none';
    }
  };
  
  return (
    <div ref={playerRef} className={`fixed bottom-4 right-4 z-50 ${isFullscreen ? 'fixed inset-0 flex items-center justify-center bg-black' : ''}`}>
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
          overflow-hidden shadow-lg relative border border-white/10 ${getBgStyle()}
        `}
      >
        <div 
          ref={visualizerRef}
          className={`absolute inset-0 z-0 overflow-hidden ${
            showVisualizer && isAudioPlaying 
              ? 'opacity-100' 
              : 'opacity-0'
          }`}
        >
          <AnimatePresence>
            {showVisualizer && isAudioPlaying && (
              <motion.div 
                key="visualizer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full"
              >
                <SacredGeometryCanvas 
                  audioAnalyser={analyser} 
                  colorScheme={visualizerMode}
                  chakra={chakra}
                  frequency={frequency}
                  onPrimeDetected={handlePrimeSequence}
                  onFrequencyDataAvailable={(data) => {
                    // Calculate approximate dominant frequency if needed
                    if (data.length > 0) {
                      const max = Math.max(...data);
                      const idx = data.indexOf(max);
                      // Rough approximation: idx * (22050 / data.length)
                      const approximateFreq = Math.round(idx * (22050 / data.length));
                      if (approximateFreq > 20) { // Only update for audible frequencies
                        handleFrequencyDetected(approximateFreq);
                      }
                    }
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <AnimatePresence>
          {activeTooltipPrime && isAudioPlaying && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-14 left-1/2 transform -translate-x-1/2 z-50
                px-4 py-2 rounded-full backdrop-blur-sm shadow-lg text-white bg-black/70"
            >
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full animate-pulse bg-purple-400"></div>
                <span className="text-xs font-medium">Prime Harmonic Activated: {activeTooltipPrime}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="relative z-10 flex flex-col h-full border-0">
          <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white mr-2"
                onClick={handleExpand}
                title={expanded ? "Minimize" : "Expand"}
              >
                {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <div className="truncate max-w-[200px]">
                <p className="font-medium text-sm text-white truncate">
                  {title}
                </p>
                {artist && (
                  <p className="text-xs text-white opacity-80 truncate">{artist}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {expanded && (
                <>
                  {isAudioPlaying && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-white hover:bg-white/10"
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
                          className="h-7 w-7 text-white hover:bg-white/10"
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
                className="h-7 w-7 text-white hover:bg-white/10"
                onClick={handleFullscreen}
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              
              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-white hover:text-red-400 hover:bg-white/10"
                onClick={handleClose}
                title="Close Player"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="p-4 space-y-4 flex-1 flex flex-col">
            <div className="flex flex-wrap gap-2">
              {frequency && (
                <Badge variant="outline" className="text-white border-white/30 bg-white/10">
                  {frequency} Hz
                </Badge>
              )}
              {chakra && (
                <Badge variant="outline" className="text-white border-white/30 bg-white/10">
                  {chakra} Chakra
                </Badge>
              )}
              {detectedFrequency && (
                <Badge variant="outline" className="text-white border-white/30 bg-white/10">
                  Current: ~{detectedFrequency} Hz
                </Badge>
              )}
              {primes.length > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge className="bg-purple-600 text-white cursor-help">
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
            
            <div className={`flex-1 flex flex-col justify-center items-center min-h-[200px] ${isFullscreen ? 'min-h-[60vh]' : ''}`}>
              {(!isAudioPlaying || !showVisualizer) && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative rounded-full bg-opacity-20 p-8"
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
                  <div className={`absolute inset-0 rounded-full ${liftTheVeil ? 'bg-pink-500' : 'bg-purple-500'} opacity-10 animate-ping`} />
                </motion.div>
              )}
              
              {isAudioPlaying && showVisualizer && (
                <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none">
                  <Badge 
                    className={`px-3 py-1.5 flex items-center gap-2 ${liftTheVeil ? 'bg-pink-600' : 'bg-purple-600'} text-white opacity-90 backdrop-blur-sm`}
                  >
                    <Activity className="h-3 w-3 animate-pulse" />
                    <span>{getCurrentVisualizerLabel()}</span>
                  </Badge>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-white">
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
            
            <div className="flex items-center justify-between">
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
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white opacity-80 hover:opacity-100"
                  onClick={handleToggleMute}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                
                <Slider
                  value={[isMuted ? 0 : volume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={(values) => setVolume(values[0])}
                  className="w-[100px]"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SacredAudioPlayer;
