
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import JourneyExperience from '@/components/journey/JourneyExperience';
import { useJourney } from '@/context/JourneyContext';
import LoadingScreen from '@/components/LoadingScreen';
import { toast } from 'sonner';
import { logTimelineEvent } from '@/services/timeline'; 
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

const JourneyExperiencePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Preparing Your Sacred Journey...");
  const [journeyData, setJourneyData] = useState<any>(null);
  const [transitionActive, setTransitionActive] = useState(true);
  const { startJourney } = useJourney();
  const [eventLogged, setEventLogged] = useState(false); // Track if event has been logged
  const [startTime, setStartTime] = useState<Date>(new Date()); // Track journey start time
  
  // Console log to help debug loading issues
  console.log("JourneyExperiencePage rendering with slug:", slug);
  
  useEffect(() => {
    const loadJourney = async () => {
      if (!slug) {
        toast.error("No journey specified");
        navigate('/journey-index');
        return;
      }
      
      try {
        setLoading(true);
        setLoadingMessage(`Loading journey experience for: ${slug}`);
        console.log(`Loading journey experience for: ${slug}`);
        
        // Use the journeyService to fetch the journey by slug
        const journey = await fetchJourneyBySlug(slug);
        
        if (!journey) {
          console.error("Journey not found:", slug);
          toast.error("Journey not found");
          navigate('/journey-index');
          return;
        }
        
        console.log("Journey data loaded:", journey.title);
        setJourneyData(journey);
        setStartTime(new Date()); // Record start time for journey completion tracking
        
        // Convert the journey ID to string to ensure consistency
        const journeyId = journey.id?.toString();
        
        // Only log the event once - prevents duplicates
        if (!eventLogged) {
          try {
            // Log the timeline event for journey start
            await logTimelineEvent('journey_start', {
              journeyId,
              title: journey.title,
              chakra: journey.chakra || journey.chakra_tag // Use chakra field
            });
            setEventLogged(true); // Mark event as logged
          } catch (timelineError) {
            console.warn('Failed to log journey start to timeline:', timelineError);
            // Continue with journey even if timeline logging fails
          }
          
          // Initialize journey context with properly normalized tags
          startJourney({
            id: journeyId,
            title: journey.title,
            description: journey.description || '',
            tags: normalizeStringArray(journey.tags),
            chakra: journey.chakra || journey.chakra_tag // Use chakra field consistently
          });
        }
        
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
  }, [slug, navigate, startJourney, eventLogged]);
  
  const handleJourneyComplete = (reflectionData: any) => {
    // Calculate duration in seconds
    const endTime = new Date();
    const durationSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    
    // Log journey completion with duration
    if (journeyData?.id) {
      logTimelineEvent('journey_complete', {
        journeyId: journeyData.id.toString(),
        title: journeyData.title,
        chakra: journeyData.chakra || journeyData.chakra_tag,
        durationSeconds,
        reflection: reflectionData?.reflection
      });
    }
  };
  
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
          id: journeyData.id?.toString(), // Ensure ID is a string
          title: journeyData.title,
          intent: journeyData.intent,
          script: journeyData.script,
          frequency: journeyData.sound_frequencies 
            ? parseFloat(journeyData.sound_frequencies) 
            : undefined,
          chakra: journeyData.chakra || journeyData.chakra_tag, // Use chakra field
          audioFile: journeyData.audio_filename
        }}
        onComplete={handleJourneyComplete}
      />
    </>
  );
};

export default JourneyExperiencePage;
