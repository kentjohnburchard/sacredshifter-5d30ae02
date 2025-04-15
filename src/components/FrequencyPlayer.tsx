
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
}

// This is a wrapper component around SacredAudioPlayer for backward compatibility
const FrequencyPlayer: React.FC<FrequencyPlayerProps> = (props) => {
  return <SacredAudioPlayer {...props} />;
};

export default FrequencyPlayer;
