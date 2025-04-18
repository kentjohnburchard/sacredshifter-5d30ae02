
import { useRef, useCallback } from 'react';
import { PlayerInfo, VisualRegistration } from '@/types/audioPlayer';
import { createGlobalAudioElement, getExistingAudioElement } from '@/utils/audioUtils';

export const useAudioSetup = (volume: number) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const onEndedCallbackRef = useRef<(() => void) | null>(null);
  const visualRegistrationsRef = useRef<VisualRegistration[]>([]);
  const primeCallbacksRef = useRef<((prime: number) => void)[]>([]);
  const lastDetectedPrimesRef = useRef<{[key: number]: number}>({});

  const initializeAudioElement = useCallback(() => {
    if (typeof window === 'undefined' || audioRef.current) return;

    const existingAudio = getExistingAudioElement();
    audioRef.current = existingAudio || createGlobalAudioElement(volume);
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
