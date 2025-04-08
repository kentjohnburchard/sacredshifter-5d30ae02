
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { JourneyTemplate } from '@/data/journeyTemplates';
import { toast } from 'sonner';
import { JourneyAudioMapping } from '@/types/music';

interface UseJourneyTemplatesProps {
  includeAudioMappings?: boolean;
}

export const useJourneyTemplates = ({ includeAudioMappings = true }: UseJourneyTemplatesProps = {}) => {
  const [templates, setTemplates] = useState<JourneyTemplate[]>([]);
  const [audioMappings, setAudioMappings] = useState<Record<string, { audioUrl: string, audioFileName: string }>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJourneyTemplates = async () => {
      try {
        setLoading(true);
        
        // Use the rpc function to get templates with all their related data
        // This avoids type issues with accessing tables directly
        const { data: templates, error: templatesError } = await supabase
          .rpc('get_journey_templates_with_details');

        if (templatesError) {
          throw templatesError;
        }

        if (templates) {
          setTemplates(templates);
        }

        // Fetch audio mappings if requested
        if (includeAudioMappings) {
          const { data: mappingsData, error: mappingsError } = await supabase
            .rpc('get_journey_audio_mappings');

          if (mappingsError) {
            console.error('Error fetching audio mappings:', mappingsError);
          } else if (mappingsData) {
            // Create a mapping from template ID to audio URL
            const mappings: Record<string, { audioUrl: string, audioFileName: string }> = {};
            
            mappingsData.forEach((mapping: any) => {
              const audioUrl = mapping.audio_url || 
                `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${mapping.audio_file_name}`;
              
              mappings[mapping.journey_template_id] = {
                audioUrl,
                audioFileName: mapping.audio_file_name
              };
            });
            
            setAudioMappings(mappings);
          }
        }
      } catch (err: any) {
        console.error('Error fetching journey templates:', err);
        setError(err.message || 'Failed to load journey templates');
        toast.error('Failed to load journey templates');
        
        // Fallback to local data
        const { default: localTemplates } = await import('@/data/journeyTemplates');
        setTemplates(localTemplates);
      } finally {
        setLoading(false);
      }
    };

    fetchJourneyTemplates();
  }, [includeAudioMappings]);

  // Function to add an audio mapping to a journey template
  const addAudioMapping = async (journeyId: string, audioFileName: string, audioUrl?: string, isPrimary: boolean = true) => {
    try {
      // Use stored procedure to insert audio mapping
      const { data, error } = await supabase
        .rpc('insert_journey_audio_mapping', {
          template_id: journeyId,
          file_name: audioFileName,
          url: audioUrl,
          is_primary: isPrimary
        });

      if (error) {
        throw error;
      }

      if (isPrimary) {
        // Update local state for primary mappings
        setAudioMappings(prev => ({
          ...prev,
          [journeyId]: {
            audioUrl: audioUrl || `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${audioFileName}`,
            audioFileName
          }
        }));
      }

      toast.success('Audio mapping added successfully');
      return data;
    } catch (err: any) {
      console.error('Error adding audio mapping:', err);
      toast.error('Failed to add audio mapping');
      throw err;
    }
  };

  // Function to get audio for a specific journey template
  const getJourneyAudio = (journeyId: string): string | null => {
    if (audioMappings[journeyId]) {
      return audioMappings[journeyId].audioUrl;
    }
    return null;
  };

  return {
    templates,
    loading,
    error,
    audioMappings,
    addAudioMapping,
    getJourneyAudio
  };
};
