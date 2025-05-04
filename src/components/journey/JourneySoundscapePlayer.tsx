
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ExternalLink, 
  Music 
} from 'lucide-react';
import { JourneySoundscape } from '@/services/soundscapeService';
import { Card, CardContent } from '@/components/ui/card';

interface JourneySoundscapePlayerProps {
  soundscape: JourneySoundscape;
  className?: string;
}

const JourneySoundscapePlayer: React.FC<JourneySoundscapePlayerProps> = ({ 
  soundscape, 
  className = '' 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7); // Default to 70% volume
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previousVolumeRef = useRef(volume);

  // Format the audio URL if needed
  const getAudioUrl = (url: string) => {
    if (url.startsWith('http')) {
      return url;
    }
    return `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${url}`;
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Error playing audio:", error);
          setError("Unable to play audio. Please try again.");
        });
      }
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    
    if (isMuted) {
      audioRef.current.volume = previousVolumeRef.current;
      setVolume(previousVolumeRef.current);
    } else {
      previousVolumeRef.current = volume;
      audioRef.current.volume = 0;
      setVolume(0);
    }
    
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    
    // Update muted state based on volume
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  // Set up audio event listeners
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      audioElement.currentTime = 0; // Reset to beginning
      audioElement.play(); // Loop the audio
    };
    const handleError = () => {
      setError("There was an error with the audio playback");
      setIsPlaying(false);
    };
    
    // Set initial volume
    audioElement.volume = volume;
    
    // Add event listeners
    audioElement.addEventListener('play', handlePlay);
    audioElement.addEventListener('pause', handlePause);
    audioElement.addEventListener('ended', handleEnded);
    audioElement.addEventListener('error', handleError);
    
    // Clean up
    return () => {
      audioElement.removeEventListener('play', handlePlay);
      audioElement.removeEventListener('pause', handlePause);
      audioElement.removeEventListener('ended', handleEnded);
      audioElement.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <Card className={`bg-black/20 backdrop-blur-sm border-purple-500/30 ${className}`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Music className="h-4 w-4 text-purple-400 mr-2" />
              <h3 className="font-medium text-purple-300">Journey Soundscape</h3>
            </div>
            
            {soundscape.source_link && (
              <a 
                href={soundscape.source_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center"
              >
                Source <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            )}
          </div>

          <div className="text-sm">
            <h4 className="text-white/90 font-medium">{soundscape.title}</h4>
            {soundscape.description && (
              <p className="text-white/70 text-xs mt-1">{soundscape.description}</p>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              size="sm"
              variant="outline"
              onClick={togglePlay}
              className="h-8 w-8 rounded-full p-0 border-purple-500/30 bg-purple-900/20 text-purple-200"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            
            <Button
              size="sm"
              variant="ghost"
              onClick={toggleMute}
              className="h-8 w-8 rounded-full p-0 text-purple-300 hover:text-purple-200 hover:bg-purple-900/20"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            
            <div className="relative flex-grow">
              <Slider 
                value={[volume]} 
                max={1} 
                min={0}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="w-full"
              />
            </div>
          </div>
          
          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}
          
          <audio
            ref={audioRef}
            src={getAudioUrl(soundscape.file_url)}
            loop
            preload="metadata"
            className="hidden"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default JourneySoundscapePlayer;
