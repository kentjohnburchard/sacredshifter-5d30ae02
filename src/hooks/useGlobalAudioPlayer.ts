
import { useCallback, useState, useEffect, useRef } from 'react';

type AudioInfo = {
  title: string;
  artist?: string;
  imageUrl?: string;
  source: string;
};

// Create a singleton pattern to maintain state across component unmounts/remounts
let globalAudioState = {
  currentAudio: null as AudioInfo | null,
  isPlaying: false,
  onEndedCallback: null as (() => void) | null,
  // Track whether the audio has been initialized to prevent duplicate initialization
  isInitialized: false,
  // Track current audio element to ensure consistency
  audioElement: null as HTMLAudioElement | null
};

// Ensure we have a global audio element
const getOrCreateGlobalAudioElement = (): HTMLAudioElement => {
  if (globalAudioState.audioElement) {
    return globalAudioState.audioElement;
  }
  
  // Look for existing audio element first
  let audioElement = document.getElementById('global-audio-player') as HTMLAudioElement;
  
  // Create one if it doesn't exist
  if (!audioElement) {
    audioElement = document.createElement('audio');
    audioElement.id = 'global-audio-player';
    audioElement.style.display = 'none';
    audioElement.crossOrigin = 'anonymous'; // Important for analyzing cross-origin media
    document.body.appendChild(audioElement);
    console.log("Global Audio Player: Created new audio element");
  } else {
    console.log("Global Audio Player: Found existing audio element");
  }
  
  globalAudioState.audioElement = audioElement;
  return audioElement;
};

export function useGlobalAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(globalAudioState.isPlaying);
  const [currentAudio, setCurrentAudio] = useState<AudioInfo | null>(globalAudioState.currentAudio);
  const eventsAttached = useRef(false);
  const [onEndedCallback, setOnEndedCallbackState] = useState<(() => void) | null>(globalAudioState.onEndedCallback);

  // Initialize audio element if needed
  useEffect(() => {
    // Get or create the audio element on mount
    const audioElement = getOrCreateGlobalAudioElement();
    
    // Set up event listeners if not already attached
    if (!globalAudioState.isInitialized) {
      // Event listener for playback ending
      const handleEnded = () => {
        if (globalAudioState.onEndedCallback) {
          console.log("Global Audio Player: Track ended, executing callback");
          globalAudioState.onEndedCallback();
        }
      };
      
      // Listen for playback ending
      audioElement.addEventListener('ended', handleEnded);
      
      // Mark as initialized
      globalAudioState.isInitialized = true;
      console.log("Global Audio Player: Initialized event handlers");
      
      // Clean up on full app unmount
      return () => {
        audioElement.removeEventListener('ended', handleEnded);
      };
    }
  }, []);

  // Function to set onEnded callback
  const setOnEndedCallback = useCallback((callback: (() => void) | null) => {
    globalAudioState.onEndedCallback = callback;
    setOnEndedCallbackState(callback);
    
    // Dispatch event to notify the global player about callback change
    const event = new CustomEvent('audioCallbackChange', {
      detail: { callback }
    });
    window.dispatchEvent(event);
    console.log("Global audio player: onEndedCallback set");
  }, []);

  // Function to play audio through the global player
  const playAudio = useCallback((audioInfo: AudioInfo) => {
    const audioElement = getOrCreateGlobalAudioElement();
    
    // Check if we're trying to play the same audio that's already playing
    const isSameAudio = globalAudioState.currentAudio?.source === audioInfo.source;
    
    // If it's the same audio and already playing, don't trigger a replay
    if (isSameAudio && globalAudioState.isPlaying) {
      console.log("Global player: Already playing this audio, skipping replay");
      return;
    }
    
    // Update global state
    globalAudioState.currentAudio = audioInfo;
    globalAudioState.isPlaying = true;
    
    // Update local state
    setCurrentAudio(audioInfo);
    setIsPlaying(true);
    
    // Set the audio source directly
    console.log("Global player: Playing new song:", audioInfo.title, "URL:", audioInfo.source);
    
    // Update audio element directly
    audioElement.src = audioInfo.source;
    audioElement.load();
    
    // Play the audio
    const playPromise = audioElement.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.error("Global player: Error playing audio:", error);
        globalAudioState.isPlaying = false;
        setIsPlaying(false);
      });
    }
    
    // Dispatch event to notify any other components
    const event = new CustomEvent('playAudio', {
      detail: { audioInfo }
    });
    window.dispatchEvent(event);
  }, []);

  // Function to toggle play/pause state
  const togglePlayPause = useCallback(() => {
    const audioElement = getOrCreateGlobalAudioElement();
    
    // Update global state
    const newIsPlaying = !globalAudioState.isPlaying;
    globalAudioState.isPlaying = newIsPlaying;
    
    // Update local state
    setIsPlaying(newIsPlaying);
    
    // Update audio element directly
    if (newIsPlaying) {
      if (audioElement.src) {
        const playPromise = audioElement.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Global player: Error playing audio:", error);
            globalAudioState.isPlaying = false;
            setIsPlaying(false);
          });
        }
      }
    } else {
      audioElement.pause();
    }
    
    // Dispatch event to notify the global player
    const event = new CustomEvent('togglePlayPause', {
      detail: { isPlaying: newIsPlaying }
    });
    window.dispatchEvent(event);
    console.log("Global player: Toggle play/pause, now playing:", newIsPlaying);
  }, []);

  // Listen for global audio player state changes
  useEffect(() => {
    // Only attach events once
    if (eventsAttached.current) return;
    
    const handleAudioStateChange = (event: CustomEvent) => {
      const newIsPlaying = event.detail.isPlaying;
      globalAudioState.isPlaying = newIsPlaying;
      setIsPlaying(newIsPlaying);
      console.log("Global player: Audio state changed to playing:", newIsPlaying);
    };

    // Track audio info changes
    const handleAudioInfoChange = (event: CustomEvent) => {
      const newAudioInfo = event.detail.audioInfo;
      if (newAudioInfo) {
        globalAudioState.currentAudio = newAudioInfo;
        setCurrentAudio(newAudioInfo);
        console.log("Global player: Audio info changed:", newAudioInfo.title);
      }
    };

    window.addEventListener('audioStateChange' as any, handleAudioStateChange as EventListener);
    window.addEventListener('audioInfoChange' as any, handleAudioInfoChange as EventListener);
    eventsAttached.current = true;
    console.log("Global player: Event listeners attached");

    return () => {
      window.removeEventListener('audioStateChange' as any, handleAudioStateChange as EventListener);
      window.removeEventListener('audioInfoChange' as any, handleAudioInfoChange as EventListener);
      eventsAttached.current = false;
    };
  }, []);

  return { 
    playAudio, 
    isPlaying, 
    currentAudio, 
    setOnEndedCallback,
    togglePlayPause
  };
}
