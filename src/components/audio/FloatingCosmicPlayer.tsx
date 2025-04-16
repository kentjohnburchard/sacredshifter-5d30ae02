
import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, PlayCircle, PauseCircle, MinimizeIcon, MaximizeIcon } from 'lucide-react';
import CosmicAudioPlayer from './CosmicAudioPlayer';
import { getFrequencyAudioUrl } from '@/utils/focusTrackMap';
import { toast } from 'sonner';

interface FloatingCosmicPlayerProps {
  frequency?: number;
  audioUrl?: string; 
  title?: string;
  description?: string;
  initiallyVisible?: boolean;
  chakra?: string;
  initialShape?: string;
  initialColorTheme?: string;
  initialIsExpanded?: boolean;
  onExpandStateChange?: (expanded: boolean) => void;
}

const FloatingCosmicPlayer: React.FC<FloatingCosmicPlayerProps> = ({
  frequency = 396,
  audioUrl,
  title,
  description,
  initiallyVisible = false,
  chakra,
  initialShape = 'flower-of-life',
  initialColorTheme = 'cosmic-purple',
  initialIsExpanded = false,
  onExpandStateChange
}) => {
  const [isVisible, setIsVisible] = useState(initiallyVisible);
  const [isExpanded, setIsExpanded] = useState(initialIsExpanded);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<RetryTimeout | null>(null);
  
  interface RetryTimeout {
    id: number;
    count: number;
  }
  
  // Get the audio URL for the frequency if not provided
  const sourceUrl = audioUrl || (frequency ? getFrequencyAudioUrl(frequency) : '');
  
  // Set up title and description if not provided
  const displayTitle = title || (frequency ? `${frequency}Hz Frequency` : 'Cosmic Audio');
  const displayDescription = description || getFrequencyDescription(frequency);

  // Force visibility based on initiallyVisible prop
  useEffect(() => {
    setIsVisible(initiallyVisible);
  }, [initiallyVisible]);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current.id);
      }
    };
  }, []);
  
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
    
    if (!isVisible) {
      // When showing the player, log it
      console.log("Showing cosmic player:", {
        frequency,
        audioUrl: sourceUrl,
        title: displayTitle
      });
    }
  };
  
  const handleExpandStateChange = (expanded: boolean) => {
    setIsExpanded(expanded);
    if (onExpandStateChange) {
      onExpandStateChange(expanded);
    }
  };

  const handlePlayerError = (error: any) => {
    console.error("Player error:", error);
    
    // If we have a retry timeout already running, don't start another one
    if (timeoutRef.current) return;
    
    // Only retry a few times to avoid infinite loops
    timeoutRef.current = {
      id: window.setTimeout(() => {
        if (timeoutRef.current && timeoutRef.current.count < 3) {
          timeoutRef.current.count++;
          setIsLoading(true);
          // Force re-render of CosmicAudioPlayer by toggling visibility briefly
          setIsVisible(false);
          setTimeout(() => {
            setIsVisible(true);
            setIsLoading(false);
          }, 500);
        } else {
          toast.error("Could not load audio player. Please try again.");
          timeoutRef.current = null;
        }
      }, 2000),
      count: 0
    };
  };
  
  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <CosmicAudioPlayer
              defaultFrequency={frequency}
              defaultAudioUrl={sourceUrl}
              title={displayTitle}
              description={displayDescription}
              chakra={chakra}
              initialShape={initialShape}
              initialColorTheme={initialColorTheme}
              initialIsExpanded={isExpanded}
              onExpandStateChange={handleExpandStateChange}
              autoPlay={true}
              onError={handlePlayerError}
              key={isLoading ? 'loading' : 'loaded'}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {!isVisible && (
        <Button
          className="fixed bottom-4 right-4 shadow-lg bg-purple-600 hover:bg-purple-700 text-white rounded-full h-12 w-12 flex items-center justify-center z-50"
          onClick={toggleVisibility}
        >
          <PlayCircle className="h-6 w-6" />
        </Button>
      )}
    </>
  );
};

// Helper function to get description for frequency
function getFrequencyDescription(frequency: number | undefined): string {
  if (!frequency) return 'Sacred frequency visualization';
  
  const descriptions: Record<number, string> = {
    396: 'Liberation from fear and guilt (Root Chakra)',
    417: 'Facilitates change (Sacral Chakra)',
    432: 'Natural harmony and relaxed alertness',
    528: 'Transformation and DNA repair (Heart Chakra)',
    639: 'Connecting relationships (Heart Chakra)',
    741: 'Expression and solutions (Throat Chakra)',
    852: 'Returning to spiritual order (Third Eye Chakra)',
    963: 'Divine consciousness and light (Crown Chakra)',
  };
  
  return descriptions[frequency] || 'Sacred frequency visualization';
}

export default FloatingCosmicPlayer;
