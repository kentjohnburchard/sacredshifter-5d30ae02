
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Pause, Plus, Heart } from "lucide-react";
import { FrequencyLibraryItem } from "@/types/frequencies";
import { formatDuration } from "@/utils/formatters";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import FrequencyPlayer from "@/components/FrequencyPlayer";
import { useNavigate } from "react-router-dom";

interface HermeticFrequencyCardProps {
  frequency: FrequencyLibraryItem;
}

const HermeticFrequencyCard: React.FC<HermeticFrequencyCardProps> = ({ frequency }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Get the audio URL from either audio_url or url property
  const audioUrl = frequency.audio_url || frequency.url || "";

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

  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
  };

  const handleAddToJourney = () => {
    if (!user) {
      toast.error("Please sign in to add frequencies to your journey");
      return;
    }
    toast.success(`Added ${frequency.title} to your journey`);
    // Actual implementation would add this to a user's journey in the database
  };

  const handleSave = () => {
    if (!user) {
      toast.error("Please sign in to save frequencies");
      return;
    }
    toast.success(`Saved ${frequency.title} to your library`);
    // Actual implementation would save this to the user's saved frequencies
  };

  const handleCardClick = () => {
    // Navigate to the frequency detail page
    navigate(`/frequency/${frequency.id}`);
  };

  // Default chakra gradient if none is provided
  const chakraGradient = getChakraColor(frequency.chakra);
  // Frequency value for display
  const freqValue = typeof frequency.frequency === 'number' ? `${frequency.frequency} Hz` : frequency.frequency;

  return (
    <Card 
      className={`overflow-hidden border transition-all hover:shadow-md 
        ${isPlaying ? 'border-purple-300 shadow-purple-100' : 'border-gray-200'}`}
    >
      <div 
        className="h-32 bg-cover bg-center relative"
        style={{
          backgroundImage: frequency.visual_url 
            ? `url(${frequency.visual_url})` 
            : `linear-gradient(to right bottom, ${frequency.visual_url ? 'rgba(0,0,0,0.3), rgba(0,0,0,0.3)' : 'rgba(0,0,0,0)'}, rgba(0,0,0,0)), linear-gradient(to right, var(--${frequency.chakra?.toLowerCase() || 'gray'}-gradient-start), var(--${frequency.chakra?.toLowerCase() || 'gray'}-gradient-end))`
        }}
      >
        <div className={`absolute inset-0 bg-gradient-to-b ${chakraGradient} opacity-75`}></div>
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
          </div>
          <FrequencyPlayer audioUrl={audioUrl} isPlaying={isPlaying} onPlayToggle={handlePlayToggle} />
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
      </CardContent>
    </Card>
  );
};

export default HermeticFrequencyCard;
