
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { createTone } from '@/utils/audioUtils';

export const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentAudioTime, setCurrentAudioTime] = useState(0);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const bufferSourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      console.log("Creating new Audio element");
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
      
      // Try to generate a fallback tone if we have frequency information
      const frequencyMatch = audio.src.match(/(\d+)hz/i);
      if (frequencyMatch && frequencyMatch[1]) {
        const frequency = parseInt(frequencyMatch[1]);
        if (!isNaN(frequency) && frequency > 0) {
          toast.info(`Generating ${frequency}Hz tone as fallback`);
          playFallbackTone(frequency);
        } else {
          toast.error("Could not load audio. The file may be missing or in an unsupported format.");
        }
      } else {
        toast.error("Could not load audio. The file may be missing or in an unsupported format.");
      }
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
      
      // Pause audio when component is unmounted
      if (isAudioPlaying) {
        console.log("Pausing audio on cleanup");
        audio.pause();
      }
      
      // Also stop any fallback tone
      stopFallbackTone();
    };
  }, [isAudioPlaying]);

  // Play a fallback tone using Web Audio API when the audio file fails to load
  const playFallbackTone = (frequency: number) => {
    try {
      stopFallbackTone(); // Stop any currently playing tone
      
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      if (audioContextRef.current) {
        const buffer = createTone(audioContextRef.current, frequency, 30, 0.5);
        bufferSourceRef.current = audioContextRef.current.createBufferSource();
        bufferSourceRef.current.buffer = buffer;
        bufferSourceRef.current.connect(audioContextRef.current.destination);
        bufferSourceRef.current.start();
        setIsAudioPlaying(true);
        console.log(`Playing fallback tone at ${frequency}Hz`);
      }
    } catch (error) {
      console.error("Error playing fallback tone:", error);
      toast.error("Unable to generate audio fallback");
    }
  };
  
  const stopFallbackTone = () => {
    if (bufferSourceRef.current) {
      try {
        bufferSourceRef.current.stop();
        bufferSourceRef.current.disconnect();
        bufferSourceRef.current = null;
      } catch (error) {
        console.error("Error stopping fallback tone:", error);
      }
    }
  };

  const formatAudioUrl = (url: string): string => {
    // If it's already a proper URL with http/https, return as is
    if (!url) {
      console.warn("Empty audio URL provided");
      return '';
    }
    
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // If it's a path to a file from Pixabay, fix the URL
    if (url.includes('pixabay.com') || url.includes('/music/')) {
      // Make sure there's no leading slash in the path
      const path = url.startsWith('/') ? url.substring(1) : url;
      return `https://cdn.pixabay.com/${path}`;
    }
    
    // For Supabase storage URLs
    if (url.includes('storage/v1/object')) {
      return url;
    }
    
    // Check for local audio files
    if (url.startsWith('/audio/') || url.startsWith('audio/')) {
      const path = url.startsWith('/') ? url : `/${url}`;
      return `${window.location.origin}${path}`;
    }
    
    // For other URLs, assume they're relative to the Supabase storage
    console.log("Using Supabase storage URL:", url);
    return `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${url}`;
  };

  const setAudioSource = (src: string) => {
    if (!src) {
      console.error("No audio source provided");
      setAudioError("No audio source provided");
      return;
    }
    
    const formattedUrl = formatAudioUrl(src);
    console.log("Setting audio source:", formattedUrl);
    
    if (audioRef.current) {
      // Reset state
      setAudioLoaded(false);
      setAudioError(null);
      
      // Stop any current playback
      if (isAudioPlaying) {
        audioRef.current.pause();
        stopFallbackTone();
        setIsAudioPlaying(false);
      }
      
      try {
        // Set new source
        audioRef.current.src = formattedUrl;
        audioRef.current.load();
        console.log("Audio started loading:", formattedUrl);
      } catch (err) {
        console.error("Error setting audio source:", err);
        setAudioError(`Error setting audio source: ${err}`);
        toast.error("Failed to load audio file");
      }
    } else {
      console.error("Audio element not initialized");
    }
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) {
      console.error("Audio element not initialized");
      return;
    }
    
    // If fallback tone is playing, stop it on toggle
    if (bufferSourceRef.current && isAudioPlaying) {
      stopFallbackTone();
      setIsAudioPlaying(false);
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
            
            // Try to extract frequency from filename for fallback
            const frequencyMatch = audio.src.match(/(\d+)hz/i);
            if (frequencyMatch && frequencyMatch[1]) {
              const frequency = parseInt(frequencyMatch[1]);
              if (!isNaN(frequency) && frequency > 0) {
                toast.info(`Generating ${frequency}Hz tone as fallback`);
                playFallbackTone(frequency);
              } else {
                toast.error("Failed to play audio. Please try again.");
              }
            } else {
              toast.error("Failed to play audio. Please try again.");
            }
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
    seekTo,
    formatAudioUrl,
    playFallbackTone
  };
};
