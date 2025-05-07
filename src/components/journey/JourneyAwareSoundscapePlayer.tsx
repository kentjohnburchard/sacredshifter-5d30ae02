
import React, { useState, useEffect } from 'react';
import { fetchJourneySoundscape } from '@/services/soundscapeService';
import { useJourney } from '@/context/JourneyContext';
import JourneySoundscapePlayer from './JourneySoundscapePlayer';

interface JourneyAwareSoundscapePlayerProps {
  journeyId?: string;
  autoSync?: boolean;
  autoplay?: boolean;
}

const JourneyAwareSoundscapePlayer: React.FC<JourneyAwareSoundscapePlayerProps> = ({
  journeyId,
  autoSync = true,
  autoplay = false
}) => {
  const { activeJourney } = useJourney();
  const [journeySlug, setJourneySlug] = useState<string | undefined>(undefined);
  
  // If autoSync is true, use the active journey from context
  useEffect(() => {
    if (autoSync && activeJourney?.filename) {
      setJourneySlug(activeJourney.filename);
    } else if (journeyId) {
      // If journeyId is provided directly, use that
      setJourneySlug(journeyId);
    }
  }, [autoSync, activeJourney, journeyId]);
  
  if (!journeySlug) {
    console.log("No journey slug available for soundscape player");
    return null;
  }
  
  console.log(`JourneyAwareSoundscapePlayer: Loading soundscape for journey ${journeySlug}`);
  return <JourneySoundscapePlayer journeySlug={journeySlug} autoplay={autoplay} />;
};

export default JourneyAwareSoundscapePlayer;
