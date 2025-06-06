
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FrequencyLibraryItem } from "@/types/frequencies";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { ChakraIcon } from "./ChakraIcon";
import WaveformVisualizer from "./WaveformVisualizer";
import { 
  Play, Pause, Volume2, VolumeX, Repeat, SkipForward, 
  SkipBack, MessageCircle, Layers, Info, Heart
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from 'sonner';

// Define interfaces for the feedback data
interface FrequencyFeedback {
  id: string;
  track_id: string;
  user_id: string | null;
  name: string;
  comment: string;
  created_at: string;
}

interface FractalVisual {
  id: string;
  frequency: number;
  chakra: string | null;
  principle: string | null;
  visual_url: string | null;
}

const FrequencyExperiencePlayer = () => {
  const { frequencyId } = useParams<{ frequencyId: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [showFractal, setShowFractal] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [volume, setVolume] = useState(0.8);
  const [isLooping, setIsLooping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const previousVolumeRef = useRef(volume);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioInitializedRef = useRef(false);
  
  // Audio player hook
  const { 
    isAudioPlaying,
    togglePlayPause, 
    setAudioSource,
    currentAudioTime,
    duration,
    seekTo,
    audioRef,
    audioLoaded,
    audioError
  } = useAudioPlayer();

  // Fetch frequency data
  const { data: frequency, isLoading: isLoadingFrequency } = useQuery({
    queryKey: ["frequency", frequencyId],
    queryFn: async () => {
      if (!frequencyId) return null;
      
      const { data, error } = await supabase
        .from("frequency_library")
        .select("*")
        .eq("id", frequencyId)
        .single();
      
      if (error) throw error;
      return data as FrequencyLibraryItem;
    },
    enabled: !!frequencyId
  });

  // Fetch associated fractal visual
  const { data: fractalVisual } = useQuery({
    queryKey: ["fractal", frequency?.frequency, frequency?.chakra, frequency?.principle],
    queryFn: async () => {
      if (!frequency) return null;
      
      const query = supabase
        .from("fractal_visuals")
        .select("*");
      
      if (frequency.frequency) {
        query.eq("frequency", frequency.frequency);
      } else if (frequency.chakra) {
        query.eq("chakra", frequency.chakra);
      } else if (frequency.principle) {
        query.eq("principle", frequency.principle);
      } else {
        return null;
      }
      
      const { data, error } = await query.limit(1);
      
      if (error || !data || data.length === 0) {
        // Fallback to any fractal
        const { data: anyFractal } = await supabase
          .from("fractal_visuals")
          .select("*")
          .limit(1);
          
        return anyFractal?.[0] || null;
      }
      
      return data[0] as FractalVisual;
    },
    enabled: !!frequency
  });

  // Fetch comments/testimonials for this frequency
  const { data: comments, isLoading: isLoadingComments, refetch: refetchComments } = useQuery({
    queryKey: ["comments", frequencyId],
    queryFn: async () => {
      if (!frequencyId) return [];
      
      // Use direct query since the function might not be available yet
      const { data, error } = await supabase
        .from('frequency_feedback')
        .select('*')
        .eq('track_id', frequencyId)
        .order('created_at', { ascending: false });
          
      if (error) {
        console.error("Error fetching comments:", error);
        throw error;
      }
      
      return data as FrequencyFeedback[] || [];
    },
    enabled: !!frequencyId
  });

  // Set audio source when frequency data is loaded
  useEffect(() => {
    if (!audioInitializedRef.current && frequency && (frequency.audio_url || frequency.url)) {
      const audioSource = frequency.audio_url || frequency.url;
      if (audioSource) {
        console.log("FrequencyExperiencePlayer: Setting audio source to", audioSource);
        setAudioSource(audioSource);
        audioInitializedRef.current = true;
      }
    }
  }, [frequency, setAudioSource]);

  // Handle looping
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLooping;
      console.log("FrequencyExperiencePlayer: Set audio loop to", isLooping);
    }
  }, [isLooping, audioRef]);

  // Format time in mm:ss
  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Handle volume changes
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      console.log("FrequencyExperiencePlayer: Set volume to", newVolume);
    }
    
    if (isMuted && newVolume > 0) {
      setIsMuted(false);
    }
  };

  // Handle mute toggle
  const toggleMute = () => {
    if (audioRef.current) {
      if (!isMuted) {
        previousVolumeRef.current = volume;
        setVolume(0);
        audioRef.current.volume = 0;
      } else {
        const restoreVolume = previousVolumeRef.current || 0.5;
        setVolume(restoreVolume);
        audioRef.current.volume = restoreVolume;
      }
      setIsMuted(!isMuted);
      console.log("FrequencyExperiencePlayer: Toggled mute to", !isMuted);
    }
  };

  // Handle errors in audio loading
  useEffect(() => {
    if (audioError) {
      toast({
        title: "Audio Error",
        description: "There was a problem loading the audio. Please try again.",
        variant: "destructive"
      });
      console.error("FrequencyExperiencePlayer: Audio error detected", audioError);
    }
  }, [audioError, toast]);

  // Handle comment submission
  const handleSubmitComment = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to leave a comment",
        variant: "destructive"
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: "Empty comment",
        description: "Please enter a comment before submitting",
        variant: "destructive"
      });
      return;
    }

    try {
      // Use raw SQL query to insert the comment
      const { error } = await supabase
        .from('frequency_feedback')
        .insert({
          track_id: frequencyId,
          user_id: user.id,
          name: user.user_metadata?.name || "Anonymous",
          comment: newComment.trim()
        });
      
      if (error) throw error;
      
      toast({
        title: "Comment submitted",
        description: "Thank you for sharing your experience!",
      });
      
      setNewComment("");
      refetchComments();
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast({
        title: "Error submitting comment",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  // Handle playback control
  const handlePlayPause = () => {
    if (audioLoaded || audioRef.current?.src) {
      togglePlayPause();
      console.log("FrequencyExperiencePlayer: Toggled playback to", !isAudioPlaying);
    } else if (frequency?.audio_url || frequency?.url) {
      // Try to set the source again if not loaded
      const audioSource = frequency.audio_url || frequency.url;
      console.log("FrequencyExperiencePlayer: Setting audio source again:", audioSource);
      setAudioSource(audioSource);
      // Wait a bit and then try to play
      setTimeout(() => {
        togglePlayPause();
      }, 100);
    } else {
      toast({
        title: "No Audio Available",
        description: "This frequency doesn't have an audio file assigned.",
        variant: "destructive"
      });
    }
  };

  // Determine chakra color class for styling
  const getChakraColorClass = () => {
    if (!frequency?.chakra) return "from-purple-400 to-blue-500";
    
    const chakra = frequency.chakra.toLowerCase();
    switch (chakra) {
      case 'root': return "from-red-500 to-red-600";
      case 'sacral': return "from-orange-400 to-orange-500";
      case 'solar plexus': return "from-yellow-400 to-yellow-500";
      case 'heart': return "from-green-400 to-green-500";
      case 'throat': return "from-blue-400 to-blue-500";
      case 'third eye': return "from-indigo-400 to-indigo-500";
      case 'crown': return "from-purple-400 to-violet-500";
      default: return "from-purple-400 to-blue-500";
    }
  };

  if (isLoadingFrequency) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!frequency) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <h3 className="text-xl font-semibold mb-2">Frequency Not Found</h3>
        <p className="text-gray-500">The frequency you're looking for doesn't exist or has been moved.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4">
      <Card className="overflow-hidden bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl">
        {showFractal && fractalVisual && (
          <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden">
            <img 
              src={fractalVisual.visual_url || ''} 
              alt="Fractal Visual" 
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-3 right-3 text-white bg-black/20 hover:bg-black/40"
              onClick={() => setShowFractal(false)}
            >
              <Layers className="h-4 w-4 mr-1" />
              Hide Visual
            </Button>
          </div>
        )}
        
        {!showFractal && (
          <Button 
            variant="outline" 
            className="m-4"
            onClick={() => setShowFractal(true)}
          >
            <Layers className="h-4 w-4 mr-1" />
            Show Fractal Visual
          </Button>
        )}

        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start gap-4">
            <div className="md:w-1/4 flex flex-col items-center">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center bg-gradient-to-br ${getChakraColorClass()} mb-2`}>
                <ChakraIcon chakra={frequency.chakra || ""} className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-center">{frequency.frequency} Hz</h2>
              {frequency.chakra && (
                <Badge className="mt-1">{frequency.chakra} Chakra</Badge>
              )}
            </div>
            
            <div className="md:w-3/4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold">{frequency.title}</h1>
                  {frequency.description && (
                    <p className="text-gray-600 mt-1">{frequency.description}</p>
                  )}
                </div>
                <Button variant="ghost" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {frequency.principle && (
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    {frequency.principle} Principle
                  </Badge>
                )}
                {frequency.tags && frequency.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              {/* Waveform Visualizer */}
              <div className={`relative w-full h-24 mb-4 rounded-md overflow-hidden border border-${frequency.chakra ? frequency.chakra.toLowerCase().replace(' ', '-') : 'purple'}-300`}>
                <WaveformVisualizer 
                  canvasRef={canvasRef}
                  isPlaying={isAudioPlaying}
                  frequencyHz={frequency.frequency || 432}
                  chakra={frequency.chakra || undefined}
                />
                
                {/* Time progress bar overlay */}
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" 
                  style={{ width: `${(currentAudioTime / (duration || 1)) * 100}%` }}>
                </div>
              </div>
              
              {/* Audio Controls */}
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handlePlayPause}
                      disabled={audioError !== null}
                    >
                      {isAudioPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setIsLooping(!isLooping)}
                      disabled={audioError !== null}
                    >
                      <Repeat className={`h-5 w-5 ${isLooping ? 'text-purple-500' : ''}`} />
                    </Button>
                    <div className="flex items-center space-x-1 min-w-20">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={toggleMute}
                        disabled={audioError !== null}
                      >
                        {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                      </Button>
                      <div className="w-16">
                        <Slider
                          value={[volume]}
                          min={0}
                          max={1}
                          step={0.01}
                          onValueChange={handleVolumeChange}
                          disabled={audioError !== null}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    {formatTime(currentAudioTime)} / {formatTime(duration)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs for Comments/Info */}
          <Tabs defaultValue="benefits" className="mt-8">
            <TabsList>
              <TabsTrigger value="benefits">
                <Info className="h-4 w-4 mr-2" />
                Benefits
              </TabsTrigger>
              <TabsTrigger value="comments">
                <MessageCircle className="h-4 w-4 mr-2" />
                Testimonials ({comments && Array.isArray(comments) ? comments.length : 0})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="benefits" className="p-4">
              <h3 className="text-lg font-medium mb-2">Benefits of {frequency.frequency} Hz</h3>
              {frequency.affirmation && (
                <div className="mb-4">
                  <h4 className="font-medium text-sm text-gray-500 mb-1">Affirmation</h4>
                  <p className="italic">"{frequency.affirmation}"</p>
                </div>
              )}
              <div className="prose prose-sm max-w-none">
                {frequency.description ? (
                  <p>{frequency.description}</p>
                ) : (
                  <p>This frequency helps align and balance your energy centers, promoting harmony and well-being.</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="comments" className="p-4">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Share Your Experience</h3>
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="How did this frequency make you feel?"
                  className="mb-2"
                />
                <Button onClick={handleSubmitComment}>
                  Submit Testimonial
                </Button>
              </div>
              
              <div className="space-y-4">
                {isLoadingComments ? (
                  <p>Loading comments...</p>
                ) : comments && Array.isArray(comments) && comments.length > 0 ? (
                  comments.map((comment: FrequencyFeedback) => (
                    <div key={comment.id} className="border-t pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{comment.name}</h4>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600">{comment.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No testimonials yet. Be the first to share your experience!</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FrequencyExperiencePlayer;
