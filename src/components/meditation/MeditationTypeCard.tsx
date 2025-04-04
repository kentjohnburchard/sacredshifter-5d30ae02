
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timer, Music, Play } from "lucide-react";
import { MeditationType } from "@/types/meditation";

interface MeditationTypeCardProps {
  meditation: MeditationType;
  onSelect: () => void;
}

const MeditationTypeCard: React.FC<MeditationTypeCardProps> = ({ meditation, onSelect }) => {
  return (
    <Card className="overflow-hidden border border-[#9966FF]/20 hover:shadow-md transition-all bg-white/80 backdrop-blur-sm">
      <div 
        className={`h-3 bg-gradient-to-r ${meditation.colorGradient}`}
      />
      <CardContent className="pt-6">
        <h3 className="text-xl font-medium mb-2 text-[#7510c9]">{meditation.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 h-10">{meditation.description}</p>
        
        <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Timer className="h-4 w-4" />
            <span>{meditation.duration} min</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Music className="h-4 w-4" />
            <span>{meditation.frequency} Hz</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 pb-4">
        <Button 
          className="w-full bg-[#9966FF] hover:bg-[#7510c9]" 
          onClick={onSelect}
        >
          <Play className="h-4 w-4 mr-2" />
          Start Meditation
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MeditationTypeCard;
