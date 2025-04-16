
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, PlayCircle } from 'lucide-react';
import CosmicAudioPlayer from './CosmicAudioPlayer';
import { getFrequencyAudioUrl } from '@/utils/focusTrackMap';

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
  onExpandStateChange?: (expanded: boolean) => void; // Add this prop
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
  
  // Get the audio URL for the frequency if not provided
  const sourceUrl = audioUrl || (frequency ? getFrequencyAudioUrl(frequency) : '');
  
  // Set up title and description if not provided
  const displayTitle = title || (frequency ? `${frequency}Hz Frequency` : 'Cosmic Audio');
  const displayDescription = description || getFrequencyDescription(frequency);
  
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
  
  return (
    <>
      <AnimatePresence>
        {isVisible && (
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
          />
        )}
      </AnimatePresence>
      
      {!isVisible && (
        <Button
          className="fixed bottom-4 right-4 shadow-lg bg-purple-600 hover:bg-purple-700 text-white rounded-full h-12 w-12 flex items-center justify-center"
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
