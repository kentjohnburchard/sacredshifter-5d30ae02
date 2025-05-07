
import React, { useState, useEffect } from 'react';
import { fetchJourneySoundscape } from '@/services/soundscapeService';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface JourneySoundscapePlayerProps {
  journeySlug: string;
  autoplay?: boolean;
}

interface Soundscape {
  id: string;
  title: string;
  description?: string;
  file_url: string;
  source_link?: string;
}

const JourneySoundscapePlayer: React.FC<JourneySoundscapePlayerProps> = ({
  journeySlug,
  autoplay = false
}) => {
  const [soundscape, setSoundscape] = useState<Soundscape | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    playAudio, 
    togglePlayPause, 
    isPlaying, 
    currentAudio, 
    volume,
    setVolume
  } = useGlobalAudioPlayer();

  // Load soundscape for journey
  useEffect(() => {
    const loadSoundscape = async () => {
      try {
        setLoading(true);
        const soundscapeData = await fetchJourneySoundscape(journeySlug);
        
        if (soundscapeData) {
          setSoundscape(soundscapeData);
          setError(null);
          
          // Auto play if enabled
          if (autoplay) {
            playAudio({
              title: soundscapeData.title,
              source: soundscapeData.file_url,
              id: soundscapeData.id,
              sourceType: 'journey'
            });
          }
        } else {
          setSoundscape(null);
          setError("No soundscape found for this journey");
        }
      } catch (err) {
        console.error("Failed to load soundscape:", err);
        setError("Failed to load soundscape");
        setSoundscape(null);
      } finally {
        setLoading(false);
      }
    };
    
    if (journeySlug) {
      loadSoundscape();
    }
  }, [journeySlug, autoplay, playAudio]);
  
  // Check if this soundscape is currently playing
  const isThisSoundscapePlaying = 
    isPlaying && currentAudio?.source === soundscape?.file_url;
  
  // Play this specific soundscape
  const playSoundscape = () => {
    if (!soundscape) return;
    
    playAudio({
      title: soundscape.title,
      source: soundscape.file_url,
      id: soundscape.id,
      sourceType: 'journey'
    });
  };
  
  // Toggle play/pause for this soundscape
  const handlePlayToggle = () => {
    if (isThisSoundscapePlaying) {
      togglePlayPause();
    } else {
      playSoundscape();
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-16">
        <div className="animate-spin h-5 w-5 border-2 border-purple-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  if (error || !soundscape) {
    return (
      <div className="text-sm text-gray-400 p-2 text-center">
        {error || "No soundscape available"}
      </div>
    );
  }
  
  return (
    <div className="soundscape-player">
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-white">{soundscape.title}</h3>
            {soundscape.description && (
              <p className="text-xs text-gray-400">{soundscape.description}</p>
            )}
          </div>
          
          <Button
            size="sm"
            variant="outline"
            className={`
              ${isThisSoundscapePlaying
                ? 'bg-purple-700/50 border-purple-500' 
                : 'bg-black/30 border-purple-500/30'}
              text-white hover:bg-purple-800/50 transition-colors
            `}
            onClick={handlePlayToggle}
          >
            {isThisSoundscapePlaying ? (
              <Pause className="h-4 w-4 mr-2" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            {isThisSoundscapePlaying ? 'Pause' : 'Play'}
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-gray-400" />
          <Slider
            value={[volume * 100]}
            min={0}
            max={100}
            step={1}
            className="flex-1"
            onValueChange={(values) => {
              setVolume(values[0] / 100);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default JourneySoundscapePlayer;
