
import React, { useState, useEffect, useRef } from 'react';
import CosmicAudioPlayer from './CosmicAudioPlayer';
import { toast } from 'sonner';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';

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
  const [playerKey, setPlayerKey] = useState<string>(Date.now().toString());
  const { resetPlayer } = useGlobalAudioPlayer();
  const errorCountRef = useRef(0);
  
  useEffect(() => {
    // Format URL if needed
    let formattedUrl = audioUrl;
    if (audioUrl && !audioUrl.startsWith('http')) {
      formattedUrl = audioUrl.startsWith('/') 
        ? `${window.location.origin}${audioUrl}`
        : `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${audioUrl}`;
    }
    setAudioUrl(formattedUrl);
    // Reset the player key to force a re-render when URL changes
    setPlayerKey(Date.now().toString());
    // Reset error count when URL changes
    errorCountRef.current = 0;
  }, [audioUrl]);

  const handleError = (error: any) => {
    console.error("Cosmic player error:", error);
    errorCountRef.current += 1;
    
    if (errorCountRef.current <= 2) {
      toast.error("Audio error occurred. Attempting to recover...");
      
      // Force a restart with a new player instance
      setTimeout(() => {
        resetPlayer();
        setPlayerKey(Date.now().toString());
      }, 500);
    } else {
      toast.error("Audio playback failed. Try a different track.");
      resetPlayer();
    }
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
      key={playerKey}
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
      allowShapeChange={true}
      allowColorChange={true}
    />
  );
};

export default FloatingCosmicPlayer;
