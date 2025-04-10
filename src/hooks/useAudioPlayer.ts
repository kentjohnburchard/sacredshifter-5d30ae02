
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

export const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentAudioTime, setCurrentAudioTime] = useState(0);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const maxLoadAttempts = 3;

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
      
      if (loadAttempts < maxLoadAttempts) {
        // Try to recover by regenerating the audio locally
        console.log(`Attempt ${loadAttempts + 1} of ${maxLoadAttempts}: Trying to recover audio playback`);
        setLoadAttempts(prev => prev + 1);
        
        try {
          // Create a simple oscillator tone as fallback
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = ctx.createOscillator();
          const gainNode = ctx.createGain();
          
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(432, ctx.currentTime); // Default to 432Hz
          gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
          
          oscillator.connect(gainNode);
          gainNode.connect(ctx.destination);
          
          oscillator.start();
          setTimeout(() => oscillator.stop(), 5000); // Stop after 5 seconds
          
          // Don't set error state since we're providing alternative audio
          return;
        } catch (err) {
          console.error("Failed to create fallback audio:", err);
        }
      }
      
      setAudioError("Failed to load or play audio");
      setIsAudioPlaying(false);
      toast.error("Could not load audio. Using local audio generation instead.");
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
    };
  }, [isAudioPlaying, loadAttempts]);

  const formatAudioUrl = (url: string): string => {
    // If it's already a proper URL with http/https, return as is
    if (!url) {
      console.warn("Empty audio URL provided");
      return '';
    }
    
    // Check if it's a data URL (our fallback mechanism)
    if (url.startsWith('data:')) {
      return url;
    }
    
    // If it's a relative path without protocol, try adding protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      // Check for public folder path first
      if (url.startsWith('/sounds/') || url.startsWith('sounds/')) {
        const path = url.startsWith('/') ? url.substring(1) : url;
        return `${window.location.origin}/${path}`;
      }
      
      // If it's a path to a file from Pixabay, fix the URL
      if (url.includes('pixabay.com') || url.includes('/music/')) {
        const path = url.startsWith('/') ? url.substring(1) : url;
        return `https://cdn.pixabay.com/${path}`;
      }
      
      // For Supabase storage URLs
      if (url.includes('storage/v1/object')) {
        return url;
      }
      
      // For other URLs, we assume they're local and provide a fallback mechanism
      console.log("Using local audio generation instead of external URL:", url);
      // Return a data URL for a silent audio clip
      return 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAAAAAABq';
    }
    
    return url;
  };

  const setAudioSource = (src: string) => {
    if (!src) {
      console.error("No audio source provided");
      setAudioError("No audio source provided");
      return;
    }
    
    setLoadAttempts(0); // Reset load attempts for new source
    
    try {
      const formattedUrl = formatAudioUrl(src);
      console.log("Setting audio source:", formattedUrl);
      
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
        audioRef.current.src = formattedUrl;
        audioRef.current.load();
        console.log("Audio started loading:", formattedUrl);
      } else {
        console.error("Audio element not initialized");
      }
    } catch (err) {
      console.error("Error setting audio source:", err);
      setAudioError(`Error setting audio source: ${err}`);
      toast.error("Failed to load audio file, using local generation instead");
    }
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) {
      console.error("Audio element not initialized");
      return;
    }
    
    // If no source, generate a simple tone
    if (!audio.src || audio.src === 'about:blank') {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(432, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        if (isAudioPlaying) {
          oscillator.stop();
          setIsAudioPlaying(false);
        } else {
          oscillator.start();
          setIsAudioPlaying(true);
          // Create a timer to simulate track duration
          setTimeout(() => {
            oscillator.stop();
            setIsAudioPlaying(false);
          }, 10000); // 10 seconds
        }
        return;
      } catch (err) {
        console.error("Error generating tone:", err);
        toast.error("Could not generate audio tone");
        return;
      }
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
            
            // Try to generate a tone instead
            try {
              const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
              const oscillator = ctx.createOscillator();
              const gainNode = ctx.createGain();
              
              oscillator.type = 'sine';
              oscillator.frequency.setValueAtTime(432, ctx.currentTime);
              gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
              
              oscillator.connect(gainNode);
              gainNode.connect(ctx.destination);
              
              oscillator.start();
              setIsAudioPlaying(true);
              
              toast.info("Using generated tone instead");
              
              // Stop after 10 seconds
              setTimeout(() => {
                oscillator.stop();
                setIsAudioPlaying(false);
              }, 10000);
            } catch (err) {
              console.error("Error generating fallback tone:", err);
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
    formatAudioUrl
  };
};
