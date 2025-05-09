
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import JourneyExperience from '@/components/journey/JourneyExperience';
import { JourneyProvider, useJourney } from '@/context/JourneyContext';
import { supabase } from '@/integrations/supabase/client';
import LoadingScreen from '@/components/LoadingScreen';
import { toast } from 'sonner';
import { logTimelineEvent } from '@/services/timelineService';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { fetchJourneyBySlug } from '@/services/journeyService';
import { normalizeStringArray } from '@/utils/parsers';

const BackButton = () => {
  const navigate = useNavigate();
  
  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed top-6 left-6 z-50 p-3 rounded-full bg-black/40 backdrop-blur-lg 
                text-white hover:bg-purple-900/40 transition-colors"
      onClick={() => navigate('/journey-index')}
      title="Back to Journeys"
    >
      <ArrowLeft size={20} />
    </motion.button>
  );
};

const JourneyExperienceContent: React.FC = () => {
  const { journeySlug } = useParams<{ journeySlug: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Preparing Your Sacred Journey...");
  const [journeyData, setJourneyData] = useState<any>(null);
  const [transitionActive, setTransitionActive] = useState(true);
  const { startJourney } = useJourney();
  
  useEffect(() => {
    const loadJourney = async () => {
      if (!journeySlug) {
        toast.error("No journey specified");
        navigate('/journey-index');
        return;
      }
      
      try {
        setLoading(true);
        setLoadingMessage(`Loading journey experience for: ${journeySlug}`);
        console.log(`Loading journey experience for: ${journeySlug}`);
        
        // Use the journeyService to fetch the journey by slug
        const journey = await fetchJourneyBySlug(journeySlug);
        
        if (!journey) {
          console.error("Journey not found:", journeySlug);
          toast.error("Journey not found");
          navigate('/journey-index');
          return;
        }
        
        console.log("Journey data loaded:", journey.title);
        setJourneyData(journey);
        
        // Record journey start to timeline
        logTimelineEvent('journey_start', {
          journeyId: journey.id,
          title: journey.title,
          chakra: journey.chakra_tag
        });
        
        // Initialize journey context with properly normalized tags
        startJourney({
          id: journey.id?.toString(),
          title: journey.title,
          description: journey.description || '',
          tags: normalizeStringArray(journey.tags),
          chakra_tag: journey.chakra_tag
        });
        
        // Begin entrance transition
        setTimeout(() => {
          setTransitionActive(false);
        }, 1500);
      } catch (err) {
        console.error("Error in journey experience:", err);
        toast.error("Error loading journey");
        navigate('/journey-index');
      } finally {
        setLoading(false);
      }
    };
    
    loadJourney();
  }, [journeySlug, navigate, startJourney]);
  
  if (loading) {
    return <LoadingScreen message={loadingMessage} />;
  }
  
  if (!journeyData) {
    return null;
  }
  
  return (
    <>
      <BackButton />
      
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
          id: journeyData.id?.toString(),
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
