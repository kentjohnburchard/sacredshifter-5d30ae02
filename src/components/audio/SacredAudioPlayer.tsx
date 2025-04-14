
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
  X,
  SkipBack,
  SkipForward
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useTheme } from '@/context/ThemeContext';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import useAudioAnalyzer from '@/hooks/useAudioAnalyzer';
import FrequencyEqualizer from '../visualizer/FrequencyEqualizer';

const VISUALIZER_MODES = [
  { value: 'purple', label: 'Purple Flow' },
  { value: 'blue', label: 'Blue Ocean' },
  { value: 'rainbow', label: 'Rainbow' },
  { value: 'gold', label: 'Golden Light' }
] as const;

type VisualizerMode = typeof VISUALIZER_MODES[number]['value'];

interface SacredAudioPlayerProps {
  initiallyExpanded?: boolean;
}

const SacredAudioPlayer = ({ initiallyExpanded = false }: SacredAudioPlayerProps) => {
  const { liftTheVeil } = useTheme();
  const [expanded, setExpanded] = useState(initiallyExpanded);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(true);
  const [primes, setPrimes] = useState<number[]>([]);
  const [detectedFrequency, setDetectedFrequency] = useState<number | null>(null);
  const [visualizerMode, setVisualizerMode] = useState<VisualizerMode>(
    liftTheVeil ? 'rainbow' : 'purple'
  );
  const [activeTooltipPrime, setActiveTooltipPrime] = useState<number | null>(null);
  const [showEqualizer, setShowEqualizer] = useState(true);
  const [frequencyData, setFrequencyData] = useState<Uint8Array | null>(null);
  const onEndedCallbackRef = useRef<(() => void) | null>(null);
  const audioInitializedRef = useRef(false);
  
  const playerRef = useRef<HTMLDivElement>(null);
  const visualizerRef = useRef<HTMLDivElement>(null);
  const tooltipTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioDataRef = useRef<Uint8Array | null>(null);
  
  // State to track the current playing audio info
  const [currentAudio, setCurrentAudio] = useState<{
    title: string;
    artist?: string;
    imageUrl?: string;
    source: string;
    frequency?: number;
    chakra?: string;
  } | null>(null);
  
  const {
    isAudioPlaying,
    duration,
    currentAudioTime,
    togglePlayPause,
    seekTo,
    setAudioSource,
    audioRef,
    audioLoaded,
    audioError,
  } = useAudioPlayer();
  
  const { audioContext, analyser } = useAudioAnalyzer(audioRef);

  // Set up the audio ended event listener
  useEffect(() => {
    if (!audioRef.current) return;
    
    const handleAudioEnded = () => {
      if (onEndedCallbackRef.current) {
        onEndedCallbackRef.current();
      }
    };
    
    // Remove any existing ended listeners to prevent duplicates
    audioRef.current.removeEventListener('ended', handleAudioEnded);
    // Add the listener
    audioRef.current.addEventListener('ended', handleAudioEnded);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleAudioEnded);
      }
    };
  }, [audioRef.current]);
  
  // Listen for custom events to control the global player
  useEffect(() => {
    const handlePlayAudio = (event: CustomEvent) => {
      const { audioInfo } = event.detail;
      if (!audioInfo || !audioInfo.source) return;
      
      // Check if we're trying to play the same audio that's already playing
      const isSameSource = currentAudio?.source === audioInfo.source;
      if (isSameSource && isAudioPlaying) {
        console.log("Already playing this audio, skipping replay");
        return;
      }
      
      // Update current audio info
      setCurrentAudio(audioInfo);
      setAudioSource(audioInfo.source);
      setExpanded(true);
      
      // Broadcast the audio info change
      const infoChangeEvent = new CustomEvent('audioInfoChange', {
        detail: { audioInfo }
      });
      window.dispatchEvent(infoChangeEvent);
      
      // Auto play after source is set
      setTimeout(() => {
        if (!isAudioPlaying) {
          togglePlayPause();
        }
      }, 100);
    };

    const handleTogglePlayPause = () => {
      togglePlayPause();
    };

    const handleCallbackChange = (event: CustomEvent) => {
      const { callback } = event.detail;
      onEndedCallbackRef.current = callback;
    };

    // Add event listeners with type assertion
    window.addEventListener('playAudio' as any, handlePlayAudio as EventListener);
    window.addEventListener('togglePlayPause' as any, handleTogglePlayPause as EventListener);
    window.addEventListener('audioCallbackChange' as any, handleCallbackChange as EventListener);

    return () => {
      window.removeEventListener('playAudio' as any, handlePlayAudio as EventListener);
      window.removeEventListener('togglePlayPause' as any, handleTogglePlayPause as EventListener);
      window.removeEventListener('audioCallbackChange' as any, handleCallbackChange as EventListener);
    };
  }, [setAudioSource, togglePlayPause, isAudioPlaying, currentAudio]);

  // Store audio state in session storage to persist between page navigations
  useEffect(() => {
    const storeAudioInfo = () => {
      if (currentAudio) {
        sessionStorage.setItem('currentAudio', JSON.stringify(currentAudio));
        sessionStorage.setItem('isAudioPlaying', isAudioPlaying.toString());
      }
    };

    // Store when audio changes or play state changes
    storeAudioInfo();
  }, [currentAudio, isAudioPlaying]);

  // Restore audio state from session storage on mount
  useEffect(() => {
    // Only run once on initial mount
    if (!audioInitializedRef.current) {
      const storedAudio = sessionStorage.getItem('currentAudio');
      const storedIsPlaying = sessionStorage.getItem('isAudioPlaying');
      
      if (storedAudio) {
        try {
          const audioInfo = JSON.parse(storedAudio);
          // Only restore if we don't already have current audio
          if (!currentAudio && audioInfo) {
            setCurrentAudio(audioInfo);
            setAudioSource(audioInfo.source);
            setExpanded(true);
            
            // If it was playing before, resume playback
            if (storedIsPlaying === 'true' && !isAudioPlaying) {
              // Delay to ensure audio source is set
              setTimeout(() => togglePlayPause(), 100);
            }
          }
        } catch (error) {
          console.error('Error restoring audio state:', error);
        }
      }
      
      audioInitializedRef.current = true;
    }
  }, []);

  // Dispatch audio state change events when isAudioPlaying changes
  useEffect(() => {
    const event = new CustomEvent('audioStateChange', {
      detail: { isPlaying: isAudioPlaying }
    });
    window.dispatchEvent(event);
  }, [isAudioPlaying]);
  
  useEffect(() => {
    setVisualizerMode(liftTheVeil ? 'rainbow' : 'purple');
  }, [liftTheVeil]);
  
  // Effect for audio data processing and spectrum analysis
  useEffect(() => {
    if (!analyser || !isAudioPlaying || !showVisualizer) {
      return;
    }
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    let animationFrameId: number;
    let primeFoundThisFrame = false;
    let lastDetectedPrime = 0;
    
    // Helper to check if a number is prime
    const isPrime = (num: number): boolean => {
      if (num <= 1) return false;
      if (num <= 3) return true;
      if (num % 2 === 0 || num % 3 === 0) return false;
      
      let i = 5;
      while (i * i <= num) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
        i += 6;
      }
      return true;
    };
    
    const updateData = () => {
      analyser.getByteFrequencyData(dataArray);
      
      // Create a copy of the data for components that need it
      const dataCopy = new Uint8Array(dataArray);
      audioDataRef.current = dataCopy;
      setFrequencyData(dataCopy);
      
      // Find dominant frequency for visualization
      let maxValue = 0;
      let maxIndex = 0;
      
      for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i] > maxValue) {
          maxValue = dataArray[i];
          maxIndex = i;
        }
      }
      
      if (audioContext && maxValue > 20) { // Threshold to avoid background noise
        const nyquist = audioContext.sampleRate / 2;
        const estimatedFrequency = Math.round(maxIndex * nyquist / dataArray.length);
        
        setDetectedFrequency(estimatedFrequency);
        
        // Check for prime numbers in frequency ranges that matter
        if (estimatedFrequency > 20 && estimatedFrequency < 1000) {
          // Round to nearest integer and check if prime
          const roundedFreq = Math.round(estimatedFrequency);
          
          if (isPrime(roundedFreq) && roundedFreq !== lastDetectedPrime) {
            lastDetectedPrime = roundedFreq;
            setPrimes(prev => [...prev, roundedFreq]);
            
            // Set the active tooltip prime
            setActiveTooltipPrime(roundedFreq);
            
            // Clear any existing tooltip timer
            if (tooltipTimerRef.current) {
              clearTimeout(tooltipTimerRef.current);
            }
            
            // Set new timer to hide tooltip
            tooltipTimerRef.current = setTimeout(() => {
              setActiveTooltipPrime(null);
            }, 3000);
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(updateData);
    };
    
    updateData();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (tooltipTimerRef.current) {
        clearTimeout(tooltipTimerRef.current);
      }
    };
  }, [analyser, isAudioPlaying, showVisualizer, audioContext]);
  
  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted, audioRef]);

  // Format time display (minutes:seconds)
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0];
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const toggleVisualizer = () => {
    setShowVisualizer(!showVisualizer);
  };
  
  const changeVisualizerMode = () => {
    const modes = VISUALIZER_MODES.map(m => m.value);
    const currentIndex = modes.indexOf(visualizerMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setVisualizerMode(modes[nextIndex]);
  };

  const getCurrentVisualizerLabel = (): string => {
    const currentMode = VISUALIZER_MODES.find(m => m.value === visualizerMode);
    return currentMode?.label || 'Visualizer';
  };
  
  const handleClose = () => {
    if (isAudioPlaying) {
      togglePlayPause(); // Pause the audio
    }
    setCurrentAudio(null); // Clear current audio
    sessionStorage.removeItem('currentAudio');
    sessionStorage.removeItem('isAudioPlaying');
    setExpanded(false);
    setPrimes([]);
  };
  
  const toggleExpand = () => {
    setExpanded(!expanded);
    if (isFullscreen) setIsFullscreen(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setExpanded(true);
  };
  
  // Get chakra color based on the current audio
  const getChakraColor = (): string => {
    if (!currentAudio?.chakra) return 'purple';
    
    switch (currentAudio.chakra.toLowerCase()) {
      case 'root': return 'red';
      case 'sacral': return 'orange';
      case 'solar plexus': return 'yellow';
      case 'heart': return 'green';
      case 'throat': return 'blue';
      case 'third eye': return 'indigo';
      case 'crown': return 'violet';
      default: return 'purple';
    }
  };

  // Dynamically compute background styles
  const getBgStyle = () => {
    if (liftTheVeil) {
      return isFullscreen 
        ? 'bg-black bg-opacity-95' 
        : 'bg-gradient-to-r from-pink-900/95 to-purple-900/95 shadow-lg shadow-pink-900/50';
    } else {
      return isFullscreen 
        ? 'bg-black bg-opacity-95'
        : 'bg-gradient-to-r from-purple-900/95 to-indigo-900/95 shadow-lg shadow-purple-900/50';
    }
  };

  // Don't render if no audio has been set
  if (!currentAudio) return null;
  
  // Generate canvas styles based on visualizer mode
  const getCanvasStyle = () => {
    const baseStyle = {
      position: 'absolute' as const,
      inset: 0,
      width: '100%',
      height: '100%',
    };
    
    if (!showVisualizer || !isAudioPlaying) {
      return { 
        ...baseStyle,
        display: 'none'
      };
    }
    
    return baseStyle;
  };

  return (
    <div className={`fixed ${isFullscreen ? 'inset-0 z-[100]' : 'bottom-4 right-4 z-50'} flex items-center justify-center`}>
      {/* Prime number detection tooltip */}
      {activeTooltipPrime && isAudioPlaying && (
        <div className="fixed top-14 left-1/2 transform -translate-x-1/2 z-[101]
          px-4 py-2 rounded-full backdrop-blur-sm shadow-lg text-white bg-black/70">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full animate-pulse bg-purple-400"></div>
            <span className="text-xs font-medium">✨ Prime Harmonic Detected: {activeTooltipPrime}</span>
          </div>
        </div>
      )}

      <div className={`
        ${isFullscreen ? 'w-full h-full' : expanded ? 'w-[520px]' : 'w-[320px]'}
        relative rounded-lg overflow-hidden shadow-xl border border-white/10 ${getBgStyle()}
        ${isFullscreen ? '' : 'transition-all duration-300 ease-in-out'}
      `}>
        {/* Visualizer background */}
        <div id="visualizer-container" className="absolute inset-0 z-0 overflow-hidden">
          {showVisualizer && isAudioPlaying && (
            <canvas 
              id="sacred-audio-visualizer-canvas"
              style={getCanvasStyle()}
              ref={(canvas) => {
                if (!canvas) return;
                
                const ctx = canvas.getContext('2d');
                if (!ctx || !frequencyData) return;
                
                // Match canvas dimensions to container
                const dpr = window.devicePixelRatio || 1;
                const rect = canvas.getBoundingClientRect();
                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;
                ctx.scale(dpr, dpr);
                
                // Clear previous frame
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                // Draw based on visualizer mode
                switch(visualizerMode) {
                  case 'purple':
                    drawPurpleVisualizer(ctx, canvas, frequencyData);
                    break;
                  case 'blue':
                    drawBlueVisualizer(ctx, canvas, frequencyData);
                    break;
                  case 'rainbow':
                    drawRainbowVisualizer(ctx, canvas, frequencyData);
                    break;
                  case 'gold':
                    drawGoldVisualizer(ctx, canvas, frequencyData);
                    break;
                }
              }}
            />
          )}
        </div>

        {/* Control overlay */}
        <div className="relative z-10 flex flex-col h-full">
          <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-white/90 hover:text-white mr-2"
                onClick={toggleExpand}
              >
                {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <div className="truncate max-w-[200px]">
                <p className="font-medium text-sm text-white/90 truncate">{currentAudio.title}</p>
                {currentAudio.artist && (
                  <p className="text-xs text-white/70 truncate">{currentAudio.artist}</p>
                )}
              </div>
            </div>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-white/70 hover:text-white"
                onClick={toggleVisualizer}
                title={showVisualizer ? "Hide visualizer" : "Show visualizer"}
              >
                {showVisualizer ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
              
              {showVisualizer && isAudioPlaying && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-white/70 hover:text-white"
                      onClick={changeVisualizerMode}
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
              
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-white/70 hover:text-white"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-gray-300 hover:text-red-400"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {expanded && (
            <div className="p-4 space-y-4">
              {/* Frequency and Prime information */}
              {(currentAudio.frequency || detectedFrequency || primes.length > 0) && (
                <div className="flex flex-wrap gap-2">
                  {currentAudio.frequency && (
                    <Badge variant="outline" className="text-white border-white/30 bg-white/10">
                      {currentAudio.frequency} Hz
                    </Badge>
                  )}
                  {currentAudio.chakra && (
                    <Badge variant="outline" className="text-white border-white/30 bg-white/10">
                      {currentAudio.chakra} Chakra
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
                        <Badge className={`${liftTheVeil ? 'bg-pink-600' : 'bg-purple-600'} text-white cursor-help`}>
                          {primes.length} Primes Found
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm">Prime Harmonics: {primes.slice(-5).join(', ')}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Prime frequencies align with sacred harmonic fields
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              )}
  
              {/* Album art if available */}
              {currentAudio.imageUrl && (
                <div className="w-full h-40 bg-gray-900 dark:bg-gray-800 rounded-md overflow-hidden mb-4">
                  <img 
                    src={currentAudio.imageUrl} 
                    alt={currentAudio.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* Visualizer status indicator */}
              {isAudioPlaying && showVisualizer && (
                <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none">
                  <Badge 
                    className={`px-3 py-1 flex items-center gap-2 ${liftTheVeil ? 'bg-pink-600' : 'bg-purple-600'} text-white opacity-90 backdrop-blur-sm`}
                  >
                    <Activity className="h-3 w-3 animate-pulse" />
                    <span className="capitalize">{getCurrentVisualizerLabel()}</span>
                  </Badge>
                </div>
              )}
              
              {/* Central play button when visualizer is hidden */}
              {(!isAudioPlaying || !showVisualizer) && (
                <div className="flex justify-center my-6">
                  <div className="relative">
                    <Button
                      variant="default"
                      size="icon"
                      className={`h-16 w-16 rounded-full ${liftTheVeil ? 'bg-pink-600 hover:bg-pink-700' : 'bg-purple-600 hover:bg-purple-700'}`}
                      onClick={togglePlayPause}
                      disabled={!audioLoaded}
                    >
                      {isAudioPlaying ? (
                        <Pause className="h-8 w-8" />
                      ) : (
                        <Play className="h-8 w-8 ml-1" />
                      )}
                    </Button>
                    <div className={`absolute inset-0 rounded-full ${liftTheVeil ? 'bg-pink-500' : 'bg-purple-500'} opacity-10 animate-ping`} />
                  </div>
                </div>
              )}

              {/* Frequency equalizer display */}
              {isAudioPlaying && showVisualizer && frequencyData && (
                <div className="h-24 w-full mt-4">
                  <FrequencyEqualizer 
                    frequencyData={frequencyData} 
                    chakraColor={getChakraColor()}
                    isLiftedVeil={liftTheVeil}
                  />
                </div>
              )}
              
              {/* Time & seek controls */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-white/70">
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

              {/* Playback controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white/70 hover:text-white"
                    onClick={() => seekTo(Math.max(0, currentAudioTime - 10))}
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="default"
                    size="icon"
                    className={`h-10 w-10 rounded-full ${liftTheVeil ? 'bg-pink-600 hover:bg-pink-700' : 'bg-purple-600 hover:bg-purple-700'}`}
                    onClick={togglePlayPause}
                    disabled={!audioLoaded}
                  >
                    {isAudioPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5 ml-0.5" />
                    )}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white/70 hover:text-white"
                    onClick={() => seekTo(Math.min(duration, currentAudioTime + 10))}
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Volume controls */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white/70 hover:text-white"
                    onClick={toggleMute}
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    min={0}
                    max={1}
                    step={0.01}
                    onValueChange={handleVolumeChange}
                    className="w-24"
                  />
                </div>
              </div>
              
              {/* Error message */}
              {audioError && (
                <p className="text-red-500 text-xs mt-2">Error: {audioError}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Visualizer Drawing Functions
const drawPurpleVisualizer = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, frequencyData: Uint8Array) => {
  const width = canvas.width / window.devicePixelRatio;
  const height = canvas.height / window.devicePixelRatio;
  
  // Create a circular gradient from center
  const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width);
  gradient.addColorStop(0, 'rgba(139, 92, 246, 0.2)'); // Purple with low opacity
  gradient.addColorStop(1, 'rgba(76, 29, 149, 0)');    // Darker purple with no opacity
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Parameters for the visualizer
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) * 0.45;
  const numPoints = Math.min(128, frequencyData.length / 4);
  const angleStep = (2 * Math.PI) / numPoints;
  
  // Draw outer frequency circle
  ctx.beginPath();
  for (let i = 0; i < numPoints; i++) {
    const normalizedValue = frequencyData[i * 4] / 255;
    const radius = maxRadius * (0.6 + normalizedValue * 0.4); // Base radius plus variation
    const angle = i * angleStep;
    
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  
  // Apply gradient to the circle
  const strokeGradient = ctx.createLinearGradient(0, 0, width, height);
  strokeGradient.addColorStop(0, 'rgba(167, 139, 250, 0.7)');  // Lighter purple
  strokeGradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.7)'); // Medium purple
  strokeGradient.addColorStop(1, 'rgba(91, 33, 182, 0.7)');    // Darker purple
  
  ctx.strokeStyle = strokeGradient;
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Draw inner rings that pulse with bass frequencies
  const bassLevel = Math.max(...Array.from(frequencyData.slice(0, 10))) / 255;
  
  for (let ring = 0; ring < 3; ring++) {
    const ringRadius = maxRadius * (0.2 + (ring * 0.15)) * (0.8 + bassLevel * 0.2);
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(139, 92, 246, ${0.4 - ring * 0.1})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  
  // Draw connecting lines for some frequency points
  ctx.strokeStyle = 'rgba(167, 139, 250, 0.3)';
  ctx.lineWidth = 1;
  
  for (let i = 0; i < numPoints; i += 6) {
    if (frequencyData[i * 4] > 50) { // Only connect lines for stronger frequencies
      const normalizedValue = frequencyData[i * 4] / 255;
      const radius = maxRadius * (0.6 + normalizedValue * 0.4);
      const angle = i * angleStep;
      
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  }
};

const drawBlueVisualizer = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, frequencyData: Uint8Array) => {
  const width = canvas.width / window.devicePixelRatio;
  const height = canvas.height / window.devicePixelRatio;
  
  // Fill with gradient background
  const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
  bgGradient.addColorStop(0, 'rgba(7, 89, 133, 0.2)');
  bgGradient.addColorStop(1, 'rgba(12, 74, 110, 0)');
  
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);
  
  // Create a waveform effect at the bottom third of the canvas
  const waveHeight = height * 0.6;  // Wave starts at 60% from top
  const waveBase = height * 0.8;    // Base line for the wave
  const waveWidth = width;
  const waveSegments = 100;
  const segmentWidth = waveWidth / waveSegments;
  
  // Calculate overall energy to make waves react to beat
  let energy = 0;
  for (let i = 0; i < 20; i++) {
    energy += frequencyData[i];
  }
  energy = energy / (20 * 255); // Normalize to 0-1
  
  // Draw main wave
  ctx.beginPath();
  ctx.moveTo(0, waveBase);
  
  for (let i = 0; i <= waveSegments; i++) {
    const x = i * segmentWidth;
    const frequencyIndex = Math.floor(i * frequencyData.length / waveSegments);
    const normalizedValue = frequencyData[frequencyIndex] / 255;
    
    // Add some wave effect even when there's low audio
    const baseWave = Math.sin(i * 0.2 + Date.now() * 0.001) * 10;
    const y = waveBase - (normalizedValue * waveHeight * 0.8) - (baseWave * (0.5 + energy * 0.5));
    
    ctx.lineTo(x, y);
  }
  
  // Complete the wave shape by drawing to the bottom right and back to start
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  
  // Fill wave with gradient
  const waveGradient = ctx.createLinearGradient(0, waveBase - waveHeight, 0, height);
  waveGradient.addColorStop(0, 'rgba(56, 189, 248, 0.7)'); // Light sky blue
  waveGradient.addColorStop(0.5, 'rgba(2, 132, 199, 0.5)'); // Sky blue
  waveGradient.addColorStop(1, 'rgba(3, 105, 161, 0.2)'); // Dark sky blue
  
  ctx.fillStyle = waveGradient;
  ctx.fill();
  
  // Add reflective dots on the surface of the wave
  ctx.fillStyle = 'rgba(186, 230, 253, 0.8)'; // Light blue
  
  for (let i = 0; i <= waveSegments; i += 5) {
    const x = i * segmentWidth;
    const frequencyIndex = Math.floor(i * frequencyData.length / waveSegments);
    const normalizedValue = frequencyData[frequencyIndex] / 255;
    
    // Position dots on the wave surface
    const baseWave = Math.sin(i * 0.2 + Date.now() * 0.001) * 10;
    const y = waveBase - (normalizedValue * waveHeight * 0.8) - (baseWave * (0.5 + energy * 0.5));
    
    const dotSize = 2 + normalizedValue * 2;
    
    // Only draw dot if frequency is above threshold
    if (normalizedValue > 0.1) {
      ctx.beginPath();
      ctx.arc(x, y, dotSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Add some glowing particles above the wave
  const numParticles = 20;
  
  for (let i = 0; i < numParticles; i++) {
    // Use frequencies to influence particle positions
    const frequencyIndex = Math.floor(i * frequencyData.length / numParticles);
    const normalizedValue = frequencyData[frequencyIndex] / 255;
    
    // Position particles around the canvas
    const x = width * (i / numParticles) + Math.sin(Date.now() * 0.001 + i) * 20;
    const y = waveBase * 0.5 - normalizedValue * 100;
    
    // Only show particles when sound is playing
    if (normalizedValue > 0.05) {
      const particleSize = 1 + normalizedValue * 3;
      
      // Draw glowing particle
      const glow = ctx.createRadialGradient(x, y, 0, x, y, particleSize * 3);
      glow.addColorStop(0, 'rgba(186, 230, 253, 0.8)');
      glow.addColorStop(1, 'rgba(186, 230, 253, 0)');
      
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, particleSize * 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Inner bright core
      ctx.fillStyle = 'rgba(224, 242, 254, 0.9)';
      ctx.beginPath();
      ctx.arc(x, y, particleSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }
};

const drawRainbowVisualizer = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, frequencyData: Uint8Array) => {
  const width = canvas.width / window.devicePixelRatio;
  const height = canvas.height / window.devicePixelRatio;
  
  // Clear with a semi-transparent black background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(0, 0, width, height);
  
  // Calculate the center of the canvas
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Create a mandala/spiral effect using frequency data
  const numRings = 5;
  const numSegments = 12;
  const maxRadius = Math.min(width, height) / 2 * 0.8;
  
  // Use time to rotate the entire visualization
  const time = Date.now() * 0.0008;
  
  // Get overall energy for animation effects
  let totalEnergy = 0;
  for (let i = 0; i < 32; i++) {
    totalEnergy += frequencyData[i];
  }
  totalEnergy = totalEnergy / (32 * 255); // Normalize to 0-1
  
  // Draw each ring
  for (let ring = 0; ring < numRings; ring++) {
    // Base radius for this ring
    const ringRadius = (ring + 1) * (maxRadius / numRings);
    
    // Make the rings pulsate based on audio energy
    const dynamicRadius = ringRadius * (0.9 + totalEnergy * 0.2);
    
    // Draw each segment in the ring
    for (let segment = 0; segment < numSegments; segment++) {
      // Map segment to frequency data
      const freqIndex = (ring * numSegments + segment) % (frequencyData.length / 2);
      const normalizedValue = Math.pow(frequencyData[freqIndex] / 255, 1.5); // Add some non-linear scaling
      
      // Calculate start and end angles for the segment
      const segmentAngle = (2 * Math.PI) / numSegments;
      const startAngle = segment * segmentAngle + time + (ring * 0.2); // Offset each ring slightly
      const endAngle = startAngle + segmentAngle;
      
      // Adjust radius based on frequency
      const innerRadius = dynamicRadius - (maxRadius / numRings) + (normalizedValue * 10);
      const outerRadius = dynamicRadius + (normalizedValue * 20);
      
      // Skip drawing very quiet segments
      if (normalizedValue < 0.05) continue;
      
      // Create gradient based on frequency and position
      const hue = (segment * 30 + ring * 60 + time * 30) % 360; // Rainbow colors
      const saturation = 80 + normalizedValue * 20;
      const lightness = 40 + normalizedValue * 30;
      
      // Draw arc segment
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
      ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
      ctx.closePath();
      
      // Fill with gradient
      const gradient = ctx.createRadialGradient(
        centerX, centerY, innerRadius,
        centerX, centerY, outerRadius
      );
      gradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness}%, ${normalizedValue * 0.8})`);
      gradient.addColorStop(1, `hsla(${hue + 30}, ${saturation}%, ${lightness - 20}%, ${normalizedValue * 0.4})`);
      
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Add a subtle glow stroke
      ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness + 20}%, ${normalizedValue * 0.7})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
  
  // Add particles that react to higher frequencies
  const numParticles = 40;
  
  for (let i = 0; i < numParticles; i++) {
    // Use mid to high frequencies for particles
    const freqIndex = Math.floor(frequencyData.length / 2 + (i * frequencyData.length / 4 / numParticles));
    const normalizedValue = frequencyData[freqIndex] / 255;
    
    // Skip drawing very quiet particles
    if (normalizedValue < 0.1) continue;
    
    // Calculate particle position using polar coordinates
    const angle = (i / numParticles) * Math.PI * 2 + time;
    const distanceFromCenter = maxRadius * (0.2 + normalizedValue * 0.8);
    
    const x = centerX + Math.cos(angle) * distanceFromCenter;
    const y = centerY + Math.sin(angle) * distanceFromCenter;
    
    // Calculate particle size based on frequency
    const size = 2 + normalizedValue * 6;
    
    // Create colorful particle
    const hue = (i * 20 + time * 50) % 360;
    
    // Draw glow effect
    const glow = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
    glow.addColorStop(0, `hsla(${hue}, 100%, 70%, ${normalizedValue * 0.8})`);
    glow.addColorStop(1, `hsla(${hue}, 100%, 60%, 0)`);
    
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, size * 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw bright core
    ctx.fillStyle = `hsla(${hue}, 100%, 80%, ${normalizedValue * 0.9})`;
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Add central mandala pattern
  ctx.globalCompositeOperation = 'lighter';
  
  const mandalaSize = maxRadius * 0.3 * (0.8 + totalEnergy * 0.4);
  const mandalaSides = 6;
  
  ctx.beginPath();
  for (let i = 0; i <= mandalaSides; i++) {
    const angle = (i / mandalaSides) * Math.PI * 2 + time;
    const x = centerX + Math.cos(angle) * mandalaSize;
    const y = centerY + Math.sin(angle) * mandalaSize;
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  
  // Connect to center to create a star pattern
  for (let i = 0; i <= mandalaSides; i++) {
    const angle = (i / mandalaSides) * Math.PI * 2 + time + Math.PI / mandalaSides;
    const x = centerX + Math.cos(angle) * mandalaSize;
    const y = centerY + Math.sin(angle) * mandalaSize;
    
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
  }
  
  // Style and draw the central mandala
  ctx.strokeStyle = `hsla(${time * 50 % 360}, 100%, 70%, ${0.4 + totalEnergy * 0.4})`;
  ctx.lineWidth = 2;
  ctx.stroke();
  
  ctx.globalCompositeOperation = 'source-over'; // Reset blend mode
};

const drawGoldVisualizer = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, frequencyData: Uint8Array) => {
  const width = canvas.width / window.devicePixelRatio;
  const height = canvas.height / window.devicePixelRatio;
  
  // Calculate the center of the canvas
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Create gradient background
  const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height));
  bgGradient.addColorStop(0, 'rgba(133, 77, 14, 0.2)');  // Darker gold at center
  bgGradient.addColorStop(0.7, 'rgba(59, 30, 9, 0.1)');  // Brown-gold
  bgGradient.addColorStop(1, 'rgba(20, 10, 0, 0)');      // Nearly transparent dark
  
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);
  
  // Parameters for the sacred geometry pattern
  const time = Date.now() * 0.0005; // Slow rotation
  const maxRadius = Math.min(width, height) * 0.4;
  
  // Get energy levels for animation
  let bassEnergy = 0;
  let midEnergy = 0;
  let highEnergy = 0;
  
  // Bass frequencies (lower third)
  for (let i = 0; i < frequencyData.length / 3; i++) {
    bassEnergy += frequencyData[i];
  }
  bassEnergy = bassEnergy / (frequencyData.length / 3) / 255;
  
  // Mid frequencies (middle third)
  for (let i = Math.floor(frequencyData.length / 3); i < 2 * frequencyData.length / 3; i++) {
    midEnergy += frequencyData[i];
  }
  midEnergy = midEnergy / (frequencyData.length / 3) / 255;
  
  // High frequencies (upper third)
  for (let i = Math.floor(2 * frequencyData.length / 3); i < frequencyData.length; i++) {
    highEnergy += frequencyData[i];
  }
  highEnergy = highEnergy / (frequencyData.length / 3) / 255;
  
  // Draw the Flower of Life pattern with gold
  drawFlowerOfLife(ctx, centerX, centerY, maxRadius * (0.8 + bassEnergy * 0.3), time, midEnergy);
  
  // Draw outer ring that pulses with bass
  ctx.beginPath();
  ctx.arc(centerX, centerY, maxRadius * (1.1 + bassEnergy * 0.2), 0, Math.PI * 2);
  
  const ringGradient = ctx.createLinearGradient(
    centerX - maxRadius, centerY - maxRadius,
    centerX + maxRadius, centerY + maxRadius
  );
  ringGradient.addColorStop(0, `rgba(255, 215, 0, ${0.3 + bassEnergy * 0.3})`);  // Gold
  ringGradient.addColorStop(0.5, `rgba(218, 165, 32, ${0.3 + bassEnergy * 0.3})`); // Goldenrod
  ringGradient.addColorStop(1, `rgba(184, 134, 11, ${0.3 + bassEnergy * 0.3})`);  // Dark goldenrod
  
  ctx.strokeStyle = ringGradient;
  ctx.lineWidth = 2 + bassEnergy * 3;
  ctx.stroke();
  
  // Draw sacred geometry symbols that react to high frequencies
  if (highEnergy > 0.1) {
    drawSacredSymbols(ctx, centerX, centerY, maxRadius * 0.6, time, highEnergy);
  }
  
  // Add particles that float around based on frequency
  const numParticles = 30;
  
  ctx.fillStyle = 'rgba(255, 223, 0, 0.7)';  // Gold particles
  
  for (let i = 0; i < numParticles; i++) {
    // Use a frequency to determine if this particle should be visible
    const freqIndex = Math.floor(i * frequencyData.length / numParticles);
    const normalizedValue = frequencyData[freqIndex] / 255;
    
    if (normalizedValue < 0.15) continue; // Skip quiet particles
    
    // Position based on sine waves and time
    const angle = (i / numParticles) * Math.PI * 2 + time;
    const radiusOffset = Math.sin(time * 2 + i) * 20;
    const particleRadius = maxRadius * (0.3 + 0.7 * normalizedValue) + radiusOffset;
    
    const x = centerX + Math.cos(angle) * particleRadius;
    const y = centerY + Math.sin(angle) * particleRadius;
    
    // Size based on frequency
    const particleSize = 1 + normalizedValue * 4;
    
    // Create glowing particle
    const glow = ctx.createRadialGradient(x, y, 0, x, y, particleSize * 3);
    glow.addColorStop(0, `rgba(255, 215, 0, ${normalizedValue * 0.8})`);
    glow.addColorStop(0.5, `rgba(218, 165, 32, ${normalizedValue * 0.4})`);
    glow.addColorStop(1, `rgba(218, 165, 32, 0)`);
    
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y, particleSize * 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Particle core
    ctx.fillStyle = `rgba(255, 223, 0, ${normalizedValue * 0.9})`;
    ctx.beginPath();
    ctx.arc(x, y, particleSize, 0, Math.PI * 2);
    ctx.fill();
  }
};

// Helper function for gold visualizer
const drawFlowerOfLife = (
  ctx: CanvasRenderingContext2D, 
  centerX: number, 
  centerY: number, 
  radius: number, 
  time: number,
  intensity: number
) => {
  // Draw the central circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius / 3, 0, Math.PI * 2);
  
  const circleGradient = ctx.createRadialGradient(
    centerX, centerY, 0,
    centerX, centerY, radius / 3
  );
  circleGradient.addColorStop(0, `rgba(255, 215, 0, ${0.1 + intensity * 0.2})`);
  circleGradient.addColorStop(1, `rgba(218, 165, 32, ${0.05 + intensity * 0.1})`);
  
  ctx.fillStyle = circleGradient;
  ctx.fill();
  
  ctx.strokeStyle = `rgba(255, 215, 0, ${0.3 + intensity * 0.5})`;
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // Draw surrounding circles in the Flower of Life pattern
  const numPetals = 6;
  
  for (let i = 0; i < numPetals; i++) {
    const angle = (i / numPetals) * Math.PI * 2 + time;
    const x = centerX + Math.cos(angle) * (radius / 3);
    const y = centerY + Math.sin(angle) * (radius / 3);
    
    ctx.beginPath();
    ctx.arc(x, y, radius / 3, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 215, 0, ${0.2 + intensity * 0.4})`;
    ctx.stroke();
    
    // Second layer of circles
    for (let j = 0; j < numPetals; j++) {
      const angle2 = (j / numPetals) * Math.PI * 2 + time * 0.7;
      const x2 = x + Math.cos(angle2) * (radius / 3);
      const y2 = y + Math.sin(angle2) * (radius / 3);
      
      // Only draw if within the overall radius
      const distFromCenter = Math.sqrt(Math.pow(x2 - centerX, 2) + Math.pow(y2 - centerY, 2));
      if (distFromCenter < radius * 0.9) {
        ctx.beginPath();
        ctx.arc(x2, y2, radius / 3, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 215, 0, ${0.1 + intensity * 0.3})`;
        ctx.stroke();
      }
    }
  }
};

// Helper function for gold visualizer
const drawSacredSymbols = (
  ctx: CanvasRenderingContext2D, 
  centerX: number, 
  centerY: number, 
  radius: number,
  time: number,
  intensity: number
) => {
  // Draw a Sri Yantra-inspired pattern
  const numTriangles = 9;
  const triangleLayers = 4;
  
  for (let layer = 0; layer < triangleLayers; layer++) {
    const layerRadius = radius * (0.3 + layer * 0.2);
    const rotation = time + layer * 0.2;
    
    for (let i = 0; i < numTriangles; i++) {
      const angle = (i / numTriangles) * Math.PI * 2 + rotation;
      const x1 = centerX + Math.cos(angle) * layerRadius;
      const y1 = centerY + Math.sin(angle) * layerRadius;
      
      const angle2 = ((i + 1) / numTriangles) * Math.PI * 2 + rotation;
      const x2 = centerX + Math.cos(angle2) * layerRadius;
      const y2 = centerY + Math.sin(angle2) * layerRadius;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.closePath();
      
      ctx.strokeStyle = `rgba(255, 215, 0, ${0.1 + layer * 0.05 + intensity * 0.3})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
};

export default SacredAudioPlayer;
