
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Eye, EyeOff } from 'lucide-react';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';
import WaveformVisualizer from './WaveformVisualizer';
import SacredAudioPlayerWithVisualizer from '@/components/audio/SacredAudioPlayerWithVisualizer';

interface FrequencyExperiencePlayerProps {
  audioUrl?: string;
  frequency?: number;
  chakra?: string;
  description?: string;
  title?: string;
}

const FrequencyExperiencePlayer: React.FC<FrequencyExperiencePlayerProps> = ({
  audioUrl = "/frequencies/528hz-love.mp3",
  frequency = 528,
  chakra = "heart",
  title = "Love Frequency",
  description = "The Love frequency is the 'Miracle' note of the original Solfeggio musical scale."
}) => {
  const { playAudio, togglePlayPause, isPlaying, currentAudio } = useGlobalAudioPlayer();
  const [showVisualizer, setShowVisualizer] = useState(true);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  
  const isCurrentTrack = currentAudio?.source === audioUrl;
  
  const handlePlayToggle = () => {
    if (isCurrentTrack) {
      togglePlayPause();
    } else {
      playAudio({
        title: `${frequency}Hz - ${title}`,
        source: audioUrl,
        customData: {
          frequency,
          chakra
        }
      });
    }
  };

  // Explicitly define shouldShowVisualizer to avoid reference errors
  const shouldShowVisualizer = !!(audioUrl && frequency && showVisualizer);
  
  return (
    <Card className="w-full max-w-4xl mx-auto overflow-hidden">
      <div className="relative">
        {shouldShowVisualizer && (
          <div className="h-64 bg-black/5 relative">
            <WaveformVisualizer
              canvasRef={canvasRef}
              isPlaying={isPlaying && isCurrentTrack}
              frequencyHz={frequency}
              chakra={chakra}
            />
          </div>
        )}
        
        {!shouldShowVisualizer && (
          <div className="h-16 bg-gradient-to-r from-purple-900/20 to-indigo-900/20"></div>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowVisualizer(prev => !prev)}
          className="absolute top-2 right-2 bg-black/30 hover:bg-black/50 text-white border-none"
        >
          {showVisualizer ? (
            <>
              <EyeOff className="h-4 w-4 mr-1" />
              Hide Visuals
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-1" />
              Show Visuals
            </>
          )}
        </Button>
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-medium">{frequency}Hz - {title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
          
          <Button
            onClick={handlePlayToggle}
            variant="default"
            size="sm"
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isPlaying && isCurrentTrack ? (
              <>
                <Pause className="h-4 w-4 mr-1" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-1" />
                Play
              </>
            )}
          </Button>
        </div>
        
        <div className="mt-4">
          {/* We'll use SacredAudioPlayerWithVisualizer for the full experience */}
          <SacredAudioPlayerWithVisualizer
            journey={{
              id: `freq-${frequency}`,
              title: `${frequency}Hz - ${title}`,
              audioUrl: audioUrl,
              chakras: [chakra],
              frequencies: [frequency]
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FrequencyExperiencePlayer;
