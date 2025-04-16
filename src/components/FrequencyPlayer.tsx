
import React, { useEffect, useRef, useState } from 'react';
import SacredAudioPlayer from '@/components/audio/SacredAudioPlayer';
import { useAppStore } from '@/store';
import { toast } from 'sonner';
import useAudioAnalyzer from '@/hooks/useAudioAnalyzer';

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
  
  // Don't use a default audio source that doesn't exist
  const [effectiveAudioSource, setEffectiveAudioSource] = useState<string | undefined>(audioSource);
  
  // Use the force play parameter if present
  const forcePlay = props.forcePlay || false;
  
  // Get relevant state and functions from the store
  const { setIsPlaying, setAudioPlaybackError } = useAppStore();
  const { resumeAudioContext } = useAudioAnalyzer();
  const initializationAttempted = useRef(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  
  // Initialize audio context after user interaction
  useEffect(() => {
    if (!initializationAttempted.current) {
      initializationAttempted.current = true;
      
      // Log important information
      console.log("🔊 FrequencyPlayer mounted with:", {
        audioSource,
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
    
    if (forcePlay && audioSource) {
      setTimeout(() => {
        console.log("🎵 Attempting force play...");
        resumeAudioContext();
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
  }, [audioSource, forcePlay, props.isPlaying, props.onPlayToggle, setIsPlaying, effectiveAudioSource, resumeAudioContext]);
  
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
    
    // Don't show error toast if there's no audio source
    if (effectiveAudioSource) {
      toast.error("Couldn't load audio file. Please try a different journey.", {
        id: "audio-error", // Use consistent ID to prevent duplicates
        duration: 5000,
      });
    }
  };
  
  // Handler for successful audio loading
  const handleAudioLoaded = () => {
    console.log("Audio successfully loaded");
    setAudioLoaded(true);
    setAudioPlaybackError(null);
  };

  // If no audio source is provided, don't try to render the player
  if (!effectiveAudioSource) {
    console.log("No audio source provided to FrequencyPlayer");
    return (
      <div className="frequency-player p-4 text-center">
        <div className="text-red-500">No audio available for this journey.</div>
        <button 
          className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-md"
          onClick={() => window.history.back()}
        >
          Go Back
        </button>
      </div>
    );
  }
  
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
