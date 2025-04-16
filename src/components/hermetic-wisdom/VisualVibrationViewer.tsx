
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { FractalVisual, FrequencyLibraryItem } from "@/types/frequencies";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { 
  Play, Pause, Maximize2, Heart, Download, Music, 
  RefreshCw, PlusCircle, Info, ChevronRight, Volume2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";

interface VisualVibrationViewerProps {
  onVibrationalPairingSelect?: (visual: FractalVisual, audio?: FrequencyLibraryItem) => void;
}

const VisualVibrationViewer: React.FC<VisualVibrationViewerProps> = ({ 
  onVibrationalPairingSelect 
}) => {
  // State management
  const [fractals, setFractals] = useState<FractalVisual[]>([]);
  const [frequencyLibrary, setFrequencyLibrary] = useState<FrequencyLibraryItem[]>([]);
  const [selectedFractal, setSelectedFractal] = useState<FractalVisual | null>(null);
  const [matchedAudio, setMatchedAudio] = useState<FrequencyLibraryItem | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'chakra' | 'principle' | 'frequency'>('all');
  const [chakraFilter, setChakraFilter] = useState<string>('all');
  const [principleFilter, setPrincipleFilter] = useState<string>('all');
  const [frequencyFilter, setFrequencyFilter] = useState<string>('all');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  
  // Audio player hook
  const { audioRef, togglePlayPause, isAudioPlaying } = useAudioPlayer();
  
  // Video ref for managing playback
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Auth context for user information
  const { user } = useAuth();
  
  // Fullscreen element ref
  const fullscreenRef = useRef<HTMLDivElement>(null);
  
  // Fetch fractal visuals and frequency library data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Fetch fractals
        const { data: fractalData, error: fractalError } = await supabase
          .from("fractal_visuals")
          .select("*")
          .order("frequency", { ascending: true });
          
        if (fractalError) throw fractalError;
        
        // Fetch frequency library
        const { data: frequencyData, error: frequencyError } = await supabase
          .from("frequency_library")
          .select("*")
          .order("frequency", { ascending: true });
          
        if (frequencyError) throw frequencyError;
        
        setFractals(fractalData || []);
        setFrequencyLibrary(frequencyData || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to load visuals and frequencies");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Handle video play/pause
  useEffect(() => {
    if (!videoRef.current || !selectedFractal) return;
    
    if (isPlaying) {
      videoRef.current.play().catch(e => {
        console.error("Failed to play video:", e);
      });
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying, selectedFractal]);
  
  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!fullscreenRef.current) return;
    
    if (!document.fullscreenElement) {
      fullscreenRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };
  
  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // Find matching audio for a fractal
  const findMatchingAudio = (fractal: FractalVisual) => {
    // Match by exact frequency
    let match = frequencyLibrary.find(item => 
      item.frequency === fractal.frequency
    );
    
    // If no exact match, try to find close frequency
    if (!match) {
      match = frequencyLibrary.find(item => 
        item.chakra === fractal.chakra || 
        item.principle === fractal.principle
      );
    }
    
    return match || null;
  };
  
  // Handle fractal selection
  const handleFractalSelect = (fractal: FractalVisual) => {
    setSelectedFractal(fractal);
    setIsPlaying(true);
    
    // Find matching audio if any
    const audioMatch = findMatchingAudio(fractal);
    setMatchedAudio(audioMatch);
  };
  
  // Add pair to journey
  const handleAddToJourney = () => {
    if (!selectedFractal) return;
    
    try {
      if (!user) {
        toast.error("Please sign in to add to journey");
        return;
      }
      
      toast.success("Added to your journey", {
        description: "Visual and sound pairing saved"
      });
      
      // Call the callback if provided
      if (onVibrationalPairingSelect && selectedFractal) {
        onVibrationalPairingSelect(selectedFractal, matchedAudio || undefined);
      }
      
    } catch (err) {
      console.error("Error adding to journey:", err);
      toast.error("Failed to add to journey");
    }
  };
  
  // Save to timeline
  const saveToTimeline = async () => {
    if (!selectedFractal || !user) {
      toast.error("Please sign in to save to timeline");
      return;
    }
    
    try {
      const { error } = await supabase
        .from('timeline_snapshots')
        .insert({
          user_id: user.id,
          title: `Fractal: ${selectedFractal.title || `${selectedFractal.frequency}Hz Fractal`}`,
          frequency: selectedFractal.frequency,
          chakra: selectedFractal.chakra,
          tag: 'fractal',
          visual_type: selectedFractal.type,
          notes: `Fractal visual for ${selectedFractal.frequency}Hz frequency${selectedFractal.principle ? ` / ${selectedFractal.principle} principle` : ''}`
        });
      
      if (error) throw error;
      
      toast.success("Saved to your timeline");
    } catch (err) {
      console.error("Error saving to timeline:", err);
      toast.error("Failed to save to timeline");
    }
  };
  
  // Toggle audio playback
  const toggleAudio = () => {
    if (matchedAudio?.audio_url || matchedAudio?.url) {
      togglePlayPause();
    }
  };
  
  // Filter fractals based on selected filters
  const filteredFractals = fractals.filter(fractal => {
    if (activeFilter === 'all') return true;
    
    if (activeFilter === 'chakra' && chakraFilter !== 'all') {
      return fractal.chakra?.toLowerCase() === chakraFilter.toLowerCase();
    }
    
    if (activeFilter === 'principle' && principleFilter !== 'all') {
      return fractal.principle?.toLowerCase() === principleFilter.toLowerCase();
    }
    
    if (activeFilter === 'frequency' && frequencyFilter !== 'all') {
      return fractal.frequency === parseInt(frequencyFilter);
    }
    
    return true;
  });
  
  // Get unique chakras, principles and frequencies for filters
  const uniqueChakras = Array.from(
    new Set(fractals.map(f => f.chakra).filter(Boolean) as string[])
  ).sort();
  
  const uniquePrinciples = Array.from(
    new Set(fractals.map(f => f.principle).filter(Boolean) as string[])
  ).sort();
  
  const uniqueFrequencies = Array.from(
    new Set(fractals.map(f => f.frequency).filter(Boolean) as number[])
  ).sort((a, b) => a - b);
  
  // Get style for chakra color
  const getChakraColor = (chakra: string = ""): string => {
    switch (chakra.toLowerCase()) {
      case 'root': return 'from-red-500 to-red-600';
      case 'sacral': return 'from-orange-400 to-orange-500';
      case 'solar plexus': return 'from-yellow-400 to-yellow-500';
      case 'heart': return 'from-green-400 to-green-500';
      case 'throat': return 'from-blue-400 to-blue-500';
      case 'third eye': return 'from-indigo-400 to-indigo-500';
      case 'crown': return 'from-purple-400 to-violet-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };
  
  // Get animation class based on fractal type
  const getAnimationClass = (type?: string): string => {
    if (type === 'animation') {
      return 'animate-pulse';
    }
    return '';
  };
  
  // Find a smart pairing suggestion
  const getSmartPairingSuggestion = () => {
    if (!selectedFractal) return null;
    
    // Find tracks with the same frequency, chakra or principle
    const suggestedTracks = frequencyLibrary.filter(item => 
      (item.frequency === selectedFractal.frequency) ||
      (item.chakra === selectedFractal.chakra) ||
      (item.principle === selectedFractal.principle)
    );
    
    if (suggestedTracks.length === 0) return null;
    
    // Sort by relevance (matching both frequency and chakra/principle is best)
    suggestedTracks.sort((a, b) => {
      const aScore = (a.frequency === selectedFractal.frequency ? 3 : 0) +
                    (a.chakra === selectedFractal.chakra ? 2 : 0) + 
                    (a.principle === selectedFractal.principle ? 2 : 0);
                    
      const bScore = (b.frequency === selectedFractal.frequency ? 3 : 0) +
                    (b.chakra === selectedFractal.chakra ? 2 : 0) + 
                    (b.principle === selectedFractal.principle ? 2 : 0);
                    
      return bScore - aScore;
    });
    
    return suggestedTracks[0];
  };
  
  // Find and select a suggested audio track for matching
  const handleFindMatchingAudio = () => {
    if (!selectedFractal) return;
    
    const suggestion = getSmartPairingSuggestion();
    if (suggestion) {
      setMatchedAudio(suggestion);
      toast.success(`Matched with "${suggestion.title}"`, {
        description: `${suggestion.frequency}Hz - ${suggestion.chakra || ''} ${suggestion.principle || ''}`
      });
    } else {
      toast.info("No perfect match found in the library");
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Main viewer card */}
      <Card className="border border-purple-200 bg-white/80 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center gap-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-500">
              Visual Vibration Viewer
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Filters section */}
          <div className="px-6 py-4 border-b border-gray-100">
            <Tabs 
              value={activeFilter} 
              onValueChange={(val) => setActiveFilter(val as 'all' | 'chakra' | 'principle' | 'frequency')}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4 mb-4">
                <TabsTrigger value="all">All Visuals</TabsTrigger>
                <TabsTrigger value="chakra">By Chakra</TabsTrigger>
                <TabsTrigger value="principle">By Principle</TabsTrigger>
                <TabsTrigger value="frequency">By Frequency</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <p className="text-sm text-gray-600">
                  View all fractal visuals in the library. Each visual resonates with a specific frequency and principle.
                </p>
              </TabsContent>
              
              <TabsContent value="chakra">
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-gray-600 mb-2">
                    Select a chakra to view associated fractal visuals:
                  </p>
                  <Select value={chakraFilter} onValueChange={setChakraFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Chakra" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Chakras</SelectItem>
                      {uniqueChakras.map(chakra => (
                        <SelectItem key={chakra} value={chakra.toLowerCase()}>
                          {chakra}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              
              <TabsContent value="principle">
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-gray-600 mb-2">
                    Select a Hermetic principle to view associated fractal visuals:
                  </p>
                  <Select value={principleFilter} onValueChange={setPrincipleFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Principle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Principles</SelectItem>
                      {uniquePrinciples.map(principle => (
                        <SelectItem key={principle} value={principle.toLowerCase()}>
                          {principle}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              
              <TabsContent value="frequency">
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-gray-600 mb-2">
                    Select a frequency to view associated fractal visuals:
                  </p>
                  <Select value={frequencyFilter} onValueChange={setFrequencyFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Frequencies</SelectItem>
                      {uniqueFrequencies.map(frequency => (
                        <SelectItem key={frequency} value={frequency.toString()}>
                          {frequency}Hz
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Fractals grid */}
          {isLoading ? (
            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-pulse">
                {Array(8).fill(0).map((_, i) => (
                  <div key={i} className="h-40 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          ) : filteredFractals.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No fractal visuals found for the selected filter</p>
            </div>
          ) : (
            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredFractals.map((fractal) => (
                  <div 
                    key={fractal.id}
                    className="relative group cursor-pointer rounded-lg overflow-hidden"
                    onClick={() => handleFractalSelect(fractal)}
                  >
                    <div className="relative aspect-square">
                      {fractal.type === 'animation' ? (
                        <video 
                          src={fractal.visual_url} 
                          className="absolute inset-0 w-full h-full object-cover"
                          muted
                          loop
                          playsInline
                          onMouseOver={(e) => e.currentTarget.play()}
                          onMouseOut={(e) => e.currentTarget.pause()}
                        />
                      ) : (
                        <div 
                          className={`absolute inset-0 bg-cover bg-center ${getAnimationClass(fractal.type)}`} 
                          style={{ backgroundImage: `url(${fractal.visual_url})` }}
                        />
                      )}
                    </div>
                    
                    {/* Overlay with information */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                      <div className="text-white">
                        <h3 className="font-medium truncate">
                          {fractal.title || `${fractal.frequency}Hz Fractal`}
                        </h3>
                        
                        <div className="flex flex-wrap gap-1 mt-1">
                          {fractal.frequency && (
                            <Badge variant="outline" className="bg-black/50 text-white text-xs">
                              {fractal.frequency}Hz
                            </Badge>
                          )}
                          
                          {fractal.principle && (
                            <Badge variant="outline" className="bg-black/50 text-white text-xs">
                              {fractal.principle}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Chakra badge */}
                    {fractal.chakra && (
                      <Badge
                        className={`absolute top-2 right-2 bg-gradient-to-r ${getChakraColor(fractal.chakra)}`}
                      >
                        {fractal.chakra}
                      </Badge>
                    )}
                    
                    {/* Animation indicator */}
                    {fractal.type === 'animation' && (
                      <Badge
                        className="absolute bottom-2 right-2 bg-black/50"
                        variant="outline"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Animated
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Selected fractal viewer */}
      {selectedFractal && (
        <Card className="border border-purple-300 bg-white/90 backdrop-blur-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Visual side */}
            <div className="relative overflow-hidden" style={{ minHeight: "300px" }}>
              {selectedFractal.type === 'animation' ? (
                <video 
                  ref={videoRef}
                  src={selectedFractal.visual_url}
                  className="w-full h-full object-cover aspect-square"
                  muted
                  loop
                  playsInline
                  autoPlay
                />
              ) : (
                <div 
                  className="w-full h-full bg-cover bg-center aspect-square"
                  style={{ backgroundImage: `url(${selectedFractal.visual_url})` }}
                />
              )}
              
              {/* Play/pause overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Button
                  variant="secondary"
                  size="icon"
                  className="bg-black/30 text-white hover:bg-black/50"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPlaying(!isPlaying);
                  }}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </Button>
              </div>
              
              {/* Chakra overlay */}
              {selectedFractal.chakra && (
                <div 
                  className={`absolute inset-0 bg-gradient-to-t ${getChakraColor(selectedFractal.chakra)} opacity-10`}
                />
              )}
            </div>
            
            {/* Info side */}
            <div className="p-6 flex flex-col">
              <h3 className="text-xl font-medium mb-2">
                {selectedFractal.title || `${selectedFractal.frequency}Hz Fractal`}
              </h3>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-purple-500">
                  {selectedFractal.frequency}Hz
                </Badge>
                
                {selectedFractal.chakra && (
                  <Badge className={`bg-gradient-to-r ${getChakraColor(selectedFractal.chakra)}`}>
                    {selectedFractal.chakra} Chakra
                  </Badge>
                )}
                
                {selectedFractal.principle && (
                  <Badge variant="outline" className="bg-indigo-100 text-indigo-800 border-indigo-300">
                    {selectedFractal.principle} Principle
                  </Badge>
                )}
                
                {selectedFractal.prime_number && (
                  <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
                    Prime {selectedFractal.prime_number}
                  </Badge>
                )}
              </div>
              
              {selectedFractal.notes && (
                <p className="text-gray-600 text-sm mb-4">
                  {selectedFractal.notes}
                </p>
              )}
              
              {/* Smart pairing section */}
              <div className="mt-auto">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <RefreshCw className="w-4 h-4 mr-1" /> Vibrational Pairing
                </h4>
                
                <div className="flex gap-2 mb-4">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={handleFindMatchingAudio}
                    className="text-sm"
                  >
                    <Music className="w-4 h-4 mr-1" />
                    Match with Sound
                  </Button>
                  
                  {matchedAudio && (
                    <Button
                      variant={isAudioPlaying ? "default" : "secondary"}
                      size="sm"
                      onClick={toggleAudio}
                      className="text-sm"
                    >
                      {isAudioPlaying ? (
                        <>
                          <Pause className="w-4 h-4 mr-1" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-1" />
                          Play
                        </>
                      )}
                    </Button>
                  )}
                </div>
                
                {/* Matched audio info */}
                {matchedAudio && (
                  <div className="bg-purple-50 rounded-lg p-3 mb-4">
                    <h5 className="font-medium text-sm flex items-center mb-1">
                      <Info className="w-4 h-4 mr-1 text-purple-500" />
                      <span>Matched Audio Track:</span>
                    </h5>
                    
                    <p className="text-sm mb-2">
                      "{matchedAudio.title}" - {matchedAudio.frequency}Hz
                    </p>
                    
                    {isAudioPlaying && (
                      <div className="flex items-center gap-2">
                        <Volume2 className="h-4 w-4 text-purple-500" />
                        <Slider
                          value={[volume * 100]}
                          min={0}
                          max={100}
                          step={1}
                          onValueChange={(vals) => setVolume(vals[0] / 100)}
                          className="w-24"
                        />
                      </div>
                    )}
                    
                    <audio 
                      ref={audioRef}
                      src={matchedAudio.audio_url || matchedAudio.url || ''}
                      loop
                    />
                  </div>
                )}
                
                {/* Action buttons */}
                <div className="flex gap-3 mt-4">
                  <Button 
                    variant="default"
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                    onClick={handleAddToJourney}
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add to Journey
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={saveToTimeline}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Save to Timeline
                  </Button>
                  
                  <Button 
                    variant="secondary"
                    onClick={toggleFullscreen}
                    size="icon"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
      
      {/* Fullscreen mode */}
      {selectedFractal && (
        <div 
          ref={fullscreenRef}
          className={`fixed inset-0 z-50 bg-black ${isFullscreen ? 'block' : 'hidden'}`}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <AnimatePresence>
              {selectedFractal.type === 'animation' ? (
                <motion.video
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  src={selectedFractal.visual_url}
                  className="w-full h-full object-contain"
                  autoPlay
                  loop
                  muted
                />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full bg-contain bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${selectedFractal.visual_url})` }}
                />
              )}
            </AnimatePresence>
            
            {/* Fullscreen overlay controls */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 bg-black/30 backdrop-blur-sm rounded-full p-2">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                {isPlaying ? "Pause" : "Play"}
              </Button>
              
              {matchedAudio && (
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={toggleAudio}
                >
                  {isAudioPlaying ? (
                    <>
                      <Volume2 className="mr-2 h-4 w-4 text-purple-300" />
                      Mute Audio
                    </>
                  ) : (
                    <>
                      <Music className="mr-2 h-4 w-4" />
                      Play Audio
                    </>
                  )}
                </Button>
              )}
              
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={toggleFullscreen}
              >
                Exit Fullscreen
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualVibrationViewer;
