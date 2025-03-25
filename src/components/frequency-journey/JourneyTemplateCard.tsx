
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Info } from "lucide-react";
import { JourneyTemplate } from "@/data/journeyTemplates";
import { useNavigate } from "react-router-dom";

interface JourneyTemplateCardProps {
  template: JourneyTemplate;
  showDetails?: boolean;
  onBeginJourney?: () => void;
}

const JourneyTemplateCard: React.FC<JourneyTemplateCardProps> = ({ 
  template, 
  showDetails = true,
  onBeginJourney 
}) => {
  const navigate = useNavigate();

  const handleBeginJourney = () => {
    if (onBeginJourney) {
      onBeginJourney();
    } else {
      // Navigate to dedicated journey player with this frequency
      navigate(`/journey/${template.frequency}`);
    }
  };

  return (
    <Card className="overflow-hidden h-full border border-gray-200 hover:border-purple-200 transition-all duration-300 hover:shadow-md">
      <div className={`h-3 bg-gradient-to-r ${template.color}`}></div>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-medium">{template.emoji} {template.name}</h3>
          <span className="text-sm bg-gray-100 px-2 py-1 rounded-full text-gray-600">
            {template.frequency}Hz
          </span>
        </div>
        
        <div className="mb-3">
          <span className="text-sm font-medium text-purple-700">{template.chakra} Chakra</span>
          <p className="text-sm text-gray-600 mt-1">{template.vibe}</p>
        </div>
        
        {showDetails && (
          <div className="space-y-3 my-4 text-sm">
            <div className="space-y-1">
              <div className="font-medium text-gray-700">Visual Theme</div>
              <div className="text-gray-600">{template.visualTheme}</div>
            </div>
            
            <div className="space-y-1">
              <div className="font-medium text-gray-700">Affirmation</div>
              <div className="text-gray-600 italic">"{template.affirmation}"</div>
            </div>
            
            <div className="space-y-1">
              <div className="font-medium text-gray-700">Session Type</div>
              <div className="text-gray-600">{template.sessionType}</div>
            </div>
          </div>
        )}
        
        <div className="flex gap-2 mt-4">
          <Button 
            onClick={handleBeginJourney}
            className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            <Play className="h-3 w-3 mr-1" /> Begin Journey
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JourneyTemplateCard;
