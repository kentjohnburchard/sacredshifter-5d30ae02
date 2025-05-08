
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getArchetypeForChakra } from '@/utils/archetypes';
import { ChakraTag, getChakraColor } from '@/types/chakras';
import { Journey } from '@/types/journey';
import { Play } from 'lucide-react';

interface JourneyCardProps {
  journey: Journey;
  variant?: 'default' | 'compact';
}

const JourneyCard: React.FC<JourneyCardProps> = ({ journey, variant = 'default' }) => {
  const chakraTag = journey.chakra_tag as ChakraTag;
  const archetype = getArchetypeForChakra(chakraTag);
  const chakraColor = getChakraColor(chakraTag) || '#8B00FF';
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card 
        className="h-full overflow-hidden backdrop-blur-sm bg-black/50 border-0 shadow-xl"
        style={{
          boxShadow: `0 4px 20px ${chakraColor}30`,
          borderLeft: `3px solid ${chakraColor}`
        }}
      >
        {/* Archetype symbol in top right */}
        {archetype?.symbol && (
          <div className="absolute top-2 right-2 opacity-20">
            <img 
              src={archetype.symbol} 
              alt={archetype.name} 
              className="w-12 h-12"
              style={{ filter: `drop-shadow(0 0 8px ${chakraColor})` }}
            />
          </div>
        )}
        
        <CardContent className="p-5 pt-6 relative">
          {/* Chakra tag */}
          {chakraTag && (
            <div 
              className="inline-block text-xs font-medium px-2 py-1 mb-2 rounded-full" 
              style={{ backgroundColor: `${chakraColor}30`, color: chakraColor }}
            >
              {chakraTag}
              {archetype && ` · ${archetype.name}`}
            </div>
          )}
          
          <h3 className="text-xl font-bold text-white mb-2">{journey.title}</h3>
          
          {journey.intent && variant !== 'compact' && (
            <p className="text-white/70 text-sm line-clamp-3">{journey.intent}</p>
          )}
          
          {journey.frequencies && journey.frequencies.length > 0 && (
            <div className="mt-3 text-sm text-white/50 flex items-center">
              <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: chakraColor }}></span>
              {Array.isArray(journey.frequencies) 
                ? `${journey.frequencies.join(', ')} Hz` 
                : `${journey.frequencies} Hz`}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="p-5 pt-0">
          <Button 
            asChild
            className="w-full" 
            style={{ 
              backgroundColor: chakraColor,
              color: '#000000',
              fontWeight: 'bold'
            }}
          >
            <Link to={`/journey/${journey.slug || journey.filename}/experience`}>
              <Play className="h-4 w-4 mr-2" />
              Begin Journey
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default JourneyCard;
