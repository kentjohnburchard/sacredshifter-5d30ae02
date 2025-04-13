
import React, { useState, useEffect } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Pause, Play, X, MinusCircle, Volume2, VolumeX } from 'lucide-react';
import { Card } from '@/components/ui/card';

export interface GlobalAudioPlayerProps {
  initiallyExpanded?: boolean;
}

const GlobalAudioPlayer = ({ initiallyExpanded = false }: GlobalAudioPlayerProps) => {
  const [expanded, setExpanded] = useState(initiallyExpanded);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  
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

  // State to track the current playing audio info
  const [currentAudio, setCurrentAudio] = useState<{
    title: string;
    artist?: string;
    imageUrl?: string;
    source: string;
  } | null>(null);

  // Listen for custom events to control the global player
  useEffect(() => {
    const handlePlayAudio = (event: CustomEvent) => {
      const { audioInfo } = event.detail;
      if (!audioInfo || !audioInfo.source) return;
      
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

    // Add event listener with type assertion
    window.addEventListener('playAudio' as any, handlePlayAudio as EventListener);

    return () => {
      window.removeEventListener('playAudio' as any, handlePlayAudio as EventListener);
    };
  }, [setAudioSource, togglePlayPause, isAudioPlaying]);

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

    return () => {
      // We don't clear storage on unmount, as we want to persist between navigations
    };
  }, [currentAudio, isAudioPlaying]);

  // Restore audio state from session storage on mount
  useEffect(() => {
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
            setTimeout(() => togglePlayPause(), 100);
          }
        }
      } catch (error) {
        console.error('Error restoring audio state:', error);
      }
    }
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
  
  const handleClose = () => {
    if (isAudioPlaying) {
      togglePlayPause(); // Pause the audio
    }
    setCurrentAudio(null); // Clear current audio
    sessionStorage.removeItem('currentAudio');
    sessionStorage.removeItem('isAudioPlaying');
    setExpanded(false);
  };
  
  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  // Don't render if no audio has been set
  if (!currentAudio) return null;

  return (
    <Card className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-900 shadow-lg border border-purple-200 dark:border-purple-900 rounded-lg overflow-hidden transition-all duration-300 w-[320px]">
      <div className="px-4 py-3 flex items-center justify-between bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/50 dark:to-indigo-900/50">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-purple-700 dark:text-purple-300 mr-2"
            onClick={toggleExpand}
          >
            {expanded ? <MinusCircle className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <div className="truncate max-w-[200px]">
            <p className="font-medium text-sm text-purple-900 dark:text-purple-100 truncate">{currentAudio.title}</p>
            {currentAudio.artist && (
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{currentAudio.artist}</p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-gray-500 hover:text-gray-700"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {expanded && (
        <div className="p-4 space-y-4">
          {currentAudio.imageUrl && (
            <div className="w-full h-40 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden mb-4">
              <img 
                src={currentAudio.imageUrl} 
                alt={currentAudio.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
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
              className={`h-10 w-10 rounded-full ${isAudioPlaying ? 'bg-purple-700' : 'bg-purple-600'} hover:bg-purple-800`}
              onClick={togglePlayPause}
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
                className="h-8 w-8 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
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
                className="w-28"
              />
            </div>
          </div>
          
          {audioError && (
            <p className="text-red-500 text-xs mt-2">Error: {audioError}</p>
          )}
        </div>
      )}
    </Card>
  );
};

export default GlobalAudioPlayer;
