
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { JourneyTemplate } from "@/data/journeyTemplates";
import { HealingFrequency } from "@/data/frequencies";
import { toast } from "sonner";

interface JourneyPlayerProps {
  template: JourneyTemplate;
  frequency: HealingFrequency;
  onClose?: () => void;
}

// This is a smaller version of the journey player that can be embedded in other components
const JourneyPlayer: React.FC<JourneyPlayerProps> = ({ 
  template, 
  frequency,
  onClose
}) => {
  const navigate = useNavigate();

  const handleStartFullJourney = () => {
    navigate(`/journey/${frequency.frequency}`);
    toast.success(`Loading ${frequency.frequency}Hz journey`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-xl">{template.emoji}</span>
        <h3 className="text-xl font-medium text-gray-800">{template.name}</h3>
      </div>
      
      <p className="text-gray-600">{template.vibe}</p>
      
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
        <p className="text-gray-700 italic">"{template.affirmation}"</p>
      </div>
      
      <div className="flex gap-3">
        <Button 
          className="bg-gradient-to-r from-purple-500 to-blue-500 flex-1"
          onClick={handleStartFullJourney}
        >
          Start Full Journey
        </Button>
        
        {onClose && (
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Close
          </Button>
        )}
      </div>
    </div>
  );
};

export default JourneyPlayer;
