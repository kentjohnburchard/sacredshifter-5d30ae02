
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import JourneyExperience from '@/components/journey/JourneyExperience';
import { JourneyProvider, useJourney } from '@/context/JourneyContext';
import { supabase } from '@/integrations/supabase/client';
import LoadingScreen from '@/components/LoadingScreen';
import { toast } from 'sonner';
import { logTimelineEvent } from '@/services/timelineService';
import { motion, AnimatePresence } from 'framer-motion';

const JourneyExperienceContent: React.FC = () => {
  const { journeySlug } = useParams<{ journeySlug: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [journeyData, setJourneyData] = useState<any>(null);
  const [transitionActive, setTransitionActive] = useState(true);
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
          
          // Record journey start to timeline
          logTimelineEvent('journey_start', {
            journeyId: journeyData.id,
            title: journeyData.title,
            chakra: journeyData.chakra_tag
          });
          
          // Initialize journey context
          startJourney({
            id: journeyData.id.toString(),
            title: journeyData.title,
            description: journeyData.description || '',
            tags: Array.isArray(journeyData.tags) 
              ? journeyData.tags 
              : journeyData.tags?.split(',').map((t: string) => t.trim()) || [],
            chakra_tag: journeyData.chakra_tag
          });
          
          // Begin entrance transition
          setTimeout(() => {
            setTransitionActive(false);
          }, 1500);
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
    return <LoadingScreen message="Preparing Your Sacred Journey..." />;
  }
  
  if (!journeyData) {
    return null;
  }
  
  return (
    <>
      <AnimatePresence>
        {transitionActive && (
          <motion.div
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            <motion.div 
              className="text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              <h2 className="text-3xl font-semibold mb-3 text-white">{journeyData.title}</h2>
              <p className="text-purple-300 italic">
                {journeyData.intent || "Begin your sacred journey..."}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
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
    </>
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
