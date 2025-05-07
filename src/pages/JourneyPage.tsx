
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
      const frontmatter = parseJourneyFrontmatter(content);
      
      // Create a journey object from the content
      const parsedContent = parseJourneyContent(content);
      
      // Ensure tags is an array
      const tags = normalizeStringArray(frontmatter.tags || []);
      
      const journey: Journey = {
        id: "temp-0", // Use string ID to match the updated Journey type
        filename,
        title: frontmatter.title || filename,
        veil_locked: frontmatter.veil || false,
        sound_frequencies: frontmatter.frequency?.toString() || parsedContent.frequencies || '',
        tags: tags
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
  const [showTimeline, setShowTimeline] = useState(true); // Changed to default true
  
  const { 
    activeJourney, 
    isJourneyActive, 
    startJourney, 
    completeJourney, 
    resetJourney,
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
        
        // Ensure journeyData.id is a string
        if (journeyData && journeyData.id) {
          journeyData.id = String(journeyData.id);
        }
        
        setJourney(journeyData);
      } catch (error) {
        console.error('Error loading journey:', error);
        toast.error("Error loading journey");
      } finally {
        setLoading(false);
      }
    };

    loadJourney();
  }, [slug]);

  // Function to render markdown content with proper styling
  const renderMarkdownContent = () => {
    if (!content) return null;
    
    return (
      <div className="prose prose-invert max-w-none text-white leading-relaxed">
        <ReactMarkdown>{removeFrontmatter(content)}</ReactMarkdown>
      </div>
    );
  };

  // Start journey function - creates timeline event and activates journey context
  const handleStartJourney = () => {
    if (journey) {
      console.log("Starting journey:", journey.title);
      
      // Convert tags to string array if needed
      const journeyTags = normalizeStringArray(journey.tags);
      
      const formattedJourney: Journey = {
        ...journey,
        id: journey.id || "", // Ensure it's a non-empty string
        tags: journeyTags
      };
      
      // Record the start of the journey in the timeline
      recordActivity('journey_start', { 
        journeyId: formattedJourney.id,
        title: formattedJourney.title
      });
      
      // Start the journey in the context
      startJourney(formattedJourney);
      toast.success("Journey started");
    }
  };
  
  // Complete journey function - finishes the journey and logs it
  const handleCompleteJourney = () => {
    console.log("Completing journey:", journey?.title);
    
    // Record journey completion in timeline
    recordActivity('journey_complete', {
      journeyId: journey?.id,
      title: journey?.title
    });
    
    // Complete the journey in the context
    completeJourney();
    toast.success("Journey completed");
  };
  
  // Toggle timeline visibility
  const toggleTimeline = () => {
    setShowTimeline(prev => !prev);
  };
  
  // Check if the currently loaded journey matches the active journey
  const isCurrentJourneyActive = isJourneyActive && activeJourney?.id === journey?.id;

  // Extract tags from content if available
  const extractTagsFromContent = () => {
    if (!content) return [];
    
    const frontmatter = parseJourneyFrontmatter(content);
    if (frontmatter.tags) {
      return normalizeStringArray(frontmatter.tags);
    }
    return [];
  };

  const journeyTags = journey?.tags?.length ? journey.tags : extractTagsFromContent();

  return (
    <Layout 
      pageTitle={journey?.title || 'Journey'} 
      className="bg-gradient-to-b from-purple-900/40 to-black"
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
                    journeyId={journey?.id}
                    autoSync={false}
                    showControls={true}
                    containerId={`journeySpiral-${slug}`}
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2 text-white">Sacred Frequencies</h3>
                  <div className="text-sm text-white/80">
                    {journey?.sound_frequencies || 'No frequency information available'}
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
                    {slug && (
                      <JourneyAwareSoundscapePlayer 
                        journeyId={slug} 
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
                      journeyId={journey?.id}
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
                  <h1 className="text-3xl font-bold mb-4 text-white">{journey?.title}</h1>
                  
                  {journeyTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {journeyTags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-purple-900/60 rounded-full text-xs text-white font-medium">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {renderMarkdownContent()}
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

export default JourneyPage;
