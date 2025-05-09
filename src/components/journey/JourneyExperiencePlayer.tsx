
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ArrowRight, ChevronLeft, Volume2, Volume, MoonStar } from 'lucide-react';
import { ChakraTag, getChakraColor } from '@/types/chakras';
import { useJourney } from '@/context/JourneyContext';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { parseJourneyMarkdown } from '@/utils/parseJourneyMarkdown';
import { useAuth } from '@/context/AuthContext';

type JourneyStage = 'intro' | 'content' | 'reflection' | 'complete';

interface StageContent {
  title?: string;
  content: string;
}

const JourneyExperiencePlayer = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { activeJourney, startJourney, completeJourney, recordActivity } = useJourney();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [journeyData, setJourneyData] = useState<any>(null);
  const [currentStage, setCurrentStage] = useState<JourneyStage>('intro');
  const [contentSections, setContentSections] = useState<StageContent[]>([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [reflection, setReflection] = useState('');
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.7);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [transitionActive, setTransitionActive] = useState(false);
  const [chakraColor, setChakraColor] = useState('#8B5CF6'); // Default purple

  useEffect(() => {
    const loadJourney = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        
        // Fetch journey data from Supabase
        const { data: journeyData, error } = await supabase
          .from('journeys')
          .select('*')
          .eq('filename', slug)
          .single();
          
        if (error) {
          throw error;
        }
        
        if (journeyData) {
          setJourneyData(journeyData);
          
          // Set chakra color
          if (journeyData.chakra_tag) {
            setChakraColor(getChakraColor(journeyData.chakra_tag as ChakraTag) || '#8B5CF6');
          }
          
          // Parse content sections from markdown if script is available
          if (journeyData.script) {
            const parsed = parseJourneyMarkdown(journeyData.script);
            
            // Split content into sections
            const sections: StageContent[] = [];
            
            // Add intro section with intent
            sections.push({
              title: 'Intention',
              content: journeyData.intent || 'Begin by setting your intention for this sacred journey.'
            });
            
            // Add main content sections by splitting markdown on h2/h3 headings
            const contentParts = journeyData.script.split(/#{2,3}\s+/g).filter(Boolean);
            contentParts.forEach((part, index) => {
              if (index === 0) {
                sections.push({ content: part.trim() });
              } else {
                // Extract title from first line
                const lines = part.trim().split('\n');
                const title = lines[0].trim();
                const content = lines.slice(1).join('\n').trim();
                sections.push({ title, content });
              }
            });
            
            setContentSections(sections);
          } else {
            // Create default sections if no script
            setContentSections([
              {
                title: 'Intention',
                content: journeyData.intent || 'Begin by setting your intention for this sacred journey.'
              },
              {
                title: 'Breathe',
                content: 'Take three deep breaths, allowing your body to relax and your mind to clear.'
              },
              {
                title: 'Experience',
                content: 'Allow the frequencies to flow through you, activating your energy centers.'
              }
            ]);
          }
          
          // Setup audio if available
          if (journeyData.audio_filename) {
            const audioUrl = `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${journeyData.audio_filename}`;
            setAudioSrc(audioUrl);
            
            // Create audio element
            const audio = new Audio(audioUrl);
            audio.loop = true;
            audio.volume = audioVolume;
            setAudioElement(audio);
          }
          
          // Record that journey started
          if (user) {
            recordActivity('journey_start', {
              journeyId: journeyData.id,
              title: journeyData.title
            });
          }
        } else {
          toast.error("Journey not found");
          navigate('/journey-index');
        }
      } catch (error) {
        console.error("Error loading journey:", error);
        toast.error("Error loading journey");
      } finally {
        setLoading(false);
      }
    };
    
    loadJourney();
    
    // Cleanup on unmount
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
      }
    };
  }, [slug, navigate, recordActivity, user]);
  
  // Handle audio play/pause
  const toggleAudio = () => {
    if (!audioElement) return;
    
    if (audioPlaying) {
      audioElement.pause();
    } else {
      audioElement.play().catch(error => {
        console.error("Audio playback error:", error);
        toast.error("Could not play audio");
      });
    }
    
    setAudioPlaying(!audioPlaying);
  };
  
  // Handle audio volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setAudioVolume(newVolume);
    
    if (audioElement) {
      audioElement.volume = newVolume;
    }
  };
  
  // Handle next section
  const goToNextSection = () => {
    setTransitionActive(true);
    
    setTimeout(() => {
      if (currentStage === 'intro') {
        setCurrentStage('content');
        setCurrentSectionIndex(0);
      } else if (currentStage === 'content') {
        if (currentSectionIndex < contentSections.length - 1) {
          setCurrentSectionIndex(currentSectionIndex + 1);
        } else {
          setCurrentStage('reflection');
        }
      } else if (currentStage === 'reflection') {
        completeJourney();
        recordActivity('journey_complete', {
          journeyId: journeyData?.id,
          reflection
        });
        
        // Save reflection to timeline
        if (user && reflection.trim() !== '') {
          saveReflection();
        }
        
        setCurrentStage('complete');
      }
      
      setTransitionActive(false);
    }, 800);
  };
  
  // Handle go back
  const goBack = () => {
    if (currentStage === 'content' && currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    } else if (currentStage === 'content' && currentSectionIndex === 0) {
      setCurrentStage('intro');
    } else if (currentStage === 'reflection') {
      setCurrentStage('content');
      setCurrentSectionIndex(contentSections.length - 1);
    }
  };
  
  // Handle save reflection
  const saveReflection = async () => {
    if (!user || !journeyData || reflection.trim() === '') return;
    
    try {
      const { data, error } = await supabase
        .from('timeline_snapshots')
        .insert({
          user_id: user.id,
          journey_id: journeyData.id,
          title: `Reflection: ${journeyData.title}`,
          notes: reflection,
          tag: 'reflection',
          chakra: journeyData.chakra_tag,
          component: 'journey_experience'
        });
        
      if (error) {
        throw error;
      }
      
      // Award points for journey completion
      const { data: pointsData, error: pointsError } = await supabase
        .rpc('add_lightbearer_points', {
          user_id: user.id,
          activity_type: 'journey_complete',
          points: 15,
          description: `Completed journey: ${journeyData.title}`
        });
        
      if (pointsError) {
        console.error("Error awarding points:", pointsError);
      } else if (pointsData) {
        toast.success(`+15 Light Points awarded`, {
          description: "Journey completion recorded"
        });
        
        if (pointsData.leveled_up) {
          toast.success(`Level Up! You are now level ${pointsData.new_level}`, {
            duration: 5000,
            className: "bg-purple-700 border-yellow-400 border-2"
          });
        }
      }
      
    } catch (error) {
      console.error("Error saving reflection:", error);
      toast.error("Failed to save reflection");
    }
  };
  
  // Return to journey index
  const returnToIndex = () => {
    navigate('/journey-index');
  };
  
  // Start another journey
  const startAnotherJourney = () => {
    navigate('/journey-index');
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-purple-500 border-r-purple-500 border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl text-white font-medium">Preparing your sacred journey...</h2>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background effects */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-black to-purple-950/30 z-0"
        style={{ 
          boxShadow: `inset 0 0 150px ${chakraColor}30`,
        }}
      />
      
      {/* Sacred geometry background */}
      <motion.div 
        className="absolute inset-0 z-0 opacity-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 2 }}
      >
        <div className="w-full h-full" style={{ 
          backgroundImage: 'url(/assets/sacred-geometry.svg)', 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: 'scale(2) rotate(0deg)'
        }}/>
      </motion.div>
      
      {/* Main content with transition animations */}
      <div className="container mx-auto px-4 py-8 relative z-10 min-h-screen flex flex-col">
        {/* Top navigation bar */}
        <div className="flex justify-between items-center mb-6">
          {currentStage !== 'complete' && (
            <Button 
              variant="ghost" 
              className="text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => {
                if (window.confirm("Are you sure you want to exit this journey? Your progress will be lost.")) {
                  navigate(-1);
                }
              }}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Exit Journey
            </Button>
          )}
          
          {audioSrc && (
            <div className="flex items-center space-x-2">
              <Button
                size="icon"
                variant="ghost"
                className="text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                onClick={toggleAudio}
              >
                {audioPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <div className="hidden sm:flex items-center space-x-2 bg-black/30 py-1 px-2 rounded-full">
                {audioVolume === 0 ? (
                  <Volume className="h-4 w-4 text-white/70" />
                ) : (
                  <Volume2 className="h-4 w-4 text-white/70" />
                )}
                <div className="w-20">
                  <Slider
                    value={[audioVolume]}
                    max={1}
                    step={0.01}
                    onValueChange={handleVolumeChange}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Main journey content */}
        <div className="flex-grow flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {currentStage === 'intro' && (
              <motion.div
                key="intro"
                className="max-w-2xl mx-auto text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl font-playfair font-bold mb-6 text-white">{journeyData?.title}</h1>
                
                <div 
                  className="w-16 h-16 rounded-full mb-8 mx-auto flex items-center justify-center"
                  style={{ backgroundColor: `${chakraColor}30`, border: `2px solid ${chakraColor}` }}
                >
                  <MoonStar className="h-8 w-8 text-white" />
                </div>
                
                <div className="prose prose-invert max-w-none">
                  <p className="text-xl text-white/90 mb-8">
                    {journeyData?.intent || "Prepare yourself for a transcendent experience that will align your energies and expand your consciousness."}
                  </p>
                  
                  {journeyData?.sound_frequencies && (
                    <div className="mb-6">
                      <p className="text-sm uppercase tracking-wider text-white/50 mb-1">Frequency</p>
                      <p className="text-white/80">{journeyData.sound_frequencies} Hz</p>
                    </div>
                  )}
                  
                  <Button 
                    className="mt-8 px-8 py-6 text-lg"
                    style={{ 
                      background: `linear-gradient(to right, ${chakraColor}, ${chakraColor}90)`,
                      color: 'white' 
                    }}
                    onClick={goToNextSection}
                  >
                    Begin Journey
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}
            
            {currentStage === 'content' && contentSections.length > 0 && (
              <motion.div
                key={`content-${currentSectionIndex}`}
                className="max-w-2xl mx-auto w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <div className="bg-white/10 px-3 py-1 rounded-full">
                      <p className="text-xs text-white/70">
                        Step {currentSectionIndex + 1} of {contentSections.length}
                      </p>
                    </div>
                    
                    {journeyData?.chakra_tag && (
                      <div 
                        className="text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm" 
                        style={{ backgroundColor: `${chakraColor}20`, color: chakraColor }}
                      >
                        {journeyData.chakra_tag}
                      </div>
                    )}
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full h-1 bg-white/10 rounded-full">
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        width: `${((currentSectionIndex + 1) / contentSections.length) * 100}%`,
                        backgroundColor: chakraColor 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                  {contentSections[currentSectionIndex].title && (
                    <h2 className="text-2xl font-playfair mb-4 text-white">
                      {contentSections[currentSectionIndex].title}
                    </h2>
                  )}
                  
                  <div className="prose prose-invert max-w-none">
                    <ReactMarkdown>
                      {contentSections[currentSectionIndex].content}
                    </ReactMarkdown>
                  </div>
                </div>
                
                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    className="border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
                    onClick={goBack}
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Back
                  </Button>
                  
                  <Button
                    className="text-white"
                    style={{ 
                      background: `linear-gradient(to right, ${chakraColor}, ${chakraColor}90)`,
                    }}
                    onClick={goToNextSection}
                  >
                    {currentSectionIndex < contentSections.length - 1 ? 'Continue' : 'Complete Journey'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}
            
            {currentStage === 'reflection' && (
              <motion.div
                key="reflection"
                className="max-w-2xl mx-auto w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-playfair font-bold mb-4 text-white text-center">Reflect on Your Experience</h2>
                
                <p className="text-white/80 mb-6 text-center">Take a moment to integrate the energies and share your insights from this journey.</p>
                
                <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                  <label className="block text-sm font-medium text-white/70 mb-2">Your Reflection (optional)</label>
                  <Textarea
                    placeholder="Describe what you experienced during this journey..."
                    className="bg-black/30 border-white/20 text-white min-h-[150px]"
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                  />
                  
                  {!user && (
                    <p className="text-amber-400 text-sm mt-2">Sign in to save your reflection to your timeline.</p>
                  )}
                </div>
                
                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    className="border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
                    onClick={goBack}
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Back
                  </Button>
                  
                  <Button
                    className="text-white"
                    style={{ 
                      background: `linear-gradient(to right, ${chakraColor}, ${chakraColor}90)`,
                    }}
                    onClick={goToNextSection}
                  >
                    Complete Journey
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}
            
            {currentStage === 'complete' && (
              <motion.div
                key="complete"
                className="max-w-2xl mx-auto text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div 
                  className="w-24 h-24 rounded-full mb-8 mx-auto flex items-center justify-center"
                  style={{ backgroundColor: `${chakraColor}30`, border: `3px solid ${chakraColor}` }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5, type: 'spring' }}
                  >
                    <MoonStar className="h-12 w-12 text-white" />
                  </motion.div>
                </div>
                
                <h1 className="text-4xl font-playfair font-bold mb-4 text-white">Journey Complete</h1>
                
                <p className="text-xl text-white/80 mb-8">
                  You have completed your sacred journey. The energies continue to resonate within you.
                </p>
                
                <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-8">
                  <p className="text-white/70 mb-2">Lightbearer XP Earned</p>
                  <p className="text-3xl font-bold text-white">+15 XP</p>
                </div>
                
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button 
                    variant="outline" 
                    className="border-white/20 text-white"
                    onClick={startAnotherJourney}
                  >
                    Start Next Journey
                  </Button>
                  
                  <Button
                    className="text-white"
                    style={{ 
                      background: `linear-gradient(to right, ${chakraColor}, ${chakraColor}90)`,
                    }}
                    onClick={returnToIndex}
                  >
                    Return to Journey Index
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Full screen transition effect */}
      <AnimatePresence>
        {transitionActive && (
          <motion.div
            className="fixed inset-0 z-50 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.5, 0] }}
                transition={{ duration: 0.8 }}
                className="w-24 h-24 rounded-full"
                style={{ backgroundColor: chakraColor }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JourneyExperiencePlayer;
