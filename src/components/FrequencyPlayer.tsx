
import React, { useEffect } from 'react';
import SacredAudioPlayer from '@/components/audio/SacredAudioPlayer';
import { useAppStore } from '@/store';
import { toast } from 'sonner';

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
  
  // Use the force play parameter if present
  const forcePlay = props.forcePlay || false;
  
  const { setIsPlaying } = useAppStore();
  
  useEffect(() => {
    // Log useful debugging information
    console.log("FrequencyPlayer rendering with:", {
      audioSource,
      frequency: props.frequency,
      isPlaying: props.isPlaying,
      forcePlay
    });
    
    if (!audioSource) {
      console.warn("FrequencyPlayer: No audio source provided!");
    }
    
    // Handle external isPlaying prop
    if (props.isPlaying !== undefined) {
      setIsPlaying(props.isPlaying);
    }
    
    if (forcePlay) {
      setTimeout(() => {
        setIsPlaying(true);
        if (props.onPlayToggle) {
          props.onPlayToggle(true);
        }
      }, 300);
    }
  }, [audioSource, forcePlay, props.isPlaying, props.onPlayToggle, setIsPlaying]);
  
  const handlePlayToggle = (isPlaying: boolean) => {
    console.log("FrequencyPlayer: handlePlayToggle called with", isPlaying);
    
    // Call the onPlayToggle prop if provided
    if (props.onPlayToggle) {
      props.onPlayToggle(isPlaying);
    }
  };
  
  if (!audioSource) {
    console.warn("FrequencyPlayer: No audio source provided");
    return null;
  }
  
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
