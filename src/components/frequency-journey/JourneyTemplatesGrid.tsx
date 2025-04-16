
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { JourneyTemplate } from '@/data/journeyTemplates';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useJourneyTemplates } from '@/hooks/useJourneyTemplates';
import { useTheme } from '@/context/ThemeContext';
import { Music, Play, Timer, Check, Info, Star, Wand } from 'lucide-react';
import { JourneyAudioMapping } from '@/types/music';

// Helper function to get chakra color
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

// Helper function to format duration
const formatDuration = (minutes: number) => {
  return `${minutes} min`;
};

const JourneyTemplatesGrid: React.FC = () => {
  const navigate = useNavigate();
  const { templates, loading, audioMappings } = useJourneyTemplates();
  const [filteredTemplates, setFilteredTemplates] = useState<JourneyTemplate[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('chakra');
  const { liftTheVeil } = useTheme();
  
  // Filter and sort templates
  useEffect(() => {
    let result = [...templates];
    
    // Apply filter
    if (filter !== 'all') {
      result = result.filter(template => 
        template.chakras && 
        template.chakras.some(chakra => chakra.toLowerCase() === filter.toLowerCase())
      );
    }
    
    // Apply sorting
    if (sortBy === 'duration') {
      result.sort((a, b) => (a.duration || 0) - (b.duration || 0));
    } else if (sortBy === 'chakra') {
      result.sort((a, b) => {
        const aChakra = a.chakras && a.chakras.length > 0 ? a.chakras[0].toLowerCase() : 'z';
        const bChakra = b.chakras && b.chakras.length > 0 ? b.chakras[0].toLowerCase() : 'z';
        return aChakra.localeCompare(bChakra);
      });
    } else if (sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }
    
    setFilteredTemplates(result);
  }, [templates, filter, sortBy]);

  // Helper function to get the template audio (primary or first)
  const getTemplateAudio = (templateId: string): JourneyAudioMapping | null => {
    const mappings = audioMappings[templateId];
    if (!mappings || mappings.length === 0) {
      return null;
    }
    
    // Try to find a primary audio first
    const primaryAudio = mappings.find(m => m.isPrimary);
    if (primaryAudio) {
      return primaryAudio;
    }
    
    // Fall back to the first audio in the list
    return mappings[0];
  };

  const handleBeginJourney = (template: JourneyTemplate) => {
    navigate(`/journey-player/${template.id}`);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Filter options */}
      <div className="flex flex-wrap gap-2">
        <Badge 
          className={`cursor-pointer ${filter === 'all' ? 'bg-purple-600' : 'bg-gray-600 hover:bg-purple-600'}`}
          onClick={() => setFilter('all')}
        >
          All Journeys
        </Badge>
        <Badge 
          className={`cursor-pointer ${filter === 'root' ? getChakraColor('root') : 'bg-gray-600 hover:bg-red-500'}`}
          onClick={() => setFilter('root')}
        >
          Root Chakra
        </Badge>
        <Badge 
          className={`cursor-pointer ${filter === 'sacral' ? getChakraColor('sacral') : 'bg-gray-600 hover:bg-orange-500'}`}
          onClick={() => setFilter('sacral')}
        >
          Sacral Chakra
        </Badge>
        <Badge 
          className={`cursor-pointer ${filter === 'solar plexus' ? getChakraColor('solar plexus') : 'bg-gray-600 hover:bg-yellow-500'}`}
          onClick={() => setFilter('solar plexus')}
        >
          Solar Plexus
        </Badge>
        <Badge 
          className={`cursor-pointer ${filter === 'heart' ? getChakraColor('heart') : 'bg-gray-600 hover:bg-green-500'}`}
          onClick={() => setFilter('heart')}
        >
          Heart Chakra
        </Badge>
        <Badge 
          className={`cursor-pointer ${filter === 'throat' ? getChakraColor('throat') : 'bg-gray-600 hover:bg-blue-500'}`}
          onClick={() => setFilter('throat')}
        >
          Throat Chakra
        </Badge>
        <Badge 
          className={`cursor-pointer ${filter === 'third eye' ? getChakraColor('third eye') : 'bg-gray-600 hover:bg-indigo-500'}`}
          onClick={() => setFilter('third eye')}
        >
          Third Eye
        </Badge>
        <Badge 
          className={`cursor-pointer ${filter === 'crown' ? getChakraColor('crown') : 'bg-gray-600 hover:bg-purple-500'}`}
          onClick={() => setFilter('crown')}
        >
          Crown Chakra
        </Badge>
      </div>

      {/* Sort options */}
      <div className="flex gap-2 text-sm text-white">
        <span>Sort by:</span>
        <span 
          className={`cursor-pointer ${sortBy === 'chakra' ? 'text-purple-400 font-medium' : 'text-gray-300'}`}
          onClick={() => setSortBy('chakra')}
        >
          Chakra
        </span>
        <span>|</span>
        <span 
          className={`cursor-pointer ${sortBy === 'duration' ? 'text-purple-400 font-medium' : 'text-gray-300'}`}
          onClick={() => setSortBy('duration')}
        >
          Duration
        </span>
        <span>|</span>
        <span 
          className={`cursor-pointer ${sortBy === 'title' ? 'text-purple-400 font-medium' : 'text-gray-300'}`}
          onClick={() => setSortBy('title')}
        >
          Title
        </span>
      </div>

      {/* Templates Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-4">
        {filteredTemplates.map(template => {
          const hasAudio = !!getTemplateAudio(template.id);
          const audioMapping = getTemplateAudio(template.id);
          
          return (
            <Card 
              key={template.id} 
              className={`overflow-hidden transition-all duration-300 border-2 ${hasAudio ? 'border-purple-600/30' : 'border-gray-700/30'} ${liftTheVeil ? 'bg-black/60' : 'bg-black/40'}`}
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
                  onClick={() => handleBeginJourney(template)}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Begin Journey
                </Button>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-gray-400">
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
                      
                      {audioMapping && (
                        <p className="text-sm flex items-center">
                          <Music className="h-3 w-3 mr-1 text-purple-400" />
                          <span className="text-gray-300">
                            {audioMapping.displayTitle || audioMapping.audioFileName.split('/').pop()}
                          </span>
                        </p>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-10">
          <div className="text-4xl mb-4">🧘</div>
          <p className="text-gray-400">No journeys match your filter. Try a different selection.</p>
        </div>
      )}
    </div>
  );
};

export default JourneyTemplatesGrid;
