import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { JourneySong, JourneySongGroup, convertToJourneySong } from '@/types/journeySongs';
import { SongMapping } from '@/types/music';

// Map of journey IDs to their audio filenames - Fixed mapping based on the correct journey templates
const journeySongsMap: Record<string, string[]> = {
  'silent-tune': [
    "Silent Tune - Realigning Inner Ear.mp3",
    "Gentle Waves for Tinnitus Relief.mp3",
    "Delta Waves Healing Tone.mp3"
  ],
  'chakra-harmony': [
    "Chakra Harmony - Root to Crown.mp3",
    "Seven Centers Alignment.mp3",
    "Complete Energy System Balance.mp3"
  ],
  'deep-sleep': [
    "Theta Wave Immersion.mp3",
    "Deep Sleep Journey.mp3",
    "Delta Dreamtime.mp3",
    "Restorative Night Sounds.mp3"
  ],
  'focus-flow': [
    "Alpha Wave Activation.mp3",
    "Focus Flow Enhancer.mp3",
    "Mental Clarity Session.mp3"
  ],
  'anxiety-release': [
    "Anxiety Release - Theta-Alpha Blend.mp3",
    "Calm Waters Meditation.mp3",
    "Heart Center Healing.mp3"
  ],
  'creativity-boost': [
    "Creativity Boost - Gamma Theta Combination.mp3",
    "Artistic Flow Enhancer.mp3",
    "Inspiration Frequency.mp3"
  ]
};

// Get direct Supabase audio URL for a filename
const getDirectAudioUrl = (filename: string): string => {
  // Return the Supabase URL directly without encoding
  // FrequencyPlayer will handle the encoding
  return `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${filename}`;
};

// Clean text by removing \n characters
const cleanText = (text: string): string => {
  return text.replace(/\\n/g, ' ');
};

// Convert song filenames to mock SongMapping objects
const createMockSongMappings = (filenames: string[], journeyId: string): SongMapping[] => {
  return filenames.map((filename, index) => ({
    id: `song-${journeyId}-${index}`,
    title: cleanText(filename.replace('.mp3', '')),
    artist: 'Sacred Soundscapes',
    functionality: 'journey',
    description: cleanText(`Frequency healing for ${journeyId.replace('-', ' ')} journey`),
    duration: 240 + Math.floor(Math.random() * 240), // Random duration between 4-8 minutes
    audioUrl: getDirectAudioUrl(filename),
    frequency: getFrequencyForJourney(journeyId, index),
    chakra: getChakraForJourney(journeyId, index)
  }));
};

// Helper function to assign appropriate frequencies to each journey type
const getFrequencyForJourney = (journeyId: string, index: number): number => {
  switch (journeyId) {
    case 'silent-tune':
      return [528, 741, 963][index % 3]; // Frequencies mentioned in the journey template
    case 'chakra-harmony':
      return [396, 417, 528, 639, 741, 852, 963][index % 7]; // All chakra frequencies
    case 'deep-sleep':
      return [396, 528][index % 2]; // Sleep frequencies
    case 'focus-flow':
      return [417][index % 1]; // Focus frequency
    case 'anxiety-release':
      return [396, 639][index % 2]; // Anxiety release frequencies
    case 'creativity-boost':
      return [417, 528][index % 2]; // Creativity frequencies
    default:
      return 432; // Default healing frequency
  }
};

// Helper function to assign appropriate chakras to each journey type
const getChakraForJourney = (journeyId: string, index: number): string => {
  switch (journeyId) {
    case 'silent-tune':
      return ['Crown', 'Third Eye', 'Throat'][index % 3]; // From journey template
    case 'chakra-harmony':
      return ['Root', 'Sacral', 'Solar Plexus', 'Heart', 'Throat', 'Third Eye', 'Crown'][index % 7];
    case 'deep-sleep':
      return ['Root', 'Third Eye'][index % 2]; // From journey template
    case 'focus-flow':
      return ['Solar Plexus', 'Third Eye'][index % 2]; // From journey template
    case 'anxiety-release':
      return ['Heart', 'Solar Plexus', 'Root'][index % 3]; // From journey template
    case 'creativity-boost':
      return ['Sacral', 'Third Eye', 'Crown'][index % 3]; // From journey template
    default:
      return 'Heart'; // Default chakra
  }
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
            console.log(`Fetching songs for journey: ${journeyId}, found ${journeySongs.length} songs`);
            
            const convertedSongs = journeySongs.map(song => {
              const convertedSong = convertToJourneySong(song, journeyId, false);
              console.log(`Converted song: ${convertedSong.title}, URL: ${convertedSong.audioUrl}`);
              return convertedSong;
            });
            
            setSongs(convertedSongs);
          } else {
            // Fetch all songs grouped by journey
            const groups: JourneySongGroup[] = Object.entries(mockSongs).map(([id, songs]) => ({
              journeyId: id,
              title: cleanText(id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')),
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
