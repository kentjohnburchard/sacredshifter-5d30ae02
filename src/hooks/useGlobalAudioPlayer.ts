import { useContext } from 'react';
import { GlobalAudioPlayerContext } from '@/context/GlobalAudioPlayerContext';

export function useGlobalAudioPlayer() {
  const context = useContext(GlobalAudioPlayerContext);
  
  if (!context) {
    throw new Error("useGlobalAudioPlayer must be used within a GlobalAudioPlayerProvider");
  }
  
  // Add volume functions to the existing hook
  const { setVolume: contextSetVolume, getVolume: contextGetVolume, ...restContext } = context;
  
  const setVolume = (volume: number) => {
    if (contextSetVolume) {
      contextSetVolume(volume);
      
      // Also set the volume on the audio element directly for immediate effect
      const audioElement = document.querySelector('#global-audio-player') as HTMLAudioElement;
      if (audioElement) {
        audioElement.volume = volume;
        console.log("Global audio player volume set to:", volume);
      }
    }
  };
  
  const getVolume = (): number => {
    if (contextGetVolume) {
      return contextGetVolume();
    }
    
    // Fallback to get volume directly from the element
    const audioElement = document.querySelector('#global-audio-player') as HTMLAudioElement;
    if (audioElement) {
      return audioElement.volume;
    }
    
    return 0.8; // Default volume
  };

  return {
    ...restContext,
    setVolume,
    getVolume
  };
}
