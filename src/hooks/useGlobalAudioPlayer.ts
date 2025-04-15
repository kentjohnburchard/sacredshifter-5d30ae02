
import { useCallback, useState, useEffect } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useAppStore } from '@/store';

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
  const { setAudioSource, togglePlay: internalTogglePlay } = useAudioPlayer();
  const { setIsPlaying: setGlobalIsPlaying } = useAppStore();

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
    setGlobalIsPlaying(true);
    
    // Set the audio source in the useAudioPlayer hook
    setAudioSource(audioInfo.source);
    
    const event = new CustomEvent('playAudio', {
      detail: { audioInfo }
    });
    window.dispatchEvent(event);
  }, [setAudioSource, setGlobalIsPlaying]);
  
  /**
   * Toggle play/pause state of the current audio
   */
  const togglePlayPause = useCallback(() => {
    // Call the underlying audio player's toggle function
    internalTogglePlay();
    
    // The state will be updated via the event listener, but this makes the UI more responsive
    setIsPlaying(prev => !prev);
    setGlobalIsPlaying(prev => !prev);
    
    const event = new CustomEvent('togglePlayPause');
    window.dispatchEvent(event);
  }, [internalTogglePlay, setGlobalIsPlaying]);

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
      setGlobalIsPlaying(event.detail.isPlaying);
      
      // If audio was stopped/changed, also update currentAudio
      if (event.detail.currentAudio) {
        setCurrentAudio(event.detail.currentAudio);
      }
    };

    window.addEventListener('audioPlayStateChange', handlePlayStateChange as EventListener);
    
    return () => {
      window.removeEventListener('audioPlayStateChange', handlePlayStateChange as EventListener);
    };
  }, [setGlobalIsPlaying]);

  // Return the audio player interface
  return {
    playAudio,
    togglePlayPause,
    setOnEndedCallback,
    isPlaying,
    currentAudio
  };
}
