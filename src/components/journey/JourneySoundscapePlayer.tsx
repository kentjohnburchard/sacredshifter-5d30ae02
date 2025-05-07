
import React, { useState, useEffect } from 'react';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';
import { fetchJourneySoundscape } from '@/services/soundscapeService';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface JourneySoundscapePlayerProps {
  journeySlug: string;
  autoplay?: boolean;
}

const JourneySoundscapePlayer: React.FC<JourneySoundscapePlayerProps> = ({ 
  journeySlug,
  autoplay = false
}) => {
  const [soundscape, setSoundscape] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  
  // Use global audio player to ensure only one audio plays at a time
  const { 
    playAudio, 
    togglePlayPause, 
    isPlaying, 
    currentTime, 
    duration, 
    setVolume,
    volume,
    currentAudio
  } = useGlobalAudioPlayer();
  
  // Progress percentage calculation
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  // Check if this player is the active player
  const isActivePlayer = currentAudio?.source === soundscape?.file_url;
  
  // Load soundscape data for the journey
  useEffect(() => {
    const loadSoundscape = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchJourneySoundscape(journeySlug);
        setSoundscape(data);
        
        // Autoplay if specified and soundscape is found
        if (data?.file_url && autoplay) {
          playAudio({
            title: data.title || 'Journey Soundscape',
            source: data.file_url,
            artist: 'Sacred Shifter'
          });
        }
      } catch (err) {
        console.error('Error loading soundscape:', err);
        setError('Failed to load soundscape');
      } finally {
        setLoading(false);
      }
    };
    
    if (journeySlug) {
      loadSoundscape();
    }
    
    return () => {
      // No cleanup needed since global audio player persists
    };
  }, [journeySlug, autoplay, playAudio]);
  
  // Handle play button click
  const handlePlay = () => {
    if (soundscape?.file_url) {
      if (!isActivePlayer) {
        playAudio({
          title: soundscape.title || 'Journey Soundscape',
          source: soundscape.file_url,
          artist: 'Sacred Shifter'
        });
      } else {
        togglePlayPause();
      }
    }
  };
  
  // Toggle mute
  const handleToggleMute = () => {
    if (volume > 0 && !isMuted) {
      setVolume(0);
      setIsMuted(true);
    } else {
      setVolume(0.7); // Default volume
      setIsMuted(false);
    }
  };
  
  // Format time display (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // If no soundscape or error, show fallback UI
  if (!soundscape && !loading) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-black/60 rounded-lg">
        <p className="text-white/70 text-sm">
          {error || "No soundscape available for this journey."}
        </p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col space-y-4">
      {loading ? (
        <div className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white/60"></div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div className="flex-1 truncate pr-4">
              <h3 className="text-white text-sm font-medium truncate">{soundscape?.title || 'Journey Soundscape'}</h3>
              <p className="text-white/60 text-xs truncate">
                {soundscape?.description || 'Sacred sound frequency'}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="ghost"
                className="text-white/80 hover:text-white"
                onClick={handleToggleMute}
              >
                {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </Button>
              
              <Button
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-full h-10 w-10 p-0 flex items-center justify-center"
                onClick={handlePlay}
              >
                {isPlaying && isActivePlayer ? <Pause size={18} /> : <Play size={18} />}
              </Button>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="space-y-1">
            <div className="h-1.5 bg-gray-700/40 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-500 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/60">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default JourneySoundscapePlayer;
