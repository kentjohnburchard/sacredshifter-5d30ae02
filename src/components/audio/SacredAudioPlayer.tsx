import React, { useEffect, useState, useRef } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { JourneyProps } from '@/types/journey';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useAppStore } from '@/store';
import { Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

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
    setAudioSource: setGlobalAudioSource, // Renamed to avoid conflict
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
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const [fallbackAudioUrl] = useState<string>('/sounds/focus-ambient.mp3');

  // Determine if we're in controlled or uncontrolled mode
  const isControlledMode = externalIsPlaying !== undefined;
  const isPlaying = isControlledMode ? externalIsPlaying : internalIsPlaying;

  useEffect(() => {
    console.log("SacredAudioPlayer current state:", {
      audioUrl,
      externalIsPlaying,
      internalIsPlaying,
      isPlaying,
      forcePlay,
      audioLoaded,
      audioRef: audioRef.current ? "exists" : "none"
    });
  }, [audioUrl, externalIsPlaying, internalIsPlaying, isPlaying, forcePlay, audioLoaded, audioRef]);

  // Format time to mm:ss
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Ensure we have a valid audio file
  const validatedAudioUrl = audioUrl || url || '/sounds/focus-ambient.mp3';
  const [audioSource, setLocalAudioSource] = useState(validatedAudioUrl);
  
  useEffect(() => {
    console.log("SacredAudioPlayer validating source:", validatedAudioUrl);
    
    // Create a test Audio element to check if the file exists/loads
    const audioTest = new Audio();
    
    const handleTestSuccess = () => {
      console.log("Audio test successful for:", validatedAudioUrl);
      setLocalAudioSource(validatedAudioUrl);
      if (onAudioLoaded) onAudioLoaded();
      
      // Clean up test element
      audioTest.removeEventListener('canplaythrough', handleTestSuccess);
      audioTest.removeEventListener('error', handleTestError);
      audioTest.src = '';
    };
    
    const handleTestError = () => {
      console.error("Audio test failed for:", validatedAudioUrl);
      // Fallback to default audio
      setLocalAudioSource('/sounds/focus-ambient.mp3');
      if (onError) onError();
      
      // Clean up test element
      audioTest.removeEventListener('canplaythrough', handleTestSuccess);
      audioTest.removeEventListener('error', handleTestError);
      audioTest.src = '';
    };
    
    // Set up listeners
    audioTest.addEventListener('canplaythrough', handleTestSuccess);
    audioTest.addEventListener('error', handleTestError);
    
    // Start test
    audioTest.src = validatedAudioUrl;
    
    return () => {
      // Clean up on unmount if still attached
      audioTest.removeEventListener('canplaythrough', handleTestSuccess);
      audioTest.removeEventListener('error', handleTestError);
      audioTest.src = '';
    };
  }, [validatedAudioUrl, onError, onAudioLoaded]);

  // Set audio source when component mounts or audioUrl changes
  useEffect(() => {
    if (audioSource) {
      console.log("Setting audio source:", audioSource);
      setGlobalAudioSource(audioSource);
    } else {
      console.warn("No audio URL provided to SacredAudioPlayer");
      // Set a fallback audio source
      setGlobalAudioSource('/sounds/focus-ambient.mp3');
    }
  }, [audioSource, setGlobalAudioSource]);

  // Handle play/pause toggling with internal/external state management
  const handleTogglePlay = () => {
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

    // Initialize audio context if needed after user interaction
    if (!audioContextRef.current) {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
          audioContextRef.current = new AudioContext();
          console.log("AudioContext created after user interaction");
        }
      } catch (e) {
        console.error("Failed to create AudioContext:", e);
      }
    } else if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume().catch(e => {
        console.error("Failed to resume AudioContext:", e);
      });
    }
  };

  // Set up audio analyser
  useEffect(() => {
    console.log("Setting up audio analyser");

    const setupAudioAnalyser = () => {
      try {
        // Check if we already have an audio context
        if (!audioContextRef.current) {
          const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
          if (!AudioContext) {
            console.warn("AudioContext not supported");
            return;
          }
          
          audioContextRef.current = new AudioContext();
        }
        
        // Check if audio element exists
        if (!audioRef.current) {
          console.log("Audio element not found yet");
          setTimeout(setupAudioAnalyser, 500);
          return;
        }

        // Resume audio context if it's suspended
        if (audioContextRef.current.state === 'suspended') {
          console.log("Resuming audio context");
          audioContextRef.current.resume().catch(e => {
            console.error("Failed to resume audio context:", e);
          });
        }
        
        // Set up analyser if it doesn't exist
        if (!analyserRef.current) {
          analyserRef.current = audioContextRef.current.createAnalyser();
          analyserRef.current.fftSize = 256; // Power of 2, controls frequency bin count
        }
        
        // Connect audio element to analyser if not already connected
        if (!audioSourceRef.current) {
          try {
            console.log("Creating media element source");
            audioSourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
            audioSourceRef.current.connect(analyserRef.current);
            analyserRef.current.connect(audioContextRef.current.destination);
            console.log("Connected audio source to analyser");
          } catch (e: any) {
            if (e.toString().includes('already connected')) {
              console.log("Audio already connected");
            } else {
              console.error("Error connecting audio source:", e);
              setAudioPlaybackError("Error connecting audio source");
            }
          }
        }
        
        // Set up the audio data update loop
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const freqArray = new Uint8Array(bufferLength);
        
        const updateAudioData = () => {
          if (analyserRef.current && isPlaying) {
            // Get audio data
            analyserRef.current.getByteTimeDomainData(dataArray);
            setAudioData(new Uint8Array(dataArray));
            
            // Get frequency data
            analyserRef.current.getByteFrequencyData(freqArray);
            setFrequencyData(new Uint8Array(freqArray));
          }
          requestAnimationFrame(updateAudioData);
        };
        
        updateAudioData();
        
      } catch (error) {
        console.error("Error setting up audio analyser:", error);
        setAudioPlaybackError("Error setting up audio visualizer");
      }
    };
    
    // Add a delay to ensure the audio element is ready
    setTimeout(setupAudioAnalyser, 1000);
    
    // Also add event listeners to try to initialize audio after user interaction
    const handleUserInteraction = () => {
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume().catch(e => {
          console.error("Failed to resume audio context after user interaction:", e);
        });
      }
    };
    
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
    
    return () => {
      // Clean up
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      
      if (audioSourceRef.current) {
        try {
          audioSourceRef.current.disconnect();
        } catch (e) {
          console.error("Error disconnecting audio source:", e);
        }
      }
      
      if (analyserRef.current) {
        try {
          analyserRef.current.disconnect();
        } catch (e) {
          console.error("Error disconnecting analyser:", e);
        }
      }
    };
  }, [audioRef, isPlaying, setAudioData, setFrequencyData, setAudioPlaybackError]);

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume, audioRef]);
  
  // Auto play when forcePlay is true
  useEffect(() => {
    if (forcePlay && audioLoaded && !audioPlayAttempted.current) {
      audioPlayAttempted.current = true;
      console.log("Auto-playing audio");
      
      // Small delay to ensure everything is ready
      setTimeout(() => {
        if (!isPlaying) {
          console.log("Forcing play now");
          handleTogglePlay();
        }
      }, 500);
    }
  }, [forcePlay, audioLoaded, isPlaying]);
  
  // Handle errors
  useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      console.error("Audio error:", e);
      toast.error("Audio playback error. Please try again.");
      setAudioPlaybackError("Audio playback error");
      
      // Try to use fallback audio
      if (audioRef.current && audioRef.current.src !== fallbackAudioUrl) {
        console.log("Attempting to use fallback audio");
        setLocalAudioSource(fallbackAudioUrl);
      }
    };
    
    if (audioRef.current) {
      audioRef.current.addEventListener('error', handleError as EventListener);
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('error', handleError as EventListener);
      }
    };
  }, [audioRef, fallbackAudioUrl, setAudioPlaybackError]);
  
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
            className={cn(
              "h-10 w-10 rounded-full bg-purple-600 hover:bg-purple-700 text-white",
              isPlaying ? "animate-pulse" : ""
            )}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
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
              style={{ width: `${(currentTime / duration) * 100}%` }}
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
