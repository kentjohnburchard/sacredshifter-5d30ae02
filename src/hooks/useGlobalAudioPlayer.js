
import { useState, useEffect, useRef, useCallback } from 'react';

export function useGlobalAudioPlayer() {
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  
  const audioRef = useRef(null);
  const onEndedCallbackRef = useRef(null);
  
  // Initialize audio element
  useEffect(() => {
    // Look for an existing audio element
    let audioElement = document.querySelector('audio#global-audio-player');
    
    // If it doesn't exist, create it
    if (!audioElement) {
      audioElement = document.createElement('audio');
      audioElement.id = 'global-audio-player';
      audioElement.style.display = 'none';
      audioElement.crossOrigin = 'anonymous'; // For audio analysis
      document.body.appendChild(audioElement);
      console.log("Creating new Audio element");
    }
    
    audioRef.current = audioElement;
    
    const audio = audioRef.current;
    
    // Set up event listeners
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleVolumeChange = () => setVolume(audio.volume);
    const handlePlay = () => {
      console.log("Audio play event detected");
      setIsPlaying(true);
    };
    const handlePause = () => {
      console.log("Audio pause event detected");
      setIsPlaying(false);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      
      // Call the onEnded callback if it exists
      if (onEndedCallbackRef.current) {
        console.log("Triggering onEnded callback");
        onEndedCallbackRef.current();
      }
    };
    
    // Add event listeners
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('volumechange', handleVolumeChange);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    
    // Return cleanup function
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('volumechange', handleVolumeChange);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);
  
  // Play audio function
  const playAudio = useCallback((audioInfo) => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    
    // Check if we're already playing this audio
    if (currentAudio && currentAudio.source === audioInfo.source && isPlaying) {
      console.log("Already playing this audio, skipping replay");
      return;
    }
    
    console.log("Global player: Playing new song:", audioInfo.title, "URL:", audioInfo.source);
    
    // Update audio source
    audio.src = audioInfo.source;
    audio.volume = volume;
    
    // Load and play
    audio.load();
    
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error("Error playing audio:", error);
      });
    }
    
    // Update current audio info
    setCurrentAudio(audioInfo);
  }, [currentAudio, isPlaying, volume]);
  
  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    
    if (isPlaying) {
      audio.pause();
    } else if (audio.src) {
      audio.play().catch(error => {
        console.error("Error playing audio:", error);
      });
    }
  }, [isPlaying]);
  
  // Seek to a specific time
  const seek = useCallback((time) => {
    if (!audioRef.current) return;
    
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }, []);
  
  // Set volume
  const setVolumeLevel = useCallback((level) => {
    if (!audioRef.current) return;
    
    const clampedVolume = Math.max(0, Math.min(1, level));
    audioRef.current.volume = clampedVolume;
    setVolume(clampedVolume);
  }, []);
  
  // Set onEnded callback
  const setOnEndedCallback = useCallback((callback) => {
    if (callback) {
      console.log("Global audio player: onEndedCallback set");
      onEndedCallbackRef.current = callback;
    } else {
      onEndedCallbackRef.current = null;
    }
  }, []);
  
  // Reset player completely - useful for recovering from errors
  const resetPlayer = useCallback(() => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    
    // Stop and reset current audio
    audio.pause();
    audio.currentTime = 0;
    audio.src = '';
    
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    
    // Create a fresh audio element to replace the current one
    const newAudio = document.createElement('audio');
    newAudio.id = 'global-audio-player';
    newAudio.style.display = 'none';
    newAudio.crossOrigin = 'anonymous';
    
    // Replace the old element with the new one
    if (audio.parentNode) {
      audio.parentNode.replaceChild(newAudio, audio);
    } else {
      document.body.appendChild(newAudio);
    }
    
    // Update the ref
    audioRef.current = newAudio;
    
    console.log("Global audio player: Reset complete");
  }, []);
  
  return {
    currentAudio,
    isPlaying,
    duration,
    currentTime,
    volume,
    audioElement: audioRef.current,
    playAudio,
    togglePlayPause,
    seek,
    setVolume: setVolumeLevel,
    setOnEndedCallback,
    resetPlayer
  };
}
