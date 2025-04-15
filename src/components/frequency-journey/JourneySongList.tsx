import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Clock, Music } from 'lucide-react';
import { JourneySong } from '@/types/journey';
import { formatTime } from '@/lib/utils';
import SimpleAudioPlayer from '@/components/audio/SimpleAudioPlayer';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';
import SacredAudioPlayer from '@/components/audio/SacredAudioPlayer';

interface JourneySongListProps {
  songs: JourneySong[];
  onSongSelect?: (song: JourneySong) => void;
  selectedSongId?: string;
  journeyId?: string;
  journeyTitle?: string;
  loading?: boolean;
  onAddSongClick?: () => void;
}

const JourneySongList: React.FC<JourneySongListProps> = ({
  songs,
  onSongSelect,
  selectedSongId,
  journeyId,
  journeyTitle,
  loading,
  onAddSongClick
}) => {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const { playAudio, togglePlayPause, isPlaying, currentAudio } = useGlobalAudioPlayer();

  const handlePlayToggle = (song: JourneySong, index: number) => {
    if (playingIndex === index) {
      togglePlayPause();
      setPlayingIndex(null);
    } else {
      playAudio({
        title: song.title,
        artist: song.artist,
        source: song.audioUrl,
        customData: {
          frequency: song.frequency,
          chakra: song.chakra
        }
      });
      setPlayingIndex(index);
      
      if (onSongSelect) {
        onSongSelect(song);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center p-6 text-gray-500">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-gray-200 rounded-full mb-3"></div>
          <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (songs.length === 0) {
    return (
      <div className="text-center p-6 text-gray-500">
        <Music className="h-12 w-12 mx-auto opacity-40 mb-3" />
        <p>No songs available for this frequency journey</p>
        {onAddSongClick && (
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-4"
            onClick={onAddSongClick}
          >
            Add a song
          </Button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-2">
        {songs.map((song, index) => (
          <Card
            key={song.id}
            className={`border transition-all ${selectedSongId === song.id ? 'border-purple-400 bg-purple-50/30' : 'hover:border-purple-200 border-gray-200'}`}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Button
                    variant={playingIndex === index ? "default" : "outline"}
                    size="icon"
                    className={`h-8 w-8 rounded-full ${playingIndex === index ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                    onClick={() => handlePlayToggle(song, index)}
                  >
                    {playingIndex === index && isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4 ml-0.5" />
                    )}
                  </Button>
                  
                  <div>
                    <h3 className="font-medium text-sm">{song.title}</h3>
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="mr-2">{song.artist || 'Unknown Artist'}</span>
                      {song.duration && (
                        <>
                          <Clock className="h-3 w-3 inline mr-1" />
                          <span>{formatTime(song.duration)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  {song.frequency && (
                    <Badge variant="outline" className="mr-2 text-xs">
                      {song.frequency}Hz
                    </Badge>
                  )}
                  {song.chakra && (
                    <Badge
                      className="text-xs"
                      style={{
                        backgroundColor: getChakraColor(song.chakra),
                        color: 'white'
                      }}
                    >
                      {song.chakra}
                    </Badge>
                  )}
                </div>
              </div>
              
              {playingIndex === index && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <SimpleAudioPlayer
                    audioUrl={song.audioUrl}
                    frequency={song.frequency}
                    isPlaying={isPlaying && playingIndex === index}
                    onPlayToggle={() => handlePlayToggle(song, index)}
                    size="sm"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <SacredAudioPlayer />
    </div>
  );
};

const getChakraColor = (chakra: string): string => {
  switch (chakra.toLowerCase()) {
    case 'root': return '#FF0000';
    case 'sacral': return '#FFA500';
    case 'solar plexus': return '#FFFF00';
    case 'heart': return '#00FF00';
    case 'throat': return '#00FFFF';
    case 'third eye': return '#0000FF';
    case 'crown': return '#EE82EE';
    default: return '#8E9196';
  }
};

export default JourneySongList;
