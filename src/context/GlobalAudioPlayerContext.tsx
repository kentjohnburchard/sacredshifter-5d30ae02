
import React, { createContext, useState, useEffect, useRef, useCallback } from 'react';
import { VisualRegistration, PlayerInfo, GlobalAudioPlayerContextType, PlayerState } from '@/types/audioPlayer';
import { useAudioSetup } from '@/hooks/useAudioSetup';

// Default context value
const defaultAudioContext: GlobalAudioPlayerContextType = {
  currentAudio: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.7,
  currentFrequency: null,
  activeFrequencies: [],
  activePrimeNumbers: [],
  playerState: {
    isBuffering: false,
    isPlaying: false,
    trackEnded: false,
    error: null
  },
  playAudio: () => {},
  togglePlayPause: () => {},
  seekTo: () => {},
  resetPlayer: () => {},
  setOnEndedCallback: () => {},
  registerPlayerVisuals: () => undefined,
  setVolume: () => {},
  getVolume: () => 0.7,
  registerPrimeCallback: () => undefined,
  getAudioElement: () => null,
  forceVisualSync: () => {}
};

// Create the context
export const GlobalAudioPlayerContext = createContext<GlobalAudioPlayerContextType>(defaultAudioContext);

interface GlobalAudioPlayerProviderProps {
  children: React.ReactNode;
}

