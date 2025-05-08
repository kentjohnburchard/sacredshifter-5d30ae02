
import React from 'react';
import { JourneyProvider } from '@/context/JourneyContext';
import Layout from '@/components/Layout';
import ReactMarkdown from 'react-markdown';
import { fetchJourneyBySlug } from '@/services/journeyService';
import { Journey } from '@/types/journey';
import { parseJourneyContent, removeFrontmatter, parseJourneyFrontmatter } from '@/utils/journeyLoader';
import JourneyAwareSoundscapePlayer from '@/components/journey/JourneyAwareSoundscapePlayer';
import JourneyAwareSpiralVisualizer from '@/components/visualizer/JourneyAwareSpiralVisualizer';
import JourneyTimelineView from '@/components/timeline/JourneyTimelineView';
import { Card, CardContent } from '@/components/ui/card';
import { useJourney } from '@/context/JourneyContext';
import { Button } from '@/components/ui/button';
import { Play, CirclePause, History } from 'lucide-react';
import { normalizeStringArray } from '@/utils/parsers';
import { toast } from 'sonner';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/components/ui/theme-provider';

/**
 * Test harness for the JourneyPage component using a hardcoded journey slug
 */
const TestJourney: React.FC = () => {
  // Hardcoded journey slug for testing
  // Updated to use the correct format according to journeys in Supabase
  const JOURNEY_SLUG = "akashic-reconnection";
  
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="sacred-theme">
        <JourneyProvider>
          <TestJourneyContent journeySlug={JOURNEY_SLUG} />
        </JourneyProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

// Internal component to use hooks inside the providers
const TestJourneyContent: React.FC<{ journeySlug: string }> = ({ journeySlug }) => {
  // Now we're going to implement a simplified version of the JourneyPage
  // with the hardcoded journey slug
  const [journey, setJourney] = React.useState<Journey | null>(null);
  const [content, setContent] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [hasAudioContent, setHasAudioContent] = React.useState(false);
  const [showTimeline, setShowTimeline] = React.useState(true);
  
  const { 
    activeJourney, 
    isJourneyActive, 
    startJourney, 
    completeJourney,
    recordActivity
  } = useJourney();
  
  // Load journey data on component mount
  React.useEffect(() => {
    const loadJourney = async () => {
      console.log(`Loading journey: ${journeySlug}`);
      setLoading(true);
      try {
        // Try to get the journey from the database
        let journeyData = await fetchJourneyBySlug(journeySlug);
        
        // Log the fetched journey data for debugging
        console.log("Fetched journey data:", journeyData);
        console.log("Frequencies data:", journeyData?.frequencies);
        console.log("Frequencies data type:", journeyData?.frequencies ? typeof journeyData.frequencies : "undefined");
        if (journeyData?.frequencies) {
          console.log("Is frequencies an array?", Array.isArray(journeyData.frequencies));
        }
        
        if (!journeyData) {
          console.log(`Journey ${journeySlug} not found in database, checking core_content...`);
          // Implementation of loadCoreJourneyContent would go here,
          // but we'll skip this for the test harness
          console.error(`Journey ${journeySlug} not found in database or core_content`);
          toast.error("Journey not found");
          return;
        } else {
          console.log("Loaded journey from database:", journeyData.title);
          console.log("Journey ID:", journeyData.id, "Type:", typeof journeyData.id);
          
          // Determine if there's audio content based on metadata
          setHasAudioContent(!!journeyData.sound_frequencies || !!journeyData.audio_filename);
          
          // Ensure journeyData.id is a string
          if (journeyData && journeyData.id) {
            journeyData.id = String(journeyData.id);
          }
          
          // Ensure frequencies is treated as an array
          if (journeyData.frequencies && typeof journeyData.frequencies === 'string') {
            try {
              journeyData.frequencies = JSON.parse(journeyData.frequencies);
            } catch (e) {
              journeyData.frequencies = [journeyData.frequencies];
            }
          } else if (journeyData.frequencies && !Array.isArray(journeyData.frequencies)) {
            journeyData.frequencies = [String(journeyData.frequencies)];
          }
          
          setJourney(journeyData);
        }
      } catch (error) {
        console.error('Error loading journey:', error);
        toast.error("Error loading journey");
      } finally {
        setLoading(false);
      }
    };

    loadJourney();
  }, [journeySlug]);

  // Start journey function
  const handleStartJourney = () => {
    if (journey) {
      console.log("Starting journey:", journey.title);
      const journeyTags = normalizeStringArray(journey.tags);
      
      const formattedJourney: Journey = {
        ...journey,
        id: journey.id || "",
        tags: journeyTags
      };
      
      recordActivity('journey_start', { 
        journeyId: formattedJourney.id,
        title: formattedJourney.title
      });
      
      startJourney(formattedJourney);
      toast.success("Journey started");
    }
  };
  
  // Complete journey function
  const handleCompleteJourney = () => {
    console.log("Completing journey:", journey?.title);
    
    recordActivity('journey_complete', {
      journeyId: journey?.id,
      title: journey?.title
    });
    
    completeJourney();
    toast.success("Journey completed");
  };
  
  // Toggle timeline visibility
  const toggleTimeline = () => {
    setShowTimeline(prev => !prev);
  };
  
  // Format frequencies for display - FIXED to handle string or array
  const getFrequencyDisplay = () => {
    if (!journey) return 'No frequency information available';
    
    console.log("Getting frequency display for:", journey);
    console.log("Frequencies:", journey.frequencies, "Type:", typeof journey.frequencies);
    
    // Check for frequencies array first - properly handle array or string type
    if (journey.frequencies) {
      if (Array.isArray(journey.frequencies) && journey.frequencies.length > 0) {
        console.log("Using frequencies array:", journey.frequencies.join(', '));
        return journey.frequencies.join(', ') + ' Hz';
      } else if (typeof journey.frequencies === 'string') {
        // Handle case where frequencies is a string
        return journey.frequencies + ' Hz';
      }
    }
    
    // Fall back to sound_frequencies string
    if (journey.sound_frequencies) {
      console.log("Using sound_frequencies:", journey.sound_frequencies);
      return journey.sound_frequencies;
    }
    
    console.log("No frequency information found");
    return 'No frequency information available';
  };
  
  // Check if the currently loaded journey matches the active journey
  const isCurrentJourneyActive = isJourneyActive && activeJourney?.id === journey?.id;

  // Generate a unique container ID for this instance of the spiral
  const spiralContainerId = `journeySpiral-${journeySlug}`;

  return (
    <Layout 
      pageTitle={journey?.title || 'Test Journey'} 
      className="bg-gradient-to-b from-purple-900/40 to-black"
      showGlobalWatermark={false}
    >
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column: Spiral visualizer and audio player */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="bg-black/80 backdrop-blur-lg border-purple-500/30 shadow-xl overflow-hidden">
                <div className="h-64 relative">
                  <JourneyAwareSpiralVisualizer 
                    journeyId={journey ? String(journey.id) : undefined}
                    autoSync={false}
                    showControls={true}
                    containerId={spiralContainerId}
                    className="h-full w-full"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2 text-white">Sacred Frequencies</h3>
                  <div className="text-sm text-white/80">
                    {getFrequencyDisplay()}
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    {!isCurrentJourneyActive ? (
                      <Button 
                        onClick={handleStartJourney} 
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Journey
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleCompleteJourney} 
                        variant="outline"
                        className="border-purple-500/50 text-purple-200"
                      >
                        <CirclePause className="h-4 w-4 mr-2" />
                        Complete Journey
                      </Button>
                    )}
                    
                    <Button 
                      onClick={toggleTimeline} 
                      variant="ghost"
                      className="text-purple-200"
                      title="Toggle Timeline"
                    >
                      <History className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Render audio player if journey has sound frequencies */}
              {hasAudioContent && (
                <Card className="bg-black/80 backdrop-blur-lg border-purple-500/30 shadow-xl">
                  <CardContent className="p-4">
                    {journeySlug && (
                      <JourneyAwareSoundscapePlayer 
                        journeyId={journeySlug} 
                        autoSync={false}
                        autoplay={false} 
                      />
                    )}
                  </CardContent>
                </Card>
              )}
              
              {/* Journey Timeline (conditionally shown) */}
              {showTimeline && (
                <Card className="bg-black/80 backdrop-blur-lg border-purple-500/30 shadow-xl">
                  <CardContent className="p-4">
                    <JourneyTimelineView 
                      journeyId={journey ? String(journey.id) : ""}
                      autoSync={false}
                      limit={5}
                    />
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Right column: Journey content */}
            <div className="lg:col-span-2">
              <Card className="bg-black/80 backdrop-blur-lg border-purple-500/30 shadow-xl">
                <CardContent className="p-6">
                  <h1 className="text-3xl font-bold mb-4 text-white">{journey?.title || "Test Journey"}</h1>
                  
                  {journey?.tags && Array.isArray(journey.tags) && journey.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {journey.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-purple-900/60 rounded-full text-xs text-white font-medium">
                          {typeof tag === 'string' ? tag.trim() : tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    <div className="prose prose-invert max-w-none text-white leading-relaxed">
                      {content ? (
                        <ReactMarkdown>{removeFrontmatter(content)}</ReactMarkdown>
                      ) : (
                        <div className="p-4 bg-purple-900/20 rounded-md">
                          <p>Testing the journey display with slug: <strong>{journeySlug}</strong></p>
                          <p className="mt-2">Journey ID: <strong>{journey?.id || "Not loaded"}</strong></p>
                          <p className="mt-2">Frequencies: <strong>{getFrequencyDisplay()}</strong></p>
                          <p className="mt-2">Intent: <strong>{journey?.intent || "None specified"}</strong></p>
                          <p className="mt-2">Chakra: <strong>{journey?.chakra_tag || "None specified"}</strong></p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TestJourney;
