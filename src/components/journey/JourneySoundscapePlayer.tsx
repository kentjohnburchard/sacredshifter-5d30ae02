
import React, { useState, useEffect, useRef } from 'react';
import { JourneySoundscape } from '@/services/soundscapeService';
import { Volume2, VolumeX, Play, Pause, SkipBack } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';

interface JourneySoundscapePlayerProps {
  soundscape: JourneySoundscape;
  autoPlay?: boolean;
  loop?: boolean;
  className?: string;
}

const JourneySoundscapePlayer: React.FC<JourneySoundscapePlayerProps> = ({
  soundscape,
  autoPlay = false,
  loop = true,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { playAudio } = useGlobalAudioPlayer();
  
  const isYouTubeEmbed = soundscape.source_type === 'youtube';
  
  // Handle YouTube embeds separately
  if (isYouTubeEmbed && soundscape.source_link) {
    return (
      <div className={`relative rounded-lg overflow-hidden ${className}`}>
        <iframe
          src={`${soundscape.source_link}?autoplay=${autoPlay ? '1' : '0'}&loop=${loop ? '1' : '0'}`}
          title={soundscape.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full aspect-video"
        />
      </div>
    );
  }
  
  // For regular audio files
  useEffect(() => {
    if (soundscape.file_url) {
      // Format url if needed
      let audioUrl = soundscape.file_url;
      
      if (!audioUrl.startsWith('http') && !audioUrl.startsWith('/')) {
        // Assume it's a storage file path
        audioUrl = `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${audioUrl}`;
      }
      
      if (autoPlay) {
        playAudio({
          title: soundscape.title,
          source: audioUrl,
          artist: "Sacred Shifter"
        });
        setIsPlaying(true);
      }
    }
  }, [soundscape, autoPlay, playAudio]);
  
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => {
          console.error('Audio playback failed:', err);
        });
      }
      setIsPlaying(!isPlaying);
    } else if (soundscape.file_url) {
      let audioUrl = soundscape.file_url;
      
      if (!audioUrl.startsWith('http') && !audioUrl.startsWith('/')) {
        audioUrl = `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${audioUrl}`;
      }
      
      playAudio({
        title: soundscape.title,
        source: audioUrl,
        artist: "Sacred Shifter"
      });
      setIsPlaying(true);
    }
  };
  
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !muted;
      setMuted(!muted);
    }
  };
  
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };
  
  const resetTrack = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };
  
  return (
    <div className={`p-3 bg-black/20 backdrop-blur-sm rounded-md ${className}`}>
      <div className="flex items-center justify-between">
        <div className="font-medium truncate mr-2">
          {soundscape.title}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={resetTrack} className="text-gray-300 hover:text-white">
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={togglePlay}
            className="text-gray-300 hover:text-white"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleMute}
            className="text-gray-300 hover:text-white"
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          
          <div className="w-24">
            <Slider
              value={[volume]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
              className="h-1.5"
            />
          </div>
        </div>
      </div>
      
      {/* Hidden audio element for direct control */}
      <audio 
        ref={audioRef}
        src={soundscape.file_url}
        preload="auto"
        loop={loop}
        hidden
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
};

export default JourneySoundscapePlayer;
