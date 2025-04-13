
import { useCallback, useState, useEffect } from 'react';

type AudioInfo = {
  title: string;
  artist?: string;
  imageUrl?: string;
  source: string;
};

// Create a singleton pattern to maintain state across component unmounts/remounts
let globalAudioState = {
  currentAudio: null as AudioInfo | null,
  isPlaying: false
};

export function useGlobalAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(globalAudioState.isPlaying);
  const [currentAudio, setCurrentAudio] = useState<AudioInfo | null>(globalAudioState.currentAudio);

  // Function to play audio through the global player
  const playAudio = useCallback((audioInfo: AudioInfo) => {
    // Update global state
    globalAudioState.currentAudio = audioInfo;
    globalAudioState.isPlaying = true;
    
    // Update local state
    setCurrentAudio(audioInfo);
    setIsPlaying(true);
    
    // Dispatch event to notify the global player
    const event = new CustomEvent('playAudio', {
      detail: { audioInfo }
    });
    window.dispatchEvent(event);
  }, []);

  // Listen for global audio player state changes
  useEffect(() => {
    const handleAudioStateChange = (event: CustomEvent) => {
      const newIsPlaying = event.detail.isPlaying;
      globalAudioState.isPlaying = newIsPlaying;
      setIsPlaying(newIsPlaying);
    };

    // Track audio info changes
    const handleAudioInfoChange = (event: CustomEvent) => {
      const newAudioInfo = event.detail.audioInfo;
      if (newAudioInfo) {
        globalAudioState.currentAudio = newAudioInfo;
        setCurrentAudio(newAudioInfo);
      }
    };

    window.addEventListener('audioStateChange' as any, handleAudioStateChange as EventListener);
    window.addEventListener('audioInfoChange' as any, handleAudioInfoChange as EventListener);

    return () => {
      window.removeEventListener('audioStateChange' as any, handleAudioStateChange as EventListener);
      window.removeEventListener('audioInfoChange' as any, handleAudioInfoChange as EventListener);
    };
  }, []);

  return { playAudio, isPlaying, currentAudio };
}
