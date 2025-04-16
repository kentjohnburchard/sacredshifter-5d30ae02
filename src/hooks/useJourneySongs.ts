
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { JourneySong, JourneySongGroup, convertToJourneySong } from '@/types/journeySongs';
import { SongMapping } from '@/types/music';

export const useJourneySongs = (journeyId?: string) => {
  const [songs, setSongs] = useState<JourneySong[]>([]);
  const [songGroups, setSongGroups] = useState<JourneySongGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        
        // Fetch songs from Supabase
        if (journeyId) {
          // Fetch songs for a specific journey
          const { data: mappingsData, error: mappingsError } = await supabase
            .from('journey_template_audio_mappings')
            .select('*')
            .eq('journey_template_id', journeyId);
            
          if (mappingsError) throw mappingsError;
          
          if (mappingsData && mappingsData.length > 0) {
            // Convert mapping data to JourneySongs
            const journeySongs = mappingsData.map(mapping => {
              // Create audioUrl from file_name if not present
              const audioUrl = mapping.audio_url || 
                `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${mapping.audio_file_name}`;
                
              // Mock artist and duration for now, as they're not in the database
              const song: SongMapping = {
                id: mapping.id,
                title: mapping.audio_file_name.replace('.mp3', '').split('/').pop() || 'Unnamed Song',
                artist: 'Sacred Soundscapes',
                functionality: 'journey',
                description: mapping.description || `Journey audio for ${journeyId}`,
                duration: 300, // Default 5 minutes
                audioUrl: audioUrl,
                // Optional fields
                frequency: undefined,
                chakra: undefined
              };
              
              return convertToJourneySong(song, journeyId, mapping.is_primary || false);
            });
            
            setSongs(journeySongs);
          } else {
            // No mappings found
            setSongs([]);
          }
        } else {
          // Fetch all journey templates to group songs
          const { data: templatesData, error: templatesError } = await supabase
            .from('journey_templates')
            .select('id, title');
          
          if (templatesError) throw templatesError;
          
          if (templatesData) {
            // For each template, fetch its audio mappings
            const groups: JourneySongGroup[] = [];
            
            for (const template of templatesData) {
              const { data: mappingsData } = await supabase
                .from('journey_template_audio_mappings')
                .select('*')
                .eq('journey_template_id', template.id);
              
              if (mappingsData && mappingsData.length > 0) {
                // Convert mappings to songs
                const templateSongs = mappingsData.map(mapping => {
                  const audioUrl = mapping.audio_url || 
                    `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${mapping.audio_file_name}`;
                    
                  const song: SongMapping = {
                    id: mapping.id,
                    title: mapping.audio_file_name.replace('.mp3', '').split('/').pop() || 'Unnamed Song',
                    artist: 'Sacred Soundscapes',
                    functionality: 'journey',
                    description: mapping.description || `Journey audio for ${template.id}`,
                    duration: 300,
                    audioUrl: audioUrl
                  };
                  
                  return convertToJourneySong(song, template.id, mapping.is_primary || false);
                });
                
                groups.push({
                  journeyId: template.id,
                  title: template.title,
                  songs: templateSongs
                });
              }
            }
            
            setSongGroups(groups);
          }
        }
        
        setLoading(false);
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
      // Extract filename from audioUrl or use a default
      const filename = song.audioUrl?.split('/').pop() || `song-${Date.now()}.mp3`;
      
      // Add mapping to Supabase
      const { data, error } = await supabase
        .from('journey_template_audio_mappings')
        .insert({
          journey_template_id: journeyId,
          audio_file_name: filename,
          audio_url: song.audioUrl,
          is_primary: false,
          description: song.description
        })
        .select('*')
        .single();
      
      if (error) throw error;
      
      if (data) {
        // Create JourneySong from the new mapping
        const newSong = {
          id: data.id,
          title: song.title,
          artist: song.artist || 'Unknown Artist',
          audioUrl: song.audioUrl || '',
          duration: song.duration || 180,
          journeyId: journeyId,
          isPrimary: false,
          chakra: song.chakra,
          frequency: song.frequency
        };
        
        // Update state
        setSongs(prev => [...prev, newSong]);
        
        toast.success(`Added "${song.title}" to journey`);
        return newSong;
      }
      
      return null;
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
