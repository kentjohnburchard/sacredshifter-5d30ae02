
import { useState, useRef, useEffect } from 'react';

export const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentAudioTime, setCurrentAudioTime] = useState(0);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  useEffect(() => {
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    
    const audio = audioRef.current;
    
    const setAudioData = () => {
      setDuration(audio.duration);
      setAudioLoaded(true);
    };

    const setAudioTime = () => {
      setCurrentAudioTime(audio.currentTime);
    };
    
    const handleAudioError = (e: Event) => {
      console.error("Error playing audio:", e);
      setAudioError("Failed to load or play audio");
      setIsAudioPlaying(false);
    };
    
    const handleAudioEnded = () => {
      setIsAudioPlaying(false);
      setCurrentAudioTime(0);
    };

    // Wait for audio to be loaded
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('error', handleAudioError);
    audio.addEventListener('ended', handleAudioEnded);
    
    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('error', handleAudioError);
      audio.removeEventListener('ended', handleAudioEnded);
      audio.pause();
    };
  }, []);

  const setAudioSource = (src: string) => {
    if (audioRef.current) {
      // Reset state
      setAudioLoaded(false);
      setAudioError(null);
      
      // Stop any current playback
      if (isAudioPlaying) {
        audioRef.current.pause();
        setIsAudioPlaying(false);
      }
      
      // Set new source
      audioRef.current.src = src;
      audioRef.current.load();
    }
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || !audioLoaded) return;

    if (isAudioPlaying) {
      audio.pause();
      setIsAudioPlaying(false);
    } else {
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsAudioPlaying(true);
          })
          .catch(error => {
            console.error("Error playing audio:", error);
            setAudioError("Failed to play audio");
          });
      }
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentAudioTime(audio.currentTime);
  };

  const handleVolumeChange = (volume: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  };
  
  const seekTo = (time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentAudioTime(time);
  };

  return {
    audioRef,
    togglePlayPause,
    isAudioPlaying,
    duration,
    currentAudioTime,
    handleTimeUpdate,
    handleVolumeChange,
    setAudioSource,
    audioLoaded,
    audioError,
    seekTo
  };
};
