
import { useContext } from 'react';
import { GlobalAudioPlayerContext } from '@/context/GlobalAudioPlayerContext';

export function useGlobalAudioPlayer() {
  const context = useContext(GlobalAudioPlayerContext);
  
  if (!context) {
    throw new Error("useGlobalAudioPlayer must be used within a GlobalAudioPlayerProvider");
  }
  
  return context;
}
