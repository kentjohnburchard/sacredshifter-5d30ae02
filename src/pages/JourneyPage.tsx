
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchJourneyBySlug, Journey } from '@/services/journeyService';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import Layout from '@/components/Layout';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import JourneyVisualizer from '@/components/sacred-journey/JourneyVisualizer';
import NotFound from './NotFound';

const JourneyPage: React.FC = () => {
  const { journeySlug } = useParams<{ journeySlug: string }>();
  const [journey, setJourney] = useState<Journey | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [visualsEnabled, setVisualsEnabled] = useState(true);
  const { user } = useAuth();

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

  return (
    <Layout pageTitle={journey?.title || 'Journey'}>
      <div className="container mx-auto px-4 py-8">
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
              {journey?.title}
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

            <div className="flex items-center justify-center mt-6 mb-8">
              <Switch 
                id="visuals-toggle" 
                checked={visualsEnabled}
                onCheckedChange={setVisualsEnabled}
                className="mr-2"
              />
              <label htmlFor="visuals-toggle" className="text-sm text-gray-600">
                Enable Visual Effects
              </label>
            </div>
          </header>

          <div className="prose prose-purple max-w-none">
            {/* Journey content would be loaded here */}
            <p className="text-center text-gray-500 py-8">
              Journey content for {journey?.filename} would be displayed here.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default JourneyPage;
