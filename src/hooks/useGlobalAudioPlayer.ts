
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
  const audioSourceRef = useRef<string>('');

  // Make sure we're tracking the current audio time
  const [currentTime, setCurrentTime] = useState(0);
  
  // Update current time when it changes in the audio player
  useEffect(() => {
    setCurrentTime(currentAudioTime);
  }, [currentAudioTime]);

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
      console.error("Cannot play: Missing audio source");
      toast.error("Cannot play: Missing audio source");
      return;
    }
    
    // If we're already playing the same audio, just toggle play/pause
    if (audioInfo.source === audioSourceRef.current) {
      togglePlayPause();
      return;
    }
    
    // Otherwise, set new audio source
    audioSourceRef.current = audioInfo.source;
    setCurrentAudio(audioInfo);
    
    // First pause any currently playing audio
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
    }
    
    // Then set the new source
    setAudioSource(audioInfo.source);
    
    // Reset current time
    setCurrentTime(0);
    
    // Small delay to ensure source is set before playing
    setTimeout(() => {
      console.log("Starting playback after source change");
      const audio = audioRef.current;
      if (audio) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Error playing audio:", error);
            toast.error("Audio playback failed. Try again.");
          });
        }
      }
    }, 100);
  };

  const setOnEndedCallback = (callback: (() => void) | null) => {
    onEndedCallbackRef.current = callback;
    console.log("Global audio player: onEndedCallback set");
  };
  
  const resetPlayer = () => {
    const audio = audioRef.current;
    if (audio) {
      // First pause playback
      audio.pause();
      
      // Reset time and source
      audio.currentTime = 0;
      setCurrentTime(0);
      
      // Clear source and state
      audio.src = '';
      audioSourceRef.current = '';
      setCurrentAudio({source: ''});
      console.log("Global audio player: Reset complete");
    }
  };

  return {
    playAudio,
    isPlaying: isAudioPlaying,
    currentAudio,
    currentTime,
    duration,
    setOnEndedCallback,
    togglePlayPause,
    resetPlayer,
    seekTo
  };
}
