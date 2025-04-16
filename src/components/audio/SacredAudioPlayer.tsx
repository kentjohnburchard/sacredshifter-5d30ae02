import React, { useEffect, useState, useRef } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { JourneyProps } from '@/types/journey';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useAppStore } from '@/store';
import { Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { getAudioContext, resumeAudioContext } from '@/utils/audioContextInitializer';

interface SacredAudioPlayerProps {
  journey?: JourneyProps;
  audioUrl?: string;
  url?: string; // Added for compatibility with FrequencyPlayer
  frequency?: number; // Added for frequency visualization
  isPlaying?: boolean; // Added for external control
  onPlayToggle?: (isPlaying: boolean) => void; // Added for external control
  forcePlay?: boolean;
  frequencyId?: string; // Added for tracking
  groupId?: string; // Added for grouping
  id?: string; // Added for identification
  onError?: () => void; // Added for error handling
  onAudioLoaded?: () => void; // Added for successful loading notification
}

// Default Supabase storage URL
const SUPABASE_STORAGE_URL = 'https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets';

const SacredAudioPlayer: React.FC<SacredAudioPlayerProps> = ({
  journey,
  audioUrl,
  url, // Support legacy 'url' prop
  frequency,
  isPlaying: externalIsPlaying,
  onPlayToggle,
  forcePlay = false,
  frequencyId,
  groupId,
  id,
  onError,
  onAudioLoaded
}) => {
  const {
    togglePlay,
    seekTo,
    setAudioSource: setGlobalAudioSource,
    duration,
    currentTime,
    isPlaying: internalIsPlaying,
    audioRef,
    audioLoaded
  } = useAudioPlayer();
  const [volume, setVolume] = useState(70);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const { setAudioData, setFrequencyData, setIsPlaying, setAudioPlaybackError } = useAppStore();
  const audioPlayAttempted = useRef(false);
  
  // Audio processing state
  const [audioSourceValid, setAudioSourceValid] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(true);
  
  // Updated default fallbacks with working paths
  const [fallbackAudioUrl] = useState<string>(`${SUPABASE_STORAGE_URL}/meditation/cosmic-breath.mp3`);
  
  // Error handling with strict limits
  const errorToastShownRef = useRef(false);
  const errorCountRef = useRef(0);
  const MAX_ERROR_RETRIES = 2;

  // Determine if we're in controlled or uncontrolled mode
  const isControlledMode = externalIsPlaying !== undefined;
  const isPlaying = isControlledMode ? externalIsPlaying : internalIsPlaying;

  // Format time to mm:ss
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Normalize audio URL - ensure we use the correct base URL for relative paths
  const normalizeAudioUrl = (url?: string): string | undefined => {
    if (!url) return undefined;
    
    // If it's already an absolute URL, return it as is
    if (url.startsWith('http')) {
      return url;
    }
    
    // If it starts with a slash, it's a relative path from the root
    if (url.startsWith('/')) {
      return `${SUPABASE_STORAGE_URL}${url}`;
    }
    
    // Otherwise, it's just a filename
    return `${SUPABASE_STORAGE_URL}/${url}`;
  };
  
  // Ensure we have a valid audio file
  const rawAudioUrl = audioUrl || url;
  const validatedAudioUrl = normalizeAudioUrl(rawAudioUrl) || fallbackAudioUrl;
  const [currentAudioSource, setCurrentAudioSource] = useState(validatedAudioUrl);

  // Log the normalized audio URL for debugging
  useEffect(() => {
    console.log("Normalized audio URL:", validatedAudioUrl);
    console.log("Using fallback URL:", fallbackAudioUrl);
  }, [validatedAudioUrl, fallbackAudioUrl]);
  
  // Reset error state when audio source changes
  useEffect(() => {
    // Only reset if we're changing to a different source
    if (currentAudioSource !== validatedAudioUrl) {
      console.log("Audio source changed, resetting error state:", validatedAudioUrl);
      errorCountRef.current = 0;
      errorToastShownRef.current = false;
      setLoadingAudio(true);
      setAudioSourceValid(false);
    }
  }, [validatedAudioUrl, currentAudioSource]);
  
  // Audio source validation with improved error handling
  useEffect(() => {
    if (!validatedAudioUrl) {
      console.error("No audio URL provided");
      setAudioSourceValid(false);
      setLoadingAudio(false);
      return;
    }
    
    console.log("Validating audio source:", validatedAudioUrl);
    setLoadingAudio(true);
    
    // Create a test Audio element to check if the file exists/loads
    const audioTest = new Audio();
    
    const handleTestSuccess = () => {
      console.log("✅ Audio test successful for:", validatedAudioUrl);
      setAudioSourceValid(true);
      setLoadingAudio(false);
      setCurrentAudioSource(validatedAudioUrl);
      if (onAudioLoaded) onAudioLoaded();
      
      // Reset error state on success
      errorCountRef.current = 0;
      errorToastShownRef.current = false;
      
      // Clean up test element
      audioTest.removeEventListener('canplaythrough', handleTestSuccess);
      audioTest.removeEventListener('error', handleTestError);
      audioTest.src = '';
    };
    
    const handleTestError = () => {
      console.error("❌ Audio test failed for:", validatedAudioUrl);
      errorCountRef.current += 1;
      
      // Only show error toast once
      if (!errorToastShownRef.current) {
        errorToastShownRef.current = true;
        
        // Only show toast for user-provided audio, not fallbacks
        if (validatedAudioUrl !== fallbackAudioUrl) {
          toast.error("Audio file couldn't be loaded", {
            id: "audio-error", // Use consistent ID to prevent duplicates
            description: "Using fallback audio instead"
          });
        }
      }
      
      setLoadingAudio(false);
      
      // Use fallback only if we're not already trying it
      if (validatedAudioUrl !== fallbackAudioUrl && errorCountRef.current >= MAX_ERROR_RETRIES) {
        console.log("Using fallback audio after multiple failed attempts");
        setCurrentAudioSource(fallbackAudioUrl);
        if (onError) onError();
      } else if (validatedAudioUrl === fallbackAudioUrl) {
        // Even the fallback failed
        console.error("Fallback audio also failed to load");
        setAudioPlaybackError("Audio couldn't be loaded");
        setAudioSourceValid(false);
        
        // Try another fallback from a different domain
        const altFallbackUrl = "https://assets.mixkit.co/sfx/preview/mixkit-simple-countdown-922.mp3";
        console.log("Trying alternative fallback from mixkit.co");
        setCurrentAudioSource(altFallbackUrl);
      }
      
      // Clean up test element
      audioTest.removeEventListener('canplaythrough', handleTestSuccess);
      audioTest.removeEventListener('error', handleTestError);
      audioTest.src = '';
    };
    
    // Set up listeners
    audioTest.addEventListener('canplaythrough', handleTestSuccess, { once: true });
    audioTest.addEventListener('error', handleTestError, { once: true });
    
    // Add crossOrigin for CORS
    audioTest.crossOrigin = "anonymous";
    
    // Start test with a timeout to prevent hanging
    audioTest.src = validatedAudioUrl;
    
    // Safety timeout in case the events never fire
    const timeoutId = setTimeout(() => {
      if (loadingAudio) {
        console.warn("Audio load test timed out");
        audioTest.removeEventListener('canplaythrough', handleTestSuccess);
        audioTest.removeEventListener('error', handleTestError);
        audioTest.src = '';
        
        // Assume failure and try fallback
        if (validatedAudioUrl !== fallbackAudioUrl) {
          console.log("Using fallback audio after timeout");
          setCurrentAudioSource(fallbackAudioUrl);
        } else {
          const altFallbackUrl = "https://assets.mixkit.co/sfx/preview/mixkit-simple-countdown-922.mp3";
          console.log("Trying alternative fallback from mixkit.co after timeout");
          setCurrentAudioSource(altFallbackUrl);
          setAudioSourceValid(false);
          setLoadingAudio(false);
        }
      }
    }, 8000); // 8 second timeout
    
    return () => {
      // Clean up on unmount if still attached
      clearTimeout(timeoutId);
      audioTest.removeEventListener('canplaythrough', handleTestSuccess);
      audioTest.removeEventListener('error', handleTestError);
      audioTest.src = '';
    };
  }, [validatedAudioUrl, onError, onAudioLoaded, fallbackAudioUrl, loadingAudio]);

  // Set audio source when component mounts or audioUrl changes
  useEffect(() => {
    if (currentAudioSource && !loadingAudio) {
      console.log("Setting global audio source:", currentAudioSource);
      setGlobalAudioSource(currentAudioSource);
      // Force an update to consider the source valid after timeout
      // This allows the player UI to initialize even if audio validation is slow
      setTimeout(() => {
        setAudioSourceValid(true);
      }, 2000);
    }
  }, [currentAudioSource, loadingAudio, setGlobalAudioSource]);

  // Handle play/pause toggling with internal/external state management
  const handleTogglePlay = () => {
    // Set up audio context first if needed
    resumeAudioContext().catch(e => {
      console.warn("Could not resume audio context:", e);
    });
    
    // Force the audio to be valid if we've waited long enough
    if (!audioSourceValid && !loadingAudio && currentAudioSource) {
      setAudioSourceValid(true);
    }
    
    console.log("Toggle play called, current state:", isPlaying);
    
    // Toggle the internal player state
    togglePlay();
    
    // If we're in controlled mode, call the callback
    if (isControlledMode && onPlayToggle) {
      onPlayToggle(!isPlaying);
    } else {
      // Otherwise, update the global state
      setIsPlaying(!isPlaying);
    }
  };

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume, audioRef]);
  
  // Auto play when forcePlay is true
  useEffect(() => {
    if (forcePlay && !audioPlayAttempted.current) {
      audioPlayAttempted.current = true;
      console.log("Auto-playing audio");
      
      // Small delay to ensure everything is ready
      setTimeout(() => {
        if (!isPlaying) {
          console.log("Forcing play now");
          handleTogglePlay();
        }
      }, 1000);
    }
  }, [forcePlay, isPlaying]);
  
  // Connect audio to analyzer for visualizations if needed
  useEffect(() => {
    const setupAudioAnalyzer = async () => {
      // Wait for the audio to be ready
      if (!audioRef.current) {
        return;
      }
      
      try {
        const audioContext = getAudioContext();
        if (!audioContext) return;
        
        // Try to resume the context
        await resumeAudioContext();
        
        // Create analyzer node
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        
        // Connect audio element to analyzer (if not already connected)
        try {
          const source = audioContext.createMediaElementSource(audioRef.current);
          source.connect(analyser);
          analyser.connect(audioContext.destination);
          
          // Set up data array to receive frequency data
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          
          // Start updating audio data at animation frame rate
          const updateAudioData = () => {
            if (isPlaying) {
              analyser.getByteFrequencyData(dataArray);
              setFrequencyData(new Uint8Array(dataArray));
              
              analyser.getByteTimeDomainData(dataArray);
              setAudioData(new Uint8Array(dataArray));
            }
            requestAnimationFrame(updateAudioData);
          };
          
          updateAudioData();
          console.log("Audio analyzer connected successfully");
          
        } catch (e: any) {
          // Ignore already connected errors
          if (e.toString().includes('already connected')) {
            console.log("Audio element already connected to analyzer");
          } else {
            throw e;
          }
        }
      } catch (error) {
        console.error("Error setting up audio analyzer:", error);
      }
    };
    
    // Try to set up analyzer
    setupAudioAnalyzer();
    
  }, [audioRef, isPlaying, setAudioData, setFrequencyData]);
  
  // Generate mock audio data for visualizer even when audio isn't playing
  useEffect(() => {
    if (!isPlaying) {
      // Create mock audio data for visualizer
      const mockDataSize = 128;
      const mockFrequencyData = new Uint8Array(mockDataSize);
      const mockWaveformData = new Uint8Array(mockDataSize);
      
      // Fill with placeholder data
      for (let i = 0; i < mockDataSize; i++) {
        // Create a basic waveform shape (sine wave)
        mockWaveformData[i] = 128 + Math.sin(i / 10) * 25;
        
        // Create frequency bars that look like a typical spectrum
        if (i < mockDataSize / 3) {
          // Lower frequencies - higher amplitude
          mockFrequencyData[i] = 50 + Math.random() * 30;
        } else if (i < mockDataSize * 2/3) {
          // Mid frequencies - medium amplitude
          mockFrequencyData[i] = 30 + Math.random() * 20;
        } else {
          // High frequencies - lower amplitude
          mockFrequencyData[i] = 10 + Math.random() * 15;
        }
      }
      
      // Only update occasionally when not playing
      const interval = setInterval(() => {
        setFrequencyData(mockFrequencyData);
        setAudioData(mockWaveformData);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isPlaying, setFrequencyData, setAudioData]);
  
  return (
    <div className="bg-black/50 p-4 rounded-b-xl backdrop-blur-sm">
      <div className="flex flex-col text-white">
        <div className="flex justify-between items-center mb-2">
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">
              {journey?.title || (frequency ? `${frequency} Hz` : "Sacred Frequency")}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {frequency ? `${frequency} Hz` : (journey?.frequencies?.length ? `${journey.frequencies[0]} Hz` : "432 Hz")} | 
              {journey?.chakras?.length ? ` ${journey.chakras[0]} Chakra` : " Crown Chakra"}
            </p>
          </div>
          
          <div className="flex items-center">
            <div 
              className="relative" 
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0 text-white"
                onClick={() => setVolume(prev => prev === 0 ? 70 : 0)}
              >
                {volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : volume < 50 ? (
                  <Volume1 className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              
              {showVolumeSlider && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-black/90 rounded-lg w-24">
                  <Slider
                    value={[volume]}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={(value) => setVolume(value[0])}
                    className="w-20"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-4 mb-2">
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0 text-white opacity-70 hover:opacity-100"
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button 
            onClick={handleTogglePlay}
            size="icon"
            disabled={loadingAudio && !audioSourceValid}
            className={cn(
              "h-10 w-10 rounded-full bg-purple-600 hover:bg-purple-700 text-white",
              isPlaying ? "animate-pulse" : "",
              (loadingAudio && !audioSourceValid) ? "opacity-70 cursor-not-allowed" : ""
            )}
          >
            {(loadingAudio && !audioSourceValid) ? (
              <span className="h-4 w-4 block rounded-full border-2 border-t-transparent border-white animate-spin"></span>
            ) : isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </Button>
          
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0 text-white opacity-70 hover:opacity-100"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{formatTime(currentTime)}</span>
          
          <div className="relative w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="absolute h-full bg-purple-500 rounded-full"
              style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
            />
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={(e) => seekTo(Number(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-pointer w-full"
            />
          </div>
          
          <span className="text-xs text-gray-400">{formatTime(duration || 0)}</span>
        </div>
      </div>
    </div>
  );
};

export default SacredAudioPlayer;
