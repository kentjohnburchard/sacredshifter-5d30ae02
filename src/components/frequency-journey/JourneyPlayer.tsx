import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FrequencyLibraryItem, FractalVisual } from "@/types/frequencies";
import FrequencyPlayer from "@/components/FrequencyPlayer";
import { Badge } from "@/components/ui/badge";
import AnimatedBackground from "@/components/AnimatedBackground";
import { formatDuration } from "@/utils/formatters";
import { supabase } from "@/integrations/supabase/client";
import { Maximize2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface JourneyPlayerProps {
  frequency: FrequencyLibraryItem;
  onSessionStart: (intention: string) => void;
  onReflectionSubmit: (reflection: string) => void;
  currentIntention: string;
  sessionId: string | null;
  audioGroupId?: string | null;
}

export const JourneyPlayer: React.FC<JourneyPlayerProps> = ({
  frequency,
  onSessionStart,
  onReflectionSubmit,
  currentIntention,
  sessionId,
  audioGroupId
}) => {
  const [intention, setIntention] = useState("");
  const [reflection, setReflection] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [fractalVisual, setFractalVisual] = useState<FractalVisual | null>(null);
  const [showFractalDialog, setShowFractalDialog] = useState(false);
  
  useEffect(() => {
    const fetchFractalVisual = async () => {
      try {
        const { data, error } = await supabase
          .from("fractal_visuals")
          .select("*")
          .eq("frequency", frequency.frequency)
          .maybeSingle();

        if (error) {
          console.error("Error fetching fractal visual:", error);
          return;
        }

        if (data) {
          setFractalVisual(data);
          frequency.fractal_visual = data;
        }
      } catch (err) {
        console.error("Failed to fetch fractal visual:", err);
      }
    };

    fetchFractalVisual();
  }, [frequency.frequency]);
  
  const handleStartSession = () => {
    if (intention.trim().length > 0) {
      onSessionStart(intention);
    }
  };

  const handleSubmitReflection = () => {
    if (reflection.trim().length > 0) {
      onReflectionSubmit(reflection);
      setReflection("");
    }
  };

  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
  };

  const getBackgroundColor = (chakra: string) => {
    switch (chakra.toLowerCase()) {
      case 'root': return 'from-red-900 to-red-600';
      case 'sacral': return 'from-orange-800 to-orange-500';
      case 'solar plexus': return 'from-yellow-800 to-yellow-500';
      case 'heart': return 'from-green-800 to-green-500';
      case 'throat': return 'from-blue-800 to-blue-500';
      case 'third eye': return 'from-indigo-800 to-indigo-600';
      case 'crown': return 'from-purple-800 to-violet-600';
      default: return 'from-purple-900 to-blue-600';
    }
  };

  const getFractalAnimationClass = (type?: string): string => {
    if (type === 'animation') {
      return 'animate-fractal-zoom';
    }
    return '';
  };

  const bgGradient = getBackgroundColor(frequency.chakra);

  return (
    <div className="relative min-h-[80vh]">
      {fractalVisual?.visual_url ? (
        <div 
          className={`absolute inset-0 z-0 bg-cover bg-center ${getFractalAnimationClass(fractalVisual.type)}`}
          style={{ backgroundImage: `url(${fractalVisual.visual_url})` }}
        >
          <div className={`absolute inset-0 bg-gradient-to-b from-black/30 to-black/70`}></div>
        </div>
      ) : (
        <div className="absolute inset-0 z-0">
          <AnimatedBackground 
            colorScheme={bgGradient.split(' ')[1]} 
            isActive={isPlaying} 
          />
        </div>
      )}
      
      <div className="relative z-10">
        <Card className="bg-black/40 backdrop-blur-md border border-white/10 text-white shadow-xl">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <CardTitle className="text-2xl font-light">
                  <span className="font-semibold">{frequency.frequency} Hz</span> - {frequency.title}
                </CardTitle>
                <div className="flex mt-2 gap-2">
                  <Badge className="bg-white/20">{frequency.chakra} Chakra</Badge>
                  {fractalVisual?.principle && (
                    <Badge variant="outline" className="text-white/80 border-white/20">
                      {fractalVisual.principle}
                    </Badge>
                  )}
                  {frequency.length && (
                    <Badge variant="outline" className="text-white/80 border-white/20">
                      {formatDuration(frequency.length)}
                    </Badge>
                  )}
                  {fractalVisual?.prime_number && (
                    <Badge variant="outline" className="bg-purple-500/30 text-white border-purple-300/50">
                      Prime {fractalVisual.prime_number}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {fractalVisual && (
                  <Button 
                    variant="outline"
                    size="sm"
                    className="text-white border-white/20 hover:bg-white/10"
                    onClick={() => setShowFractalDialog(true)}
                  >
                    <Maximize2 className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Expand Fractal</span>
                  </Button>
                )}
                
                {frequency.audio_url && (
                  <FrequencyPlayer 
                    audioUrl={frequency.audio_url}
                    isPlaying={isPlaying}
                    onPlayToggle={handlePlayToggle}
                    frequency={frequency.frequency}
                    frequencyId={frequency.id}
                    groupId={audioGroupId}
                  />
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {frequency.description && (
                <p className="text-white/80">{frequency.description}</p>
              )}
              
              {frequency.affirmation && (
                <div className="p-4 bg-white/10 rounded-lg">
                  <p className="text-lg font-medium text-center text-white italic">
                    "{frequency.affirmation}"
                  </p>
                </div>
              )}
            </div>
            
            {!sessionId ? (
              <div className="space-y-3">
                <h3 className="font-medium text-white/90">Set Your Intention for This Journey</h3>
                <Textarea
                  placeholder="What do you wish to experience or release in this frequency journey?"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  value={intention}
                  onChange={(e) => setIntention(e.target.value)}
                />
                <Button 
                  className="w-full bg-white/20 hover:bg-white/30 text-white" 
                  onClick={handleStartSession}
                >
                  Begin Journey
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-white/10 rounded-lg">
                  <h3 className="font-medium text-white/90">Your Intention</h3>
                  <p className="text-white/80 italic">"{currentIntention}"</p>
                </div>
                
                <div className="pt-4">
                  <h3 className="font-medium text-white/90 mb-2">Reflect on Your Experience</h3>
                  <Textarea
                    placeholder="What did you feel? What insights came to you?"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[100px]"
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                  />
                </div>
              </div>
            )}
          </CardContent>
          
          {sessionId && (
            <CardFooter>
              <Button 
                className="w-full bg-white/20 hover:bg-white/30 text-white"
                onClick={handleSubmitReflection}
                disabled={reflection.trim().length === 0}
              >
                Save Reflection
              </Button>
            </CardFooter>
          )}
        </Card>
        
        {fractalVisual && (
          <Dialog open={showFractalDialog} onOpenChange={setShowFractalDialog}>
            <DialogContent className="max-w-5xl h-full max-h-[90vh] p-0 overflow-hidden">
              <div className="relative w-full h-full">
                <div 
                  className={`absolute inset-0 bg-cover bg-center ${getFractalAnimationClass(fractalVisual.type)}`}
                  style={{ backgroundImage: `url(${fractalVisual.visual_url})` }}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                  <div className="text-white max-w-xl">
                    <h2 className="text-2xl font-semibold mb-2">
                      {fractalVisual.title || frequency.title || `${frequency.frequency}Hz Fractal`}
                    </h2>
                    
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <Badge variant="outline" className="border-white/30 text-white">
                        {frequency.frequency}Hz
                      </Badge>
                      <Badge variant="outline" className="border-white/30 text-white">
                        {frequency.chakra} Chakra
                      </Badge>
                      {fractalVisual.principle && (
                        <Badge variant="outline" className="border-white/30 text-white">
                          {fractalVisual.principle} Principle
                        </Badge>
                      )}
                      {fractalVisual.prime_number && (
                        <Badge variant="outline" className="border-purple-300 bg-purple-500/30 text-white">
                          Prime {fractalVisual.prime_number}
                        </Badge>
                      )}
                    </div>
                    
                    {fractalVisual.notes && (
                      <p className="text-white/80 mb-4">{fractalVisual.notes}</p>
                    )}
                    
                    {fractalVisual.formula && (
                      <div className="bg-black/30 p-3 rounded mb-4">
                        <p className="text-sm font-mono text-green-300">{fractalVisual.formula}</p>
                      </div>
                    )}
                    
                    <Button 
                      className="mt-4 bg-white text-purple-800 hover:bg-white/90"
                      onClick={() => setShowFractalDialog(false)}
                    >
                      Return to Journey
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default JourneyPlayer;
