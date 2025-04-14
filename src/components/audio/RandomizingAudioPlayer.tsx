
import React, { useRef, useState, useEffect, RefObject } from 'react';
import { Button } from "@/components/ui/button";
import { Pause, Play, Volume2, VolumeX, SkipForward, Loader2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';

interface RandomizingAudioPlayerProps {
  audioRef?: RefObject<HTMLAudioElement>;
  audioUrl?: string | null;
  groupId?: string;
  frequency?: number;
  autoPlay?: boolean;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

const RandomizingAudioPlayer: React.FC<RandomizingAudioPlayerProps> = ({
  audioUrl,
  groupId,
  frequency,
  autoPlay = false,
  onPlayStateChange
}) => {
  const { playAudio, togglePlayPause, isPlaying } = useGlobalAudioPlayer();
  
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [tracks, setTracks] = useState<{id: string, audioUrl: string, title?: string}[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const prevAutoPlayRef = useRef(autoPlay);
  
  // Fetch tracks if groupId is provided
  useEffect(() => {
    const fetchTracks = async () => {
      if (!groupId) {
        if (audioUrl) {
          setTracks([{id: 'single', audioUrl, title: `Frequency ${frequency || ''}`}]);
        }
        return;
      }
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('journey_template_audio_mappings')
          .select('*')
          .eq('journey_template_id', groupId);
          
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          console.log("Found audio mappings:", data);
          
          const formattedTracks = data.map(track => ({
            id: track.id,
            audioUrl: track.audio_url || '',
            title: track.description || `Track ${track.id}`
          }));
          
          const sortedTracks = [...formattedTracks].sort((a, b) => {
            const trackA = data.find(t => t.id === a.id);
            const trackB = data.find(t => t.id === b.id);
            if (trackA && trackB && 'is_primary' in trackA && 'is_primary' in trackB) {
              return trackA.is_primary ? -1 : trackB.is_primary ? 1 : 0;
            }
            return 0;
          });
          
          setTracks(sortedTracks);
        } else if (audioUrl) {
          setTracks([{id: 'single', audioUrl, title: `Frequency ${frequency || ''}`}]);
        }
      } catch (error) {
        console.error("Error fetching tracks:", error);
        if (audioUrl) {
          setTracks([{id: 'single', audioUrl, title: `Frequency ${frequency || ''}`}]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTracks();
  }, [groupId, audioUrl, frequency]);
  
  // Handle autoPlay prop changes
  useEffect(() => {
    if (autoPlay !== prevAutoPlayRef.current) {
      prevAutoPlayRef.current = autoPlay;
      
      if (autoPlay && tracks.length > 0) {
        const currentTrack = tracks[currentTrackIndex];
        if (currentTrack) {
          playAudio({
            title: currentTrack.title || `Track ${currentTrackIndex + 1}`,
            source: currentTrack.audioUrl,
            customData: { frequency }
          });
        }
      }
    }
  }, [autoPlay, tracks, currentTrackIndex, playAudio, frequency]);
  
  // Notify parent component of play state changes
  useEffect(() => {
    if (onPlayStateChange) {
      onPlayStateChange(isPlaying);
    }
  }, [isPlaying, onPlayStateChange]);
  
  const handleTogglePlayPause = () => {
    if (tracks.length === 0) return;
    
    if (!isPlaying) {
      const currentTrack = tracks[currentTrackIndex];
      playAudio({
        title: currentTrack.title || `Track ${currentTrackIndex + 1}`,
        source: currentTrack.audioUrl,
        customData: { frequency }
      });
    } else {
      togglePlayPause();
    }
  };
  
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (value[0] > 0 && isMuted) {
      setIsMuted(false);
    }
    
    // Update volume of the global audio player
    const audioElement = document.getElementById('global-audio-player') as HTMLAudioElement;
    if (audioElement) {
      audioElement.volume = value[0];
    }
  };
  
  const toggleMute = () => {
    setIsMuted(prev => !prev);
    
    // Update mute status of the global audio player
    const audioElement = document.getElementById('global-audio-player') as HTMLAudioElement;
    if (audioElement) {
      audioElement.muted = !isMuted;
    }
  };
  
  const skipToNextTrack = () => {
    if (tracks.length <= 1) return;
    
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);
    
    const nextTrack = tracks[nextIndex];
    playAudio({
      title: nextTrack.title || `Track ${nextIndex + 1}`,
      source: nextTrack.audioUrl,
      customData: { frequency }
    });
  };
  
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          disabled={isLoading || tracks.length === 0}
          onClick={handleTogglePlayPause}
          className={`h-10 w-10 rounded-full ${isPlaying ? 'bg-purple-100' : 'bg-white'}`}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5 ml-0.5" />
          )}
        </Button>
        
        <div className="flex-1 flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="h-8 w-8"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          
          <Slider
            value={[isMuted ? 0 : volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="w-24"
          />
        </div>
        
        {tracks.length > 1 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={skipToNextTrack}
            className="h-8 w-8"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {frequency && (
        <div className="text-xs text-center text-gray-500">
          {frequency}Hz {tracks.length > 1 && `· ${currentTrackIndex + 1}/${tracks.length}`}
        </div>
      )}
    </div>
  );
};

export default RandomizingAudioPlayer;
