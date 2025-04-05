
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, Pause, BookmarkIcon, Plus, Tag } from "lucide-react";
import { FrequencyLibraryItem } from "@/types/frequencies";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import FrequencyPlayer from "@/components/FrequencyPlayer";

interface HermeticFrequencyCardProps {
  frequency: FrequencyLibraryItem;
  onAddToJourney?: () => void;
  onSaveToFavorites?: () => void;
}

const HermeticFrequencyCard: React.FC<HermeticFrequencyCardProps> = ({
  frequency,
  onAddToJourney,
  onSaveToFavorites
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const navigate = useNavigate();

  // Get chakra color based on chakra name
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

  // Get chakra animation class
  const getChakraPulseAnimation = (chakra: string): string => {
    const baseAnimation = "animate-pulse-slow";
    switch (chakra?.toLowerCase()) {
      case 'root': return `${baseAnimation} bg-red-50`;
      case 'sacral': return `${baseAnimation} bg-orange-50`;
      case 'solar plexus': return `${baseAnimation} bg-yellow-50`;
      case 'heart': return `${baseAnimation} bg-green-50`;
      case 'throat': return `${baseAnimation} bg-blue-50`;
      case 'third eye': return `${baseAnimation} bg-indigo-50`;
      case 'crown': return `${baseAnimation} bg-purple-50`;
      default: return `${baseAnimation} bg-gray-50`;
    }
  };

  // Format duration from seconds to MM:SS
  const formatDuration = (seconds?: number) => {
    if (!seconds) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
  };

  const handleAddToJourney = () => {
    if (onAddToJourney) {
      onAddToJourney();
    } else {
      toast.success(`Added ${frequency.title} to your journey`);
    }
  };

  const handleSaveToFavorites = () => {
    if (onSaveToFavorites) {
      onSaveToFavorites();
    } else {
      toast.success(`Saved ${frequency.title} to your favorites`);
    }
  };

  return (
    <Card className={`overflow-hidden h-full border-transparent shadow-md transition-all duration-500 ${getChakraPulseAnimation(frequency.chakra)}`}>
      <div className={`h-2 bg-gradient-to-r ${getChakraColor(frequency.chakra)}`} />
      
      {frequency.visual_url && (
        <div className="h-24 bg-cover bg-center" style={{ backgroundImage: `url(${frequency.visual_url})` }} />
      )}
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-gray-900 text-lg">{frequency.title}</h3>
          <Badge className={`bg-gradient-to-r ${getChakraColor(frequency.chakra)} text-white border-none`}>
            {frequency.frequency}Hz
          </Badge>
        </div>
        
        {frequency.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{frequency.description}</p>
        )}
        
        <div className="flex flex-wrap gap-1 my-2">
          {frequency.tags && frequency.tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs bg-white hover:bg-gray-50 cursor-pointer">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
          <Clock className="h-3.5 w-3.5" />
          <span>{formatDuration(frequency.length || 180)}</span>
          
          {frequency.principle && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {frequency.principle}
            </Badge>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          <FrequencyPlayer 
            audioUrl={frequency.audio_url || ""} 
            isPlaying={isPlaying}
            onPlayToggle={handlePlayToggle}
          />
          
          <Button 
            size="sm" 
            variant="outline"
            className="text-xs px-2"
            onClick={handleAddToJourney}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add to Journey
          </Button>
          
          <Button 
            size="sm" 
            variant="ghost"
            className="text-xs px-2"
            onClick={handleSaveToFavorites}
          >
            <BookmarkIcon className="h-3.5 w-3.5 mr-1" />
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HermeticFrequencyCard;
