
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { healingFrequencies } from '@/data/frequencies';
import { useAudioLibrary } from '@/hooks/useAudioLibrary';

export interface MeditationMusic {
  id: string;
  title: string;
  description: string | null;
  frequency_id: string;
  audio_url: string;
  created_at: string;
  updated_at: string;
  group_id?: string;
}

export const useMusicLibrary = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [meditationMusic, setMeditationMusic] = useState<MeditationMusic[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const { getAllTracks } = useAudioLibrary();

  useEffect(() => {
    fetchMeditationMusic();
  }, []);

  const fetchMeditationMusic = async () => {
    try {
      setIsLoading(true);
      
      // First try to get meditation music from the meditation_music table
      const { data: meditationData, error: meditationError } = await supabase
        .from('meditation_music')
        .select('*')
        .order('created_at', { ascending: false });

      if (meditationError) {
        throw meditationError;
      }
      
      // Now get frequency library tracks that are marked as meditation or focus
      const allTracks = await getAllTracks();
      const meditationTracks = allTracks.filter(track => 
        track.type === 'Meditation' || track.type === 'Focus'
      ).map(track => ({
        id: track.id,
        title: track.title,
        description: track.description || null,
        frequency_id: track.frequency ? track.frequency.toString() : '',
        audio_url: track.audioUrl,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        group_id: track.groupId
      }));
      
      // Combine both sources
      const combinedData = [
        ...(meditationData as MeditationMusic[] || []),
        ...meditationTracks
      ];
      
      // Remove duplicates based on title
      const uniqueTitles = new Set();
      const uniqueData = combinedData.filter(item => {
        if (uniqueTitles.has(item.title)) {
          return false;
        }
        uniqueTitles.add(item.title);
        return true;
      });
      
      setMeditationMusic(uniqueData);
    } catch (error) {
      console.error('Error fetching meditation music:', error);
      toast.error('Failed to load meditation music');
    } finally {
      setIsLoading(false);
    }
  };

  const uploadMusic = async (
    file: File,
    title: string,
    description: string,
    frequencyId: string
  ) => {
    if (!user) {
      toast.error('You must be logged in to upload music');
      return null;
    }

    try {
      setIsUploading(true);

      // Create a unique file path including the user ID
      const filePath = `${user.id}/${Date.now()}_${file.name}`;
      
      // Upload the file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('meditation_audio')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('meditation_audio')
        .getPublicUrl(filePath);

      // Add the record to the meditation_music table
      const { data: musicData, error: insertError } = await supabase
        .from('meditation_music')
        .insert([
          {
            title,
            description,
            frequency_id: frequencyId,
            audio_url: urlData.publicUrl
          }
        ])
        .select()
        .single();

      if (insertError) {
        // If there was an error inserting the record, delete the uploaded file
        await supabase.storage
          .from('meditation_audio')
          .remove([filePath]);
        throw insertError;
      }

      toast.success('Music uploaded successfully');
      fetchMeditationMusic();
      return musicData as MeditationMusic;
    } catch (error) {
      console.error('Error uploading music:', error);
      toast.error('Failed to upload music');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteMusic = async (id: string, audioUrl: string) => {
    if (!user) {
      toast.error('You must be logged in to delete music');
      return;
    }

    try {
      // Get the file path from the URL
      const urlObj = new URL(audioUrl);
      const pathArray = urlObj.pathname.split('/');
      const filePath = pathArray.slice(pathArray.indexOf('meditation_audio') + 1).join('/');

      // Delete the record from the meditation_music table
      const { error: deleteRecordError } = await supabase
        .from('meditation_music')
        .delete()
        .eq('id', id);

      if (deleteRecordError) {
        throw deleteRecordError;
      }

      // Delete the file from storage
      const { error: deleteFileError } = await supabase.storage
        .from('meditation_audio')
        .remove([filePath]);

      if (deleteFileError) {
        console.error('Warning: Could not delete file from storage:', deleteFileError);
      }

      toast.success('Music deleted successfully');
      fetchMeditationMusic();
    } catch (error) {
      console.error('Error deleting music:', error);
      toast.error('Failed to delete music');
    }
  };

  const getFrequencyName = (frequencyId: string) => {
    const frequency = healingFrequencies.find(f => f.id === frequencyId);
    return frequency ? frequency.name : 'Unknown Frequency';
  };

  return {
    isLoading,
    meditationMusic,
    isUploading,
    uploadMusic,
    deleteMusic,
    getFrequencyName
  };
};
