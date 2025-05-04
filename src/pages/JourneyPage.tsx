
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchJourneyBySlug, Journey } from '@/services/journeyService';
import { fetchJourneySoundscape, JourneySoundscape } from '@/services/soundscapeService';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { Switch } from '@/components/ui/switch';
import { Loader2, Music } from 'lucide-react';
import JourneyVisualizer from '@/components/sacred-journey/JourneyVisualizer';
import NotFound from './NotFound';
import JourneySoundscapePlayer from '@/components/journey/JourneySoundscapePlayer';
import SpiralVisualizer from '@/components/visualizer/SpiralVisualizer';
import useSpiralParams from '@/hooks/useSpiralParams';
import ReactMarkdown from 'react-markdown';

const DEFAULT_SPIRAL_PARAMS = {
  coeffA: 4,
  coeffB: 4,
  coeffC: 1.3,
  freqA: 44,
  freqB: -17,
  freqC: -54
};

const JourneyPage: React.FC = () => {
  const { journeySlug } = useParams<{ journeySlug: string }>();
  const [journey, setJourney] = useState<Journey | null>(null);
  const [soundscape, setSoundscape] = useState<JourneySoundscape | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [visualsEnabled, setVisualsEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [spiralEnabled, setSpiralEnabled] = useState(true);
  const { user } = useAuth();
  
  // Get spiral parameters based on journey slug, with fallback to defaults
  const spiralParams = useSpiralParams(journeySlug) || DEFAULT_SPIRAL_PARAMS;

  useEffect(() => {
    const loadJourney = async () => {
      if (!journeySlug) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        const data = await fetchJourneyBySlug(journeySlug);
        if (!data) {
          setNotFound(true);
          return;
        }
        
        // Check if journey is veil-locked and user is not authenticated
        if (data.veil_locked && !user) {
          toast.error("This journey requires authentication to view");
          setNotFound(true);
          return;
        }
        
        setJourney(data);
        
        // Fetch the associated soundscape if any
        try {
          const soundscapeData = await fetchJourneySoundscape(journeySlug);
          if (soundscapeData) {
            setSoundscape(soundscapeData);
          }
        } catch (soundscapeError) {
          console.error('Error loading soundscape:', soundscapeError);
          // Don't fail the whole page load if soundscape fails
        }
      } catch (error) {
        console.error('Error loading journey:', error);
        toast.error('Failed to load journey content');
      } finally {
        setLoading(false);
      }
    };

    loadJourney();
  }, [journeySlug, user]);

  if (notFound) {
    return <NotFound />;
  }

  if (loading) {
    return (
      <Layout pageTitle="Loading Journey...">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600 mr-2" />
          <p className="text-lg text-purple-700">Loading sacred journey...</p>
        </div>
      </Layout>
    );
  }

  // Determine if soundscape is YouTube
  const isYoutubeEmbedded = soundscape?.source_type === 'youtube';
  
  return (
    <Layout pageTitle={journey?.title || 'Journey'}>
      {/* Spiral Visualizer rendered below the main content but above the background */}
      {spiralEnabled && <SpiralVisualizer params={spiralParams} />}
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {visualsEnabled && journey?.visual_effects && (
          <JourneyVisualizer 
            visualEffects={journey.visual_effects}
            strobePatterns={journey.strobe_patterns}
            audioUrl={journey.assigned_songs}
          />
        )}
        
        <div className="max-w-3xl mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-600">
              {journey?.title || "Untitled Journey"}
            </h1>
            
            {journey?.tags && (
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {journey.tags.split(',').map(tag => (
                  <span 
                    key={tag} 
                    className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-center gap-4 mt-6 mb-4">
              <div className="flex items-center">
                <Switch 
                  id="visuals-toggle" 
                  checked={visualsEnabled}
                  onCheckedChange={setVisualsEnabled}
                  className="mr-2"
                />
                <label htmlFor="visuals-toggle" className="text-sm text-gray-600">
                  Visual Effects
                </label>
              </div>
              
              <div className="flex items-center">
                <Switch 
                  id="spiral-toggle" 
                  checked={spiralEnabled}
                  onCheckedChange={setSpiralEnabled}
                  className="mr-2"
                />
                <label htmlFor="spiral-toggle" className="text-sm text-gray-600">
                  Spiral Background
                </label>
              </div>
              
              {soundscape && (
                <div className="flex items-center">
                  <Switch 
                    id="audio-toggle" 
                    checked={audioEnabled}
                    onCheckedChange={setAudioEnabled}
                    className="mr-2"
                  />
                  <label htmlFor="audio-toggle" className="text-sm text-gray-600 flex items-center">
                    <Music className="h-3 w-3 mr-1" /> {isYoutubeEmbedded ? 'Video' : 'Soundscape'}
                  </label>
                </div>
              )}
            </div>
            
            {soundscape && audioEnabled && (
              <div className={`mt-4 mb-6 ${isYoutubeEmbedded ? 'max-w-xl' : 'max-w-md'} mx-auto`}>
                <JourneySoundscapePlayer 
                  soundscape={soundscape} 
                  className={isYoutubeEmbedded ? 'w-full' : 'max-w-md mx-auto'}
                  autoPlay={true}
                  loop={true}
                />
              </div>
            )}
          </header>

          <div className="prose prose-purple max-w-none dark:prose-invert bg-white/50 dark:bg-black/50 p-6 rounded-lg backdrop-blur-sm">
            {journey?.content ? (
              <ReactMarkdown>{journey.content}</ReactMarkdown>
            ) : (
              <p className="text-center text-gray-500 py-8">
                {journey?.filename ? 
                  `Journey content for ${journey.filename} would be displayed here.` : 
                  "This journey has no content yet. It will be added soon."}
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default JourneyPage;
