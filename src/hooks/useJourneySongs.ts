
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { JourneySong, JourneySongGroup, convertToJourneySong } from '@/types/journeySongs';
import { SongMapping } from '@/types/music';

// Map of journey IDs to their audio filenames
const journeySongsMap: Record<string, string[]> = {
  'silent-tune': [
    "Whispers on the Breeze.mp3",
    "Whispers on the Breeze (1).mp3"
  ],
  'chakra-harmony': [
    "Whispering Waters.mp3",
    "Whispering Waters (1).mp3",
    "Rise in Gold.mp3",
    "Rise in Gold (1).mp3"
  ],
  'deep-sleep': [
    "Celestial Calling.mp3",
    "Celestial Calling (1).mp3",
    "Through the Veil.mp3",
    "Through the Veil (1).mp3"
  ],
  'focus-flow': [
    "Ignite the Flame.mp3",
    "Ignite the Flame (1).mp3",
    "Calm Horizons.mp3",
    "Calm Horizons (1).mp3"
  ],
  'anxiety-release': [
    "Heart Strings.mp3",
    "Heart Strings (1).mp3",
    "Mending the Echoes.mp3",
    "Mending the Echoes (1).mp3"
  ],
  'creativity-boost': [
    "Inner Glow.mp3",
    "Inner Glow (1).mp3",
    "Echoes of Eternity.mp3",
    "Echoes of Eternity (1).mp3"
  ]
};

// Convert song filenames to mock SongMapping objects
const createMockSongMappings = (filenames: string[], journeyId: string): SongMapping[] => {
  return filenames.map((filename, index) => ({
    id: `song-${journeyId}-${index}`,
    title: filename.replace('.mp3', ''),
    artist: 'Sacred Soundscapes',
    functionality: 'journey',
    description: `Song for ${journeyId} journey`,
    duration: 240 + Math.floor(Math.random() * 240), // Random duration between 4-8 minutes
    audioUrl: `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/journey/${filename}`,
    frequency: index % 2 === 0 ? 432 : 528, // Alternate between common healing frequencies
    chakra: ['Root', 'Sacral', 'Solar Plexus', 'Heart', 'Throat', 'Third Eye', 'Crown'][index % 7]
  }));
};

// Convert the journeySongsMap to mockSongs format
const mockSongs: Record<string, SongMapping[]> = {};
Object.entries(journeySongsMap).forEach(([journeyId, filenames]) => {
  mockSongs[journeyId] = createMockSongMappings(filenames, journeyId);
});

export const useJourneySongs = (journeyId?: string) => {
  const [songs, setSongs] = useState<JourneySong[]>([]);
  const [songGroups, setSongGroups] = useState<JourneySongGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        // In a real implementation, we would fetch from Supabase
        // For now, use the mock data
        setTimeout(() => {
          if (journeyId) {
            // Fetch songs for a specific journey
            const journeySongs = mockSongs[journeyId] || [];
            setSongs(journeySongs.map(song => 
              convertToJourneySong(song, journeyId, false)
            ));
          } else {
            // Fetch all songs grouped by journey
            const groups: JourneySongGroup[] = Object.entries(mockSongs).map(([id, songs]) => ({
              journeyId: id,
              title: id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
              songs: songs.map(song => convertToJourneySong(song, id))
            }));
            setSongGroups(groups);
          }
          setLoading(false);
        }, 500); // Simulate network delay
      } catch (err: any) {
        console.error('Error fetching journey songs:', err);
        setError(err.message || 'Failed to load journey songs');
        toast.error('Failed to load journey songs');
        setLoading(false);
      }
    };

    fetchSongs();
  }, [journeyId]);

  // Add a song to a journey
  const addSongToJourney = async (song: Omit<SongMapping, 'id'>, journeyId: string): Promise<JourneySong | null> => {
    try {
      // In a real implementation, we would save to Supabase
      // For now, just add to the in-memory mock
      const newSong = {
        ...song,
        id: `song-${Date.now()}`
      } as SongMapping;
      
      // Add to mock data
      if (!mockSongs[journeyId]) {
        mockSongs[journeyId] = [];
      }
      mockSongs[journeyId].push(newSong);
      
      // Update state
      const journeySong = convertToJourneySong(newSong, journeyId);
      setSongs(prev => [...prev, journeySong]);
      
      toast.success(`Added "${song.title}" to journey`);
      return journeySong;
    } catch (err: any) {
      console.error('Error adding song to journey:', err);
      toast.error('Failed to add song to journey');
      return null;
    }
  };

  return {
    songs,
    songGroups,
    loading,
    error,
    addSongToJourney
  };
};
