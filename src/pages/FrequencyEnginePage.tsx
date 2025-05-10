
import React, { useState, useEffect } from 'react';
import AppShell from '@/components/layout/AppShell';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useGlobalAudioPlayer } from '@/hooks/useGlobalAudioPlayer';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Search, BookmarkPlus, Bookmark, Play, Pause } from 'lucide-react';
import FrequencyPlayer from '@/components/FrequencyPlayer';
import JourneyAwareSpiralVisualizer from '@/components/visualizer/JourneyAwareSpiralVisualizer';
import { FrequencyLibraryItem } from '@/types/frequencies';

const chakraMap: Record<string, string> = {
  "Root": "#FF5757",
  "Sacral": "#FF8C42", 
  "Solar Plexus": "#FFCE45",
  "Heart": "#6BDE81",
  "Throat": "#45CDFF",
  "Third Eye": "#8A7CFE",
  "Crown": "#B882FF"
};

const FrequencyEnginePage: React.FC = () => {
  const [frequencies, setFrequencies] = useState<FrequencyLibraryItem[]>([]);
  const [savedFrequencies, setSavedFrequencies] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [playingFrequencyId, setPlayingFrequencyId] = useState<string | null>(null);
  
  const { isPlaying, currentAudio, playAudio, togglePlayPause } = useGlobalAudioPlayer();
  const { liftTheVeil } = useTheme();
  const { user } = useAuth();

  // Fetch frequencies
  useEffect(() => {
    const fetchFrequencies = async () => {
      try {
        setLoading(true);
        
        // Fetch frequencies from library
        const { data, error } = await supabase
          .from('frequency_library')
          .select('*')
          .order('frequency', { ascending: true });
        
        if (error) {
          throw error;
        }
        
        setFrequencies(data || []);

        // If logged in, fetch saved frequencies
        if (user) {
          const { data: savedData } = await supabase
            .from('user_saved_frequencies')
            .select('frequency_id')
            .eq('user_id', user.id);
          
          if (savedData) {
            setSavedFrequencies(savedData.map(saved => saved.frequency_id));
          }
        }
      } catch (error) {
        console.error('Error fetching frequency data:', error);
        toast.error('Failed to load frequency data');
      } finally {
        setLoading(false);
      }
    };

    fetchFrequencies();
  }, [user]);

  // Toggle saving a frequency
  const toggleSaveFrequency = async (frequencyId: string) => {
    if (!user) {
      toast.error('Please sign in to save frequencies');
      return;
    }

    try {
      if (savedFrequencies.includes(frequencyId)) {
        // Remove from saved
        await supabase
          .from('user_saved_frequencies')
          .delete()
          .eq('user_id', user.id)
          .eq('frequency_id', frequencyId);
        
        setSavedFrequencies(prev => prev.filter(id => id !== frequencyId));
        toast.success('Frequency removed from favorites');
      } else {
        // Add to saved
        await supabase
          .from('user_saved_frequencies')
          .insert({
            user_id: user.id,
            frequency_id: frequencyId
          });
        
        setSavedFrequencies(prev => [...prev, frequencyId]);
        toast.success('Frequency saved to favorites');
      }
    } catch (error) {
      console.error('Error toggling saved frequency:', error);
      toast.error('Failed to update favorites');
    }
  };

  // Toggle playing a frequency
  const togglePlayFrequency = (frequency: FrequencyLibraryItem) => {
    console.log("Toggling play for frequency:", frequency.id);
    
    // Check if this is the currently playing frequency
    if (playingFrequencyId === frequency.id && isPlaying) {
      console.log("Pausing current frequency");
      togglePlayPause();
      return;
    }
    
    // Get a valid audio source
    const audioSource = frequency.audio_url || frequency.url || 
      `https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/frequency-assets/${frequency.frequency}Hz.mp3`;
    
    console.log("Playing frequency with source:", audioSource);
    
    // Play the audio
    playAudio({
      title: `${frequency.frequency}Hz - ${frequency.title}`,
      artist: "Sacred Shifter",
      source: audioSource,
      frequency: frequency.frequency,
      chakra: frequency.chakra,
      id: frequency.id
    });
    
    setPlayingFrequencyId(frequency.id);
  };

  // Filter frequencies based on search and active tab
  const filteredFrequencies = frequencies.filter(freq => {
    // Apply search filter first
    const matchesSearch = 
      freq.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      freq.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(freq.frequency).includes(searchQuery);
    
    if (!matchesSearch) return false;
    
    // Apply tab filter
    if (activeTab === 'all') return true;
    if (activeTab === 'saved') return savedFrequencies.includes(freq.id);
    
    // For chakra tabs
    const chakraTab = activeTab.toLowerCase();
    return freq.chakra?.toLowerCase() === chakraTab;
  });

  return (
    <AppShell 
      pageTitle="Frequency Engine" 
      chakraColor="#6366F1" // Indigo color for frequency engine
    >
      <div className="relative z-10 p-6">
        <div className="flex justify-between items-center mb-6 flex-col sm:flex-row">
          <h1 className="text-3xl font-bold text-white mb-4 sm:mb-0">Frequency Engine</h1>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search frequencies..." 
              className="pl-10 bg-black/30 border-white/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="bg-black/30 border border-white/20">
            <TabsTrigger value="all">All Frequencies</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
            <TabsTrigger value="root">Root</TabsTrigger>
            <TabsTrigger value="sacral">Sacral</TabsTrigger>
            <TabsTrigger value="solar plexus">Solar Plexus</TabsTrigger>
            <TabsTrigger value="heart">Heart</TabsTrigger>
            <TabsTrigger value="throat">Throat</TabsTrigger>
            <TabsTrigger value="third eye">Third Eye</TabsTrigger>
            <TabsTrigger value="crown">Crown</TabsTrigger>
          </TabsList>

          {/* Common content for all tabs */}
          <div className="mt-6">
            {loading ? (
              <div className="flex justify-center items-center min-h-[200px]">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredFrequencies.length === 0 ? (
              <Card className="bg-black/40 border-indigo-500/30">
                <CardContent className="p-6 text-center">
                  <p className="text-white/70">No frequencies found matching your criteria.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFrequencies.map((frequency) => {
                  const isCurrentlyPlaying = playingFrequencyId === frequency.id && isPlaying;
                  return (
                    <Card 
                      key={frequency.id} 
                      className={`backdrop-blur-sm ${liftTheVeil ? 'bg-pink-950/20 border-pink-500/30' : 'bg-indigo-950/20 border-indigo-500/30'}`}
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-xl font-semibold text-white">
                              {frequency.frequency}Hz
                            </h3>
                            <p className="text-white/70 text-sm">{frequency.title}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSaveFrequency(frequency.id)}
                            className="hover:bg-white/10"
                            disabled={!user}
                          >
                            {savedFrequencies.includes(frequency.id) ? (
                              <Bookmark className="h-5 w-5 text-yellow-400" />
                            ) : (
                              <BookmarkPlus className="h-5 w-5 text-white/70" />
                            )}
                          </Button>
                        </div>
                        
                        {frequency.description && (
                          <p className="text-white/70 text-sm mb-4">{frequency.description}</p>
                        )}
                        
                        {frequency.chakra && (
                          <div 
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-3"
                            style={{ 
                              backgroundColor: `${chakraMap[frequency.chakra]}30`,
                              color: chakraMap[frequency.chakra],
                              borderColor: `${chakraMap[frequency.chakra]}50`,
                              borderWidth: '1px'
                            }}
                          >
                            {frequency.chakra} Chakra
                          </div>
                        )}
                        
                        <div className="relative w-full h-32 mb-4 overflow-hidden rounded-md bg-black/30">
                          <JourneyAwareSpiralVisualizer 
                            journeyId={frequency.id} 
                            showControls={false}
                            containerId={`freq-${frequency.id}`}
                            className="absolute inset-0"
                          />
                        </div>
                        
                        <Button 
                          className="w-full"
                          variant={isCurrentlyPlaying ? "outline" : "default"}
                          onClick={() => togglePlayFrequency(frequency)}
                        >
                          {isCurrentlyPlaying ? (
                            <>
                              <Pause className="h-4 w-4 mr-2" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Play Frequency
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </Tabs>
      </div>
    </AppShell>
  );
};

export default FrequencyEnginePage;
