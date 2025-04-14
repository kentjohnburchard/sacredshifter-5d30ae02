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

// Visualizer Drawing Functions - FIX HERE for the negative radius issue
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
    const
