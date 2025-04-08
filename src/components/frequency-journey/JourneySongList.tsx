
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Heart, Music, Plus } from 'lucide-react';
import { JourneySong } from '@/types/journeySongs';
import { formatDuration } from '@/utils/formatters';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import FrequencyPlayer from '@/components/FrequencyPlayer';

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
  const [currentSong, setCurrentSong] = useState<JourneySong | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { user } = useAuth();

  const handlePlayPause = (song: JourneySong) => {
    if (currentSong?.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong(song);
      setIsPlaying(true);
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
                  currentSong?.id === song.id 
                    ? "bg-purple-50" 
                    : "hover:bg-gray-50"
                } transition-colors`}
              >
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 w-8 p-0 mr-3 ${currentSong?.id === song.id ? "bg-purple-100 text-purple-700" : "bg-gray-100"}`}
                    onClick={() => handlePlayPause(song)}
                  >
                    {currentSong?.id === song.id && isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4 ml-0.5" />
                    )}
                  </Button>
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
        
        {currentSong && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{currentSong.title}</p>
                <p className="text-xs text-gray-500">{currentSong.artist}</p>
              </div>
              <FrequencyPlayer 
                audioUrl={currentSong.audioUrl}
                isPlaying={isPlaying}
                onPlayToggle={() => setIsPlaying(!isPlaying)}
                frequency={currentSong.frequency}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JourneySongList;
