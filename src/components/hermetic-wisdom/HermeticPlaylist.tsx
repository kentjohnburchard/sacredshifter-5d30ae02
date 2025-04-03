
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Heart, Music, Upload, Shuffle } from "lucide-react";
import { HermeticTrack } from "@/types/playlist";
import { formatDuration } from "@/utils/formatters";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface HermeticPlaylistProps {
  principle: string;
  frequency: number;
  chakra: string;
  tracks: HermeticTrack[];
  onTrackPlay: (track: HermeticTrack) => void;
  onUploadClick: () => void;
}

const HermeticPlaylist: React.FC<HermeticPlaylistProps> = ({
  principle,
  frequency,
  chakra,
  tracks,
  onTrackPlay,
  onUploadClick
}) => {
  const [currentTrack, setCurrentTrack] = useState<HermeticTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { user } = useAuth();

  const handlePlayPause = (track: HermeticTrack) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      onTrackPlay(track);
    }
  };

  const handleLike = (track: HermeticTrack) => {
    if (!user) {
      toast.error("You must be logged in to save tracks");
      return;
    }
    
    toast.success(`Added "${track.title}" to your favorites`);
    // Here you would implement the actual saving logic
  };

  const handleShuffle = () => {
    if (tracks.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * tracks.length);
    const randomTrack = tracks[randomIndex];
    setCurrentTrack(randomTrack);
    setIsPlaying(true);
    onTrackPlay(randomTrack);
    toast.info(`Playing: ${randomTrack.title}`);
  };

  return (
    <Card className="bg-white/5 backdrop-blur-md border border-white/10 text-white">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-normal">
            <Music className="h-4 w-4 inline mr-2" />
            {principle} Playlist ({frequency}Hz)
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-white/80 hover:text-white hover:bg-white/10"
              onClick={handleShuffle}
              disabled={tracks.length === 0}
            >
              <Shuffle className="h-4 w-4" />
              <span className="sr-only">Shuffle</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 text-white/80 hover:text-white hover:bg-white/10"
              onClick={onUploadClick}
            >
              <Upload className="h-4 w-4" />
              <span className="sr-only">Upload</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {tracks.length === 0 ? (
          <div className="text-center py-8 text-white/60">
            <Music className="h-12 w-12 mx-auto mb-4 opacity-40" />
            <p className="mb-4">No tracks available for this journey yet</p>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-white/10 hover:bg-white/20 border-white/20 text-white"
              onClick={onUploadClick}
            >
              <Upload className="h-4 w-4 mr-2" /> 
              Upload Tracks
            </Button>
          </div>
        ) : (
          <div className="space-y-1">
            <Carousel className="w-full">
              <CarouselContent>
                {tracks.map((track) => (
                  <CarouselItem key={track.id} className="basis-full md:basis-1/2 lg:basis-1/3">
                    <div 
                      key={track.id} 
                      className={`flex items-center justify-between p-3 rounded-md ${
                        currentTrack?.id === track.id 
                          ? "bg-white/20" 
                          : "hover:bg-white/10"
                      } transition-colors`}
                    >
                      <div className="flex items-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 mr-3 bg-white/10 text-white hover:bg-white/20"
                          onClick={() => handlePlayPause(track)}
                        >
                          {currentTrack?.id === track.id && isPlaying ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4 ml-0.5" />
                          )}
                        </Button>
                        <div>
                          <p className="font-medium text-sm">{track.title}</p>
                          <p className="text-xs text-white/70">{track.artist}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs border-white/20">
                          {formatDuration(track.duration)}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-white/80 hover:text-white hover:bg-white/10"
                          onClick={() => handleLike(track)}
                        >
                          <Heart className="h-4 w-4" />
                          <span className="sr-only">Like</span>
                        </Button>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-0 bg-black/20 hover:bg-black/40 text-white border-white/10" />
              <CarouselNext className="right-0 bg-black/20 hover:bg-black/40 text-white border-white/10" />
            </Carousel>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HermeticPlaylist;
