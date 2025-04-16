
import { useState, useEffect, useRef } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { toast } from 'sonner';

interface AudioInfo {
  title?: string;
  artist?: string;
  source: string;
  frequency?: number;
  chakra?: string;
  id?: string;
}

export function useGlobalAudioPlayer() {
  const {
    isAudioPlaying,
    duration,
    currentAudioTime,
    togglePlayPause,
    seekTo,
    setAudioSource,
    audioRef,
    audioLoaded,
    audioError
  } = useAudioPlayer();

  const [currentAudio, setCurrentAudio] = useState<AudioInfo>({source: ''});
  const onEndedCallbackRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const handleEnded = () => {
      console.log("Triggering onEnded callback");
      if (onEndedCallbackRef.current) {
        onEndedCallbackRef.current();
      }
    };

    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('ended', handleEnded);
    }

    return () => {
      if (audio) {
        audio.removeEventListener('ended', handleEnded);
      }
    };
  }, [audioRef]);

  const playAudio = (audioInfo: AudioInfo) => {
    console.log("Global player: Playing new song:", audioInfo.title, "URL:", audioInfo.source);
    
    if (!audioInfo.source) {
      toast.error("Cannot play: Missing audio source");
      return;
    }
    
    setCurrentAudio(audioInfo);
    setAudioSource(audioInfo.source);
    
    // Small delay to ensure source is set before playing
    setTimeout(() => {
      togglePlayPause();
    }, 50);
  };

  const setOnEndedCallback = (callback: (() => void) | null) => {
    onEndedCallbackRef.current = callback;
    console.log("Global audio player: onEndedCallback set");
  };
  
  const resetPlayer = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.src = '';
      setCurrentAudio({source: ''});
    }
    console.log("Global audio player: Reset complete");
  };

  return {
    playAudio,
    isPlaying: isAudioPlaying,
    currentAudio,
    setOnEndedCallback,
    togglePlayPause,
    resetPlayer
  };
}
