
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { JourneyTemplate } from '@/data/journeyTemplates';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Timer, Play, Music, Info, Wand } from 'lucide-react';
import { JourneyAudioMapping } from '@/types/music';

interface JourneyTemplateCardProps {
  template: JourneyTemplate;
  audio: JourneyAudioMapping[] | null;
}

const JourneyTemplateCard: React.FC<JourneyTemplateCardProps> = ({ template, audio }) => {
  const navigate = useNavigate();
  
  const handleBeginJourney = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default link behavior
    e.stopPropagation(); // Prevent card click
    navigate(`/journey-player/${template.id}`);
  };

  const handleCardClick = () => {
    navigate(`/journey-detail/${template.id}`);
  };
  
  // Get chakra color
  const getChakraColor = (chakra: string) => {
    const chakraColors = {
      'root': 'bg-red-500',
      'sacral': 'bg-orange-500',
      'solar plexus': 'bg-yellow-500',
      'heart': 'bg-green-500',
      'throat': 'bg-blue-500',
      'third eye': 'bg-indigo-500',
      'crown': 'bg-purple-500',
      'all': 'bg-gradient-to-r from-red-500 via-green-500 to-purple-500'
    };
    return chakraColors[chakra.toLowerCase()] || 'bg-gray-500';
  };
  
  // Format duration
  const formatDuration = (minutes: number) => {
    return `${minutes} min`;
  };

  // Get primary audio or first in the list
  const getPrimaryAudio = (): JourneyAudioMapping | null => {
    if (!audio || audio.length === 0) {
      return null;
    }
    
    const primaryAudio = audio.find(a => a.isPrimary);
    return primaryAudio || audio[0];
  };
  
  const primaryAudio = getPrimaryAudio();
  const hasAudio = !!primaryAudio;
  
  return (
    <Card 
      className={`overflow-hidden transition-all duration-300 border ${hasAudio ? 'border-purple-600/30' : 'border-gray-700/30'} bg-black/40 cursor-pointer`}
      onClick={handleCardClick}
    >
      <div 
        className="h-3"
        style={{ 
          background: template.color || (template.chakras && template.chakras.length > 0 
            ? getChakraColor(template.chakras[0])
            : 'bg-purple-500') 
        }}
      ></div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">{template.title}</h3>
            <p className="text-sm text-gray-300">{template.subtitle}</p>
          </div>
          <div className="text-2xl">{template.emoji}</div>
        </div>
        
        <div className="mt-3 space-y-2">
          <p className="text-sm text-gray-300 line-clamp-2">{template.description}</p>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {template.chakras && template.chakras.map(chakra => (
              <Badge 
                key={chakra}
                className={`text-xs ${getChakraColor(chakra)}`}
              >
                {chakra}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
            <div className="flex items-center">
              <Timer className="h-4 w-4 mr-1" />
              {formatDuration(template.duration || 10)}
            </div>
            
            {hasAudio && (
              <div className="flex items-center">
                <Music className="h-4 w-4 mr-1 text-purple-400" />
                <span className="text-purple-300">Audio</span>
              </div>
            )}
            
            {template.features && template.features.includes('guided') && (
              <div className="flex items-center">
                <Wand className="h-4 w-4 mr-1 text-blue-400" />
                <span className="text-blue-300">Guided</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <Button 
          variant={hasAudio ? "default" : "secondary"}
          size="sm" 
          className={`${hasAudio ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-700 hover:bg-gray-600'}`}
          onClick={handleBeginJourney}
        >
          <Play className="h-4 w-4 mr-2" />
          Begin Journey
        </Button>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full h-8 w-8 text-gray-400"
              onClick={(e) => e.stopPropagation()} // Prevent card click
            >
              <Info className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs bg-black/90 border-gray-800">
            <div className="space-y-2 p-1">
              {template.purpose && (
                <p className="text-sm">
                  <span className="font-medium text-purple-300">Purpose: </span>
                  <span className="text-gray-300">{template.purpose}</span>
                </p>
              )}
              
              {template.frequencies && template.frequencies.length > 0 && (
                <div className="text-sm">
                  <span className="font-medium text-purple-300">Frequencies: </span>
                  <ul className="list-disc pl-5 text-gray-300">
                    {template.frequencies.map((freq, i) => (
                      <li key={i}>{freq.name}: {freq.value} Hz</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {template.affirmation && (
                <p className="text-sm italic text-blue-300">"{template.affirmation}"</p>
              )}
              
              {primaryAudio && (
                <p className="text-sm flex items-center">
                  <Music className="h-3 w-3 mr-1 text-purple-400" />
                  <span className="text-gray-300">
                    {primaryAudio.displayTitle || primaryAudio.audioFileName.split('/').pop()}
                  </span>
                </p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </CardFooter>
    </Card>
  );
};

export default JourneyTemplateCard;
