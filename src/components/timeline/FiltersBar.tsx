
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Star, Sparkles, CirclePlay, Dot } from 'lucide-react';
import { ChakraTag } from '@/types/chakras';
import ChakraFilter from '@/components/chakra/ChakraFilter';

interface FiltersBarProps {
  activeTagFilter: string;
  chakraFilter: ChakraTag[];
  onFilterChange: (filter: string) => void;
  onChakraFilterChange: (chakras: ChakraTag[]) => void;
}

const FiltersBar: React.FC<FiltersBarProps> = ({ 
  activeTagFilter, 
  chakraFilter,
  onFilterChange,
  onChakraFilterChange
}) => {
  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        <Button
          variant={activeTagFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange('all')}
          className="whitespace-nowrap"
        >
          <Star className="h-4 w-4 mr-1" />
          All Events
        </Button>
        
        <Button
          variant={activeTagFilter === 'journey' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange('journey')}
          className="whitespace-nowrap"
        >
          <Calendar className="h-4 w-4 mr-1" />
          Journeys
        </Button>
        
        <Button
          variant={activeTagFilter === 'spiral' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange('spiral')}
          className="whitespace-nowrap"
        >
          <Sparkles className="h-4 w-4 mr-1" />
          Spirals
        </Button>
        
        <Button
          variant={activeTagFilter === 'soundscape' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange('soundscape')}
          className="whitespace-nowrap"
        >
          <CirclePlay className="h-4 w-4 mr-1" />
          Soundscapes
        </Button>
      </div>

      <ChakraFilter
        selectedChakras={chakraFilter}
        onChange={onChakraFilterChange}
        multiSelect={true}
        size="sm"
      />
    </div>
  );
};

export default FiltersBar;
