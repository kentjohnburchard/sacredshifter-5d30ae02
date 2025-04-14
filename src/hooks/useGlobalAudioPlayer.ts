
import { useCallback, useState, useEffect } from 'react';

// Define the AudioInfo interface
interface AudioInfo {
  title: string;
  artist?: string;
  source: string;
  imageUrl?: string;
  customData?: {
    frequency?: number;
    chakra?: string;
    frequencyId?: string;
    groupId?: string;
    [key: string]: any;
  };
}

/**
 * Hook for managing global audio playback across the application
 * This is a facade over the native audio element to ensure consistency
 */
export function useGlobalAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<AudioInfo | null>(null);

  /**
   * Play audio with the provided information
   */
  const playAudio = useCallback((audioInfo: AudioInfo) => {
    setCurrentAudio(audioInfo);
    setIsPlaying(true);
    
    const event = new CustomEvent('playAudio', {
      detail: { audioInfo }
    });
    window.dispatchEvent(event);
  }, []);
  
  /**
   * Toggle play/pause state of the current audio
   */
  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
    
    const event = new CustomEvent('togglePlayPause');
    window.dispatchEvent(event);
  }, []);

  /**
   * Set a callback to be run when audio finishes playing
   */
  const setOnEndedCallback = useCallback((callback: () => void) => {
    const event = new CustomEvent('audioCallbackChange', {
      detail: { callback }
    });
    window.dispatchEvent(event);
  }, []);

  // Listen for audio state changes from the player
  useEffect(() => {
    const handlePlayStateChange = (event: CustomEvent) => {
      setIsPlaying(event.detail.isPlaying);
    };

    window.addEventListener('audioPlayStateChange', handlePlayStateChange as EventListener);
    
    return () => {
      window.removeEventListener('audioPlayStateChange', handlePlayStateChange as EventListener);
    };
  }, []);

  // Return the audio player interface
  return {
    playAudio,
    togglePlayPause,
    setOnEndedCallback,
    isPlaying,
    currentAudio
  };
}
