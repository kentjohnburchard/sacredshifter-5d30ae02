import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import ReactMarkdown from 'react-markdown';
import { fetchJourneyBySlug, Journey } from '@/services/journeyService';
import { parseJourneyContent, removeFrontmatter, parseJourneyFrontmatter } from '@/utils/journeyLoader';
import JourneyAwareSoundscapePlayer from '@/components/journey/JourneyAwareSoundscapePlayer';
import JourneyAwareSpiralVisualizer from '@/components/visualizer/JourneyAwareSpiralVisualizer';
import JourneyTimelineView from '@/components/timeline/JourneyTimelineView';
import { Card, CardContent } from '@/components/ui/card';
import { useJourney } from '@/context/JourneyContext';
import { Button } from '@/components/ui/button';
import { Play, CirclePause, History } from 'lucide-react';

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
      const journey: Journey = {
        id: 0, // Temporary ID
        filename,
        title: frontmatter.title || filename,
        tags: Array.isArray(frontmatter.tags) ? frontmatter.tags.join(', ') : '',
        content,
        veil_locked: frontmatter.veil || false,
        sound_frequencies: frontmatter.frequency?.toString() || parsedContent.frequencies || '',
        description: parsedContent.intent || '',
        intent: parsedContent.intent || '',
        duration: parsedContent.duration || ''
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
  const [showTimeline, setShowTimeline] = useState(false);
  
  const { 
    activeJourney, 
    isJourneyActive, 
    startJourney, 
    completeJourney, 
    resetJourney 
  } = useJourney();
  
  useEffect(() => {
    const loadJourney = async () => {
      if (!slug) return;
      
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
          } else {
            console.error(`Journey ${slug} not found in database or core_content`);
            return;
          }
        } else {
          // Journey found in DB, use its content
          setContent(journeyData.content || '');
        }
        
        // Determine if there's audio content based on metadata
        setHasAudioContent(!!journeyData.sound_frequencies);
        setJourney(journeyData);
      } catch (error) {
        console.error('Error loading journey:', error);
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
      <div className="prose prose-invert max-w-none text-white readable-text-light leading-relaxed">
        <ReactMarkdown>{removeFrontmatter(content)}</ReactMarkdown>
      </div>
    );
  };

  const handleStartJourney = () => {
    if (journey) {
      startJourney(journey);
    }
  };
  
  const handleCompleteJourney = () => {
    completeJourney();
  };
  
  const toggleTimeline = () => {
    setShowTimeline(prev => !prev);
  };
  
  // Check if the currently loaded journey matches the active journey
  const isCurrentJourneyActive = isJourneyActive && activeJourney?.id === journey?.id;

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
                    journeyId={journey?.id?.toString()}
                    autoSync={false}
                    showControls={true}
                    containerId={`journeySpiral-${slug}`}
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-2 text-white readable-text">Sacred Frequencies</h3>
                  <div className="text-sm text-white/80 readable-text-light">
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
                      title="View Timeline"
                    >
                      <History className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Only render audio player if journey has sound frequencies */}
              {hasAudioContent && (
                <Card className="bg-black/80 backdrop-blur-lg border-purple-500/30 shadow-xl">
                  <CardContent className="p-4">
                    {slug && (
                      <JourneyAwareSoundscapePlayer 
                        journeyId={journey?.id?.toString()} 
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
                      journeyId={journey?.id?.toString()}
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
                  <h1 className="text-3xl font-bold mb-4 text-white readable-text-bold">{journey?.title}</h1>
                  
                  {journey?.tags && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {journey.tags.split(',').map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-purple-900/60 rounded-full text-xs text-white font-medium readable-text-light">
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
