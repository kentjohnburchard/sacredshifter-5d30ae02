
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { fetchJourneyBySlug } from '@/services/journeyService';
import { Journey } from '@/types/journey';
import { parseJourneyContent } from '@/utils/journeyLoader';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useJourney } from '@/context/JourneyContext';
import { toast } from 'sonner';
import JourneyContent from '@/components/journey/JourneyContent';
import JourneySidebar from '@/components/journey/JourneySidebar';
import JourneyAwareSpiralVisualizer from '@/components/visualizer/JourneyAwareSpiralVisualizer';

interface CoreJourneyLoaderResult {
  content: string;
  journey: Journey | null;
}

// Function to load a journey from core_content folder
const loadCoreJourneyContent = async (slug: string): Promise<CoreJourneyLoaderResult> => {
  try {
    // Try to find the journey file in core_content
    const journeyFiles = import.meta.glob('/src/core_content/journeys/*.md', { query: '?raw', import: 'default' });
    
    // Check for an exact match with the slug
    const matchingFile = Object.keys(journeyFiles).find(path => {
      const filename = path.split('/').pop()?.replace('.md', '');
      return filename === slug;
    });
    
    if (matchingFile) {
      // Load the file content as raw text
      const contentLoader = journeyFiles[matchingFile];
      const content = await contentLoader() as string;
      
      // Extract the filename from the path
      const filename = matchingFile.split('/').pop()?.replace('.md', '') || '';
      
      // Parse frontmatter to get journey metadata
      const parsedContent = parseJourneyContent(content);
      
      const journey: Journey = {
        id: filename, 
        filename,
        title: parsedContent.title || filename.replace(/_/g, ' '),
        description: parsedContent.intent || '',
        veil_locked: parsedContent.veil || false,
        sound_frequencies: parsedContent.frequency?.toString() || parsedContent.frequencies || '',
        tags: parsedContent.tags || [],
        content: content
      };
      
      return { content, journey };
    }
    
    return { content: '', journey: null };
  } catch (error) {
    console.error('Error loading core journey content:', error);
    return { content: '', journey: null };
  }
};

const JourneyPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [journey, setJourney] = useState<Journey | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasAudioContent, setHasAudioContent] = useState(false);
  const [showTimeline, setShowTimeline] = useState(true);
  const [transitionActive, setTransitionActive] = useState(true);
  
  const { 
    activeJourney, 
    isJourneyActive, 
    startJourney, 
    completeJourney, 
    recordActivity
  } = useJourney();
  
  // Load journey data on component mount
  useEffect(() => {
    const loadJourney = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }
      
      console.log(`Loading journey: ${slug}`);
      setLoading(true);
      try {
        // First try to get the journey from the database
        let journeyData = await fetchJourneyBySlug(slug);
        
        // If not found in DB, try to load from core_content
        if (!journeyData) {
          console.log(`Journey ${slug} not found in database, checking core_content...`);
          const coreJourneyResult = await loadCoreJourneyContent(slug);
          
          if (coreJourneyResult.journey) {
            journeyData = coreJourneyResult.journey;
            setContent(coreJourneyResult.content);
            console.log("Loaded journey from core_content:", journeyData.title);
          } else {
            console.error(`Journey ${slug} not found in database or core_content`);
            toast.error("Journey not found");
            return;
          }
        } else {
          console.log("Loaded journey from database:", journeyData.title);
          
          // Journey found in DB, try to load its markdown content from core_content folder
          const coreJourneyResult = await loadCoreJourneyContent(slug);
          if (coreJourneyResult.content) {
            setContent(coreJourneyResult.content);
            console.log("Additional content loaded from core_content");
          }
        }
        
        // Determine if there's audio content based on metadata
        setHasAudioContent(!!journeyData.sound_frequencies || !!journeyData.audio_filename);
        setJourney(journeyData);
        
        // Begin entrance transition
        setTimeout(() => {
          setTransitionActive(false);
        }, 1500);
      } catch (error) {
        console.error('Error loading journey:', error);
        toast.error("Error loading journey");
      } finally {
        setLoading(false);
      }
    };

    loadJourney();
  }, [slug]);

  // Start journey function - creates timeline event and activates journey context
  const handleStartJourney = () => {
    if (journey) {
      console.log("Starting journey:", journey.title);
      
      // Record the start of the journey in the timeline
      try {
        recordActivity('journey_start', { 
          journeyId: journey.id,
          title: journey.title
        });
      } catch (timelineError) {
        console.warn('Failed to log journey start to timeline:', timelineError);
        // Continue with the journey even if timeline logging fails
      }
      
      // Start the journey in the context
      startJourney(journey);
      toast.success("Sacred journey initiated");
    }
  };
  
  // Complete journey function - finishes the journey and logs it
  const handleCompleteJourney = () => {
    console.log("Completing journey:", journey?.title);
    
    // Record journey completion in timeline
    try {
      recordActivity('journey_complete', {
        journeyId: journey?.id,
        title: journey?.title
      });
    } catch (timelineError) {
      console.warn('Failed to log journey completion to timeline:', timelineError);
    }
    
    // Complete the journey in the context
    completeJourney();
    toast.success("Journey completed, thank you for traveling");
  };
  
  // Toggle timeline visibility
  const toggleTimeline = () => {
    setShowTimeline(prev => !prev);
  };
  
  // Check if the currently loaded journey matches the active journey
  const isCurrentJourneyActive = isJourneyActive && activeJourney?.id === journey?.id;

  return (
    <PageLayout 
      title={journey?.title || 'Journey'} 
      className="bg-gradient-to-b from-purple-900/40 to-black"
    >
      {!loading && journey && (
        <motion.div 
          className="absolute top-0 left-0 right-0 z-10 h-64 overflow-hidden opacity-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1 }}
        >
          <JourneyAwareSpiralVisualizer 
            journeyId={journey.id}
            autoSync={false}
            showControls={false}
            containerId={`journeyBackgroundSpiral`}
            className="w-full h-full"
          />
        </motion.div>
      )}
      
      <div className="container mx-auto px-4 py-8 relative z-20">
        <Link to="/journey-index" className="inline-flex items-center mb-6 text-purple-300 hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Journey Index
        </Link>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column: Spiral visualizer and audio player */}
            <div className="lg:col-span-1">
              <JourneySidebar
                journey={journey}
                hasAudioContent={hasAudioContent}
                showTimeline={showTimeline}
                isCurrentJourneyActive={isCurrentJourneyActive}
                slug={slug}
                handleStartJourney={handleStartJourney}
                handleCompleteJourney={handleCompleteJourney}
                toggleTimeline={toggleTimeline}
              />
            </div>
            
            {/* Right column: Journey content */}
            <div className="lg:col-span-2">
              <JourneyContent journey={journey} content={content} />
            </div>
          </div>
        )}
      </div>
      
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
              <h2 className="text-3xl font-semibold mb-3 text-white">{journey?.title}</h2>
              <p className="text-purple-300 italic">
                {journey?.description || "Begin your sacred journey..."}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
};

export default JourneyPage;
