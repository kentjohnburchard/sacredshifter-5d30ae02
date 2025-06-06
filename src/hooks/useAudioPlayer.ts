
import { useState, useEffect, useRef } from 'react';

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentAudioTime, setCurrentAudioTime] = useState(0);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioSourceRef = useRef<string | null>(null);
  const timeUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Ensure the audio element exists and has a consistent ID
  useEffect(() => {
    if (!audioRef.current) {
      // Try to find an existing global audio player first
      const existingAudio = document.querySelector('audio#global-audio-player') as HTMLAudioElement;
      
      if (existingAudio) {
        console.log("Using existing global audio element");
        audioRef.current = existingAudio;
      } else {
        // Create a new audio element if it doesn't exist yet
        const audioElement = document.createElement('audio');
        audioElement.id = 'global-audio-player';
        audioElement.style.display = 'none';
        audioElement.crossOrigin = 'anonymous'; // Important for analyzing cross-origin media
        
        document.body.appendChild(audioElement);
        audioRef.current = audioElement;
        console.log("Creating new Audio element");
      }
    }
    
    // Ensure the audio element has the correct attributes
    if (audioRef.current) {
      audioRef.current.id = 'global-audio-player';
      audioRef.current.crossOrigin = 'anonymous';
      
      // Make the audio element globally accessible for debugging
      (window as any).globalAudioElement = audioRef.current;
    }
    
    return () => {
      // Clean up interval if it exists
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current);
      }
    };
  }, []);

  // Set up event listeners for the audio element
  useEffect(() => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      setCurrentAudioTime(audio.currentTime);
      console.log("Time update:", audio.currentTime, "of", audio.duration);
    };
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setAudioLoaded(true);
      setAudioError(null);
      console.log("Audio loaded, duration:", audio.duration);
    };
    
    const handlePlay = () => {
      setIsAudioPlaying(true);
      console.log("Audio play event detected");
      
      // Set up an interval to update the time more frequently
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current);
      }
      
      timeUpdateIntervalRef.current = setInterval(() => {
        if (audio && !audio.paused) {
          setCurrentAudioTime(audio.currentTime);
        }
      }, 250); // Update 4 times per second for smoother progress
    };
    
    const handlePause = () => {
      setIsAudioPlaying(false);
      console.log("Audio pause event detected");
      
      // Clear the interval when paused
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current);
        timeUpdateIntervalRef.current = null;
      }
    };
    
    const handleError = (e: any) => {
      console.error("Audio error:", e);
      setAudioError("Failed to load audio");
      setAudioLoaded(false);
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
      
      // Clear interval
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current);
      }
    };
  }, [audioRef.current]);

  // Function to set the audio source
  const setAudioSource = (source: string) => {
    if (!audioRef.current) return;
    
    // Only change the source if it's different from current
    if (audioSourceRef.current !== source) {
      console.log("Setting audio source to:", source);
      audioSourceRef.current = source;
      audioRef.current.src = source;
      audioRef.current.load();
      setAudioLoaded(false);
      setAudioError(null);
      
      // Reset current time when changing source
      setCurrentAudioTime(0);
    }
  };

  // Function to toggle play/pause
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    console.log("Toggle play/pause called, current state:", isAudioPlaying);
    
    if (isAudioPlaying) {
      audioRef.current.pause();
    } else {
      // Ensure we have a src before playing
      if (audioRef.current.src) {
        // Set volume to ensure it's audible
        audioRef.current.volume = 0.7;
        
        console.log("Attempting to play audio...");
        const playPromise = audioRef.current.play();
        
        // Handle the play promise to catch any errors
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("Audio playback started successfully");
            })
            .catch(error => {
              console.error("Error playing audio:", error);
              setAudioError("Failed to play audio");
            });
        }
      } else {
        console.warn("Cannot play - no audio source set");
      }
    }
  };

  // Function to seek to a specific time
  const seekTo = (time: number) => {
    if (!audioRef.current) return;
    
    audioRef.current.currentTime = time;
    setCurrentAudioTime(time);
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
    getAudioElement: () => audioRef.current
  };
}
