
import React from "react";
import { useNavigate } from "react-router-dom";
import { HealingFrequency } from "@/data/frequencies";
import { Button } from "@/components/ui/button";
import { Music, ArrowRight } from "lucide-react";

interface FrequencyMusicConfirmationProps {
  frequency: HealingFrequency;
}

const FrequencyMusicConfirmation: React.FC<FrequencyMusicConfirmationProps> = ({
  frequency
}) => {
  const navigate = useNavigate();

  const handleCreateMusic = () => {
    // Navigate to the music generation page with the frequency data
    navigate('/music-generation', { 
      state: { 
        selectedFrequency: frequency,
        generateWithFrequency: true
      } 
    });
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4 text-center">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-400">
          Create Music with {frequency.name}
        </h3>
        <p className="text-slate-200">
          Would you like to generate a healing track using the {frequency.frequency}Hz frequency?
        </p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <Music className="h-5 w-5 text-teal-400" />
          <span className="text-teal-300 font-medium">{frequency.frequency}Hz</span>
          {frequency.chakra && (
            <span className="bg-white/10 text-white text-xs px-2 py-1 rounded-full">
              {frequency.chakra} Chakra
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3 w-full max-w-xs">
        <Button 
          onClick={handleCreateMusic}
          className="w-full bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700 flex items-center justify-center gap-2"
        >
          Create Healing Track
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default FrequencyMusicConfirmation;
