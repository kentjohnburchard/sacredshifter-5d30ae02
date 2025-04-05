
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

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
      console.log("Audio loaded and ready:", audio.src);
    };

    const setAudioTime = () => {
      setCurrentAudioTime(audio.currentTime);
    };
    
    const handleAudioError = (e: Event) => {
      console.error("Error playing audio:", e);
      setAudioError("Failed to load or play audio");
      setIsAudioPlaying(false);
      toast.error("Could not load audio. The file may be missing or in an unsupported format.");
    };
    
    const handleAudioEnded = () => {
      console.log("Audio playback ended");
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
    if (!src) {
      console.error("No audio source provided");
      setAudioError("No audio source provided");
      return;
    }
    
    console.log("Setting audio source:", src);
    
    if (audioRef.current) {
      // Reset state
      setAudioLoaded(false);
      setAudioError(null);
      
      // Stop any current playback
      if (isAudioPlaying) {
        audioRef.current.pause();
        setIsAudioPlaying(false);
      }
      
      try {
        // Set new source
        audioRef.current.src = src;
        audioRef.current.load();
      } catch (err) {
        console.error("Error setting audio source:", err);
        setAudioError(`Error setting audio source: ${err}`);
        toast.error("Failed to load audio file");
      }
    }
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) {
      console.error("Audio element not initialized");
      return;
    }
    
    // If no source, don't try to play
    if (!audio.src) {
      console.error("No audio source set");
      toast.error("No audio available");
      return;
    }

    if (isAudioPlaying) {
      console.log("Pausing audio:", audio.src);
      audio.pause();
      setIsAudioPlaying(false);
    } else {
      console.log("Playing audio:", audio.src);
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsAudioPlaying(true);
            console.log("Audio playback started successfully");
          })
          .catch(error => {
            console.error("Error playing audio:", error);
            setAudioError(`Failed to play audio: ${error.message}`);
            toast.error("Failed to play audio. Please try again.");
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
