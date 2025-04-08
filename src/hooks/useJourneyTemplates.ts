
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
        
        // Using the from() approach with the table name since rpc() has type issues
        const { data: templatesData, error: templatesError } = await supabase
          .from('journey_templates')
          .select(`
            id, 
            title, 
            subtitle, 
            description, 
            purpose, 
            chakras, 
            emoji, 
            name, 
            visual_theme, 
            session_type, 
            vibe, 
            color, 
            duration, 
            affirmation, 
            guided_prompt,
            vale_quote
          `);

        if (templatesError) {
          throw templatesError;
        }

        if (templatesData) {
          // We need to fetch related data for each template
          const templatesWithDetails = await Promise.all(
            templatesData.map(async (template) => {
              // Fetch frequencies for this template
              const { data: freqData } = await supabase
                .from('journey_template_frequencies')
                .select('name, value, description')
                .eq('journey_template_id', template.id);

              // Fetch features for this template
              const { data: featData } = await supabase
                .from('journey_template_features')
                .select('feature')
                .eq('journey_template_id', template.id);

              // Fetch sound sources for this template
              const { data: soundData } = await supabase
                .from('journey_template_sound_sources')
                .select('source')
                .eq('journey_template_id', template.id);

              // Construct the full template with related data
              return {
                ...template,
                frequencies: freqData || [],
                features: featData ? featData.map(f => f.feature) : [],
                soundSources: soundData ? soundData.map(s => s.source) : [],
                tags: [],
                // Convert vale_quote to valeQuote for proper property naming
                valeQuote: template.vale_quote
              } as JourneyTemplate;
            })
          );

          setTemplates(templatesWithDetails);
        }

        // Fetch audio mappings if requested
        if (includeAudioMappings) {
          const { data: mappingsData, error: mappingsError } = await supabase
            .from('journey_template_audio_mappings')
            .select('journey_template_id, audio_file_name, audio_url, is_primary');

          if (mappingsError) {
            console.error('Error fetching audio mappings:', mappingsError);
          } else if (mappingsData && Array.isArray(mappingsData)) {
            // Create a mapping from template ID to audio URL
            const mappings: Record<string, { audioUrl: string, audioFileName: string }> = {};
            
            mappingsData.forEach((mapping) => {
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
      // Insert directly to the table instead of using rpc
      const { data, error } = await supabase
        .from('journey_template_audio_mappings')
        .insert([{
          journey_template_id: journeyId,
          audio_file_name: audioFileName,
          audio_url: audioUrl,
          is_primary: isPrimary
        }]);

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
