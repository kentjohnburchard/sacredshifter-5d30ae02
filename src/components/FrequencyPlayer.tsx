
import React from 'react';
import SacredAudioPlayer from '@/components/audio/SacredAudioPlayer';

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
  
  console.log("FrequencyPlayer rendering with:", {
    audioSource,
    frequency: props.frequency,
    isPlaying: props.isPlaying,
    forcePlay
  });
  
  return (
    <SacredAudioPlayer 
      audioUrl={audioSource} 
      frequency={props.frequency}
      isPlaying={props.isPlaying}
      onPlayToggle={props.onPlayToggle}
      frequencyId={props.frequencyId}
      groupId={props.groupId}
      id={props.id}
      forcePlay={forcePlay}
    />
  );
};

export default FrequencyPlayer;
