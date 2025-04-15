
import React, { useEffect, useRef, useState } from 'react';
import SacredAudioPlayer from '@/components/audio/SacredAudioPlayer';
import { useAppStore } from '@/store';
import { toast } from 'sonner';
import { initializeAudioAfterInteraction, resumeAudioContext } from '@/utils/audioContextInitializer';

export interface FrequencyPlayerProps {
  audioUrl?: string;
  url?: string;
  frequency?: number;
  isPlaying?: boolean;
  onPlayToggle?: (isPlaying: boolean) => void;
  frequencyId?: string;
  groupId?: string;
  id?: string;
  forcePlay?: boolean;
}

// This is a wrapper component around SacredAudioPlayer for backward compatibility
const FrequencyPlayer: React.FC<FrequencyPlayerProps> = (props) => {
  // Ensure we're passing audioUrl correctly - prioritize audioUrl, but fall back to url if needed
  const audioSource = props.audioUrl || props.url;
  
  // Default audio source if none provided - this should be a real file that exists
  const defaultAudioSource = '/sounds/focus-ambient.mp3';
  
  // Determine the final audio source to use
  const [effectiveAudioSource, setEffectiveAudioSource] = useState<string>(
    audioSource || defaultAudioSource
  );
  
  // Use the force play parameter if present
  const forcePlay = props.forcePlay || false;
  
  // Get relevant state and functions from the store
  const { setIsPlaying, setAudioPlaybackError } = useAppStore();
  const initializationAttempted = useRef(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  
  // Initialize audio context after user interaction
  useEffect(() => {
    if (!initializationAttempted.current) {
      initializationAttempted.current = true;
      initializeAudioAfterInteraction();
      
      // Log important information
      console.log("🔊 FrequencyPlayer mounted with:", {
        audioSource,
        defaultAudioSource,
        effectiveAudioSource,
        frequency: props.frequency,
        isPlaying: props.isPlaying,
        forcePlay
      });
    }
    
    // Handle external isPlaying prop
    if (props.isPlaying !== undefined) {
      setIsPlaying(props.isPlaying);
    }
    
    if (forcePlay) {
      setTimeout(() => {
        console.log("🎵 Attempting force play...");
        resumeAudioContext().catch(error => {
          console.error("Failed to resume audio context:", error);
        });
        setIsPlaying(true);
        if (props.onPlayToggle) {
          props.onPlayToggle(true);
        }
      }, 300);
    }
    
    // Clean up function
    return () => {
      console.log("🔊 FrequencyPlayer unmounting");
    };
  }, [audioSource, forcePlay, props.isPlaying, props.onPlayToggle, setIsPlaying, defaultAudioSource, effectiveAudioSource]);
  
  const handlePlayToggle = (isPlaying: boolean) => {
    console.log("FrequencyPlayer: handlePlayToggle called with", isPlaying);
    
    // Resume audio context when play is triggered
    if (isPlaying) {
      resumeAudioContext().catch(error => {
        console.error("Failed to resume audio context:", error);
        toast.error("Audio playback issue. Click again to try.");
      });
    }
    
    // Call the onPlayToggle prop if provided
    if (props.onPlayToggle) {
      props.onPlayToggle(isPlaying);
    }
  };
  
  // Handler for audio loading errors
  const handleAudioError = () => {
    console.log("Audio error detected in FrequencyPlayer");
    setAudioPlaybackError("Failed to load audio");
  };
  
  // Handler for successful audio loading
  const handleAudioLoaded = () => {
    console.log("Audio successfully loaded");
    setAudioLoaded(true);
    setAudioPlaybackError(null);
  };
  
  return (
    <div className="frequency-player">
      <SacredAudioPlayer 
        audioUrl={effectiveAudioSource} 
        url={props.url}
        frequency={props.frequency}
        isPlaying={props.isPlaying}
        onPlayToggle={handlePlayToggle}
        frequencyId={props.frequencyId}
        groupId={props.groupId}
        id={props.id}
        forcePlay={forcePlay}
        onError={handleAudioError}
        onAudioLoaded={handleAudioLoaded}
      />
    </div>
  );
};

export default FrequencyPlayer;
