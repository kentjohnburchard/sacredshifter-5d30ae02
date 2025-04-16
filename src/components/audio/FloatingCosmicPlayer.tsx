
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
  const cosmicPlayerRef = useRef<any>(null);
  const { resetPlayer, registerPlayerVisuals, isPlaying, currentAudio } = useGlobalAudioPlayer();
  const errorCountRef = useRef(0);
  
  // Format the audio URL when it changes
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

  // Register this player with the global audio player
  useEffect(() => {
    if (!registerPlayerVisuals) {
      console.error("registerPlayerVisuals function is not available");
      return;
    }
    
    // Define the callback to update this player when global state changes
    const setAudioSourceCallback = (url: string, info?: any) => {
      console.log("FloatingCosmicPlayer: Global player wants to sync audio:", url);
      if (url && url !== '') {
        // Format URL if needed
        let formattedUrl = url;
        if (url && !url.startsWith('http')) {
          formattedUrl = url.startsWith('/') 
            ? `${window.location.origin}${url}`
            : `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${url}`;
        }
        setAudioUrl(formattedUrl);
        
        // Force a re-render of the cosmic player
        setPlayerKey(Date.now().toString());
        
        // Ensure cosmic player is visible
        setIsVisible(true);
      } else {
        // When url is empty, the global player wants to reset
        setIsVisible(false);
      }
    };
    
    try {
      // Register with the global player
      registerPlayerVisuals({ setAudioSource: setAudioSourceCallback });
      
      console.log("FloatingCosmicPlayer: Registered with global audio player");
    } catch (error) {
      console.error("Error registering player visuals:", error);
      toast.error("Audio visualization error");
    }
  }, [registerPlayerVisuals]);

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
      ref={cosmicPlayerRef}
      key={playerKey}
      defaultAudioUrl={audioUrl_}
      defaultFrequency={frequency || currentAudio?.frequency}
      title={title || currentAudio?.title || 'Sacred Audio'}
      description={description || (currentAudio?.chakra ? `Chakra: ${currentAudio.chakra}` : undefined)}
      chakra={chakra || currentAudio?.chakra}
      initialShape={initialShape}
      initialColorTheme={initialColorTheme}
      initialIsExpanded={initialIsExpanded}
      onExpandStateChange={handleExpandStateChange}
      autoPlay={false}  // We're using the global player now
      syncWithGlobalPlayer={true} // New prop to indicate we're syncing with global player
      isPlaying={isPlaying} // Pass the global playing state
      onError={handleError}
      allowShapeChange={true}
      allowColorChange={true}
    />
  );
};

export default FloatingCosmicPlayer;
