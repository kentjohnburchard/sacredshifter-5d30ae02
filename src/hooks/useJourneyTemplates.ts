import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { JourneyTemplate } from '@/data/journeyTemplates';
import { toast } from 'sonner';
import { JourneyAudioMapping } from '@/types/music';

interface UseJourneyTemplatesProps {
  includeAudioMappings?: boolean;
  includeVisualMappings?: boolean;
}

interface VisualMapping {
  journey_template_id: string;
  visual_file_name: string;
  visual_url: string | null;
  id: string;
  created_at: string;
}

export const useJourneyTemplates = ({ 
  includeAudioMappings = true, 
  includeVisualMappings = true 
}: UseJourneyTemplatesProps = {}) => {
  const [templates, setTemplates] = useState<JourneyTemplate[]>([]);
  const [audioMappings, setAudioMappings] = useState<Record<string, { audioUrl: string, audioFileName: string }>>({});
  const [visualMappings, setVisualMappings] = useState<Record<string, { visualUrl: string, visualFileName: string }>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJourneyTemplates = async () => {
      try {
        setLoading(true);
        
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
          const templatesWithDetails = await Promise.all(
            templatesData.map(async (template) => {
              const { data: freqData } = await supabase
                .from('journey_template_frequencies')
                .select('name, value, description')
                .eq('journey_template_id', template.id);

              const { data: featData } = await supabase
                .from('journey_template_features')
                .select('feature')
                .eq('journey_template_id', template.id);

              const { data: soundData } = await supabase
                .from('journey_template_sound_sources')
                .select('source')
                .eq('journey_template_id', template.id);

              return {
                ...template,
                frequencies: freqData || [],
                features: featData ? featData.map(f => f.feature) : [],
                soundSources: soundData ? soundData.map(s => s.source) : [],
                tags: [],
                valeQuote: template.vale_quote,
                guidedPrompt: template.guided_prompt,
                visualTheme: template.visual_theme,
                sessionType: template.session_type
              } as JourneyTemplate;
            })
          );

          setTemplates(templatesWithDetails);
        }

        if (includeAudioMappings) {
          const { data: mappingsData, error: mappingsError } = await supabase
            .from('journey_template_audio_mappings')
            .select('journey_template_id, audio_file_name, audio_url, is_primary');

          if (mappingsError) {
            console.error('Error fetching audio mappings:', mappingsError);
          } else if (mappingsData && Array.isArray(mappingsData)) {
            const mappings: Record<string, { audioUrl: string, audioFileName: string }> = {};
            
            const groupedMappings: Record<string, any[]> = {};
            mappingsData.forEach(mapping => {
              if (!groupedMappings[mapping.journey_template_id]) {
                groupedMappings[mapping.journey_template_id] = [];
              }
              groupedMappings[mapping.journey_template_id].push(mapping);
            });
            
            Object.entries(groupedMappings).forEach(([journeyId, journeyMappings]) => {
              const sortedMappings = journeyMappings.sort((a, b) => 
                a.is_primary === b.is_primary ? 0 : a.is_primary ? -1 : 1
              );
              
              const primaryMapping = sortedMappings[0];
              
              const audioUrl = primaryMapping.audio_url || 
                `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${primaryMapping.audio_file_name}`;
              
              mappings[journeyId] = {
                audioUrl,
                audioFileName: primaryMapping.audio_file_name
              };
            });
            
            setAudioMappings(mappings);
          }
        }

        if (includeVisualMappings) {
          const { data: visualData, error: visualError } = await supabase
            .from('journey_template_visual_mappings')
            .select('*') as { data: VisualMapping[] | null, error: any };

          if (visualError) {
            console.error('Error fetching visual mappings:', visualError);
          } else if (visualData && Array.isArray(visualData)) {
            const mappings: Record<string, { visualUrl: string, visualFileName: string }> = {};
            
            visualData.forEach(mapping => {
              const visualUrl = mapping.visual_url || 
                `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${mapping.visual_file_name}`;
              
              mappings[mapping.journey_template_id] = {
                visualUrl,
                visualFileName: mapping.visual_file_name
              };
            });
            
            setVisualMappings(mappings);
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
  }, [includeAudioMappings, includeVisualMappings]);

  const addAudioMapping = async (journeyId: string, audioFileName: string, audioUrl?: string, isPrimary: boolean = true) => {
    try {
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

  const addVisualMapping = async (journeyId: string, visualFileName: string, visualUrl?: string) => {
    try {
      const { data, error } = await supabase
        .from('journey_template_visual_mappings')
        .insert([{
          journey_template_id: journeyId,
          visual_file_name: visualFileName,
          visual_url: visualUrl
        }]) as { data: VisualMapping[] | null, error: any };

      if (error) {
        throw error;
      }

      setVisualMappings(prev => ({
        ...prev,
        [journeyId]: {
          visualUrl: visualUrl || `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${visualFileName}`,
          visualFileName
        }
      }));

      toast.success('Visual mapping added successfully');
      return data;
    } catch (err: any) {
      console.error('Error adding visual mapping:', err);
      toast.error('Failed to add visual mapping');
      throw err;
    }
  };

  const getJourneyAudio = (journeyId: string): string | null => {
    if (audioMappings[journeyId]) {
      return audioMappings[journeyId].audioUrl;
    }
    return null;
  };

  const getJourneyVisual = (journeyId: string): string | null => {
    if (visualMappings[journeyId]) {
      return visualMappings[journeyId].visualUrl;
    }
    return null;
  };

  return {
    templates,
    loading,
    error,
    audioMappings,
    visualMappings,
    addAudioMapping,
    addVisualMapping,
    getJourneyAudio,
    getJourneyVisual
  };
};
