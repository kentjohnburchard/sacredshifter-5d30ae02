
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
          setError('No soundscape found for this journey');
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

  const togglePlayback = () => {
    setIsPlaying(prev => !prev);
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  if (loading) {
    return <div className="h-20 flex items-center justify-center">Loading soundscape...</div>;
  }

  if (error || !soundscape) {
    return (
      <div className="h-20 flex flex-col items-center justify-center text-sm text-gray-400">
        <p>{error || 'No soundscape available'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Journey Soundscape</h3>
      
      <div className="bg-black/30 p-3 rounded-md">
        <div className="flex items-center justify-between">
          <div className="text-sm truncate max-w-[70%]">
            {soundscape.title || 'Journey Soundscape'}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleMute}
              className="h-8 w-8"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            
            {soundscape.source_type === 'file' && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={togglePlayback}
                className="h-8 w-8"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>
        
        {soundscape.source_type === 'youtube' && soundscape.file_url && (
          <div className="mt-2">
            <YouTubeEmbed 
              url={soundscape.file_url} 
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
