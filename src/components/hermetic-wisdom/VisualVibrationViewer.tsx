
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';
import { Play, Pause, Music } from 'lucide-react';

interface VisualVibrationViewerProps {
  title?: string;
  description?: string;
  frequencyDetails?: {
    frequency: number;
    name: string;
    benefit: string;
  };
  audioSrc?: string;
  imageSrc?: string;
}

const VisualVibrationViewer: React.FC<VisualVibrationViewerProps> = ({
  title = "Hermetic Visual Vibration",
  description = "Experience the vibration visually and sonically for deeper harmony",
  frequencyDetails = {
    frequency: 432,
    name: "Harmonic Resonance",
    benefit: "Aligns with the natural frequency of the universe"
  },
  audioSrc = "/sounds/focus-ambient.mp3",
  imageSrc = "/placeholder.svg"
}) => {
  const { playAudio, togglePlayPause, isPlaying, currentAudio } = useGlobalAudioPlayer();
  const [isCurrentTrack, setIsCurrentTrack] = useState(false);
  
  const handleToggleAudio = () => {
    if (isCurrentTrack) {
      togglePlayPause();
    } else {
      playAudio({
        title: `${frequencyDetails.name} (${frequencyDetails.frequency}Hz)`,
        source: audioSrc,
        customData: {
          frequency: frequencyDetails.frequency
        }
      });
      setIsCurrentTrack(true);
    }
  };
  
  // Update current track status when audio changes
  React.useEffect(() => {
    if (currentAudio?.source === audioSrc) {
      setIsCurrentTrack(true);
    } else {
      setIsCurrentTrack(false);
    }
  }, [currentAudio, audioSrc]);
  
  return (
    <Card className="overflow-hidden">
      <div className="relative h-64">
        <img 
          src={imageSrc} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-sm opacity-80">{description}</p>
        </div>
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 right-4 rounded-full h-10 w-10 bg-white/20 backdrop-blur-md hover:bg-white/40"
          onClick={handleToggleAudio}
        >
          {isCurrentTrack && isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5 ml-0.5" />
          )}
        </Button>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4 className="font-medium">{frequencyDetails.name}</h4>
            <p className="text-sm text-gray-500">{frequencyDetails.frequency} Hz</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={handleToggleAudio}
          >
            <Music className="h-3.5 w-3.5" />
            {isCurrentTrack && isPlaying ? "Pause" : "Play"}
          </Button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {frequencyDetails.benefit}
        </p>
      </CardContent>
    </Card>
  );
};

export default VisualVibrationViewer;
