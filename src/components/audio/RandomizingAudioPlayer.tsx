
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useAudioLibrary, AudioTrack } from "@/hooks/useAudioLibrary";
import { toast } from "sonner";

interface RandomizingAudioPlayerProps {
  groupId?: string;
  feature?: string;
  frequency?: number;
  audioUrl?: string;
  autoPlay?: boolean;
  onPlayStateChange?: (isPlaying: boolean) => void;
  className?: string;
  showControls?: boolean;
}

const RandomizingAudioPlayer: React.FC<RandomizingAudioPlayerProps> = ({
  groupId,
  feature,
  frequency,
  audioUrl,
  autoPlay = false,
  onPlayStateChange,
  className = "",
  showControls = true
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const { getRandomFromGroup, getByFrequency } = useAudioLibrary();

  // Load the appropriate audio track based on inputs
  useEffect(() => {
    const loadTrack = async () => {
      try {
        setIsLoading(true);
        
        // Direct audio URL has highest priority
        if (audioUrl) {
          setCurrentTrack({
            id: "direct-url",
            title: "Audio Track",
            audioUrl,
            frequency: frequency || 0
          });
          return;
        }
        
        // Try to get from group ID
        if (groupId) {
          const track = await getRandomFromGroup(groupId);
          if (track) {
            setCurrentTrack(track);
            return;
          }
        }
        
        // Try to get by frequency
        if (frequency) {
          const track = await getByFrequency(frequency);
          if (track) {
            setCurrentTrack(track);
            return;
          }
        }
        
        // If we reach here, we couldn't find a track
        console.error("No audio track could be found");
        
      } catch (err) {
        console.error("Error loading audio track:", err);
        toast.error("Failed to load audio track");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTrack();
  }, [groupId, frequency, audioUrl, getRandomFromGroup, getByFrequency]);
  
  // Set up audio element when track changes
  useEffect(() => {
    if (!currentTrack?.audioUrl) return;
    
    if (!audioRef.current) {
      audioRef.current = new Audio(currentTrack.audioUrl);
    } else {
      audioRef.current.src = currentTrack.audioUrl;
    }
    
    audioRef.current.volume = isMuted ? 0 : volume;
    
    const handleEnded = () => {
      setIsPlaying(false);
      if (onPlayStateChange) onPlayStateChange(false);
    };
    
    audioRef.current.addEventListener('ended', handleEnded);
    
    // Auto-play if requested
    if (autoPlay && !isPlaying) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          if (onPlayStateChange) onPlayStateChange(true);
        })
        .catch(err => {
          console.error("Failed to auto-play audio:", err);
        });
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, [currentTrack, autoPlay, volume, isMuted, onPlayStateChange]);
  
  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);
  
  // Toggle play/pause
  const togglePlay = () => {
    if (!audioRef.current || !currentTrack) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (onPlayStateChange) onPlayStateChange(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          if (onPlayStateChange) onPlayStateChange(true);
        })
        .catch(err => {
          console.error("Failed to play audio:", err);
          toast.error("Failed to play audio");
        });
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  // Handle volume slider change
  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0];
    setVolume(newVolume);
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  if (!showControls) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant="outline"
        size="icon"
        disabled={isLoading || !currentTrack}
        className={`h-10 w-10 rounded-full ${isLoading ? 'opacity-50' : ''}`}
        onClick={togglePlay}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5 ml-0.5" />
        )}
      </Button>
      
      {currentTrack && (
        <div className="flex-1 max-w-xs">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 p-0"
              onClick={toggleMute}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            
            <Slider
              value={[isMuted ? 0 : volume]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
            />
          </div>
        </div>
      )}
      
      {frequency && (
        <span className="text-xs text-muted-foreground ml-1">{frequency}Hz</span>
      )}
    </div>
  );
};

export default RandomizingAudioPlayer;
