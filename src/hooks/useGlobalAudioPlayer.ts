
import { useCallback } from 'react';

// Define the AudioInfo interface
interface AudioInfo {
  title: string;
  artist?: string;
  source: string;
  imageUrl?: string;
  customData?: {
    frequency?: number;
    chakra?: string;
    [key: string]: any;
  };
}

/**
 * Hook for managing global audio playback across the application
 * This is a facade over the native audio element to ensure consistency
 */
export function useGlobalAudioPlayer() {
  /**
   * Play audio with the provided information
   */
  const playAudio = useCallback((audioInfo: AudioInfo) => {
    const event = new CustomEvent('playAudio', {
      detail: { audioInfo }
    });
    window.dispatchEvent(event);
  }, []);
  
  /**
   * Toggle play/pause state of the current audio
   */
  const togglePlayPause = useCallback(() => {
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

  // Return the audio player interface
  return {
    playAudio,
    togglePlayPause,
    setOnEndedCallback,
    isPlaying: false, // This is a placeholder, actual state is managed by SacredAudioPlayer
    currentAudio: null // This is a placeholder, actual state is managed by SacredAudioPlayer
  };
}
