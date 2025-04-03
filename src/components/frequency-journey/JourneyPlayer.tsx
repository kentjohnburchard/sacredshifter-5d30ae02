
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FrequencyLibraryItem } from "@/types/frequencies";
import FrequencyPlayer from "@/components/FrequencyPlayer";
import { Badge } from "@/components/ui/badge";
import AnimatedBackground from "@/components/AnimatedBackground";
import { formatDuration } from "@/utils/formatters";

interface JourneyPlayerProps {
  frequency: FrequencyLibraryItem;
  onSessionStart: (intention: string) => void;
  onReflectionSubmit: (reflection: string) => void;
  currentIntention: string;
  sessionId: string | null;
}

export const JourneyPlayer: React.FC<JourneyPlayerProps> = ({
  frequency,
  onSessionStart,
  onReflectionSubmit,
  currentIntention,
  sessionId
}) => {
  const [intention, setIntention] = useState("");
  const [reflection, setReflection] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  
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

  // Determine background color based on chakra
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

  const bgGradient = getBackgroundColor(frequency.chakra);

  return (
    <div className="relative min-h-[80vh]">
      <AnimatedBackground 
        colorScheme={bgGradient} 
        isPlaying={isPlaying} // Pass isPlaying as a prop instead of isActive
      />
      
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
                  {frequency.length && (
                    <Badge variant="outline" className="text-white/80 border-white/20">
                      {formatDuration(frequency.length)}
                    </Badge>
                  )}
                </div>
              </div>
              
              {frequency.audio_url && (
                <FrequencyPlayer 
                  audioUrl={frequency.audio_url}
                  isPlaying={isPlaying}
                  onPlayToggle={handlePlayToggle}
                />
              )}
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
      </div>
    </div>
  );
};

export default JourneyPlayer;
