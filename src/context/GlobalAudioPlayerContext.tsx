import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { PlayerInfo, VisualRegistration, GlobalAudioPlayerContextType } from '@/types/audioPlayer';
import { useAudioSetup } from '@/hooks/useAudioSetup';
import { usePlayerCallbacks } from '@/hooks/usePlayerCallbacks';
import { isPrime } from '@/utils/audioUtils';

export const GlobalAudioPlayerContext = createContext<GlobalAudioPlayerContextType>({} as GlobalAudioPlayerContextType);

interface GlobalAudioPlayerProviderProps {
  children: ReactNode;
}

export const GlobalAudioPlayerProvider: React.FC<GlobalAudioPlayerProviderProps> = ({ children }) => {
  const [currentAudio, setCurrentAudio] = useState<PlayerInfo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [currentFrequency, setCurrentFrequency] = useState<number | null>(null);
  const [activeFrequencies, setActiveFrequencies] = useState<number[]>([]);
  const [activePrimeNumbers, setActivePrimeNumbers] = useState<number[]>([]);

  const {
    audioRef,
    onEndedCallbackRef,
    visualRegistrationsRef,
    primeCallbacksRef,
    lastDetectedPrimesRef,
    initializeAudioElement
  } = useAudioSetup(volume);

  // Initialize audio element
  initializeAudioElement();

  const { playAudio, togglePlayPause, seekTo } = usePlayerCallbacks(
    audioRef,
    setIsPlaying,
    setCurrentAudio,
    visualRegistrationsRef
  );

  // Set up event listeners if audio element exists
  if (audioRef.current) {
    audioRef.current.addEventListener('timeupdate', () => {
      setCurrentTime(audioRef.current?.currentTime || 0);
      
      if (currentAudio?.frequency) {
        const baseFreq = currentAudio.frequency;
        const time = audioRef.current?.currentTime || 0;
        const detectedFreq = Math.round(baseFreq + (Math.sin(time) * 20));
        
        if (detectedFreq !== currentFrequency) {
          setCurrentFrequency(detectedFreq);
          
          if (isPrime(detectedFreq)) {
            const now = Date.now();
            if (!lastDetectedPrimesRef.current[detectedFreq] || 
                now - lastDetectedPrimesRef.current[detectedFreq] > 5000) {
              lastDetectedPrimesRef.current[detectedFreq] = now;
              setActivePrimeNumbers(prev => [...prev, detectedFreq].slice(-5));
              
              // Notify prime number callbacks
              primeCallbacksRef.current.forEach(callback => callback(detectedFreq));
            }
          }
          
          setActiveFrequencies(prev => [...prev, detectedFreq].slice(-10));
        }
      }
    });
    
    audioRef.current.addEventListener('durationchange', () => {
      setDuration(audioRef.current?.duration || 0);
    });
    
    audioRef.current.addEventListener('ended', () => {
      if (onEndedCallbackRef.current) {
        onEndedCallbackRef.current();
      }
    });
  }

  const resetPlayer = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
    }
  }, []);

  const setOnEndedCallback = useCallback((callback: (() => void) | null) => {
    onEndedCallbackRef.current = callback;
  }, []);

  const registerPlayerVisuals = useCallback((registration: VisualRegistration) => {
    visualRegistrationsRef.current.push(registration);
    return () => {
      visualRegistrationsRef.current = visualRegistrationsRef.current.filter(reg => reg !== registration);
    };
  }, []);

  const registerPrimeCallback = useCallback((callback: (prime: number) => void) => {
    primeCallbacksRef.current.push(callback);
    return () => {
      primeCallbacksRef.current = primeCallbacksRef.current.filter(cb => cb !== callback);
    };
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    if (audioRef.current) {
      const clampedVolume = Math.min(1, Math.max(0, newVolume));
      audioRef.current.volume = clampedVolume;
      setVolumeState(clampedVolume);
      try {
        localStorage.setItem('sacredShifterVolume', clampedVolume.toString());
      } catch (e) {
        console.error("Error saving volume to localStorage:", e);
      }
    }
  }, []);

  const getVolume = useCallback((): number => {
    return audioRef.current?.volume || volume;
  }, [volume]);

  const getAudioElement = useCallback((): HTMLAudioElement | null => {
    return audioRef.current;
  }, []);

  const forceVisualSync = useCallback(() => {
    if (currentAudio?.source) {
      visualRegistrationsRef.current.forEach(reg => {
        reg.setAudioSource(currentAudio.source || '', currentAudio);
      });
    }
  }, [currentAudio]);

  return (
    <GlobalAudioPlayerContext.Provider
      value={{
        currentAudio,
        isPlaying,
        currentTime,
        duration,
        volume, // Expose the volume state
        playAudio,
        togglePlayPause,
        seekTo,
        resetPlayer,
        setOnEndedCallback,
        registerPlayerVisuals,
        setVolume,
        getVolume,
        currentFrequency,
        activeFrequencies,
        activePrimeNumbers,
        registerPrimeCallback,
        getAudioElement,
        forceVisualSync
      }}
    >
      {children}
    </GlobalAudioPlayerContext.Provider>
  );
};
