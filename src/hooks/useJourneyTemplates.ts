
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { JourneyTemplate } from '@/data/journeyTemplates';
import { toast } from 'sonner';

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
        
        // Fetch templates from database
        const { data: templatesData, error: templatesError } = await supabase
          .from('journey_templates')
          .select('*');

        if (templatesError) {
          throw templatesError;
        }

        // For each template, fetch its frequencies, features, and sound sources
        const templatesWithDetails = await Promise.all(
          templatesData.map(async (template) => {
            // Fetch frequencies
            const { data: frequenciesData } = await supabase
              .from('journey_template_frequencies')
              .select('name, value, description')
              .eq('journey_template_id', template.id);

            // Fetch features
            const { data: featuresData } = await supabase
              .from('journey_template_features')
              .select('feature')
              .eq('journey_template_id', template.id);

            // Fetch sound sources
            const { data: soundSourcesData } = await supabase
              .from('journey_template_sound_sources')
              .select('source')
              .eq('journey_template_id', template.id);

            // Convert to expected format
            return {
              ...template,
              frequencies: frequenciesData || [],
              features: featuresData?.map(item => item.feature) || [],
              soundSources: soundSourcesData?.map(item => item.source) || [],
              tags: [], // Default empty tags
            } as JourneyTemplate;
          })
        );

        setTemplates(templatesWithDetails);

        // Fetch audio mappings if requested
        if (includeAudioMappings) {
          const { data: mappingsData, error: mappingsError } = await supabase
            .from('journey_template_audio_mappings')
            .select('*')
            .eq('is_primary', true);

          if (mappingsError) {
            console.error('Error fetching audio mappings:', mappingsError);
          } else if (mappingsData) {
            // Create a mapping from template ID to audio URL
            const mappings: Record<string, { audioUrl: string, audioFileName: string }> = {};
            
            mappingsData.forEach(mapping => {
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
      } finally {
        setLoading(false);
      }
    };

    fetchJourneyTemplates();
  }, [includeAudioMappings]);

  // Function to add an audio mapping to a journey template
  const addAudioMapping = async (journeyId: string, audioFileName: string, audioUrl?: string, isPrimary: boolean = true) => {
    try {
      const mappingData = {
        journey_template_id: journeyId,
        audio_file_name: audioFileName,
        audio_url: audioUrl,
        is_primary: isPrimary
      };

      const { data, error } = await supabase
        .from('journey_template_audio_mappings')
        .insert([mappingData])
        .select('*')
        .single();

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
