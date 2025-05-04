
import React, { useState, useEffect, useRef } from 'react';
import { fetchJourneySoundscape, JourneySoundscape } from '@/services/soundscapeService';
import { Volume2, VolumeX, Play, Pause, SkipBack } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';

interface JourneySoundscapePlayerProps {
  journeySlug: string;
  autoPlay?: boolean;
  loop?: boolean;
  className?: string;
}

const JourneySoundscapePlayer: React.FC<JourneySoundscapePlayerProps> = ({
  journeySlug,
  autoPlay = false,
  loop = true,
  className = ''
}) => {
  const [soundscape, setSoundscape] = useState<JourneySoundscape | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { playAudio } = useGlobalAudioPlayer();
  
  useEffect(() => {
    const loadSoundscape = async () => {
      try {
        setIsLoading(true);
        const data = await fetchJourneySoundscape(journeySlug);
        if (data) {
          setSoundscape(data);
          if (autoPlay && data.file_url) {
            const audioUrl = formatAudioUrl(data.file_url);
            playAudio({
              title: data.title,
              source: audioUrl,
              artist: "Sacred Shifter"
            });
            setIsPlaying(true);
          }
        }
      } catch (err) {
        console.error("Error loading soundscape:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSoundscape();
  }, [journeySlug, autoPlay, playAudio]);
  
  const formatAudioUrl = (url: string) => {
    if (!url) return '';
    
    if (!url.startsWith('http') && !url.startsWith('/')) {
      return `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${url}`;
    }
    
    return url;
  };
  
  // If soundscape is still loading, show a loading state
  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <p>Loading soundscape...</p>
      </div>
    );
  }
  
  // If no soundscape was found
  if (!soundscape) {
    return (
      <div className="p-4 text-center">
        <p>No soundscape available for this journey</p>
      </div>
    );
  }
  
  // Handle YouTube embeds separately
  const isYouTubeEmbed = soundscape.source_type === 'youtube';
  
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
      const audioUrl = formatAudioUrl(soundscape.file_url);
      
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
        src={formatAudioUrl(soundscape.file_url)}
        preload="auto"
        loop={loop}
        hidden
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
};

export default JourneySoundscapePlayer;
