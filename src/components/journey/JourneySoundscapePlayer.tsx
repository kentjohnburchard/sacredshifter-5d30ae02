
import React, { useEffect, useState } from 'react';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';
import { fetchJourneySoundscape } from '@/services/soundscapeService';

interface JourneySoundscapePlayerProps {
  journeySlug: string;
  autoplay?: boolean;
}

const JourneySoundscapePlayer: React.FC<JourneySoundscapePlayerProps> = ({
  journeySlug,
  autoplay = false
}) => {
  const [soundscape, setSoundscape] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { playAudio, isPlaying, togglePlayPause } = useGlobalAudioPlayer();

  useEffect(() => {
    async function loadSoundscape() {
      setLoading(true);
      
      try {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-12">
        <div className="animate-spin h-5 w-5 border-b-2 border-purple-500 rounded-full"></div>
      </div>
    );
  }

  if (!soundscape) {
    return (
      <div className="text-sm text-gray-400 italic">
        No soundscape available for this journey
      </div>
    );
  }

  const handlePlayPause = () => {
    if (!isPlaying) {
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

  return (
    <div className="soundscape-player p-4 rounded-lg bg-purple-900/20 backdrop-blur-sm border border-purple-500/30">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-medium">{soundscape.title || 'Journey Soundscape'}</h3>
          {soundscape.description && (
            <p className="text-sm text-purple-200">{soundscape.description}</p>
          )}
        </div>
        
        <button 
          onClick={handlePlayPause}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm"
        >
          {isPlaying ? 'Pause' : 'Play'} Soundscape
        </button>
      </div>
    </div>
  );
};

export default JourneySoundscapePlayer;
