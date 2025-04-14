
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartIcon, PlayCircle, PauseCircle, ListMusic } from "lucide-react";
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';

// Sample data - would come from API in production
const HEART_FREQUENCIES = [
  { id: "love-136.1", title: "Love Frequency", frequency: 136.1, url: "/sounds/focus-ambient.mp3" },
  { id: "heart-chakra", title: "Heart Chakra", frequency: 639, url: "/sounds/focus-ambient.mp3" },
  { id: "compassion", title: "Compassion", frequency: 528, url: "/sounds/focus-ambient.mp3" },
];

const GUIDED_MEDITATIONS = [
  { id: "heart-opening", title: "Heart Opening", duration: "10 min", url: "/sounds/focus-ambient.mp3" },
  { id: "self-love", title: "Self Love", duration: "15 min", url: "/sounds/focus-ambient.mp3" },
];

interface PlaylistItemProps {
  title: string;
  subtitle?: string;
  isPlaying: boolean;
  onPlay: () => void;
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({ title, subtitle, isPlaying, onPlay }) => {
  return (
    <div 
      className="flex items-center justify-between p-3 rounded-md hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors cursor-pointer"
      onClick={onPlay}
    >
      <div>
        <p className="font-medium">{title}</p>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        {isPlaying ? (
          <PauseCircle className="h-6 w-6 text-purple-600" />
        ) : (
          <PlayCircle className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
};

const HeartFrequencyPlaylists: React.FC = () => {
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);
  const { playAudio, togglePlayPause, isPlaying } = useGlobalAudioPlayer();
  
  const handlePlayTrack = (track: any) => {
    if (currentTrackId === track.id) {
      togglePlayPause();
    } else {
      setCurrentTrackId(track.id);
      playAudio({
        title: track.title,
        source: track.url,
        customData: {
          frequency: track.frequency
        }
      });
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <HeartIcon className="mr-2 h-5 w-5 text-pink-500" />
            Heart Frequencies
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          {HEART_FREQUENCIES.map((frequency) => (
            <PlaylistItem
              key={frequency.id}
              title={frequency.title}
              subtitle={`${frequency.frequency}Hz`}
              isPlaying={currentTrackId === frequency.id && isPlaying}
              onPlay={() => handlePlayTrack(frequency)}
            />
          ))}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <ListMusic className="mr-2 h-5 w-5 text-purple-500" />
            Guided Meditations
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          {GUIDED_MEDITATIONS.map((meditation) => (
            <PlaylistItem
              key={meditation.id}
              title={meditation.title}
              subtitle={meditation.duration}
              isPlaying={currentTrackId === meditation.id && isPlaying}
              onPlay={() => handlePlayTrack(meditation)}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default HeartFrequencyPlaylists;
