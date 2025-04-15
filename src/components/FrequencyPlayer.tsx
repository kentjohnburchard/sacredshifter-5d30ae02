
import React, { useEffect, useRef } from 'react';
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
  const audioSource = props.audioUrl || props.url || '/sounds/focus-ambient.mp3';
  
  // Use the force play parameter if present
  const forcePlay = props.forcePlay || false;
  
  const { setIsPlaying, setAudioPlaybackError } = useAppStore();
  const initializationAttempted = useRef(false);
  
  // Initialize audio context after user interaction
  useEffect(() => {
    if (!initializationAttempted.current) {
      initializationAttempted.current = true;
      initializeAudioAfterInteraction();
      
      // Log important information
      console.log("🔊 FrequencyPlayer mounted with:", {
        audioSource,
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
        resumeAudioContext().catch(console.error);
        setIsPlaying(true);
        if (props.onPlayToggle) {
          props.onPlayToggle(true);
        }
      }, 300);
    }
  }, [audioSource, forcePlay, props.isPlaying, props.onPlayToggle, setIsPlaying]);
  
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
  
  return (
    <SacredAudioPlayer 
      audioUrl={audioSource} 
      url={props.url}
      frequency={props.frequency}
      isPlaying={props.isPlaying}
      onPlayToggle={handlePlayToggle}
      frequencyId={props.frequencyId}
      groupId={props.groupId}
      id={props.id}
      forcePlay={forcePlay}
    />
  );
};

export default FrequencyPlayer;
