
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import JourneyExperience from '@/components/journey/JourneyExperience';
import { JourneyProvider, useJourney } from '@/context/JourneyContext';
import { supabase } from '@/integrations/supabase/client';
import LoadingScreen from '@/components/LoadingScreen';
import { toast } from 'sonner';

const JourneyExperienceContent: React.FC = () => {
  const { journeySlug } = useParams<{ journeySlug: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [journeyData, setJourneyData] = useState<any>(null);
  const { startJourney } = useJourney();
  
  useEffect(() => {
    const loadJourney = async () => {
      if (!journeySlug) {
        navigate('/journeys');
        return;
      }
      
      try {
        setLoading(true);
        console.log(`Loading journey experience for: ${journeySlug}`);
        
        // Fetch journey data from Supabase
        const { data: journeyData, error } = await supabase
          .from('journeys')
          .select('*')
          .eq('slug', journeySlug)
          .single();
          
        if (error) {
          console.error("Error loading journey:", error);
          toast.error("Could not load journey");
          navigate('/journey-index');
          return;
        }
        
        if (journeyData) {
          console.log("Journey data loaded:", journeyData.title);
          setJourneyData(journeyData);
          startJourney({
            id: journeyData.id.toString(),
            title: journeyData.title,
            description: journeyData.description || '',
            tags: Array.isArray(journeyData.tags) 
              ? journeyData.tags 
              : journeyData.tags?.split(',').map((t: string) => t.trim()) || [],
            chakra_tag: journeyData.chakra_tag
          });
        } else {
          console.error("Journey not found:", journeySlug);
          toast.error("Journey not found");
          navigate('/journey-index');
        }
      } catch (err) {
        console.error("Error in journey experience:", err);
        toast.error("Error loading journey");
      } finally {
        setLoading(false);
      }
    };
    
    loadJourney();
  }, [journeySlug, navigate, startJourney]);
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!journeyData) {
    return null;
  }
  
  return (
    <JourneyExperience 
      journeyData={{
        id: journeyData.id.toString(),
        title: journeyData.title,
        intent: journeyData.intent,
        script: journeyData.script,
        frequency: journeyData.sound_frequencies 
          ? parseFloat(journeyData.sound_frequencies) 
          : undefined,
        chakra: journeyData.chakra_tag,
        audioFile: journeyData.audio_filename
      }}
    />
  );
};

const JourneyExperiencePage: React.FC = () => {
  return (
    <JourneyProvider>
      <JourneyExperienceContent />
    </JourneyProvider>
  );
};

export default JourneyExperiencePage;
