
import React, { useState, useEffect } from 'react';
import { fetchJourneySoundscape } from '@/services/soundscapeService';
import { useJourney } from '@/context/JourneyContext';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Play, Pause, Music } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface JourneyAwareSoundscapePlayerProps {
  journeyId?: string;
  autoSync?: boolean;
  autoplay?: boolean;
  className?: string;
  compact?: boolean;
}

const JourneyAwareSoundscapePlayer: React.FC<JourneyAwareSoundscapePlayerProps> = ({
  journeyId,
  autoSync = true,
  autoplay = false,
  className = '',
  compact = false
}) => {
  const { activeJourney } = useJourney();
  const [soundscape, setSoundscape] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { 
    playAudio, 
    isPlaying, 
    togglePlayPause, 
    currentAudioId,
    setVolume,
    volume,
    isMuted,
    toggleMute
  } = useGlobalAudioPlayer();
  const [journeySlug, setJourneySlug] = useState<string | undefined>(undefined);
  
  // If autoSync is true, use the active journey from context
  useEffect(() => {
    if (autoSync && activeJourney?.filename) {
      setJourneySlug(activeJourney.filename);
    } else if (journeyId) {
      // If journeyId is provided directly, use that
      setJourneySlug(journeyId);
    }
  }, [autoSync, activeJourney, journeyId]);
  
  useEffect(() => {
    async function loadSoundscape() {
      if (!journeySlug) return;
      
      setLoading(true);
      
      try {
        console.log(`Loading soundscape for journey: ${journeySlug}`);
        const soundscapeData = await fetchJourneySoundscape(journeySlug);
        setSoundscape(soundscapeData);
        
        // Auto-play if requested and soundscape is available
        if (soundscapeData && autoplay) {
          playAudio({
            id: soundscapeData.id,
            title: soundscapeData.title,
            source: soundscapeData.file_url,
            description: soundscapeData.description
          });
        }
      } catch (error) {
        console.error('Error loading soundscape:', error);
      } finally {
        setLoading(false);
      }
    }
    
    if (journeySlug) {
      loadSoundscape();
    }
  }, [journeySlug, autoplay, playAudio]);

  const handlePlayPause = () => {
    if (!soundscape) {
      toast.error("No soundscape available for this journey");
      return;
    }
    
    if (!isPlaying || currentAudioId !== soundscape.id) {
      playAudio({
        id: soundscape.id,
        title: soundscape.title,
        source: soundscape.file_url,
        description: soundscape.description
      });
    } else {
      togglePlayPause();
    }
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-12 ${className}`}>
        <div className="animate-spin h-5 w-5 border-b-2 border-purple-500 rounded-full"></div>
      </div>
    );
  }

  if (!soundscape) {
    if (compact) {
      return null;
    }
    
    return (
      <div className={`text-sm text-gray-400 italic p-2 ${className}`}>
        No soundscape available for this journey
      </div>
    );
  }

  // Compact version for minimal UI
  if (compact) {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePlayPause}
          title={isPlaying && currentAudioId === soundscape.id ? "Pause" : "Play"}
          className="h-8 w-8 rounded-full"
        >
          {isPlaying && currentAudioId === soundscape.id ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        <span className="text-xs text-purple-200 ml-1">{soundscape.title}</span>
      </div>
    );
  }

  // Full version with more controls and info
  return (
    <div className={`soundscape-player p-4 rounded-lg bg-purple-900/20 backdrop-blur-sm border border-purple-500/30 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-white font-medium">{soundscape.title || 'Journey Soundscape'}</h3>
            <Badge variant="outline" className="bg-purple-500/20">
              <Music className="h-3 w-3 mr-1" />
              Soundscape
            </Badge>
          </div>
          {soundscape.description && (
            <p className="text-sm text-purple-200 mt-1">{soundscape.description}</p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="text-purple-100 hover:text-white"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          
          <Button 
            onClick={handlePlayPause}
            variant="secondary"
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isPlaying && currentAudioId === soundscape.id ? (
              <>
                <Pause className="h-4 w-4 mr-1" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-1" />
                Play
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JourneyAwareSoundscapePlayer;
