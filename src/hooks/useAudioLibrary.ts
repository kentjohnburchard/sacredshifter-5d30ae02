
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AudioTrack {
  id: string;
  title: string;
  audioUrl: string;
  frequency: number;
  chakra?: string;
  description?: string;
  groupId?: string;
  feature?: string;
  type?: string;
}

export const useAudioLibrary = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Get a random audio track from a specific group
   */
  const getRandomFromGroup = useCallback(async (groupId: string): Promise<AudioTrack | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase.rpc('get_random_audio_from_group', {
        group_name: groupId
      });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        return {
          id: data[0].id,
          title: data[0].title,
          audioUrl: data[0].audio_url,
          frequency: data[0].frequency,
          chakra: data[0].chakra,
          description: data[0].description,
        };
      }
      
      return null;
    } catch (err) {
      console.error("Error fetching random audio from group:", err);
      setError("Failed to load audio track");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  /**
   * Get audio tracks by feature
   */
  const getByFeature = useCallback(async (featureName: string): Promise<AudioTrack[]> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase.rpc('get_audio_by_feature', {
        feature_name: featureName
      });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        return data.map(item => ({
          id: item.id,
          title: item.title,
          audioUrl: item.audio_url,
          frequency: item.frequency,
          chakra: item.chakra,
          description: item.description,
          groupId: item.group_id
        }));
      }
      
      return [];
    } catch (err) {
      console.error("Error fetching audio by feature:", err);
      setError("Failed to load audio tracks");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  /**
   * Get all available audio tracks
   */
  const getAllTracks = useCallback(async (): Promise<AudioTrack[]> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('frequency_library')
        .select('id, title, audio_url, frequency, chakra, description, group_id, feature, type')
        .order('title');
      
      if (error) throw error;
      
      if (data) {
        return data.map(item => ({
          id: item.id,
          title: item.title,
          audioUrl: item.audio_url,
          frequency: item.frequency,
          chakra: item.chakra,
          description: item.description,
          groupId: item.group_id,
          feature: item.feature,
          type: item.type
        }));
      }
      
      return [];
    } catch (err) {
      console.error("Error fetching all audio tracks:", err);
      setError("Failed to load audio library");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  /**
   * Get a track by frequency value (useful for specific frequency playback)
   */
  const getByFrequency = useCallback(async (frequency: number): Promise<AudioTrack | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('frequency_library')
        .select('id, title, audio_url, frequency, chakra, description')
        .eq('frequency', frequency)
        .limit(1)
        .single();
      
      if (error) {
        // If no track found, try getting the closest frequency
        if (error.code === 'PGRST116') {
          const { data: allFreqs, error: freqError } = await supabase
            .from('frequency_library')
            .select('frequency');
            
          if (freqError) throw freqError;
          
          if (allFreqs && allFreqs.length > 0) {
            // Find closest frequency
            const frequencies = allFreqs.map(f => f.frequency);
            const closest = frequencies.reduce((prev, curr) => {
              return (Math.abs(curr - frequency) < Math.abs(prev - frequency)) ? curr : prev;
            });
            
            // Get track with closest frequency
            const { data: closestTrack, error: closestError } = await supabase
              .from('frequency_library')
              .select('id, title, audio_url, frequency, chakra, description')
              .eq('frequency', closest)
              .order('created_at', { ascending: false })
              .limit(1)
              .single();
              
            if (closestError) throw closestError;
            
            if (closestTrack) {
              toast.info(`Using ${closest}Hz as the closest available frequency to ${frequency}Hz`);
              return {
                id: closestTrack.id,
                title: closestTrack.title,
                audioUrl: closestTrack.audio_url,
                frequency: closestTrack.frequency,
                chakra: closestTrack.chakra,
                description: closestTrack.description
              };
            }
          }
        }
        throw error;
      }
      
      if (data) {
        return {
          id: data.id,
          title: data.title,
          audioUrl: data.audio_url,
          frequency: data.frequency,
          chakra: data.chakra,
          description: data.description
        };
      }
      
      return null;
    } catch (err) {
      console.error("Error fetching track by frequency:", err);
      setError(`Failed to load ${frequency}Hz track`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    getRandomFromGroup,
    getByFeature,
    getAllTracks,
    getByFrequency
  };
};
