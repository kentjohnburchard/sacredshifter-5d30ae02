import React, { createContext, useState, useRef, useCallback, ReactNode } from 'react';

export interface VisualRegistration {
  setAudioSource: (url: string, info?: any) => void;
}

interface PlayerInfo {
  title?: string;
  artist?: string;
  source?: string;
  chakra?: string;
  frequency?: number;
  id?: string;
}

interface GlobalAudioPlayerContextType {
  currentAudio: PlayerInfo | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playAudio: (info: PlayerInfo) => void;
  togglePlayPause: () => void;
  seekTo: (time: number) => void;
  resetPlayer: () => void;
  setOnEndedCallback: (callback: () => void | null) => void;
  registerPlayerVisuals: (registration: VisualRegistration) => (() => void) | undefined;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  currentFrequency: number | null;
  activeFrequencies: number[];
  activePrimeNumbers: number[];
  registerPrimeCallback: (callback: (prime: number) => void) => (() => void) | undefined;
  getAudioElement: () => HTMLAudioElement | null;
  forceVisualSync: () => void;
}

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
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const onEndedCallbackRef = useRef<(() => void) | null>(null);
  const visualRegistrationsRef = useRef<VisualRegistration[]>([]);
  const primeCallbacksRef = useRef<((prime: number) => void)[]>([]);
  const lastDetectedPrimesRef = useRef<{[key: number]: number}>({});
  
  if (typeof window !== 'undefined' && !audioRef.current) {
    const existingAudio = document.getElementById('global-audio-player');
    
    if (existingAudio && existingAudio instanceof HTMLAudioElement) {
      audioRef.current = existingAudio;
    } else {
      audioRef.current = document.createElement('audio');
      audioRef.current.id = 'global-audio-player';
      audioRef.current.style.display = 'none';
      audioRef.current.volume = volume;
      document.body.appendChild(audioRef.current);
    }
    
    audioRef.current.addEventListener('timeupdate', () => {
      setCurrentTime(audioRef.current?.currentTime || 0);
      
      if (currentAudio?.frequency) {
        const baseFreq = currentAudio.frequency;
        const time = audioRef.current?.currentTime || 0;
        
        const detectedFreq = Math.round(baseFreq + (Math.sin(time) * 20));
        
        if (detectedFreq !== currentFrequency) {
          setCurrentFrequency(detectedFreq);
          
          const isPrime = (num: number): boolean => {
            if (num <= 1) return false;
            if (num <= 3) return true;
            if (num % 2 === 0 || num % 3 === 0) return false;
            let i = 5;
            while (i * i <= num) {
              if (num % i === 0 || num % (i + 2) === 0) return false;
              i += 6;
            }
            return true;
          };
          
          if (isPrime(detectedFreq)) {
            const now = Date.now();
            if (!lastDetectedPrimesRef.current[detectedFreq] || 
                now - lastDetectedPrimesRef.current[detectedFreq] > 5000) {
              
              lastDetectedPrimesRef.current[detectedFreq] = now;
              setActivePrimeNumbers(prev => {
                return [...prev, detectedFreq].slice(-5);
              });
            }
          }
          
          setActiveFrequencies(prev => {
            return [...prev, detectedFreq].slice(-10);
          });
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
  
  const playAudio = useCallback((info: PlayerInfo) => {
    if (audioRef.current && info.source) {
      audioRef.current.src = info.source;
      audioRef.current.load();
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setCurrentAudio(info);
            
            visualRegistrationsRef.current.forEach(reg => {
              reg.setAudioSource(info.source || '', info);
            });
          })
          .catch((error) => {
            console.error("Playback failed:", error);
            setIsPlaying(false);
          });
      }
    }
  }, []);
  
  const togglePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((error) => {
              console.error("Playback failed:", error);
            });
        }
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, []);
  
  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);
  
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
      visualRegistrationsRef.current = visualRegistrationsRef.current
        .filter(reg => reg !== registration);
    };
  }, []);
  
  const registerPrimeCallback = useCallback((callback: (prime: number) => void) => {
    primeCallbacksRef.current.push(callback);
    
    return () => {
      primeCallbacksRef.current = primeCallbacksRef.current
        .filter(cb => cb !== callback);
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
      
      console.log("Volume set to:", clampedVolume);
    }
  }, []);
  
  const getVolume = useCallback((): number => {
    if (audioRef.current) {
      return audioRef.current.volume;
    }
    return volume;
  }, [volume]);

  const getAudioElement = useCallback((): HTMLAudioElement | null => {
    return audioRef.current;
  }, []);

  const forceVisualSync = useCallback(() => {
    if (currentAudio?.source) {
      visualRegistrationsRef.current.forEach(reg => {
        reg.setAudioSource(currentAudio.source || '', currentAudio);
      });
      console.log("Forced visual sync for all registered visualizers");
    }
  }, [currentAudio]);

  return (
    <GlobalAudioPlayerContext.Provider
      value={{
        currentAudio,
        isPlaying,
        currentTime,
        duration,
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
