
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { toast } from 'sonner';

interface AudioInfo {
  title?: string;
  artist?: string;
  source: string;
  frequency?: number;
  chakra?: string;
  id?: string;
}

interface VisualPlayerCallbacks {
  setAudioSource: (url: string, info?: AudioInfo) => void;
}

export function useGlobalAudioPlayer() {
  const {
    isAudioPlaying,
    duration,
    currentAudioTime,
    togglePlayPause,
    seekTo,
    setAudioSource,
    audioRef,
    audioLoaded,
    audioError,
    getAudioElement
  } = useAudioPlayer();

  const [currentAudio, setCurrentAudio] = useState<AudioInfo>({source: ''});
  const [isPlaying, setIsPlaying] = useState(false);
  const onEndedCallbackRef = useRef<(() => void) | null>(null);
  const audioSourceRef = useRef<string>('');
  const playerVisualsRef = useRef<VisualPlayerCallbacks | null>(null);
  const registrationAttempts = useRef<number>(0);
  const syncTimerRef = useRef<NodeJS.Timeout | null>(null);
  const visualsSyncedRef = useRef<boolean>(false);

  // Make sure we're tracking the current audio time
  const [currentTime, setCurrentTime] = useState(0);
  
  // Update current time when it changes in the audio player
  useEffect(() => {
    setCurrentTime(currentAudioTime);
  }, [currentAudioTime]);

  // Update playing state when it changes in the audio player
  useEffect(() => {
    setIsPlaying(isAudioPlaying);
  }, [isAudioPlaying]);

  useEffect(() => {
    const handleEnded = () => {
      console.log("useGlobalAudioPlayer: Audio ended, triggering onEnded callback");
      visualsSyncedRef.current = false;
      if (onEndedCallbackRef.current) {
        onEndedCallbackRef.current();
      }
    };

    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('ended', handleEnded);
    }

    return () => {
      if (audio) {
        audio.removeEventListener('ended', handleEnded);
      }
    };
  }, [audioRef]);

  // This function is called by visual players to register themselves
  const registerPlayerVisuals = useCallback((callbacks: VisualPlayerCallbacks): boolean => {
    console.log("Global player: Registering visual player callbacks");
    playerVisualsRef.current = callbacks;
    registrationAttempts.current = 0;
    
    // If there's currently playing audio, tell the visual player about it
    if (audioSourceRef.current && audioSourceRef.current !== '') {
      console.log("Global player: Syncing current audio to visual player on registration");
      console.log("Global player: Current audio source:", audioSourceRef.current);
      
      // Use setTimeout to ensure the callbacks are properly registered before calling
      setTimeout(() => {
        if (playerVisualsRef.current) {
          playerVisualsRef.current.setAudioSource(audioSourceRef.current, currentAudio);
          visualsSyncedRef.current = true;
        }
      }, 100);
    } else {
      console.log("Global player: No current audio to sync to visual player");
    }
    
    return true; // Return true to indicate successful registration
  }, [currentAudio]);

  const syncWithVisualPlayer = useCallback((audioInfo: AudioInfo) => {
    // Clear any existing sync timer
    if (syncTimerRef.current) {
      clearTimeout(syncTimerRef.current);
    }
    
    if (!playerVisualsRef.current) {
      console.log("Global player: No visual player registered yet, will retry");
      if (registrationAttempts.current < 15) {  // Increase max attempts
        registrationAttempts.current += 1;
        syncTimerRef.current = setTimeout(() => syncWithVisualPlayer(audioInfo), 200);
      } else {
        console.warn("Global player: Failed to sync with visual player after multiple attempts");
        toast.error("Visualization sync issue. Please refresh the page if visuals don't appear.");
      }
      return;
    }
    
    console.log("Global player: Syncing audio to visual player", audioInfo.title);
    console.log("Global player: Audio source for sync:", audioInfo.source);
    
    try {
      playerVisualsRef.current.setAudioSource(audioInfo.source, audioInfo);
      visualsSyncedRef.current = true;
      registrationAttempts.current = 0; // Reset attempts counter after success
    } catch (error) {
      console.error("Error syncing with visual player:", error);
      visualsSyncedRef.current = false;
      toast.error("Visualization sync error. Please refresh if visuals don't appear.");
    }
  }, []);

  const playAudio = useCallback((audioInfo: AudioInfo) => {
    console.log("Global player: Playing new song:", audioInfo.title, "URL:", audioInfo.source);
    
    if (!audioInfo.source) {
      console.error("Cannot play: Missing audio source");
      toast.error("Cannot play: Missing audio source");
      return;
    }
    
    // Always update current audio info in state
    setCurrentAudio(audioInfo);
    
    // Update the audio source reference for visual sync
    audioSourceRef.current = audioInfo.source;
    visualsSyncedRef.current = false;
    
    // First pause any currently playing audio
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
    }
    
    // Then set the new source
    setAudioSource(audioInfo.source);
    
    // Reset current time
    setCurrentTime(0);
    
    // Small delay to ensure source is set before playing
    setTimeout(() => {
      console.log("Global player: Starting playback after source change");
      const audio = audioRef.current;
      if (audio) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Error playing audio:", error);
            toast.error("Audio playback failed. Try again.");
          });
        }
      }
      
      // Always sync with visual player when playing new audio
      syncWithVisualPlayer(audioInfo);
      
    }, 200); // Increased timeout for better reliability
  }, [setAudioSource, syncWithVisualPlayer]);

  const setOnEndedCallback = useCallback((callback: (() => void) | null) => {
    onEndedCallbackRef.current = callback;
    console.log("Global audio player: onEndedCallback set");
  }, []);
  
  const resetPlayer = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      // First pause playback
      audio.pause();
      
      // Reset time and source
      audio.currentTime = 0;
      setCurrentTime(0);
      
      // Clear source and state
      audio.src = '';
      audioSourceRef.current = '';
      setCurrentAudio({source: ''});
      visualsSyncedRef.current = false;
      console.log("Global audio player: Reset complete");
      
      // Reset visual player if registered
      if (playerVisualsRef.current) {
        console.log("Global player: Resetting visual player");
        playerVisualsRef.current.setAudioSource('');
      }
    }
  }, []);
  
  const forceVisualSync = useCallback(() => {
    if (currentAudio.source && !visualsSyncedRef.current) {
      console.log("Global player: Force syncing visuals for current audio");
      syncWithVisualPlayer(currentAudio);
    }
  }, [currentAudio, syncWithVisualPlayer]);

  return {
    playAudio,
    isPlaying,
    currentAudio,
    currentTime,
    duration,
    setOnEndedCallback,
    togglePlayPause,
    resetPlayer,
    seekTo,
    registerPlayerVisuals,
    forceVisualSync,
    getAudioElement: getAudioElement
  };
}
