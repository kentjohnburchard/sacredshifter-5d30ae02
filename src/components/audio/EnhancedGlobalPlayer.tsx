import React, { useState, useEffect, useRef } from 'react';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Pause, Play, X, MinusCircle, Volume2, VolumeX, SkipBack, SkipForward, Maximize2, Minimize2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import FractalAudioVisualizer from '@/components/audio/FractalAudioVisualizer';
import useAudioAnalyzer from '@/hooks/useAudioAnalyzer';
import EnhancedPrimeVisualizer from './EnhancedPrimeVisualizer';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';

export interface EnhancedGlobalPlayerProps {
  initiallyExpanded?: boolean;
}

const EnhancedGlobalPlayer: React.FC<EnhancedGlobalPlayerProps> = ({ initiallyExpanded = false }) => {
  const { liftTheVeil } = useTheme();
  const [expanded, setExpanded] = useState(initiallyExpanded);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const onEndedCallbackRef = useRef<(() => void) | null>(null);
  const audioInitializedRef = useRef(false);
  const [showVisualizer, setShowVisualizer] = useState(true);
  const [visualizerMode, setVisualizerMode] = useState<'purple' | 'blue' | 'rainbow' | 'gold'>(
    liftTheVeil ? 'rainbow' : 'purple'
  );
  const [primes, setPrimes] = useState<number[]>([]);
  const [frequencyDetected, setFrequencyDetected] = useState<number | undefined>(undefined);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
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

  const [currentAudio, setCurrentAudio] = useState<{
    title: string;
    artist?: string;
    imageUrl?: string;
    source: string;
  } | null>(null);

  useEffect(() => {
    setVisualizerMode(liftTheVeil ? 'rainbow' : 'purple');
  }, [liftTheVeil]);
  
  const handlePrimeSequence = (newPrimes: number[]) => {
    if (newPrimes.length > 0) {
      setPrimes(prev => {
        if (prev.length === 0 || prev[prev.length - 1] !== newPrimes[newPrimes.length - 1]) {
          return newPrimes;
        }
        return prev;
      });
    }
  };
  
  const handleFrequencyDetected = (freq: number) => {
    setFrequencyDetected(freq);
  };

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
    const modes: ('purple' | 'blue' | 'rainbow' | 'gold')[] = [
      'purple', 'blue', 'rainbow', 'gold'
    ];
    const currentIndex = modes.indexOf(visualizerMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setVisualizerMode(modes[nextIndex]);
  };
  
  const handleClose = () => {
    if (isAudioPlaying) {
      togglePlayPause();
    }
    setCurrentAudio(null);
    sessionStorage.removeItem('currentAudio');
    sessionStorage.removeItem('isAudioPlaying');
    setExpanded(false);
  };
  
  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const cardBgClass = "bg-gradient-to-r from-purple-900/90 to-indigo-800/90";
  const headerBgClass = "bg-gradient-to-r from-purple-900/50 to-indigo-900/50";
  const accentTextClass = "text-purple-300";

  if (!currentAudio && !expanded) return null;

  return (
    <>
      {showVisualizer && isAudioPlaying && (
        <div className={`fixed inset-0 pointer-events-none z-40 ${isFullScreen ? 'pointer-events-auto' : ''}`}>
          <FractalAudioVisualizer 
            audioContext={audioContext} 
            analyser={analyser} 
            isVisible={true}
            colorScheme={visualizerMode}
            pauseWhenStopped={false}
            onPrimeSequence={handlePrimeSequence}
            onFrequencyDetected={handleFrequencyDetected}
            expanded={isFullScreen}
          />
        </div>
      )}

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`fixed ${isFullScreen ? 'inset-0 z-50' : 'bottom-4 right-4 z-50'}`}
      >
        <Card className={`
          ${isFullScreen 
            ? 'w-full h-full max-w-full rounded-none flex flex-col'
            : 'w-[320px] shadow-lg rounded-lg overflow-hidden'} 
          border border-purple-300/30 dark:border-purple-900/30 transition-all duration-300
          ${cardBgClass}
        `}>
          <div className={`px-4 py-3 flex items-center justify-between ${headerBgClass}`}>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className={`h-7 w-7 ${accentTextClass} mr-2`}
                onClick={toggleExpand}
              >
                {expanded ? <MinusCircle className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <div className="truncate max-w-[200px]">
                <p className="font-medium text-sm text-purple-100 truncate">
                  {currentAudio?.title || "Sacred Sound"}
                </p>
                {currentAudio?.artist && (
                  <p className="text-xs text-gray-300 truncate">{currentAudio.artist}</p>
                )}
              </div>
            </div>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className={`h-7 w-7 text-purple-400 hover:text-white`}
                onClick={toggleVisualizer}
                title={showVisualizer ? "Hide visualizer" : "Show visualizer"}
              >
                {showVisualizer ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3a9 9 0 1 0 9 9"></path>
                    <path d="M12 3v9l9 9"></path>
                    <path d="M12 3v9l-9 9"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 12v5"></path>
                    <path d="M12 7h.01"></path>
                  </svg>
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className={`h-7 w-7 text-purple-400 hover:text-white`}
                onClick={toggleFullScreen}
                title={isFullScreen ? "Exit fullscreen" : "View fullscreen"}
              >
                {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              
              {showVisualizer && isAudioPlaying && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-7 w-7 text-purple-400 hover:text-white`}
                  onClick={changeVisualizerMode}
                  title="Change visualizer style"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12h20"></path>
                    <path d="M12 2v20"></path>
                    <circle cx="12" cy="12" r="4"></circle>
                  </svg>
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-gray-300 hover:text-white"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {(expanded || isFullScreen) && (
            <div className={`p-4 space-y-4 ${isFullScreen ? 'flex-1 flex flex-col' : ''}`}>
              {currentAudio?.imageUrl && (
                <div className={`${isFullScreen ? 'flex-1 max-h-[40vh]' : 'h-40'} bg-black/50 rounded-md overflow-hidden mb-4`}>
                  <img 
                    src={currentAudio.imageUrl} 
                    alt={currentAudio.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className={`w-full ${isFullScreen ? 'h-32' : 'h-16'} mb-2`}>
                <EnhancedPrimeVisualizer 
                  primes={primes} 
                  frequency={frequencyDetected} 
                  isPlaying={isAudioPlaying} 
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{formatTime(currentAudioTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <Slider
                  value={[currentAudioTime]}
                  max={duration || 100}
                  step={0.1}
                  onValueChange={(values) => seekTo(values[0])}
                  className="w-full [&>span]:bg-purple-400"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-300 hover:text-white"
                    onClick={() => seekTo(Math.max(0, currentAudioTime - 10))}
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="default"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-purple-600 hover:bg-purple-700"
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
                    className="h-8 w-8 text-gray-300 hover:text-white"
                    onClick={() => seekTo(Math.min(duration, currentAudioTime + 10))}
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-300 hover:text-white"
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
                    className="w-28 [&>span]:bg-purple-400"
                  />
                </div>
              </div>
              
              {audioError && (
                <p className="text-red-500 text-xs mt-2">Error: {audioError}</p>
              )}
            </div>
          )}
        </Card>
      </motion.div>
    </>
  );
};

export default EnhancedGlobalPlayer;
