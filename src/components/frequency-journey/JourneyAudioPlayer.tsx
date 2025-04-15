
import React, { useState } from 'react';
import SacredAudioPlayerWithVisualizer from '@/components/audio/SacredAudioPlayerWithVisualizer';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { JourneyTemplate } from '@/types/journey';
import { toast } from 'sonner';

interface JourneyAudioPlayerProps {
  journey?: JourneyTemplate;
}

const JourneyAudioPlayer: React.FC<JourneyAudioPlayerProps> = ({ journey }) => {
  const [isActive, setIsActive] = useState(false);

  if (!journey) {
    return null;
  }

  const handleStartJourney = () => {
    setIsActive(true);
    toast.info(`Starting journey: ${journey.title}`);
  };

  // Convert JourneyTemplate to the format expected by SacredAudioPlayerWithVisualizer
  const playerJourney = journey ? {
    id: journey.id,
    title: journey.title,
    description: journey.description,
    frequencies: journey.frequency ? [journey.frequency] : [],
    chakras: journey.chakra ? [journey.chakra] : [],
    affirmation: journey.description,
    theme: journey.chakra?.toLowerCase().includes('heart') ? 'pink' : 
           journey.chakra?.toLowerCase().includes('throat') ? 'blue' : 'purple',
    audioUrl: '/sounds/focus-ambient.mp3'
  } : undefined;

  if (!isActive) {
    return (
      <div className="flex flex-col items-center justify-center p-6 md:p-12 mx-4 md:mx-auto max-w-4xl bg-black/20 backdrop-blur-sm rounded-lg border border-purple-500/20">
        <h3 className="text-xl font-semibold text-purple-200 mb-4">{journey.title}</h3>
        <p className="text-gray-300 mb-6 text-center max-w-md">{journey.description}</p>
        <Button 
          onClick={handleStartJourney}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6"
        >
          <Play className="mr-2 h-4 w-4" /> Start Journey
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-4 md:mx-auto max-w-4xl">
      <SacredAudioPlayerWithVisualizer journey={playerJourney} />
    </div>
  );
};

export default JourneyAudioPlayer;
