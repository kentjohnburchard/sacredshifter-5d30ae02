
import React, { useState, useEffect } from 'react';
import { fetchJourneySoundscape, JourneySoundscape } from '@/services/soundscapeService';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import YouTubeEmbed from './YouTubeEmbed';

interface JourneySoundscapePlayerProps {
  journeySlug: string;
  autoplay?: boolean;
}

const JourneySoundscapePlayer: React.FC<JourneySoundscapePlayerProps> = ({
  journeySlug,
  autoplay = false
}) => {
  const [soundscape, setSoundscape] = useState<JourneySoundscape | null>(null);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(true);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSoundscape = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchJourneySoundscape(journeySlug);
        
        if (!data) {
          // Only set an error if we got null - return silently otherwise
          setError('No soundscape available');
        } else {
          setSoundscape(data);
          console.log('Loaded soundscape:', data);
        }
      } catch (err) {
        console.error('Error loading soundscape:', err);
        setError('Failed to load soundscape');
      } finally {
        setLoading(false);
      }
    };

    loadSoundscape();
  }, [journeySlug]);

  useEffect(() => {
    if (soundscape?.source_type === 'file' && soundscape.file_url) {
      const audioElement = new Audio(soundscape.file_url);
      audioElement.loop = true;
      audioElement.muted = isMuted;
      audioElement.volume = 0.5;
      
      setAudio(audioElement);
      
      return () => {
        audioElement.pause();
        audioElement.src = '';
      };
    }
  }, [soundscape]);

  useEffect(() => {
    if (audio) {
      if (isPlaying) {
        audio.play().catch(err => {
          console.error('Error playing audio:', err);
          setError('Failed to play audio. Try unmuting first.');
        });
      } else {
        audio.pause();
      }
    }
  }, [isPlaying, audio]);

  useEffect(() => {
    if (audio) {
      audio.muted = isMuted;
    }
  }, [isMuted, audio]);

  // Set autoplay when component mounts
  useEffect(() => {
    if (autoplay && soundscape) {
      setIsPlaying(true);
    }
  }, [autoplay, soundscape]);

  const togglePlayback = () => {
    setIsPlaying(prev => !prev);
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  if (loading) {
    return (
      <div className="h-16 flex items-center justify-center">
        <div className="animate-spin h-5 w-5 border-b-2 border-purple-500 rounded-full"></div>
        <span className="ml-2 text-sm text-white/80">Loading soundscape...</span>
      </div>
    );
  }

  if (error || !soundscape) {
    // Return null instead of an error message - the parent component will handle this case
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium text-white readable-text">Journey Soundscape</h3>
      
      <div className="bg-black/40 backdrop-blur-sm p-3 rounded-md border border-purple-500/20">
        <div className="flex items-center justify-between">
          <div className="text-sm truncate max-w-[70%] text-white">
            {soundscape.title || 'Journey Soundscape'}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleMute}
              className="h-8 w-8 hover:bg-purple-900/30"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            
            {soundscape.source_type === 'file' && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={togglePlayback}
                className="h-8 w-8 hover:bg-purple-900/30"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>
        
        {soundscape.source_type === 'youtube' && soundscape.file_url && (
          <div className="mt-2">
            <YouTubeEmbed 
              youtubeUrl={soundscape.file_url} 
              height="120px"
              autoplay={autoplay}
              muted={isMuted}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default JourneySoundscapePlayer;
