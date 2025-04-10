import React, { useRef, useState, useEffect, RefObject } from 'react';
import { Button } from "@/components/ui/button";
import { Pause, Play, Volume2, VolumeX, SkipForward, Loader2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import useAudioAnalyzer from '@/hooks/useAudioAnalyzer';

interface RandomizingAudioPlayerProps {
  audioRef?: RefObject<HTMLAudioElement>;
  audioUrl?: string | null;
  groupId?: string;
  frequency?: number;
  autoPlay?: boolean;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

const RandomizingAudioPlayer: React.FC<RandomizingAudioPlayerProps> = ({
  audioRef: providedAudioRef,
  audioUrl,
  groupId,
  frequency,
  autoPlay = false,
  onPlayStateChange
}) => {
  // Use provided audioRef or create our own
  const internalAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioRef = providedAudioRef || internalAudioRef;
  
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [tracks, setTracks] = useState<{id: string, audioUrl: string}[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const prevAutoPlayRef = useRef(autoPlay);
  
  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;
    
    audio.volume = volume;
    audio.muted = isMuted;

    const handleEnded = () => {
      if (tracks.length > 1) {
        skipToNextTrack();
      } else {
        setIsPlaying(false);
        if (onPlayStateChange) onPlayStateChange(false);
      }
    };

    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, [audioRef, tracks]);
  
  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume, audioRef]);
  
  // Handle mute/unmute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted, audioRef]);
  
  // Fetch tracks if groupId is provided
  useEffect(() => {
    const fetchTracks = async () => {
      if (!groupId) {
        if (audioUrl) {
          setTracks([{id: 'single', audioUrl}]);
        }
        return;
      }
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('journey_audio_mappings')
          .select('*')
          .eq('journeyId', groupId);
          
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          const formattedTracks = data.map(track => ({
            id: track.id,
            audioUrl: track.audioUrl
          }));
          
          // Sort by isPrimary if possible
          const sortedTracks = [...formattedTracks].sort((a, b) => {
            // @ts-ignore - isPrimary might exist on the data
            if (data.find(t => t.id === a.id)?.isPrimary) return -1;
            // @ts-ignore - isPrimary might exist on the data
            if (data.find(t => t.id === b.id)?.isPrimary) return 1;
            return 0;
          });
          
          setTracks(sortedTracks);
        } else if (audioUrl) {
          // Fallback to direct audio URL if no tracks from group
          setTracks([{id: 'single', audioUrl}]);
        }
      } catch (error) {
        console.error("Error fetching tracks:", error);
        // Fallback to direct audio URL if fetch fails
        if (audioUrl) {
          setTracks([{id: 'single', audioUrl}]);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTracks();
  }, [groupId, audioUrl]);
  
  // Set audio source when tracks/currentTrackIndex change
  useEffect(() => {
    const setAudioSource = () => {
      if (!audioRef.current || tracks.length === 0) return;
      
      const currentTrack = tracks[currentTrackIndex];
      if (!currentTrack) return;
      
      let url = currentTrack.audioUrl;
      
      // Format URL if needed
      if (!url.startsWith('http')) {
        url = `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${url}`;
      }
      
      // Handle spaces and parentheses
      if (url.includes(' ') || url.includes('(') || url.includes(')')) {
        url = encodeURI(url);
      }
      
      audioRef.current.src = url;
      audioRef.current.load();
    };
    
    setAudioSource();
  }, [tracks, currentTrackIndex, audioRef]);
  
  // Handle autoPlay prop changes
  useEffect(() => {
    if (autoPlay !== prevAutoPlayRef.current) {
      prevAutoPlayRef.current = autoPlay;
      setIsPlaying(autoPlay);
      
      if (autoPlay) {
        if (audioRef.current) {
          audioRef.current.play().catch(err => {
            console.error("Failed to autoplay:", err);
            setIsPlaying(false);
            if (onPlayStateChange) onPlayStateChange(false);
          });
        }
      } else {
        if (audioRef.current) {
          audioRef.current.pause();
        }
      }
    }
  }, [autoPlay, onPlayStateChange, audioRef]);
  
  // Handle play state changes
  useEffect(() => {
    if (!audioRef.current || tracks.length === 0) return;
    
    if (isPlaying) {
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Play error:", error);
          setIsPlaying(false);
          if (onPlayStateChange) onPlayStateChange(false);
          toast.error("Could not play audio. Please try again or check your browser permissions.");
        });
      }
    } else {
      audioRef.current.pause();
    }
    
    if (onPlayStateChange) {
      onPlayStateChange(isPlaying);
    }
  }, [isPlaying, tracks, onPlayStateChange, audioRef]);
  
  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };
  
  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };
  
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (value[0] > 0 && isMuted) {
      setIsMuted(false);
    }
  };
  
  const skipToNextTrack = () => {
    if (tracks.length <= 1) return;
    
    setCurrentTrackIndex(prev => {
      const nextIndex = (prev + 1) % tracks.length;
      return nextIndex;
    });
    
    // If already playing, keep playing the next track
    if (isPlaying && audioRef.current) {
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Error playing next track:", error);
        });
      }
    }
  };
  
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          disabled={isLoading || tracks.length === 0}
          onClick={togglePlayPause}
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
