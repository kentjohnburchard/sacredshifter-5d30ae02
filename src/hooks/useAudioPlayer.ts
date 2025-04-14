
import { useState, useEffect, useRef } from 'react';

interface Track {
  title: string;
  artist?: string;
  source: string;
  imageUrl?: string;
  customData?: {
    frequency?: number;
    chakra?: string;
    [key: string]: any;
  };
}

export function useAudioPlayer() {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentAudioTime, setCurrentAudioTime] = useState(0);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioSourceRef = useRef<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // Initialize the audio element and audio context
  useEffect(() => {
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      const audioElement = document.querySelector('audio#global-audio-player') as HTMLAudioElement || document.createElement('audio');
      audioElement.id = 'global-audio-player';
      audioElement.style.display = 'none';
      audioElement.crossOrigin = 'anonymous';
      
      if (!audioElement.parentElement) {
        document.body.appendChild(audioElement);
      }
      
      audioRef.current = audioElement;
    }
    
    // Initialize the AudioContext
    if (!audioContextRef.current) {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        audioContextRef.current = new AudioContext();
      }
    }
    
    return () => {
      // Don't remove the audio element on unmount
    };
  }, []);

  // Set up event listeners for the audio element
  useEffect(() => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      setCurrentAudioTime(audio.currentTime);
    };
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setAudioLoaded(true);
      setAudioError(null);
    };
    
    const handlePlay = () => {
      setIsAudioPlaying(true);
      
      // Notify any listeners about the state change
      const event = new CustomEvent('audioPlayStateChange', {
        detail: { isPlaying: true, currentAudio: currentTrack }
      });
      window.dispatchEvent(event);
    };
    
    const handlePause = () => {
      setIsAudioPlaying(false);
      
      // Notify any listeners about the state change
      const event = new CustomEvent('audioPlayStateChange', {
        detail: { isPlaying: false, currentAudio: currentTrack }
      });
      window.dispatchEvent(event);
    };
    
    const handleError = (e: any) => {
      console.error("Audio error:", e);
      setAudioError("Failed to load audio");
      setAudioLoaded(false);
      
      // Notify any listeners about the error
      const event = new CustomEvent('audioPlayStateChange', {
        detail: { isPlaying: false, error: "Failed to load audio" }
      });
      window.dispatchEvent(event);
    };
    
    // Remove existing event listeners to prevent duplicates
    audio.removeEventListener('timeupdate', handleTimeUpdate);
    audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    audio.removeEventListener('play', handlePlay);
    audio.removeEventListener('pause', handlePause);
    audio.removeEventListener('error', handleError);
    
    // Add event listeners
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);
    
    return () => {
      // Clean up event listeners if component unmounts
      if (audio) {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('error', handleError);
      }
    };
  }, [currentTrack]);

  // Listen for custom events from other components
  useEffect(() => {
    const handlePlayAudio = (event: CustomEvent) => {
      const { audioInfo } = event.detail;
      if (audioInfo && audioInfo.source) {
        setCurrentTrack(audioInfo);
        setAudioSource(audioInfo.source);
        
        // Auto-play after a short delay
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play()
              .catch(err => console.error("Error auto-playing audio:", err));
          }
        }, 100);
      }
    };
    
    const handleTogglePlayPause = () => {
      togglePlayPause();
    };
    
    window.addEventListener('playAudio', handlePlayAudio as EventListener);
    window.addEventListener('togglePlayPause', handleTogglePlayPause);
    
    return () => {
      window.removeEventListener('playAudio', handlePlayAudio as EventListener);
      window.removeEventListener('togglePlayPause', handleTogglePlayPause);
    };
  }, []);

  // Function to set the audio source
  const setAudioSource = (source: string) => {
    if (!audioRef.current) return;
    
    // Only change the source if it's different from current
    if (audioSourceRef.current !== source) {
      audioSourceRef.current = source;
      audioRef.current.src = source;
      audioRef.current.load();
      setAudioLoaded(false);
      setAudioError(null);
    }
  };

  // Function to toggle play/pause
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isAudioPlaying) {
      audioRef.current.pause();
    } else {
      // Ensure we have a src before playing
      if (audioRef.current.src) {
        // Set volume to ensure it's audible
        audioRef.current.volume = 0.7;
        
        audioRef.current.play()
          .catch(error => {
            console.error("Error playing audio:", error);
            setAudioError("Failed to play audio");
          });
      }
    }
  };

  // Function to seek to a specific time
  const seekTo = (time: number) => {
    if (!audioRef.current) return;
    
    audioRef.current.currentTime = time;
    setCurrentAudioTime(time);
  };
  
  // Function to set the current time
  const setCurrentTime = (time: number) => {
    seekTo(time);
  };

  return {
    isAudioPlaying,
    duration,
    currentAudioTime,
    togglePlayPause,
    seekTo,
    setAudioSource,
    audioRef,
    audioLoaded,
    audioError,
    audioContext: audioContextRef.current,
    currentTrack,
    setCurrentTime
  };
}
