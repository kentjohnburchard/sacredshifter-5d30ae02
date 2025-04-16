
import { useCallback, useState, useEffect, useRef } from 'react';

type AudioInfo = {
  title: string;
  artist?: string;
  imageUrl?: string;
  source: string;
  frequency?: number;
  chakra?: string;
  id?: string;
};

// Create audio element outside of component to ensure it persists
const getGlobalAudioElement = (): HTMLAudioElement => {
  // Look for existing audio element first
  let audioElement = document.getElementById('global-audio-player') as HTMLAudioElement;
  
  // Create one if it doesn't exist
  if (!audioElement) {
    audioElement = document.createElement('audio');
    audioElement.id = 'global-audio-player';
    audioElement.style.display = 'none';
    audioElement.crossOrigin = 'anonymous';
    document.body.appendChild(audioElement);
    console.log("Global Audio Player: Created new audio element");
  }
  
  return audioElement;
};

// Global state that persists between component renders
const globalState = {
  currentAudio: null as AudioInfo | null,
  isPlaying: false,
  onEndedCallback: null as (() => void) | null
};

export function useGlobalAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(globalState.isPlaying);
  const [currentAudio, setCurrentAudio] = useState<AudioInfo | null>(globalState.currentAudio);
  const audioElement = useRef<HTMLAudioElement | null>(null);
  const initialized = useRef(false);

  // Initialize audio element and listeners
  useEffect(() => {
    if (initialized.current) return;
    
    // Get the global audio element
    audioElement.current = getGlobalAudioElement();
    
    const handlePlay = () => {
      globalState.isPlaying = true;
      setIsPlaying(true);
      console.log("Audio play event detected");
    };
    
    const handlePause = () => {
      globalState.isPlaying = false;
      setIsPlaying(false);
      console.log("Audio pause event detected");
    };
    
    const handleEnded = () => {
      globalState.isPlaying = false;
      setIsPlaying(false);
      
      if (globalState.onEndedCallback) {
        console.log("Track ended, executing callback");
        globalState.onEndedCallback();
      }
    };
    
    // Add event listeners
    const audio = audioElement.current;
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    
    initialized.current = true;
    
    // Clean up on unmount
    return () => {
      if (audio) {
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('ended', handleEnded);
      }
    };
  }, []);

  // Function to set onEnded callback
  const setOnEndedCallback = useCallback((callback: (() => void) | null) => {
    globalState.onEndedCallback = callback;
    console.log("Global audio player: onEndedCallback set");
  }, []);

  // Function to play audio
  const playAudio = useCallback((audioInfo: AudioInfo) => {
    if (!audioElement.current) {
      audioElement.current = getGlobalAudioElement();
    }
    
    const audio = audioElement.current;
    
    // Check if we're trying to play the same audio that's already playing
    const isSameAudio = 
      globalState.currentAudio?.source === audioInfo.source &&
      globalState.isPlaying;
    
    if (isSameAudio) {
      console.log("Already playing this audio, skipping replay");
      return;
    }
    
    // Update global state and component state
    globalState.currentAudio = audioInfo;
    setCurrentAudio(audioInfo);
    
    // Set the audio source
    console.log("Global player: Playing new song:", audioInfo.title, "URL:", audioInfo.source);
    audio.src = audioInfo.source;
    audio.load();
    
    // Play the audio
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          globalState.isPlaying = true;
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Global player: Error playing audio:", error);
          globalState.isPlaying = false;
          setIsPlaying(false);
        });
    }
  }, []);

  // Function to toggle play/pause
  const togglePlayPause = useCallback(() => {
    if (!audioElement.current) {
      audioElement.current = getGlobalAudioElement();
    }
    
    const audio = audioElement.current;
    
    if (globalState.isPlaying) {
      audio.pause();
    } else if (audio.src) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Error toggling playback:", error);
        });
      }
    }
  }, []);

  return { 
    playAudio, 
    isPlaying, 
    currentAudio, 
    setOnEndedCallback,
    togglePlayPause
  };
}
