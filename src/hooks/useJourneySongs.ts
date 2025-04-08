
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { JourneySong, JourneySongGroup } from '@/types/journeySongs';
import { SongMapping } from '@/types/music';

// Mock data for initial development
const mockSongs: Record<string, SongMapping[]> = {
  'chakra-harmony': [
    {
      id: 'song-1',
      title: 'Root Chakra Activation',
      artist: 'Sacred Soundscapes',
      frequency: 396,
      chakra: 'Root',
      functionality: 'chakra-healing',
      description: 'Grounding vibrations to activate the root chakra',
      duration: 360,
      audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8e7a2a85d.mp3'
    },
    {
      id: 'song-2',
      title: 'Heart Center Harmony',
      artist: 'Healing Vibrations',
      frequency: 639,
      chakra: 'Heart',
      functionality: 'chakra-healing',
      description: 'Opening the heart chakra with loving vibrations',
      duration: 420,
      audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3'
    }
  ],
  'deep-sleep': [
    {
      id: 'song-3',
      title: 'Delta Waves Dreamscape',
      artist: 'Sleep Soundscapes',
      frequency: 4,
      functionality: 'sleep',
      description: 'Deep delta wave patterns for restorative sleep',
      duration: 1800,
      audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3'
    }
  ],
  'silent-tune': [
    {
      id: 'song-4',
      title: 'Inner Silence',
      artist: 'Frequency Healers',
      frequency: 528,
      functionality: 'meditation',
      description: 'Tune into the silence within',
      duration: 600,
      audioUrl: 'https://cdn.pixabay.com/download/audio/2021/11/25/audio_cb7cc40662.mp3'
    }
  ]
};

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

// Helper function to convert SongMapping to JourneySong
const convertToJourneySong = (
  song: SongMapping, 
  journeyId: string,
  isPrimary: boolean = false
): JourneySong => {
  return {
    id: song.id,
    title: song.title,
    artist: song.artist || 'Unknown Artist',
    audioUrl: song.audioUrl || '',
    duration: song.duration || 180,
    journeyId: journeyId,
    isPrimary: isPrimary,
    chakra: song.chakra,
    frequency: song.frequency
  };
};
