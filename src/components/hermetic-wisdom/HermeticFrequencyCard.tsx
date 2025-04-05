import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Pause, Plus, Heart, Maximize2 } from "lucide-react";
import { FrequencyLibraryItem, FractalVisual } from "@/types/frequencies";
import { formatDuration } from "@/utils/formatters";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import FrequencyPlayer from "@/components/FrequencyPlayer";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface HermeticFrequencyCardProps {
  frequency: FrequencyLibraryItem;
}

const HermeticFrequencyCard: React.FC<HermeticFrequencyCardProps> = ({ frequency }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [fractalVisual, setFractalVisual] = useState<FractalVisual | null>(null);
  const [showFractalDialog, setShowFractalDialog] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const audioUrl = frequency.audio_url || frequency.url || "";

  useEffect(() => {
    const fetchFractalVisual = async () => {
      try {
        const { data, error } = await supabase
          .from("fractal_visuals")
          .select("*")
          .eq("frequency", frequency.frequency)
          .limit(1)
          .single();

        if (error) {
          if (error.code !== 'PGRST116') {
            console.error("Error fetching fractal visual:", error);
          }
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

  const getChakraColor = (chakra: string): string => {
    switch (chakra?.toLowerCase()) {
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

  const getChakraTextColor = (chakra: string): string => {
    switch (chakra?.toLowerCase()) {
      case 'root': return 'text-red-500';
      case 'sacral': return 'text-orange-500';
      case 'solar plexus': return 'text-yellow-500';
      case 'heart': return 'text-green-500';
      case 'throat': return 'text-blue-500';
      case 'third eye': return 'text-indigo-500';
      case 'crown': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  const getFractalAnimationClass = (type?: string): string => {
    if (type === 'animation') {
      return 'animate-fractal-pulse';
    }
    return '';
  };

  const handlePlayToggle = () => {
    if (!audioUrl) {
      toast.error("No audio available for this frequency");
      return;
    }
    
    setIsPlaying(!isPlaying);
  };

  const handleAddToJourney = () => {
    if (!user) {
      toast.error("Please sign in to add frequencies to your journey");
      return;
    }
    toast.success(`Added ${frequency.title} to your journey`);
  };

  const handleSave = () => {
    if (!user) {
      toast.error("Please sign in to save frequencies");
      return;
    }
    toast.success(`Saved ${frequency.title} to your library`);
  };

  const handleCardClick = () => {
    navigate(`/frequency/${frequency.id}`);
  };

  const handleExpandFractal = () => {
    setShowFractalDialog(true);
  };

  const saveFractalToTimeline = async () => {
    if (!user || !fractalVisual) return;
    
    try {
      const { error } = await supabase
        .from('timeline_snapshots')
        .insert({
          user_id: user.id,
          title: `Fractal: ${frequency.title || fractalVisual.title || `${frequency.frequency}Hz`}`,
          frequency: frequency.frequency,
          chakra: frequency.chakra,
          tag: 'fractal',
          visual_type: fractalVisual.type,
          notes: `Fractal visual for ${frequency.chakra} chakra / ${frequency.principle} principle`
        });
      
      if (error) throw error;
      
      toast.success("Fractal saved to your timeline");
    } catch (err) {
      console.error("Error saving fractal to timeline:", err);
      toast.error("Failed to save fractal to timeline");
    }
  };

  const chakraGradient = getChakraColor(frequency.chakra);
  const freqValue = typeof frequency.frequency === 'number' ? `${frequency.frequency} Hz` : frequency.frequency;

  return (
    <>
      <Card 
        className={`overflow-hidden border transition-all hover:shadow-md 
          ${isPlaying ? 'border-purple-300 shadow-purple-100' : 'border-gray-200'}`}
      >
        <div 
          className={`h-32 bg-cover bg-center relative ${getFractalAnimationClass(fractalVisual?.type)}`}
          style={{
            backgroundImage: fractalVisual?.visual_url 
              ? `url(${fractalVisual.visual_url})` 
              : frequency.visual_url 
                ? `url(${frequency.visual_url})` 
                : undefined
          }}
        >
          {(!fractalVisual?.visual_url && !frequency.visual_url) && (
            <div className={`absolute inset-0 bg-gradient-to-b ${chakraGradient} opacity-75`}></div>
          )}
          
          <div className="absolute inset-0 bg-black/30"></div>
          
          {fractalVisual && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 bg-black/40 hover:bg-black/60 text-white rounded-full z-10"
              onClick={(e) => {
                e.stopPropagation();
                handleExpandFractal();
              }}
            >
              <Maximize2 className="h-4 w-4" />
              <span className="sr-only">Expand Fractal</span>
            </Button>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-center z-10">
            <div>
              <Badge 
                variant="outline" 
                className="bg-white/90 text-gray-800 mb-1 font-medium"
              >
                {freqValue}
              </Badge>
              {frequency.principle && (
                <Badge 
                  variant="outline" 
                  className="bg-black/50 text-white ml-2 mb-1"
                >
                  {frequency.principle}
                </Badge>
              )}
              {fractalVisual?.prime_number && (
                <Badge 
                  variant="outline" 
                  className="bg-purple-700/70 text-white ml-2 mb-1"
                >
                  Prime {fractalVisual.prime_number}
                </Badge>
              )}
            </div>
            
            <Button 
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                handlePlayToggle();
              }}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4 ml-0.5" />
              )}
              <span className="sr-only">
                {isPlaying ? 'Pause' : 'Play'} {frequency.title}
              </span>
            </Button>
          </div>
        </div>
        
        <CardContent className="p-3 pt-2">
          <div className="mb-2">
            <h3 
              className="font-medium text-gray-800 line-clamp-1 cursor-pointer hover:text-purple-700" 
              onClick={handleCardClick}
            >
              {frequency.title}
            </h3>
            <div className="flex items-center gap-1 mt-0.5">
              <span className={`text-xs ${getChakraTextColor(frequency.chakra)}`}>
                {frequency.chakra} Chakra
              </span>
              {frequency.length && (
                <span className="text-xs text-gray-500 ml-auto">
                  {formatDuration(frequency.length)}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-2">
            {frequency.tags && frequency.tags.slice(0, 3).map((tag, index) => (
              <Badge 
                key={index}
                variant="outline" 
                className="text-xs py-0 px-1.5 bg-gray-50"
              >
                {tag}
              </Badge>
            ))}
            {frequency.tags && frequency.tags.length > 3 && (
              <Badge 
                variant="outline" 
                className="text-xs py-0 px-1.5 bg-gray-50"
              >
                +{frequency.tags.length - 3}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-1.5">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs px-2 py-1 h-7 bg-purple-50 border-purple-100 text-purple-700 hover:bg-purple-100 flex-1"
              onClick={handleAddToJourney}
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Add to Journey
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-7 h-7 p-0"
              onClick={handleSave}
            >
              <Heart className="h-3.5 w-3.5" />
              <span className="sr-only">Save</span>
            </Button>
          </div>
          
          {isPlaying && audioUrl && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <FrequencyPlayer 
                audioUrl={audioUrl}
                isPlaying={isPlaying}
                onPlayToggle={handlePlayToggle}
                frequencyId={frequency.id}
              />
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={showFractalDialog} onOpenChange={setShowFractalDialog}>
        <DialogContent className="max-w-5xl h-full max-h-[90vh] p-0 overflow-hidden">
          <DialogHeader>
            <DialogTitle className="sr-only">Fractal Visualization</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-full">
            <div 
              className={`absolute inset-0 bg-cover bg-center ${getFractalAnimationClass(fractalVisual?.type)}`}
              style={{
                backgroundImage: fractalVisual?.visual_url ? `url(${fractalVisual.visual_url})` : undefined
              }}
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
              <div className="text-white max-w-xl">
                <h2 className="text-2xl font-semibold mb-2">
                  {fractalVisual?.title || frequency.title || `${frequency.frequency}Hz Fractal`}
                </h2>
                
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline" className="border-white/30 text-white">
                    {frequency.frequency}Hz
                  </Badge>
                  <Badge variant="outline" className="border-white/30 text-white">
                    {frequency.chakra} Chakra
                  </Badge>
                  {fractalVisual?.principle && (
                    <Badge variant="outline" className="border-white/30 text-white">
                      {fractalVisual.principle} Principle
                    </Badge>
                  )}
                  {fractalVisual?.prime_number && (
                    <Badge variant="outline" className="border-purple-300 bg-purple-500/30 text-white">
                      Prime {fractalVisual.prime_number}
                    </Badge>
                  )}
                </div>
                
                {fractalVisual?.notes && (
                  <p className="text-white/80 mb-4">{fractalVisual.notes}</p>
                )}
                
                {fractalVisual?.formula && (
                  <div className="bg-black/30 p-3 rounded mb-4">
                    <p className="text-sm font-mono text-green-300">{fractalVisual.formula}</p>
                  </div>
                )}
                
                <div className="flex gap-3 mt-2">
                  <Button 
                    className="bg-white text-purple-800 hover:bg-white/90"
                    onClick={() => setShowFractalDialog(false)}
                  >
                    Close
                  </Button>
                  <Button 
                    variant="outline" 
                    className="text-white border-white/30 hover:bg-white/20"
                    onClick={saveFractalToTimeline}
                  >
                    Save to Timeline
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HermeticFrequencyCard;
