
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
  const { registerPlayerVisuals, isPlaying, currentAudio, resetPlayer } = useGlobalAudioPlayer();
  const errorCountRef = useRef(0);
  const registeredRef = useRef(false);
  const registerAttemptsRef = useRef(0);
  
  // Format the audio URL when it changes
  useEffect(() => {
    if (!audioUrl) {
      console.log("FloatingCosmicPlayer: Empty audio URL provided");
      return;
    }
    
    console.log("FloatingCosmicPlayer: Setting audio URL:", audioUrl);
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
    // Skip registration if we've already successfully registered
    if (registeredRef.current) return;
    
    // Limit registration attempts
    if (registerAttemptsRef.current > 5) {
      console.warn("FloatingCosmicPlayer: Too many registration attempts, giving up");
      return;
    }
    
    registerAttemptsRef.current++;
    
    // Safety check
    if (!registerPlayerVisuals) {
      console.error("registerPlayerVisuals function not available");
      setTimeout(() => {
        // Force a component update by changing the key
        setPlayerKey(Date.now().toString());
      }, 1000);
      return;
    }
    
    try {
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
          console.log("FloatingCosmicPlayer: Received empty URL, hiding player");
          setIsVisible(false);
        }
      };
      
      // Register with the global player
      registerPlayerVisuals({ setAudioSource: setAudioSourceCallback });
      registeredRef.current = true;
      
      console.log("FloatingCosmicPlayer: Successfully registered with global audio player");
    } catch (error) {
      console.error("Error registering player visuals:", error);
      toast.error("Audio visualization error. Trying to recover...");
      
      // Try again after a delay
      setTimeout(() => {
        setPlayerKey(Date.now().toString());
      }, 2000);
    }
  }, [registerPlayerVisuals, playerKey]);

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
      autoPlay={false}
      syncWithGlobalPlayer={true}
      isPlaying={isPlaying}
      onError={handleError}
      allowShapeChange={true}
      allowColorChange={true}
    />
  );
};

export default FloatingCosmicPlayer;
