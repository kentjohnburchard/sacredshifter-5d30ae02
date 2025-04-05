
import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from "@/components/ui/hover-card";
import { FrequencyLibraryItem } from "@/types/frequencies";
import { formatTime } from "@/lib/utils";
import FrequencyPlayer from "@/components/FrequencyPlayer";
import { ChakraIcon } from "./ChakraIcon";

interface FrequencyLibraryGridProps {
  frequencies: FrequencyLibraryItem[];
  chakraFilter: string | null;
  principleFilter: string | null;
}

const FrequencyLibraryGrid: React.FC<FrequencyLibraryGridProps> = ({
  frequencies,
  chakraFilter,
  principleFilter
}) => {
  const [playingIndex, setPlayingIndex] = useState<string | null>(null);
  
  const filteredFrequencies = useMemo(() => {
    return frequencies.filter(freq => {
      const chakraMatch = !chakraFilter || freq.chakra?.toLowerCase() === chakraFilter.toLowerCase();
      const principleMatch = !principleFilter || freq.principle?.toLowerCase() === principleFilter.toLowerCase();
      return chakraMatch && principleMatch;
    });
  }, [frequencies, chakraFilter, principleFilter]);

  const handlePlayToggle = (id: string) => {
    setPlayingIndex(playingIndex === id ? null : id);
  };
  
  const getChakraColor = (chakra?: string): string => {
    if (!chakra) return "from-gray-400 to-gray-500";
    
    switch (chakra.toLowerCase()) {
      case 'root': return "from-red-500 to-red-600";
      case 'sacral': return "from-orange-400 to-orange-500";
      case 'solar plexus': return "from-yellow-400 to-yellow-500";
      case 'heart': return "from-green-400 to-green-500";
      case 'throat': return "from-blue-400 to-blue-500";
      case 'third eye': return "from-indigo-400 to-indigo-500";
      case 'crown': return "from-purple-400 to-violet-500";
      default: return "from-gray-400 to-gray-500";
    }
  };
  
  if (filteredFrequencies.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No frequencies match the selected filters.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
      {filteredFrequencies.map((frequency) => (
        <Card 
          key={frequency.id}
          className="overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200 hover:border-gray-300 group"
        >
          <div className={`h-2 bg-gradient-to-r ${getChakraColor(frequency.chakra)}`} />
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-lg line-clamp-1">{frequency.title}</h3>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="flex-shrink-0">
                    <ChakraIcon chakra={frequency.chakra} className="h-6 w-6" />
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-60">
                  <div className="space-y-2">
                    <h4 className="font-medium">{frequency.chakra} Chakra</h4>
                    <p className="text-sm text-gray-500">
                      {frequency.frequency} Hz frequency
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
            
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <span className="font-medium">{frequency.frequency} Hz</span>
              {frequency.length && (
                <span className="ml-2 text-gray-400">
                  • {formatTime(frequency.length)}
                </span>
              )}
            </div>
            
            {frequency.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{frequency.description}</p>
            )}
            
            {frequency.principle && (
              <div className="mb-3">
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  {frequency.principle}
                </Badge>
              </div>
            )}
            
            {frequency.tags && frequency.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {frequency.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs bg-gray-100">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="mt-3">
              <FrequencyPlayer
                audioUrl={frequency.audio_url}
                url={frequency.url}
                isPlaying={playingIndex === frequency.id}
                onPlayToggle={() => handlePlayToggle(frequency.id)}
                frequency={frequency.frequency}
                frequencyId={frequency.id}
                id={`frequency-audio-${frequency.id}`}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FrequencyLibraryGrid;
