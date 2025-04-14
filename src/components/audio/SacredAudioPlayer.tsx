
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
  Activity
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
  
  // Effect to set the audio source when the component mounts
  useEffect(() => {
    if (audioUrl) {
      setAudioSource(audioUrl);
    }
  }, [audioUrl, setAudioSource]);
  
  // Effect to update the audio volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted, audioRef]);
  
  // Effect to notify the parent when the play state changes
  useEffect(() => {
    if (onPlayStateChange) {
      onPlayStateChange(isAudioPlaying);
    }
  }, [isAudioPlaying, onPlayStateChange]);

  // Effect to update visualizer mode based on theme
  useEffect(() => {
    if (liftTheVeil) {
      setVisualizerMode('rainbow');
    } else {
      setVisualizerMode(chakraToVisualMode(chakra) || 'purple');
    }
  }, [liftTheVeil, chakra]);
  
  // Effect to manage the active tooltip for prime numbers
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
  
  const handlePrimeSequence = (newPrimes: number[]) => {
    if (newPrimes.length > 0) {
      setPrimes(newPrimes);
    }
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

  return (
    <div ref={playerRef} className={`fixed bottom-4 right-4 z-50 ${isFullscreen ? 'fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm' : ''}`}>
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
        {/* Visualizer - CONTAINED WITHIN THE PLAYER */}
        <div 
          ref={visualizerRef}
          className={`absolute inset-0 z-0 transition-opacity duration-300 overflow-hidden ${
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
                <SacredGeometryCanvas colorScheme={visualizerMode} />
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
        
        {/* Player UI */}
        <div className={`
          relative z-10 flex flex-col 
          bg-gradient-to-r from-purple-900/90 to-indigo-800/90
          ${(!showVisualizer || !isAudioPlaying) ? 'bg-opacity-100' : 'bg-opacity-70 backdrop-blur-sm'}
          ${isFullscreen ? 'h-full' : ''}
          border border-purple-700
        `}>
          <div className="px-4 py-3 flex items-center justify-between bg-gradient-to-r from-purple-900/90 to-indigo-900/90">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-purple-200 mr-2"
                onClick={handleExpand}
                title={expanded ? "Minimize" : "Expand"}
              >
                {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <div className="truncate max-w-[200px]">
                <p className="font-medium text-sm text-purple-100 truncate">
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
                      className="h-7 w-7 text-white/70 hover:text-white"
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
                          className="h-7 w-7 text-white/70 hover:text-white"
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
                className="h-7 w-7 text-white/70 hover:text-white"
                onClick={handleFullscreen}
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="p-4 space-y-4 flex-1 flex flex-col">
            <div className="flex flex-wrap gap-2">
              {frequency && (
                <Badge variant="outline" className="border-purple-400/30 text-purple-200">
                  {frequency} Hz
                </Badge>
              )}
              {chakra && (
                <Badge variant="outline" className="border-purple-400/30 text-purple-200">
                  {chakra} Chakra
                </Badge>
              )}
              {detectedFrequency && (
                <Badge variant="outline" className="border-purple-400/30 text-white/80">
                  Current: ~{detectedFrequency} Hz
                </Badge>
              )}
              {primes.length > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge className="bg-purple-700/60 hover:bg-purple-700/80 cursor-help text-purple-100">
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
                  className="relative rounded-full bg-purple-600/20 p-8"
                >
                  <Button
                    variant="default"
                    size="icon"
                    className="h-16 w-16 rounded-full bg-purple-600 hover:bg-purple-700"
                    onClick={handlePlayPause}
                    disabled={!audioLoaded}
                  >
                    {isAudioPlaying ? (
                      <Pause className="h-8 w-8" />
                    ) : (
                      <Play className="h-8 w-8 ml-1" />
                    )}
                  </Button>
                  <div className="absolute inset-0 rounded-full bg-purple-600/10 animate-ping" />
                </motion.div>
              )}
              
              {isAudioPlaying && showVisualizer && (
                <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none">
                  <Badge 
                    className="px-3 py-1.5 flex items-center gap-2 bg-purple-700/50 text-purple-50 backdrop-blur-sm"
                  >
                    <Activity className="h-3 w-3 animate-pulse" />
                    <span>{visualizerMode === 'rainbow' ? 'Full Spectrum' : 'Chakra Flow'}</span>
                  </Badge>
                </div>
              )}
            </div>
            
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
            
            <div className="flex items-center justify-between">
              <Button
                variant="default"
                size="icon"
                className="h-10 w-10 rounded-full bg-purple-600 hover:bg-purple-700"
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
                  className="h-8 w-8 text-gray-300 hover:text-white"
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