export const GlobalAudioPlayerProvider: React.FC<GlobalAudioPlayerProviderProps> = ({ children }) => {
  // State for player
  const [currentAudio, setCurrentAudio] = useState<PlayerInfo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [currentFrequency, setCurrentFrequency] = useState<number | null>(null);
  const [activeFrequencies, setActiveFrequencies] = useState<number[]>([]);
  const [activePrimeNumbers, setActivePrimeNumbers] = useState<number[]>([]);
  const [playerState, setPlayerState] = useState<PlayerState>({
    isBuffering: false,
    isPlaying: false,
    trackEnded: false,
    error: null
  });
  
  // Use the shared audio setup hook
  const {
    audioRef,
    onEndedCallbackRef,
    visualRegistrationsRef,
    primeCallbacksRef,
    lastDetectedPrimesRef,
    initializeAudioElement
  } = useAudioSetup(volume);
  
  // Initialize audio element
  useEffect(() => {
    initializeAudioElement();
    
    // Set up event listeners for the audio element
    const audio = audioRef.current;
    if (!audio) return;
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleDurationChange = () => {
      if (!isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    
    const handlePlay = () => {
      setIsPlaying(true);
      setPlayerState(prev => ({...prev, isPlaying: true, trackEnded: false}));
      console.log("Audio play detected in GlobalAudioPlayerContext");
    };
    
    const handlePause = () => {
      setIsPlaying(false);
      setPlayerState(prev => ({...prev, isPlaying: false}));
      console.log("Audio pause detected in GlobalAudioPlayerContext");
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setPlayerState(prev => ({...prev, isPlaying: false, trackEnded: true}));
      
      if (onEndedCallbackRef.current) {
        console.log("Triggering onEnded callback");
        onEndedCallbackRef.current();
      }
    };
    
    const handleBuffering = () => {
      setPlayerState(prev => ({...prev, isBuffering: true}));
    };
    
    const handleCanPlay = () => {
      setPlayerState(prev => ({...prev, isBuffering: false}));
    };
    
    const handleError = (e: ErrorEvent) => {
      setPlayerState(prev => ({...prev, error: new Error("Audio playback error")}));
      console.error("Audio playback error:", e);
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('waiting', handleBuffering);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError as EventListener);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('waiting', handleBuffering);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError as EventListener);
    };
  }, [initializeAudioElement]);
  
  // Play audio function
  const playAudio = useCallback((info: PlayerInfo) => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    
    // Check if we're already playing this audio
    if (currentAudio && currentAudio.source === info.source && isPlaying) {
      console.log("Already playing this audio, skipping replay");
      return;
    }
    
    console.log("Playing audio:", info.title || "Unknown Track");
    
    // Reset track ended state
    setPlayerState(prev => ({...prev, trackEnded: false, isBuffering: true}));
    
    // Set source and play
    audio.src = info.source || '';
    audio.volume = volume;
    
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log("Audio started playing");
          
          // Update state with new audio info
          setCurrentAudio(info);
          
          // Extract frequency from info if available
          if (info.frequency) {
            setCurrentFrequency(info.frequency);
          }
          
          // Notify all registered visualizers about the new audio
          visualRegistrationsRef.current.forEach(reg => {
            if (reg.setAudioSource) {
              reg.setAudioSource(info.source || '', info);
            }
          });
        })
        .catch(error => {
          console.error("Error playing audio:", error);
          setPlayerState(prev => ({...prev, error: error as Error}));
        });
    }
  }, [currentAudio, isPlaying, volume, visualRegistrationsRef]);
  
  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    
    if (isPlaying) {
      audio.pause();
    } else if (audio.src) {
      audio.play().catch(error => {
        console.error("Error playing audio:", error);
        setPlayerState(prev => ({...prev, error: error as Error}));
      });
    }
  }, [isPlaying]);
  
  // Seek to position
  const seekTo = useCallback((time: number) => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    audio.currentTime = time;
    setCurrentTime(time);
  }, []);
  
  // Set volume
  const setVolume = useCallback((value: number) => {
    if (!audioRef.current) return;
    
    const newVolume = Math.max(0, Math.min(1, value));
    audioRef.current.volume = newVolume;
    setVolumeState(newVolume);
  }, []);
  
  // Get volume
  const getVolume = useCallback(() => {
    return volume;
  }, [volume]);
  
  // Set on ended callback
  const setOnEndedCallback = useCallback((callback: (() => void) | null) => {
    onEndedCallbackRef.current = callback;
  }, [onEndedCallbackRef]);
  
  // Register player visuals
  const registerPlayerVisuals = useCallback((registration: VisualRegistration) => {
    visualRegistrationsRef.current.push(registration);
    
    // Return unregister function
    return () => {
      visualRegistrationsRef.current = visualRegistrationsRef.current.filter(
        reg => reg !== registration
      );
    };
  }, [visualRegistrationsRef]);
  
  // Register prime callback
  const registerPrimeCallback = useCallback((callback: (prime: number) => void) => {
    primeCallbacksRef.current.push(callback);
    
    // Return unregister function
    return () => {
      primeCallbacksRef.current = primeCallbacksRef.current.filter(
        cb => cb !== callback
      );
    };
  }, [primeCallbacksRef]);
  
  // Get audio element
  const getAudioElement = useCallback(() => {
    return audioRef.current;
  }, [audioRef]);
  
  // Reset player
  const resetPlayer = useCallback(() => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setCurrentAudio(null);
    setPlayerState({
      isBuffering: false,
      isPlaying: false,
      trackEnded: false,
      error: null
    });
  }, []);
  
  // Force synchronization with visualizations
  const forceVisualSync = useCallback(() => {
    if (currentAudio && visualRegistrationsRef.current.length > 0) {
      visualRegistrationsRef.current.forEach(reg => {
        if (reg.setAudioSource && currentAudio.source) {
          reg.setAudioSource(currentAudio.source, currentAudio);
        }
      });
    }
  }, [currentAudio, visualRegistrationsRef]);
  
  // Context value
  const contextValue: GlobalAudioPlayerContextType = {
    currentAudio,
    isPlaying,
    currentTime,
    duration,
    volume,
    currentFrequency,
    activeFrequencies,
    activePrimeNumbers,
    playerState,
    playAudio,
    togglePlayPause,
    seekTo,
    resetPlayer,
    setOnEndedCallback,
    registerPlayerVisuals,
    setVolume,
    getVolume,
    registerPrimeCallback,
    getAudioElement,
    forceVisualSync
  };
  
  return (
    <GlobalAudioPlayerContext.Provider value={contextValue}>
      {children}
    </GlobalAudioPlayerContext.Provider>
  );
};
