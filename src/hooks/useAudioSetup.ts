
import { useRef, useCallback } from 'react';
import { PlayerInfo, VisualRegistration } from '@/types/audioPlayer';

export const useAudioSetup = (volume: number) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const onEndedCallbackRef = useRef<(() => void) | null>(null);
  const visualRegistrationsRef = useRef<VisualRegistration[]>([]);
  const primeCallbacksRef = useRef<((prime: number) => void)[]>([]);
  const lastDetectedPrimesRef = useRef<{[key: number]: number}>({});

  const initializeAudioElement = useCallback(() => {
    if (typeof window === 'undefined' || audioRef.current) return;

    // Look for an existing audio element with our specific ID
    const existingAudio = document.querySelector('audio#global-audio-player') as HTMLAudioElement;
    
    if (existingAudio) {
      audioRef.current = existingAudio;
    } else {
      // Create new audio element if none exists
      const audioElement = document.createElement('audio');
      audioElement.id = 'global-audio-player';
      audioElement.style.display = 'none';
      audioElement.crossOrigin = 'anonymous';
      audioElement.volume = volume;
      document.body.appendChild(audioElement);
      audioRef.current = audioElement;
    }
  }, [volume]);

  return {
    audioRef,
    onEndedCallbackRef,
    visualRegistrationsRef,
    primeCallbacksRef,
    lastDetectedPrimesRef,
    initializeAudioElement
  };
};
