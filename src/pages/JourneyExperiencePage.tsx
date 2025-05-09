
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppShell from '@/components/layout/AppShell';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { fetchJourneyBySlug } from '@/services/journeyService';
import { parseJourneyMarkdown } from '@/utils/parseJourneyMarkdown';
import { ChakraTag, getChakraColor } from '@/types/chakras';
import JourneyAwareSpiralVisualizer from '@/components/visualizer/JourneyAwareSpiralVisualizer';
import { useTheme } from '@/context/ThemeContext';
import { useJourney } from '@/context/JourneyContext';
import { useAuth } from '@/context/AuthContext';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';
import { getAudioFileUrl } from '@/services/journeyAudioService';
import { toast } from 'sonner';
import { Check, Clock, Music, PlayCircle, PauseCircle } from 'lucide-react';
import Markdown from 'react-markdown';

const JourneyExperiencePage: React.FC = () => {
  const { journeySlug } = useParams<{ journeySlug: string }>();
  const [journeyData, setJourneyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reflection, setReflection] = useState('');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const navigate = useNavigate();
  const { liftTheVeil } = useTheme();
  const { recordActivity } = useJourney();
  const { user } = useAuth();
  const { playAudio, togglePlayPause, currentAudio } = useGlobalAudioPlayer();

  // Fetch journey data
  useEffect(() => {
    const loadJourneyData = async () => {
      if (!journeySlug) {
        setError("Journey slug is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const journey = await fetchJourneyBySlug(journeySlug);
        
        if (!journey) {
          setError(`Journey "${journeySlug}" not found`);
          setLoading(false);
          return;
        }

        // Parse markdown content
        const parsedJourney = journey.script 
          ? parseJourneyMarkdown(journey.script) 
          : { title: journey.title };

        // Combine data from the database and parsed markdown
        const combinedData = {
          ...journey,
          ...parsedJourney,
          id: journey.id
        };

        setJourneyData(combinedData);
        
        // Record journey start in timeline
        if (user?.id) {
          recordActivity('journey_start', {
            journeyId: journey.id,
            title: journey.title
          });
        }
      } catch (err) {
        console.error("Error loading journey:", err);
        setError("Failed to load journey data");
      } finally {
        setLoading(false);
      }
    };

    loadJourneyData();
  }, [journeySlug, user?.id, recordActivity]);

  // Check if audio is currently playing for this journey
  useEffect(() => {
    if (currentAudio && journeyData) {
      const audioFileName = journeyData.audio_filename;
      const audioUrl = audioFileName ? getAudioFileUrl(audioFileName) : '';
      setIsAudioPlaying(currentAudio.source === audioUrl);
    } else {
      setIsAudioPlaying(false);
    }
  }, [currentAudio, journeyData]);

  const handlePlayAudio = () => {
    if (!journeyData || !journeyData.audio_filename) return;
    
    const audioUrl = getAudioFileUrl(journeyData.audio_filename);
    
    if (currentAudio?.source === audioUrl) {
      togglePlayPause();
    } else {
      playAudio({
        title: `${journeyData.title} Soundscape`,
        artist: "Sacred Shifter",
        source: audioUrl,
        frequency: journeyData.frequency,
        chakra: journeyData.chakra_tag
      });
    }
    
    setIsAudioPlaying(!isAudioPlaying);
  };

  const handleCompleteJourney = () => {
    if (!user || !journeyData) return;
    
    // Record completion to timeline
    recordActivity('journey_complete', {
      journeyId: journeyData.id,
      reflection: reflection
    });
    
    toast.success("Journey completed! Light points earned.", {
      duration: 3000
    });
    
    // Navigate back to journey detail page
    setTimeout(() => {
      navigate(`/journey/${journeySlug}`);
    }, 1000);
  };

  if (loading) {
    return (
      <AppShell pageTitle="Loading Journey..." chakraColor="#9333EA">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-purple-300">Loading your spiritual journey...</p>
        </div>
      </AppShell>
    );
  }

  if (error || !journeyData) {
    return (
      <AppShell pageTitle="Journey Not Found" chakraColor="#9333EA">
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Journey Not Found</h1>
          <p className="text-white/80 mb-6">{error || "Unable to load journey data"}</p>
          <Button onClick={() => navigate('/journeys')}>Return to Journeys</Button>
        </div>
      </AppShell>
    );
  }

  // Determine chakra color for UI elements
  const chakraColor = getChakraColor(journeyData.chakra_tag as ChakraTag);

  return (
    <AppShell 
      pageTitle={`Experience: ${journeyData.title}`} 
      chakraColor={chakraColor}
      showSidebar={false} // Hide sidebar for immersive experience
    >
      {/* Background Visualizer */}
      <div className="fixed inset-0 z-0 opacity-40">
        <JourneyAwareSpiralVisualizer 
          journeyId={journeyData.id.toString()} 
          showControls={false}
          className="w-full h-full"
        />
      </div>
      
      {/* Content Layer */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">{journeyData.title}</h1>
            <p className="text-white/70 mt-1">
              {journeyData.chakra_tag && 
                <span className="mr-3">{journeyData.chakra_tag} Chakra</span>
              }
              {journeyData.frequency && 
                <span>{journeyData.frequency}Hz</span>
              }
            </p>
          </div>
          
          {journeyData.audio_filename && (
            <Button 
              onClick={handlePlayAudio}
              className={`mt-4 md:mt-0 ${liftTheVeil ? 'bg-pink-700 hover:bg-pink-600' : 'bg-purple-700 hover:bg-purple-600'}`}
            >
              {isAudioPlaying ? (
                <>
                  <PauseCircle className="h-4 w-4 mr-2" />
                  Pause Soundscape
                </>
              ) : (
                <>
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Play Soundscape
                </>
              )}
            </Button>
          )}
        </div>
        
        {/* Journey Content */}
        <Card className="mb-6 bg-black/60 border-purple-500/30 backdrop-blur-sm">
          <CardContent className="p-6">
            {journeyData.intent && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-2">Journey Intent</h2>
                <p className="text-white/80">{journeyData.intent}</p>
              </div>
            )}
            
            {journeyData.script && (
              <div className="prose prose-invert max-w-none">
                <Markdown>{journeyData.script}</Markdown>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Reflection Section */}
        <Card className="mb-6 bg-black/60 border-purple-500/30 backdrop-blur-sm">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-white mb-3">Journey Reflection</h2>
            <p className="text-white/70 mb-4">
              What insights or feelings arose during this journey? Record your reflection below.
            </p>
            <Textarea 
              value={reflection} 
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Share your reflections here..."
              className="bg-black/30 border-white/20 text-white min-h-[120px] mb-4"
            />
            <Button 
              onClick={handleCompleteJourney} 
              className={`w-full md:w-auto ${liftTheVeil ? 'bg-pink-700 hover:bg-pink-600' : 'bg-purple-700 hover:bg-purple-600'}`}
            >
              <Check className="h-4 w-4 mr-2" />
              Mark Journey as Complete
            </Button>
          </CardContent>
        </Card>
        
        {/* Journey Information */}
        <Card className="bg-black/60 border-purple-500/30 backdrop-blur-sm">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-white mb-3">Journey Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {journeyData.duration && (
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-white/60" />
                  <span className="text-white/80">Duration: {journeyData.duration}</span>
                </div>
              )}
              
              {journeyData.frequencies && journeyData.frequencies.length > 0 && (
                <div className="flex items-center">
                  <Music className="h-5 w-5 mr-2 text-white/60" />
                  <span className="text-white/80">
                    Frequencies: {journeyData.frequencies.join(', ')}
                  </span>
                </div>
              )}
              
              {/* Additional journey metadata can be added here */}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
};

export default JourneyExperiencePage;
