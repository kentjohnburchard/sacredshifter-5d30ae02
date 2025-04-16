
import React, { useEffect, useState } from 'react';
import { JourneySong } from '@/types/journeySongs';
import { AudioFunctionCategory } from '@/types/music';

interface JourneyAudioMapperProps {
  journeyId?: string;
  songs?: JourneySong[];
  onSongSelect?: (song: JourneySong) => void;
}

const JourneyAudioMapper: React.FC<JourneyAudioMapperProps> = ({
  journeyId,
  songs = [],
  onSongSelect
}) => {
  const [groupedSongs, setGroupedSongs] = useState<Record<AudioFunctionCategory, JourneySong[]>>({
    journey: [],
    interface: [],
    meditation: [],
    frequency: []
  });

  useEffect(() => {
    if (!songs || songs.length === 0) return;

    // Group songs by category, with a safe default
    const grouped = songs.reduce((acc, song) => {
      // Use a type assertion to ensure TypeScript knows we're accessing a valid category
      const songCategory: AudioFunctionCategory = (song.category as AudioFunctionCategory) || 'journey';
      
      if (!acc[songCategory]) {
        acc[songCategory] = [];
      }
      
      acc[songCategory].push(song);
      return acc;
    }, {} as Record<AudioFunctionCategory, JourneySong[]>);
    
    // Ensure all categories exist in the result
    const result = {
      journey: grouped.journey || [],
      interface: grouped.interface || [],
      meditation: grouped.meditation || [],
      frequency: grouped.frequency || []
    };
    
    setGroupedSongs(result);
  }, [songs]);

  return (
    <div className="journey-audio-mapper">
      {Object.entries(groupedSongs).map(([categoryKey, categorySongs]) => {
        if (categorySongs.length === 0) return null;
        
        return (
          <div key={categoryKey} className="mb-4">
            <h3 className="text-lg font-medium mb-2 capitalize">
              {categoryKey} Audio ({categorySongs.length})
            </h3>
            <div className="space-y-2">
              {categorySongs.map((song) => (
                <div
                  key={song.id}
                  className="flex justify-between items-center p-2 bg-white/10 hover:bg-white/20 rounded cursor-pointer"
                  onClick={() => onSongSelect && onSongSelect(song)}
                >
                  <span>{song.title}</span>
                  <span className="text-xs opacity-70">
                    {song.duration ? `${Math.floor(song.duration / 60)}:${String(song.duration % 60).padStart(2, '0')}` : '~3:00'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      
      {Object.values(groupedSongs).every(songs => songs.length === 0) && (
        <p className="text-gray-400 italic">No audio tracks available for this journey</p>
      )}
    </div>
  );
};

export default JourneyAudioMapper;
