
import { useState, useContext, createContext, useCallback } from 'react';

// Define the audio information type
export interface AudioInfo {
  title: string;
  artist?: string;
  source: string;
}

// Define the context type
interface GlobalAudioContextType {
  playAudio: (audio: AudioInfo) => void;
  togglePlayPause: () => void;
  isPlaying: boolean;
  currentAudio: AudioInfo | null;
  setOnEndedCallback: (callback: (() => void) | null) => void;
}

// Create the context
const GlobalAudioContext = createContext<GlobalAudioContextType | null>(null);

// Global reference to the audio element
let audioElement: HTMLAudioElement | null = null;

// Global callbacks
let onEndedCallback: (() => void) | null = null;

// Provider component
export const GlobalAudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<AudioInfo | null>(null);
  
  // Initialize audio element if not already created
  const initAudioElement = useCallback(() => {
    if (!audioElement) {
      audioElement = document.getElementById('global-audio-player') as HTMLAudioElement;
      
      if (!audioElement) {
        console.log("Creating new global audio player element");
        audioElement = document.createElement('audio');
        audioElement.id = 'global-audio-player';
        audioElement.style.display = 'none';
        audioElement.crossOrigin = 'anonymous';
        document.body.appendChild(audioElement);
      }
      
      // Set up event listeners
      audioElement.addEventListener('play', () => setIsPlaying(true));
      audioElement.addEventListener('pause', () => setIsPlaying(false));
      audioElement.addEventListener('ended', () => {
        setIsPlaying(false);
        if (onEndedCallback) onEndedCallback();
      });
    }
    
    return audioElement;
  }, []);

  const playAudio = useCallback((audio: AudioInfo) => {
    const audio_element = initAudioElement();
    
    // Set the source
    audio_element.src = audio.source;
    audio_element.load();
    
    // Play the audio
    const playPromise = audio_element.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log("Audio started playing:", audio.title);
          setIsPlaying(true);
          setCurrentAudio(audio);
        })
        .catch(error => {
          console.error("Error playing audio:", error);
        });
    }
  }, [initAudioElement]);
  
  const togglePlayPause = useCallback(() => {
    const audio_element = initAudioElement();
    
    if (isPlaying) {
      audio_element.pause();
    } else if (audio_element.src) {
      audio_element.play()
        .catch(error => console.error("Error resuming playback:", error));
    }
  }, [isPlaying, initAudioElement]);
  
  const setOnEndedCallback = useCallback((callback: (() => void) | null) => {
    onEndedCallback = callback;
  }, []);
  
  const value = {
    playAudio,
    togglePlayPause,
    isPlaying,
    currentAudio,
    setOnEndedCallback
  };
  
  return (
    <GlobalAudioContext.Provider value={value}>
      {children}
    </GlobalAudioContext.Provider>
  );
};

// Hook to use the context
export const useGlobalAudioPlayer = (): GlobalAudioContextType => {
  const context = useContext(GlobalAudioContext);
  
  if (!context) {
    throw new Error('useGlobalAudioPlayer must be used within a GlobalAudioProvider');
  }
  
  return context;
};

// Export the useAudioPlayer as an alias for useGlobalAudioPlayer for backward compatibility
export const useAudioPlayer = useGlobalAudioPlayer;
