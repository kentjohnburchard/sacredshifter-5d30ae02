
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import ReactMarkdown from 'react-markdown';
import { fetchJourneyBySlug, Journey } from '@/services/journeyService';
import { parseJourneyContent, removeFrontmatter, parseJourneyFrontmatter } from '@/utils/journeyLoader';
import JourneySoundscapePlayer from '@/components/journey/JourneySoundscapePlayer';
import SacredGeometryVisualizer from '@/components/sacred-geometry/SacredGeometryVisualizer';
import SpiralVisualizer from '@/components/visualizer/SpiralVisualizer';
import { useSpiralParams } from '@/hooks/useSpiralParams';
import { Card, CardContent } from '@/components/ui/card';

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
  const spiralParams = useSpiralParams(slug || '');
  
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
        
        setJourney(journeyData);
      } catch (error) {
        console.error('Error loading journey:', error);
      } finally {
        setLoading(false);
      }
    };

    loadJourney();
  }, [slug]);

  return (
    <Layout 
      pageTitle={journey?.title || 'Journey'} 
      className="bg-gradient-to-b from-purple-900/20 to-black"
    >
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="bg-black/70 backdrop-blur-lg border-purple-500/30 shadow-xl">
                <CardContent className="p-6">
                  <h1 className="text-3xl font-bold mb-4 text-white text-shadow-lg">{journey?.title}</h1>
                  
                  {journey?.tags && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {journey.tags.split(',').map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-purple-900/50 rounded-full text-xs text-white font-medium">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="prose prose-invert max-w-none text-white text-shadow-sm">
                    <ReactMarkdown>{removeFrontmatter(content)}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-1 space-y-4">
              <Card className="bg-black/70 backdrop-blur-lg border-purple-500/30 shadow-xl overflow-hidden">
                <div className="h-64 relative">
                  <SpiralVisualizer params={spiralParams} containerId="journeySpiral" />
                </div>
              </Card>
              
              <Card className="bg-black/70 backdrop-blur-lg border-purple-500/30 shadow-xl">
                <CardContent className="p-4">
                  {slug && (
                    <JourneySoundscapePlayer journeySlug={slug} autoplay={false} />
                  )}
                </CardContent>
              </Card>
              
              <Card className="bg-black/70 backdrop-blur-lg border-purple-500/30 shadow-xl">
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium mb-2 text-white text-shadow-md">Sacred Geometry</h3>
                  <div className="h-40 relative">
                    <SacredGeometryVisualizer 
                      defaultShape="flower-of-life"
                      size="md"
                      showControls={false}
                    />
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
