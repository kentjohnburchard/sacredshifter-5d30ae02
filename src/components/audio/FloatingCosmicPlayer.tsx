
import React, { useState, useEffect } from 'react';
import CosmicAudioPlayer from './CosmicAudioPlayer';
import { toast } from 'sonner';

interface FloatingCosmicPlayerProps {
  audioUrl: string;
  title?: string;
  description?: string;
  initiallyVisible?: boolean;
  chakra?: string;
  frequency?: number;
  initialShape?: string;
  initialColorTheme?: string;
  initialIsExpanded?: boolean;
  onExpandStateChange?: (expanded: boolean) => void;
}

const FloatingCosmicPlayer: React.FC<FloatingCosmicPlayerProps> = ({
  audioUrl,
  title = 'Sacred Audio',
  description,
  initiallyVisible = true,
  chakra,
  frequency,
  initialShape = 'flower-of-life',
  initialColorTheme = 'cosmic-purple',
  initialIsExpanded = false,
  onExpandStateChange
}) => {
  const [isVisible, setIsVisible] = useState(initiallyVisible);
  const [isExpanded, setIsExpanded] = useState(initialIsExpanded);
  const [audioUrl_, setAudioUrl] = useState<string>('');
  
  useEffect(() => {
    // Format URL if needed
    let formattedUrl = audioUrl;
    if (audioUrl && !audioUrl.startsWith('http')) {
      formattedUrl = `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${audioUrl}`;
    }
    setAudioUrl(formattedUrl);
  }, [audioUrl]);

  const handleError = (error: any) => {
    console.error("Cosmic player error:", error);
    toast.error("Audio error occurred. Try a different track.");
  };
  
  const handleExpandStateChange = (expanded: boolean) => {
    setIsExpanded(expanded);
    if (onExpandStateChange) {
      onExpandStateChange(expanded);
    }
  };
  
  if (!isVisible || !audioUrl_) {
    return null;
  }

  return (
    <CosmicAudioPlayer
      defaultAudioUrl={audioUrl_}
      defaultFrequency={frequency}
      title={title}
      description={description}
      chakra={chakra}
      initialShape={initialShape}
      initialColorTheme={initialColorTheme}
      initialIsExpanded={initialIsExpanded}
      onExpandStateChange={handleExpandStateChange}
      autoPlay={true}
      onError={handleError}
      key={audioUrl_}
    />
  );
};

export default FloatingCosmicPlayer;
