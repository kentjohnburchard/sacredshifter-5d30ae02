
import React, { useState, useEffect, useRef } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Pause, Play, X, MinusCircle, Volume2, VolumeX, SkipBack, SkipForward, Eye, EyeOff, Maximize2, Minimize2, Activity, BarChart4 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import FractalAudioVisualizer from '@/components/audio/FractalAudioVisualizer';
import useAudioAnalyzer from '@/hooks/useAudioAnalyzer';
import { useTheme } from '@/context/ThemeContext';

export interface GlobalAudioPlayerProps {
  initiallyExpanded?: boolean;
}

const VISUALIZER_MODES = ['purple', 'blue', 'rainbow', 'gold'] as const;
type VisualizerMode = typeof VISUALIZER_MODES[number];

const GlobalAudioPlayer = ({ initiallyExpanded = false }: GlobalAudioPlayerProps) => {
  const { liftTheVeil } = useTheme();
  const [expanded, setExpanded] = useState(initiallyExpanded);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const onEndedCallbackRef = useRef<(() => void) | null>(null);
  const audioInitializedRef = useRef(false);
  const [showVisualizer, setShowVisualizer] = useState(true);
  const [visualizerMode, setVisualizerMode] = useState<VisualizerMode>('purple');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [primeSequence, setPrimeSequence] = useState<number[]>([]);
  const [detectedFrequency, setDetectedFrequency] = useState<number | null>(null);
  const [activeTooltipPrime, setActiveTooltipPrime] = useState<number | null>(null);
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
    audioError,
  } = useAudioPlayer();

  // Get analyzer for visualization
  const { audioContext, analyser } = useAudioAnalyzer(audioRef);

  // State to track the current playing audio info
  const [currentAudio, setCurrentAudio] = useState<{
    title: string;
    artist?: string;
    imageUrl?: string;
    source: string;
    frequency?: number;
    chakra?: string;
  } | null>(null);

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
    // Function to prevent duplicate initialization
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
      setPrimeSequence([]);
      
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
    if (audioInitializedRef.current) return;
    
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
  }, []);

  // Dispatch audio state change events when isAudioPlaying changes
  useEffect(() => {
    const event = new CustomEvent('audioStateChange', {
      detail: { isPlaying: isAudioPlaying }
    });
    window.dispatchEvent(event);
  }, [isAudioPlaying]);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted, audioRef]);

  // Prime sequence tooltip effect
  useEffect(() => {
    if (primeSequence.length > 0) {
      const latestPrime = primeSequence[primeSequence.length - 1];
      
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
  }, [primeSequence]);

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
    const currentIndex = VISUALIZER_MODES.indexOf(visualizerMode);
    const nextIndex = (currentIndex + 1) % VISUALIZER_MODES.length;
    setVisualizerMode(VISUALIZER_MODES[nextIndex]);
  };

  const handlePrimeSequence = (primes: number[]) => {
    setPrimeSequence(primes);
  };
  
  const handleFrequencyDetected = (freq: number) => {
    setDetectedFrequency(freq);
  };
  
  const handleClose = () => {
    if (isAudioPlaying) {
      togglePlayPause(); // Pause the audio
    }
    setCurrentAudio(null); // Clear current audio
    sessionStorage.removeItem('currentAudio');
    sessionStorage.removeItem('isAudioPlaying');
    setExpanded(false);
    setPrimeSequence([]);
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
        {showVisualizer && isAudioPlaying && (
          <div className="absolute inset-0 z-0">
            <FractalAudioVisualizer 
              audioContext={audioContext} 
              analyser={analyser} 
              isVisible={true}
              colorScheme={visualizerMode}
              pauseWhenStopped={true}
              frequency={currentAudio.frequency}
              chakra={currentAudio.chakra}
              onPrimeSequence={handlePrimeSequence}
              onFrequencyDetected={handleFrequencyDetected}
              expanded={isFullscreen}
            />
          </div>
        )}

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
                {expanded ? <MinusCircle className="h-4 w-4" /> : <Play className="h-4 w-4" />}
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
                    <p>Mode: {visualizerMode}</p>
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
              {(currentAudio.frequency || detectedFrequency || primeSequence.length > 0) && (
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
                  {primeSequence.length > 0 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge className={`${liftTheVeil ? 'bg-pink-600' : 'bg-purple-600'} text-white cursor-help`}>
                          {primeSequence.length} Primes Found
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm">Prime Harmonics: {primeSequence.slice(-5).join(', ')}</p>
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
                    <span className="capitalize">{visualizerMode} Visualizer</span>
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

export default GlobalAudioPlayer;
