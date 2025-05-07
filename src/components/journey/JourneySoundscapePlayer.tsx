
import React, { useState, useEffect } from 'react';
import { fetchJourneySoundscape, JourneySoundscape } from '@/services/soundscapeService';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface JourneySoundscapePlayerProps {
  journeySlug: string;
  autoplay?: boolean;
}

const JourneySoundscapePlayer: React.FC<JourneySoundscapePlayerProps> = ({ journeySlug, autoplay = false }) => {
  const [soundscape, setSoundscape] = useState<JourneySoundscape | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.7);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  
  const { 
    isPlaying, 
    currentAudio,
    playAudio,
    togglePlayPause,
    setVolume: setPlayerVolume,
  } = useGlobalAudioPlayer();
  
  // Check if this soundscape is currently playing
  const isThisSoundscapePlaying = isPlaying && 
    currentAudio?.source === soundscape?.file_url;
  
  // Load soundscape data
  useEffect(() => {
    const loadSoundscape = async () => {
      if (!journeySlug) return;
      
      try {
        setLoading(true);
        const data = await fetchJourneySoundscape(journeySlug);
        if (data) {
          setSoundscape(data);
          setError(null);
          
          // If autoplay is enabled, start playing
          if (autoplay) {
            setTimeout(() => {
              playAudio({
                title: data.title || 'Journey Soundscape',
                artist: 'Sacred Shifter',
                source: data.file_url,
                sourceType: data.source_type || 'file'
              });
            }, 500);
          }
        } else {
          setError('No soundscape found for this journey');
        }
      } catch (err) {
        console.error('Error loading soundscape:', err);
        setError('Failed to load soundscape');
      } finally {
        setLoading(false);
      }
    };
    
    loadSoundscape();
  }, [journeySlug, autoplay, playAudio]);
  
  const handlePlay = () => {
    if (!soundscape) return;
    
    if (!isThisSoundscapePlaying) {
      // If another track is playing or no track is playing, play this one
      playAudio({
        title: soundscape.title || 'Journey Soundscape',
        artist: 'Sacred Shifter',
        source: soundscape.file_url,
        sourceType: soundscape.source_type || 'file'
      });
    } else {
      // If this track is already playing, toggle play/pause
      togglePlayPause();
    }
  };
  
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    setPlayerVolume(newVolume);
  };
  
  const toggleVolumeSlider = () => {
    setShowVolumeSlider(prev => !prev);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-4 h-16">
        <div className="animate-spin h-5 w-5 border-2 border-purple-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  if (error || !soundscape) {
    return (
      <div className="text-center p-4 text-gray-400">
        {error || 'No soundscape available for this journey'}
      </div>
    );
  }
  
  // If we have a YouTube source
  if (soundscape.source_type === 'youtube') {
    return (
      <div className="space-y-2">
        <div className="text-sm text-white mb-2">
          {soundscape.title || 'Journey Soundscape'}
        </div>
        <div className="aspect-video w-full rounded overflow-hidden">
          <iframe
            src={soundscape.source_link}
            title={soundscape.title || 'Journey Soundscape'}
            className="w-full h-full"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    );
  }
  
  // For file sources
  return (
    <div className="space-y-2">
      <div className="text-sm text-white mb-1">
        {soundscape.title || 'Journey Soundscape'}
      </div>
      
      {soundscape.description && (
        <p className="text-xs text-gray-400 mb-2">{soundscape.description}</p>
      )}
      
      <div className="flex justify-between items-center">
        <Button 
          onClick={handlePlay} 
          variant="outline" 
          size="sm"
          className="bg-purple-900/20 border-purple-500/30 text-purple-200 hover:bg-purple-900/40"
        >
          {isThisSoundscapePlaying && isPlaying ? (
            <Pause className="h-4 w-4 mr-1" />
          ) : (
            <Play className="h-4 w-4 mr-1" />
          )}
          {isThisSoundscapePlaying && isPlaying ? 'Pause' : 'Play'}
        </Button>
        
        <div className="relative">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-purple-200" 
            onClick={toggleVolumeSlider}
          >
            {volume > 0 ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </Button>
          
          {showVolumeSlider && (
            <div className="absolute right-0 bottom-full mb-2 p-2 bg-black/90 rounded shadow-lg w-32">
              <Slider 
                value={[volume]} 
                min={0} 
                max={1} 
                step={0.01}
                onValueChange={handleVolumeChange} 
                className="w-full" 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JourneySoundscapePlayer;
