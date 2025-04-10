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
      if (internalAudioRef.current === null) {
        internalAudioRef.current = new Audio();
      }
      // For the provided ref, we can't modify it directly
      if (providedAudioRef && !providedAudioRef.current) {
        console.warn("Provided audioRef is null, using internal audio element");
      }
    }

    const audio = audioRef.current || internalAudioRef.current;
    
    if (audio) {
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
    }
  }, [audioRef, tracks]);
  
  // Handle volume changes
  useEffect(() => {
    const audio = audioRef.current || internalAudioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume, audioRef]);
  
  // Handle mute/unmute
  useEffect(() => {
    const audio = audioRef.current || internalAudioRef.current;
    if (audio) {
      audio.muted = isMuted;
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
          .from('journey_template_audio_mappings')
          .select('*')
          .eq('journey_template_id', groupId);
          
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          const formattedTracks = data.map(track => ({
            id: track.id,
            audioUrl: track.audio_url || ''
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
          setTracks([{id: 'single', audioUrl}]);
        }
      } catch (error) {
        console.error("Error fetching tracks:", error);
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
      const audio = audioRef.current || internalAudioRef.current;
      if (!audio || tracks.length === 0) return;
      
      const currentTrack = tracks[currentTrackIndex];
      if (!currentTrack) return;
      
      let url = currentTrack.audioUrl;
      
      if (!url.startsWith('http')) {
        url = `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${url}`;
      }
      
      if (url.includes(' ') || url.includes('(') || url.includes(')')) {
        url = encodeURI(url);
      }
      
      audio.src = url;
      audio.load();
    };
    
    setAudioSource();
  }, [tracks, currentTrackIndex, audioRef]);
  
  // Handle autoPlay prop changes
  useEffect(() => {
    if (autoPlay !== prevAutoPlayRef.current) {
      prevAutoPlayRef.current = autoPlay;
      setIsPlaying(autoPlay);
      
      if (autoPlay) {
        const audio = audioRef.current || internalAudioRef.current;
        if (audio) {
          audio.play().catch(err => {
            console.error("Failed to autoplay:", err);
            setIsPlaying(false);
            if (onPlayStateChange) onPlayStateChange(false);
          });
        }
      } else {
        const audio = audioRef.current || internalAudioRef.current;
        if (audio) {
          audio.pause();
        }
      }
    }
  }, [autoPlay, onPlayStateChange, audioRef]);
  
  // Handle play state changes
  useEffect(() => {
    const audio = audioRef.current || internalAudioRef.current;
    if (!audio || tracks.length === 0) return;
    
    if (isPlaying) {
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Play error:", error);
          setIsPlaying(false);
          if (onPlayStateChange) onPlayStateChange(false);
          toast.error("Could not play audio. Please try again or check your browser permissions.");
        });
      }
    } else {
      audio.pause();
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
    
    if (isPlaying) {
      const audio = audioRef.current || internalAudioRef.current;
      if (audio) {
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Error playing next track:", error);
          });
        }
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
