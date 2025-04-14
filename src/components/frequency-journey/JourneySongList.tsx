
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Music, Play, Pause, Plus } from 'lucide-react';
import { JourneySong } from '@/types/journeySongs';
import { formatDuration } from '@/utils/formatters';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';

interface JourneySongListProps {
  journeyId: string;
  journeyTitle: string;
  songs: JourneySong[];
  loading?: boolean;
  onAddSongClick?: () => void;
}

const JourneySongList: React.FC<JourneySongListProps> = ({
  journeyId,
  journeyTitle,
  songs,
  loading = false,
  onAddSongClick
}) => {
  const [currentSongId, setCurrentSongId] = useState<string | null>(null);
  const { user } = useAuth();
  const { playAudio, togglePlayPause, isPlaying, currentAudio } = useGlobalAudioPlayer();

  // Track the currently playing song based on currentAudio from the global player
  useEffect(() => {
    if (currentAudio?.customData?.frequencyId) {
      setCurrentSongId(currentAudio.customData.frequencyId);
    }
  }, [currentAudio]);

  const handlePlayPause = (song: JourneySong) => {
    if (currentSongId === song.id && isPlaying) {
      // Toggle play/pause for current song
      togglePlayPause();
    } else {
      // Change to new song or play current song that was paused
      setCurrentSongId(song.id);
      playAudio({
        title: song.title,
        artist: song.artist,
        source: song.audioUrl,
        imageUrl: song.imageUrl,
        customData: {
          frequency: song.frequency,
          frequencyId: song.id,
          groupId: journeyId
        }
      });
    }
  };

  const handleLike = (song: JourneySong) => {
    if (!user) {
      toast.error("You must be logged in to save tracks");
      return;
    }
    
    toast.success(`Added "${song.title}" to your favorites`);
    // Here you would implement the actual saving logic
  };

  if (loading) {
    return (
      <Card className="bg-white/5 backdrop-blur-md border border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-normal flex items-center">
            <Music className="h-4 w-4 inline mr-2" />
            Loading songs...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm border-gray-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-normal">
            <Music className="h-4 w-4 inline mr-2" />
            {journeyTitle} Songs
          </CardTitle>
          {onAddSongClick && (
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 px-2"
              onClick={onAddSongClick}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Song
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {songs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Music className="h-12 w-12 mx-auto mb-4 opacity-40" />
            <p className="mb-4">No songs available for this journey yet</p>
            {onAddSongClick && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onAddSongClick}
              >
                <Plus className="h-4 w-4 mr-2" /> 
                Add Songs
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {songs.map((song) => (
              <div 
                key={song.id} 
                className={`flex items-center justify-between p-3 rounded-md ${
                  currentSongId === song.id 
                    ? "bg-purple-50" 
                    : "hover:bg-gray-50"
                } transition-colors`}
              >
                <div className="flex items-center">
                  <div className="mr-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full p-0"
                      onClick={() => handlePlayPause(song)}
                    >
                      {currentSongId === song.id && isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4 ml-0.5" />
                      )}
                    </Button>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{song.title}</p>
                    <p className="text-xs text-gray-500">{song.artist}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {song.frequency && (
                    <Badge variant="outline" className="text-xs">
                      {song.frequency}Hz
                    </Badge>
                  )}
                  {song.chakra && (
                    <Badge variant="outline" className="text-xs">
                      {song.chakra}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {formatDuration(song.duration)}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleLike(song)}
                  >
                    <Heart className="h-4 w-4" />
                    <span className="sr-only">Like</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JourneySongList;
