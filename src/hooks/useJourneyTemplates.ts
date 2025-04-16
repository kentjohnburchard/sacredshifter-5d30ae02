
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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [audioMappings, setAudioMappings] = useState<Record<string, JourneyAudioMapping[]>>({});

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
                // Convert snake_case to camelCase for property naming consistency
                valeQuote: template.vale_quote,
                guidedPrompt: template.guided_prompt,
                visualTheme: template.visual_theme,
                sessionType: template.session_type
              } as JourneyTemplate;
            })
          );

          setTemplates(templatesWithDetails);
        }

        // Fetch audio mappings if requested
        if (includeAudioMappings) {
          const { data: mappingsData, error: mappingsError } = await supabase
            .from('journey_template_audio_mappings')
            .select('journey_template_id, audio_file_name, audio_url, is_primary, display_order, display_title');

          if (mappingsError) {
            console.error('Error fetching audio mappings:', mappingsError);
          } else if (mappingsData && Array.isArray(mappingsData)) {
            // Group mappings by journey template ID
            const mappings: Record<string, JourneyAudioMapping[]> = {};
            
            mappingsData.forEach(mapping => {
              if (!mappings[mapping.journey_template_id]) {
                mappings[mapping.journey_template_id] = [];
              }
              
              mappings[mapping.journey_template_id].push({
                audioFileName: mapping.audio_file_name,
                audioUrl: mapping.audio_url || 
                  `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${mapping.audio_file_name}`,
                isPrimary: mapping.is_primary,
                displayOrder: mapping.display_order || 0,
                displayTitle: mapping.display_title
              });
            });
            
            // Sort mappings for each journey by display order
            Object.keys(mappings).forEach(journeyId => {
              mappings[journeyId].sort((a, b) => 
                (a.displayOrder || 0) - (b.displayOrder || 0)
              );
            });
            
            setAudioMappings(mappings);
          }
        }
      } catch (err: any) {
        console.error('Error fetching journey templates:', err);
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

  // Add audio mapping
  const addAudioMapping = async (
    journeyId: string, 
    audioFileName: string, 
    audioUrl?: string, 
    isPrimary: boolean = true,
    displayOrder: number = 0,
    displayTitle?: string
  ) => {
    try {
      const { data, error } = await supabase
        .from('journey_template_audio_mappings')
        .insert([{
          journey_template_id: journeyId,
          audio_file_name: audioFileName,
          audio_url: audioUrl,
          is_primary: isPrimary,
          display_order: displayOrder,
          display_title: displayTitle
        }]);

      if (error) {
        throw error;
      }

      // Update local state
      setAudioMappings(prev => {
        const updatedMappings = {...prev};
        const newMapping = {
          audioFileName,
          audioUrl: audioUrl || 
            `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${audioFileName}`,
          isPrimary,
          displayOrder,
          displayTitle
        };

        if (!updatedMappings[journeyId]) {
          updatedMappings[journeyId] = [];
        }

        // Add new mapping and sort
        updatedMappings[journeyId].push(newMapping);
        updatedMappings[journeyId].sort((a, b) => 
          (a.displayOrder || 0) - (b.displayOrder || 0)
        );

        return updatedMappings;
      });

      toast.success('Audio mapping added successfully');
      return data;
    } catch (err: any) {
      console.error('Error adding audio mapping:', err);
      toast.error('Failed to add audio mapping');
      throw err;
    }
  };

  // Get journey audio (returns array of audio files)
  const getJourneyAudio = (journeyId: string): JourneyAudioMapping[] => {
    return audioMappings[journeyId] || [];
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
