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
  const { registerPlayerVisuals, isPlaying, currentAudio } = useGlobalAudioPlayer();
  const errorCountRef = useRef(0);
  const registeredRef = useRef(false);
  const registerAttemptsRef = useRef(0);
  const maxRegisterAttempts = 8;
  
  useEffect(() => {
    if (!audioUrl) {
      console.log("FloatingCosmicPlayer: Empty audio URL provided");
      return;
    }
    
    console.log("FloatingCosmicPlayer: Setting audio URL:", audioUrl);
    
    let formattedUrl = audioUrl;
    if (audioUrl && !audioUrl.startsWith('http')) {
      formattedUrl = audioUrl.startsWith('/') 
        ? `${window.location.origin}${audioUrl}`
        : `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${audioUrl}`;
    }
    
    setAudioUrl(formattedUrl);
    setPlayerKey(Date.now().toString());
    errorCountRef.current = 0;
    
    setIsVisible(true);
  }, [audioUrl]);

  useEffect(() => {
    if (registeredRef.current) return;
    
    if (registerAttemptsRef.current >= maxRegisterAttempts) {
      console.warn("FloatingCosmicPlayer: Too many registration attempts, giving up");
      return;
    }
    
    const attemptRegistration = () => {
      registerAttemptsRef.current++;
      console.log(`FloatingCosmicPlayer: Registration attempt ${registerAttemptsRef.current} of ${maxRegisterAttempts}`);
      
      if (!registerPlayerVisuals) {
        console.error("registerPlayerVisuals function not available");
        
        if (registerAttemptsRef.current < maxRegisterAttempts) {
          setTimeout(attemptRegistration, 500);
        }
        return;
      }
      
      try {
        const setAudioSourceCallback = (url: string, info?: any) => {
          console.log("FloatingCosmicPlayer: Global player wants to sync audio:", url);
          
          if (url && url !== '') {
            let formattedUrl = url;
            if (url && !url.startsWith('http')) {
              formattedUrl = url.startsWith('/') 
                ? `${window.location.origin}${url}`
                : `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${url}`;
            }
            
            setAudioUrl(formattedUrl);
            setPlayerKey(Date.now().toString());
            setIsVisible(true);
            
            console.log("FloatingCosmicPlayer: URL updated from global player:", formattedUrl);
          } else {
            console.log("FloatingCosmicPlayer: Received empty URL, hiding player");
            setIsVisible(false);
          }
        };
        
        registerPlayerVisuals({ setAudioSource: setAudioSourceCallback });
        registeredRef.current = true;
        
        console.log("FloatingCosmicPlayer: Successfully registered with global audio player");
      } catch (error) {
        console.error("Error registering player visuals:", error);
        toast.error("Audio visualization error. Trying to recover...");
        
        if (registerAttemptsRef.current < maxRegisterAttempts) {
          setTimeout(attemptRegistration, 1000);
        }
      }
    };
    
    attemptRegistration();
  }, [registerPlayerVisuals]);

  const handleError = (error: any) => {
    console.error("Cosmic player error:", error);
    errorCountRef.current += 1;
    
    if (errorCountRef.current <= 2) {
      toast.error("Audio error occurred. Attempting to recover...");
      
      setTimeout(() => {
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
