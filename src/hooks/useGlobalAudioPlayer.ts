
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
  isInitialized: false
};

export function useGlobalAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(globalAudioState.isPlaying);
  const [currentAudio, setCurrentAudio] = useState<AudioInfo | null>(globalAudioState.currentAudio);
  const eventsAttached = useRef(false);
  const [onEndedCallback, setOnEndedCallbackState] = useState<(() => void) | null>(globalAudioState.onEndedCallback);

  // Function to set onEnded callback
  const setOnEndedCallback = useCallback((callback: (() => void) | null) => {
    globalAudioState.onEndedCallback = callback;
    setOnEndedCallbackState(callback);
    
    // Dispatch event to notify the global player about callback change
    const event = new CustomEvent('audioCallbackChange', {
      detail: { callback }
    });
    window.dispatchEvent(event);
  }, []);

  // Function to play audio through the global player
  const playAudio = useCallback((audioInfo: AudioInfo) => {
    // Check if we're trying to play the same audio that's already playing
    const isSameAudio = globalAudioState.currentAudio?.source === audioInfo.source;
    
    // If it's the same audio and already playing, don't trigger a replay
    if (isSameAudio && globalAudioState.isPlaying) {
      console.log("Already playing this audio, skipping replay");
      return;
    }
    
    // Update global state
    globalAudioState.currentAudio = audioInfo;
    globalAudioState.isPlaying = true;
    
    // Update local state
    setCurrentAudio(audioInfo);
    setIsPlaying(true);
    
    // Log the audio that's about to be played
    console.log("Changing to new song:", audioInfo.title, "URL:", audioInfo.source);
    
    // Dispatch event to notify the global player
    const event = new CustomEvent('playAudio', {
      detail: { audioInfo }
    });
    window.dispatchEvent(event);
  }, []);

  // Function to toggle play/pause state
  const togglePlayPause = useCallback(() => {
    // Update global state
    const newIsPlaying = !globalAudioState.isPlaying;
    globalAudioState.isPlaying = newIsPlaying;
    
    // Update local state
    setIsPlaying(newIsPlaying);
    
    // Dispatch event to notify the global player
    const event = new CustomEvent('togglePlayPause', {
      detail: { isPlaying: newIsPlaying }
    });
    window.dispatchEvent(event);
  }, []);

  // Listen for global audio player state changes
  useEffect(() => {
    // Only attach events once
    if (eventsAttached.current) return;
    
    const handleAudioStateChange = (event: CustomEvent) => {
      const newIsPlaying = event.detail.isPlaying;
      globalAudioState.isPlaying = newIsPlaying;
      setIsPlaying(newIsPlaying);
    };

    // Track audio info changes
    const handleAudioInfoChange = (event: CustomEvent) => {
      const newAudioInfo = event.detail.audioInfo;
      if (newAudioInfo) {
        globalAudioState.currentAudio = newAudioInfo;
        setCurrentAudio(newAudioInfo);
      }
    };

    window.addEventListener('audioStateChange' as any, handleAudioStateChange as EventListener);
    window.addEventListener('audioInfoChange' as any, handleAudioInfoChange as EventListener);
    eventsAttached.current = true;

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
