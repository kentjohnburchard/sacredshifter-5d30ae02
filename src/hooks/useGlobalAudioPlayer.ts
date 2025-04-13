
import { useCallback, useState, useEffect } from 'react';

type AudioInfo = {
  title: string;
  artist?: string;
  imageUrl?: string;
  source: string;
};

export function useGlobalAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  // Function to play audio through the global player
  const playAudio = useCallback((audioInfo: AudioInfo) => {
    const event = new CustomEvent('playAudio', {
      detail: { audioInfo }
    });
    window.dispatchEvent(event);
    
    // Set isPlaying to true when audio starts
    setIsPlaying(true);
  }, []);

  // Listen for global audio player state changes
  useEffect(() => {
    const handleAudioStateChange = (event: CustomEvent) => {
      setIsPlaying(event.detail.isPlaying);
    };

    window.addEventListener('audioStateChange' as any, handleAudioStateChange as EventListener);

    return () => {
      window.removeEventListener('audioStateChange' as any, handleAudioStateChange as EventListener);
    };
  }, []);

  return { playAudio, isPlaying };
}
