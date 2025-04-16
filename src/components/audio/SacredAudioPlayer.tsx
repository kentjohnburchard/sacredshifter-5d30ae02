
import React, { useEffect, useState, useRef } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { JourneyProps } from '@/types/journey';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useAppStore } from '@/store';
import { Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import AudioContextService from '@/services/AudioContextService';
import { testAudioUrl, getFallbackAudioUrl } from '@/utils/audioUrlHelper';
import useAudioAnalyzer from '@/hooks/useAudioAnalyzer';

interface SacredAudioPlayerProps {
  journey?: JourneyProps;
  audioUrl?: string;
  url?: string; // Added for compatibility with FrequencyPlayer
  frequency?: number; // Added for frequency visualization
  isPlaying?: boolean; // Added for external control
  onPlayToggle?: (isPlaying: boolean) => void; // Added for external control
  forcePlay?: boolean;
  frequencyId?: string; // Added for tracking
  groupId?: string; // Added for grouping
  id?: string; // Added for identification
  onError?: () => void; // Added for error handling
  onAudioLoaded?: () => void; // Added for successful loading notification
}

const SacredAudioPlayer: React.FC<SacredAudioPlayerProps> = ({
  journey,
  audioUrl,
  url, // Support legacy 'url' prop
  frequency,
  isPlaying: externalIsPlaying,
  onPlayToggle,
  forcePlay = false,
  frequencyId,
  groupId,
  id,
  onError,
  onAudioLoaded
}) => {
  const {
    togglePlay,
    seekTo,
    setAudioSource: setGlobalAudioSource,
    duration,
    currentTime,
    isPlaying: internalIsPlaying,
    audioRef,
    audioLoaded
  } = useAudioPlayer();
  
  const { connectAudioElement, resumeAudioContext } = useAudioAnalyzer();
  const [volume, setVolume] = useState(70);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const { setIsPlaying, setAudioPlaybackError } = useAppStore();
  
  const audioPlayAttempted = useRef(false);
  const [audioSourceValid, setAudioSourceValid] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(true);
  const audioTestingInProgress = useRef(false);
  const [testingFailed, setTestingFailed] = useState(false);
  
  const maxTestingRetries = 2;
  const testingRetries = useRef(0);
  
  const fallbackAudioRef = useRef(getFallbackAudioUrl());
  
  const isControlledMode = externalIsPlaying !== undefined;
  const isPlaying = isControlledMode ? externalIsPlaying : internalIsPlaying;

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const rawAudioUrl = audioUrl || url;
  const effectiveAudioUrl = rawAudioUrl || fallbackAudioRef.current;
  
  // Once the audio element is loaded and ready, connect it to our analyzer
  useEffect(() => {
    if (audioRef.current && audioLoaded) {
      connectAudioElement(audioRef.current);
    }
  }, [audioRef, audioLoaded, connectAudioElement]);

  useEffect(() => {
    if (audioTestingInProgress.current || testingRetries.current >= maxTestingRetries) {
      if (testingRetries.current >= maxTestingRetries && !audioSourceValid) {
        console.log("Maximum audio testing retries reached, using fallback");
        setGlobalAudioSource(fallbackAudioRef.current);
        setAudioSourceValid(true);
        setLoadingAudio(false);
        setTestingFailed(true);
      }
      return;
    }
    
    audioTestingInProgress.current = true;
    setLoadingAudio(true);
    
    const testAudio = async () => {
      testingRetries.current += 1;
      console.log(`Testing audio (attempt ${testingRetries.current}): ${effectiveAudioUrl}`);
      
      try {
        const isValid = await testAudioUrl(effectiveAudioUrl, 5000); // Increased timeout for better reliability
        
        if (isValid) {
          console.log(`Audio test succeeded for: ${effectiveAudioUrl}`);
          setGlobalAudioSource(effectiveAudioUrl);
          setAudioSourceValid(true);
          setLoadingAudio(false);
          if (onAudioLoaded) onAudioLoaded();
        } else {
          console.log(`Audio test failed for: ${effectiveAudioUrl}`);
          
          const fallback = fallbackAudioRef.current;
          console.log(`Trying fallback: ${fallback}`);
          
          const fallbackValid = await testAudioUrl(fallback, 3000);
          
          if (fallbackValid) {
            console.log(`Fallback audio test succeeded for: ${fallback}`);
            setGlobalAudioSource(fallback);
            setAudioSourceValid(true);
            setLoadingAudio(false);
            if (onError) onError();
          } else {
            console.log("All audio tests failed, using external fallback");
            const externalFallback = "https://assets.mixkit.co/sfx/preview/mixkit-simple-countdown-922.mp3";
            setGlobalAudioSource(externalFallback);
            setAudioSourceValid(true);
            setLoadingAudio(false);
            setTestingFailed(true);
            if (onError) onError();
          }
        }
      } catch (error) {
        console.error("Error testing audio:", error);
        setGlobalAudioSource(fallbackAudioRef.current);
        setAudioSourceValid(true);
        setLoadingAudio(false);
        setTestingFailed(true);
        if (onError) onError();
      } finally {
        audioTestingInProgress.current = false;
      }
    };
    
    testAudio();
  }, [effectiveAudioUrl, setGlobalAudioSource, onError, onAudioLoaded]);

  const handleTogglePlay = async () => {
    // Always resume the audio context when trying to play
    await resumeAudioContext();
    
    if (!audioSourceValid && testingRetries.current >= 1) {
      console.log("Forcing audio to be valid after retry attempts");
      setAudioSourceValid(true);
    }
    
    togglePlay();
    
    if (isControlledMode && onPlayToggle) {
      onPlayToggle(!isPlaying);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume, audioRef]);
  
  useEffect(() => {
    if (forcePlay && !audioPlayAttempted.current && audioSourceValid) {
      audioPlayAttempted.current = true;
      console.log("Auto-playing audio");
      
      setTimeout(() => {
        if (!isPlaying) {
          handleTogglePlay();
        }
      }, 1000);
    }
  }, [forcePlay, isPlaying, audioSourceValid]);

  return (
    <div className="bg-black/50 p-4 rounded-b-xl backdrop-blur-sm">
      <div className="flex flex-col text-white">
        <div className="flex justify-between items-center mb-2">
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">
              {journey?.title || (frequency ? `${frequency} Hz` : "Sacred Frequency")}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {frequency ? `${frequency} Hz` : (journey?.frequencies?.length ? `${journey.frequencies[0]} Hz` : "432 Hz")} | 
              {journey?.chakras?.length ? ` ${journey.chakras[0]} Chakra` : " Crown Chakra"}
            </p>
          </div>
          
          <div className="flex items-center">
            <div 
              className="relative" 
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0 text-white"
                onClick={() => setVolume(prev => prev === 0 ? 70 : 0)}
              >
                {volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : volume < 50 ? (
                  <Volume1 className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              
              {showVolumeSlider && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-black/90 rounded-lg w-24">
                  <Slider
                    value={[volume]}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={(value) => setVolume(value[0])}
                    className="w-20"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-4 mb-2">
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0 text-white opacity-70 hover:opacity-100"
            disabled={true}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button 
            onClick={handleTogglePlay}
            size="icon"
            disabled={loadingAudio && !audioSourceValid && testingRetries.current < maxTestingRetries}
            className={cn(
              "h-10 w-10 rounded-full bg-purple-600 hover:bg-purple-700 text-white",
              isPlaying ? "animate-pulse" : "",
              (loadingAudio && !audioSourceValid) ? "opacity-70 cursor-not-allowed" : ""
            )}
          >
            {(loadingAudio && !audioSourceValid && testingRetries.current < maxTestingRetries) ? (
              <span className="h-4 w-4 block rounded-full border-2 border-t-transparent border-white animate-spin"></span>
            ) : isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </Button>
          
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0 text-white opacity-70 hover:opacity-100"
            disabled={true}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{formatTime(currentTime)}</span>
          
          <div className="relative w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="absolute h-full bg-purple-500 rounded-full"
              style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
            />
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={(e) => seekTo(Number(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-pointer w-full"
            />
          </div>
          
          <span className="text-xs text-gray-400">{formatTime(duration || 0)}</span>
        </div>
      </div>
    </div>
  );
};

export default SacredAudioPlayer;
