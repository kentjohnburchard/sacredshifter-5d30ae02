
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

  useEffect(() => {
    if (!audioRef.current) return;
    
    const handleAudioEnded = () => {
      if (onEndedCallbackRef.current) {
        onEndedCallbackRef.current();
      }
    };
    
    audioRef.current.removeEventListener('ended', handleAudioEnded);
    audioRef.current.addEventListener('ended', handleAudioEnded);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleAudioEnded);
      }
    };
  }, [audioRef.current]);
  
  useEffect(() => {
    const handlePlayAudio = (event: CustomEvent) => {
      const { audioInfo } = event.detail;
      if (!audioInfo || !audioInfo.source) return;
      
      const isSameSource = currentAudio?.source === audioInfo.source;
      if (isSameSource && isAudioPlaying) {
        console.log("Already playing this audio, skipping replay");
        return;
      }
      
      setCurrentAudio(audioInfo);
      setAudioSource(audioInfo.source);
      setExpanded(true);
      
      const infoChangeEvent = new CustomEvent('audioInfoChange', {
        detail: { audioInfo }
      });
      window.dispatchEvent(infoChangeEvent);
      
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

    window.addEventListener('playAudio' as any, handlePlayAudio as EventListener);
    window.addEventListener('togglePlayPause' as any, handleTogglePlayPause as EventListener);
    window.addEventListener('audioCallbackChange' as any, handleCallbackChange as EventListener);

    return () => {
      window.removeEventListener('playAudio' as any, handlePlayAudio as EventListener);
      window.removeEventListener('togglePlayPause' as any, handleTogglePlayPause as EventListener);
      window.removeEventListener('audioCallbackChange' as any, handleCallbackChange as EventListener);
    };
  }, [setAudioSource, togglePlayPause, isAudioPlaying, currentAudio]);

  useEffect(() => {
    const storeAudioInfo = () => {
      if (currentAudio) {
        sessionStorage.setItem('currentAudio', JSON.stringify(currentAudio));
        sessionStorage.setItem('isAudioPlaying', isAudioPlaying.toString());
      }
    };

    storeAudioInfo();
  }, [currentAudio, isAudioPlaying]);

  useEffect(() => {
    if (!audioInitializedRef.current) {
      const storedAudio = sessionStorage.getItem('currentAudio');
      const storedIsPlaying = sessionStorage.getItem('isAudioPlaying');
      
      if (storedAudio) {
        try {
          const audioInfo = JSON.parse(storedAudio);
          if (!currentAudio && audioInfo) {
            setCurrentAudio(audioInfo);
            setAudioSource(audioInfo.source);
            setExpanded(true);
            
            if (storedIsPlaying === 'true' && !isAudioPlaying) {
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

  useEffect(() => {
    const event = new CustomEvent('audioStateChange', {
      detail: { isPlaying: isAudioPlaying }
    });
    window.dispatchEvent(event);
  }, [isAudioPlaying]);
  
  useEffect(() => {
    setVisualizerMode(liftTheVeil ? 'rainbow' : 'purple');
  }, [liftTheVeil]);
  
  useEffect(() => {
    if (!analyser || !isAudioPlaying || !showVisualizer) {
      return;
    }
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    let animationFrameId: number;
    let primeFoundThisFrame = false;
    let lastDetectedPrime = 0;
    
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
      
      const dataCopy = new Uint8Array(dataArray);
      audioDataRef.current = dataCopy;
      setFrequencyData(dataCopy);
      
      let maxValue = 0;
      let maxIndex = 0;
      
      for (let i = 0; i < dataArray.length; i++) {
        if (dataArray[i] > maxValue) {
          maxValue = dataArray[i];
          maxIndex = i;
        }
      }
      
      if (audioContext && maxValue > 20) {
        const nyquist = audioContext.sampleRate / 2;
        const estimatedFrequency = Math.round(maxIndex * nyquist / dataArray.length);
        
        setDetectedFrequency(estimatedFrequency);
        
        if (estimatedFrequency > 20 && estimatedFrequency < 1000) {
          const roundedFreq = Math.round(estimatedFrequency);
          
          if (isPrime(roundedFreq) && roundedFreq !== lastDetectedPrime) {
            lastDetectedPrime = roundedFreq;
            setPrimes(prev => [...prev, roundedFreq]);
            
            setActiveTooltipPrime(roundedFreq);
            
            if (tooltipTimerRef.current) {
              clearTimeout(tooltipTimerRef.current);
            }
            
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
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted, audioRef]);

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
      togglePlayPause();
    }
    setCurrentAudio(null);
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

  if (!currentAudio) return null;

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
        <div id="visualizer-container" className="absolute inset-0 z-0 overflow-hidden">
          {showVisualizer && isAudioPlaying && (
            <canvas 
              id="sacred-audio-visualizer-canvas"
              style={getCanvasStyle()}
              ref={(canvas) => {
                if (!canvas) return;
                
                const ctx = canvas.getContext('2d');
                if (!ctx || !frequencyData) return;
                
                const dpr = window.devicePixelRatio || 1;
                const rect = canvas.getBoundingClientRect();
                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;
                ctx.scale(dpr, dpr);
                
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
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
  
              {currentAudio.imageUrl && (
                <div className="w-full h-40 bg-gray-900 dark:bg-gray-800 rounded-md overflow-hidden mb-4">
                  <img 
                    src={currentAudio.imageUrl} 
                    alt={currentAudio.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
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
              
              {isAudioPlaying && showVisualizer && frequencyData && (
                <div className="h-24 w-full mt-4">
                  <FrequencyEqualizer 
                    frequencyData={frequencyData} 
                    chakraColor={getChakraColor()}
                    isLiftedVeil={liftTheVeil}
                  />
                </div>
              )}
              
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

const drawPurpleVisualizer = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, frequencyData: Uint8Array) => {
  const width = canvas.width / window.devicePixelRatio;
  const height = canvas.height / window.devicePixelRatio;
  
  const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width);
  gradient.addColorStop(0, 'rgba(139, 92, 246, 0.2)');
  gradient.addColorStop(1, 'rgba(76, 29, 149, 0)');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) * 0.45;
  const numPoints = Math.min(128, frequencyData.length / 4);
  const angleStep = (2 * Math.PI) / numPoints;
  
  ctx.beginPath();
  for (let i = 0; i < numPoints; i++) {
    const normalizedValue = frequencyData[i * 4] / 255;
    const radius = maxRadius * (0.6 + normalizedValue * 0.4);
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
  
  const strokeGradient = ctx.createLinearGradient(0, 0, width, height);
  strokeGradient.addColorStop(0, 'rgba(167, 139, 250, 0.7)');
  strokeGradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.7)');
  strokeGradient.addColorStop(1, 'rgba(91, 33, 182, 0.7)');
  
  ctx.strokeStyle = strokeGradient;
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Calculate bass level for ring animation
  let bassLevel = 0;
  for (let i = 0; i < 10; i++) {
    bassLevel += frequencyData[i] / 255;
  }
  bassLevel = bassLevel / 10;
  
  for (let ring = 0; ring < 3; ring++) {
    const ringRadius = maxRadius * (0.2 + (ring * 0.15)) * (0.8 + bassLevel * 0.2);
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(139, 92, 246, ${0.4 - ring * 0.1})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  
  ctx.strokeStyle = 'rgba(167, 139, 250, 0.3)';
  ctx.lineWidth = 1;
  
  for (let i = 0; i < numPoints; i += 6) {
    if (frequencyData[i * 4] > 50) {
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
  
  const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
  bgGradient.addColorStop(0, 'rgba(7, 89, 133, 0.2)');
  bgGradient.addColorStop(1, 'rgba(12, 74, 110, 0)');
  
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);
  
  const waveHeight = height * 0.6;
  const waveBase = height * 0.8;
  const waveWidth = width;
  const waveSegments = 100;
  const segmentWidth = waveWidth / waveSegments;
  
  // Calculate energy level for wave animation
  let energy = 0;
  for (let i = 0; i < 20; i++) {
    energy += frequencyData[i];
  }
  energy = energy / (20 * 255);
  
  ctx.beginPath();
  ctx.moveTo(0, waveBase);
  
  for (let i = 0; i <= waveSegments; i++) {
    const x = i * segmentWidth;
    const frequencyIndex = Math.floor(i * frequencyData.length / waveSegments);
    const frequencyValue = frequencyData[frequencyIndex] || 0;
    const normalizedValue = frequencyValue / 255;
    
    const waveAmplitude = waveHeight * 0.2 * (0.5 + energy);
    const baseY = waveBase - normalizedValue * waveHeight * 0.3;
    const y = baseY - Math.sin(i / waveSegments * Math.PI * 6) * waveAmplitude;
    
    ctx.lineTo(x, y);
  }
  
  ctx.lineTo(waveWidth, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  
  const waveGradient = ctx.createLinearGradient(0, waveBase - waveHeight * 0.5, 0, height);
  waveGradient.addColorStop(0, 'rgba(56, 189, 248, 0.3)');
  waveGradient.addColorStop(1, 'rgba(14, 116, 144, 0.1)');
  
  ctx.fillStyle = waveGradient;
  ctx.fill();
  
  ctx.beginPath();
  ctx.moveTo(0, waveBase);
  
  for (let i = 0; i <= waveSegments; i += 2) {
    const x = i * segmentWidth;
    const frequencyIndex = Math.floor(i * frequencyData.length / waveSegments);
    const frequencyValue = frequencyData[frequencyIndex] || 0;
    const normalizedValue = frequencyValue / 255;
    
    if (normalizedValue > 0.2 && i % 8 === 0) {
      const lineHeight = normalizedValue * waveHeight * 0.8;
      const startY = waveBase - lineHeight;
      
      ctx.moveTo(x, startY);
      ctx.lineTo(x, waveBase - 5);
    }
  }
  
  ctx.strokeStyle = 'rgba(125, 211, 252, 0.5)';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  for (let i = 0; i < 10; i++) {
    const circleIndex = Math.floor(Math.random() * frequencyData.length);
    const circleValue = frequencyData[circleIndex] || 0;
    
    if (circleValue > 50) {
      const normalizedValue = circleValue / 255;
      const radius = Math.max(2, normalizedValue * 15);
      const x = Math.random() * width;
      const y = waveBase - Math.random() * waveHeight * 1.2;
      
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(186, 230, 253, ${normalizedValue * 0.4})`;
      ctx.fill();
    }
  }
};

const drawRainbowVisualizer = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, frequencyData: Uint8Array) => {
  const width = canvas.width / window.devicePixelRatio;
  const height = canvas.height / window.devicePixelRatio;
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, width, height);
  
  const centerX = width / 2;
  const centerY = height / 2;
  const minDimension = Math.min(width, height);
  
  const numRings = 5;
  const numSegments = 20;
  const maxRadius = minDimension * 0.4;
  
  let avgLevel = 0;
  for (let i = 0; i < Math.min(32, frequencyData.length); i++) {
    avgLevel += frequencyData[i] / 255;
  }
  avgLevel /= Math.min(32, frequencyData.length);
  
  const time = Date.now() / 2000;
  const rotationSpeed = 0.05 + avgLevel * 0.1;
  
  for (let ring = 0; ring < numRings; ring++) {
    const ringRadius = maxRadius * (0.2 + ring * 0.2);
    const ringWidth = maxRadius * 0.05;
    const segmentAngle = (2 * Math.PI) / numSegments;
    
    const direction = ring % 2 === 0 ? 1 : -1;
    const rotation = time * rotationSpeed * direction;
    
    for (let segment = 0; segment < numSegments; segment++) {
      const freqIndex = (ring * numSegments + segment) % frequencyData.length;
      const freqValue = frequencyData[freqIndex] || 0;
      const normalizedValue = freqValue / 255;
      
      const dynamicRadius = Math.max(0.1, ringRadius * (0.8 + normalizedValue * 0.4));
      
      const startAngle = segment * segmentAngle + rotation;
      const endAngle = startAngle + segmentAngle;
      
      const hue = (segment / numSegments * 360 + ring * 25) % 360;
      const saturation = 70 + normalizedValue * 30;
      const lightness = 40 + normalizedValue * 20;
      const alpha = 0.6 + normalizedValue * 0.4;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, dynamicRadius, startAngle, endAngle);
      ctx.arc(centerX, centerY, Math.max(0.1, dynamicRadius - ringWidth), endAngle, startAngle, true);
      ctx.closePath();
      
      ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
      ctx.fill();
    }
  }
  
  const glowRadius = maxRadius * 0.2 * (0.8 + avgLevel * 0.4);
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, glowRadius);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(0.5, 'rgba(255, 220, 255, 0.3)');
  gradient.addColorStop(1, 'rgba(255, 220, 255, 0)');
  
  ctx.beginPath();
  ctx.arc(centerX, centerY, glowRadius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
};

const drawGoldVisualizer = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, frequencyData: Uint8Array) => {
  const width = canvas.width / window.devicePixelRatio;
  const height = canvas.height / window.devicePixelRatio;
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(0, 0, width, height);
  
  const centerX = width / 2;
  const centerY = height / 2;
  
  let energy = 0;
  for (let i = 0; i < 32; i++) {
    energy += frequencyData[i];
  }
  energy = energy / (32 * 255);
  
  const maxRadius = Math.min(width, height) * 0.85 * (0.9 + energy * 0.2);
  const phi = (1 + Math.sqrt(5)) / 2;
  const turns = 5;
  const pointsPerTurn = 60;
  const totalPoints = turns * pointsPerTurn;
  
  ctx.beginPath();
  let prevX = centerX;
  let prevY = centerY;
  
  for (let i = 1; i <= totalPoints; i++) {
    const angle = i * 0.1;
    const scale = Math.pow(phi, angle / Math.PI);
    const radius = maxRadius * (1 - Math.exp(-angle / 10));
    
    const x = centerX + radius * Math.cos(angle) / scale;
    const y = centerY + radius * Math.sin(angle) / scale;
    
    const freqIndex = Math.floor(i * frequencyData.length / totalPoints) % frequencyData.length;
    const freqValue = frequencyData[freqIndex] || 0;
    const normalizedValue = freqValue / 255;
    
    if (i === 1) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
    
    prevX = x;
    prevY = y;
  }
  
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
  gradient.addColorStop(0.5, 'rgba(218, 165, 32, 0.7)');
  gradient.addColorStop(1, 'rgba(184, 134, 11, 0.6)');
  
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 2 + energy * 4;
  ctx.stroke();
  
  const numParticles = Math.floor(30 + energy * 30);
  
  for (let i = 0; i < numParticles; i++) {
    const angle = i * turns * Math.PI * 2 / numParticles;
    const scale = Math.pow(phi, angle / Math.PI);
    const radius = maxRadius * (1 - Math.exp(-angle / 10)) * Math.random();
    
    const x = centerX + radius * Math.cos(angle) / scale;
    const y = centerY + radius * Math.sin(angle) / scale;
    
    const freqIndex = Math.floor(i * frequencyData.length / numParticles);
    const freqValue = frequencyData[freqIndex] || 0;
    const normalizedValue = freqValue / 255;
    
    const particleSize = 1 + normalizedValue * 6;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, particleSize);
    gradient.addColorStop(0, 'rgba(255, 255, 200, 0.9)');
    gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
    
    ctx.beginPath();
    ctx.arc(x, y, particleSize, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  }
  
  const centerSize = Math.max(5, energy * 40);
  const centerGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, centerSize);
  centerGlow.addColorStop(0, 'rgba(255, 255, 200, 0.9)');
  centerGlow.addColorStop(0.6, 'rgba(255, 215, 0, 0.4)');
  centerGlow.addColorStop(1, 'rgba(255, 215, 0, 0)');
  
  ctx.beginPath();
  ctx.arc(centerX, centerY, centerSize, 0, Math.PI * 2);
  ctx.fillStyle = centerGlow;
  ctx.fill();
  
  const geometrySize = maxRadius * 0.3 * (0.8 + energy * 0.4);
  const points = 6;
  
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? geometrySize : geometrySize * 0.5;
    const angle = i * Math.PI / points;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  
  ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
};

export default SacredAudioPlayer;
