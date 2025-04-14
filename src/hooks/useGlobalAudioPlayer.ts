
import { useCallback, useState, useEffect } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

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
    phaseId?: string;
    [key: string]: any;
  };
}

/**
 * Hook for managing global audio playback across the application
 * This is a facade over the native audio element to ensure consistency
 * and centralize all audio playback through the SacredAudioPlayer
 */
export function useGlobalAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<AudioInfo | null>(null);
  const { setAudioSource, togglePlayPause } = useAudioPlayer();

  /**
   * Play audio with the provided information
   * This will route all audio through the single SacredAudioPlayer
   */
  const playAudio = useCallback((audioInfo: AudioInfo) => {
    if (!audioInfo || !audioInfo.source) {
      console.error("Invalid audio info provided to playAudio");
      return;
    }

    setCurrentAudio(audioInfo);
    setIsPlaying(true);
    
    // Set the audio source in the useAudioPlayer hook
    setAudioSource(audioInfo.source);
    
    const event = new CustomEvent('playAudio', {
      detail: { audioInfo }
    });
    window.dispatchEvent(event);
  }, [setAudioSource]);
  
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
      
      // If audio was stopped/changed, also update currentAudio
      if (event.detail.currentAudio) {
        setCurrentAudio(event.detail.currentAudio);
      }
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
