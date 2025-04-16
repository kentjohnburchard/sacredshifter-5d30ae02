
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { JourneyTemplate } from '@/data/journeyTemplates';
import { useNavigate } from 'react-router-dom';
import { Play, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface JourneyTemplateCardProps {
  template: JourneyTemplate;
  audioMapping?: {
    audioUrl: string;
    audioFileName: string;
  };
  onClick?: (template: JourneyTemplate) => void;
}

const JourneyTemplateCard: React.FC<JourneyTemplateCardProps> = ({ 
  template, 
  audioMapping,
  onClick
}) => {
  const navigate = useNavigate();
  
  const handleStartJourney = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering onClick
    if (audioMapping?.audioUrl) {
      navigate(`/journey-player/${template.id}`);
    } else {
      console.log("No audio URL found for template:", template.id);
      // Still navigate but the player will handle the error display
      navigate(`/journey-player/${template.id}`);
    }
  };
  
  const handleCardClick = () => {
    if (onClick) {
      onClick(template);
    }
  };

  return (
    <TooltipProvider>
      <Card
        className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105 cursor-pointer"
        onClick={handleCardClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{template.title}</h3>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{template.description}</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{template.subtitle}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
              <span>{template.duration} min</span>
              <span>{template.sessionType}</span>
            </div>
            <Button size="sm" onClick={handleStartJourney}>
              <Play className="h-4 w-4 mr-2" /> Start
            </Button>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default JourneyTemplateCard;
