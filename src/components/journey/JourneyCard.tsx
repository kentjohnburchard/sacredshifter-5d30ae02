
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getArchetypeForChakra } from '@/utils/archetypes';
import { ChakraTag, getChakraColor } from '@/types/chakras';
import { Journey } from '@/types/journey';
import { Play, Lock } from 'lucide-react';
import { normalizeStringArray } from '@/utils/parsers';

interface JourneyCardProps {
  journey: Journey;
  variant?: 'default' | 'compact';
}

const JourneyCard: React.FC<JourneyCardProps> = ({ journey, variant = 'default' }) => {
  const chakraTag = journey.chakra_tag as ChakraTag;
  const archetype = getArchetypeForChakra(chakraTag);
  const chakraColor = getChakraColor(chakraTag) || '#8B5CF6'; // Default to purple
  
  const isPremium = journey.veil_locked;
  const frequencyText = journey.sound_frequencies || journey.frequencies?.join(', ');
  const tags = normalizeStringArray(journey.tags || []);
  
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="h-full"
    >
      <Card 
        className="h-full overflow-hidden relative backdrop-blur-sm border-0 group"
        style={{
          background: `linear-gradient(145deg, rgba(25, 25, 35, 0.9) 0%, rgba(40, 30, 60, 0.85) 100%)`,
        }}
      >
        {/* Glowing border effect */}
        <div 
          className="absolute inset-0 animate-pulse-subtle opacity-70 pointer-events-none z-0"
          style={{ 
            boxShadow: `inset 0 0 15px ${chakraColor}50, 0 0 25px ${chakraColor}30`,
            border: `1px solid ${chakraColor}40`,
            borderRadius: 'inherit',
          }} 
        />
        
        {/* Sacred geometry background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
          <div className="w-full h-full" style={{ 
            backgroundImage: 'url(/assets/sacred-geometry.svg)', 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.15,
            transform: 'scale(1.5)'
          }}/>
        </div>
        
        {/* Premium journey lock indicator */}
        {isPremium && (
          <div className="absolute top-3 right-3 z-10">
            <div className="bg-black/40 backdrop-blur-sm p-1.5 rounded-full">
              <Lock className="h-4 w-4 text-amber-300" />
            </div>
          </div>
        )}
        
        <CardContent className="p-5 pt-6 relative z-10">
          {/* Chakra tag */}
          {chakraTag && (
            <div 
              className="inline-block text-xs font-medium px-2.5 py-1 mb-3 rounded-full backdrop-blur-sm" 
              style={{ backgroundColor: `${chakraColor}20`, color: chakraColor }}
            >
              {chakraTag}
              {archetype && ` · ${archetype.name}`}
            </div>
          )}
          
          {/* Journey title with stylized font */}
          <h3 className="text-xl font-playfair font-bold text-white mb-2 leading-tight">{journey.title}</h3>
          
          {/* Journey description or intent */}
          {journey.intent && variant !== 'compact' && (
            <p className="text-white/70 text-sm mb-3 line-clamp-2">{journey.intent}</p>
          )}
          
          {/* Archetype icon */}
          {archetype?.symbol && (
            <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-10 w-20 h-20 pointer-events-none z-0">
              <img 
                src={archetype.symbol} 
                alt={archetype.name} 
                className="w-full h-full"
                style={{ filter: `drop-shadow(0 0 8px ${chakraColor})` }}
              />
            </div>
          )}
          
          {/* Journey tags */}
          {tags.length > 0 && variant !== 'compact' && (
            <div className="flex flex-wrap gap-1 mt-2 mb-3">
              {tags.slice(0, 3).map((tag, idx) => (
                <span 
                  key={idx}
                  className="px-2 py-0.5 text-xs rounded-full bg-white/5 text-white/60"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
          
          {/* Frequency display */}
          {frequencyText && (
            <div className="mt-3 text-sm text-white/70 flex items-center">
              <span 
                className="inline-block w-2 h-2 rounded-full mr-2 animate-pulse" 
                style={{ backgroundColor: chakraColor }}
              />
              {frequencyText} Hz
            </div>
          )}
        </CardContent>
        
        <CardFooter className="p-5 pt-0 z-10">
          <Button 
            asChild
            className="w-full transition-all group-hover:shadow-lg group-hover:shadow-purple-900/30" 
            style={{ 
              backgroundImage: `linear-gradient(to right, ${chakraColor}, ${chakraColor}90)`,
              color: '#111',
              fontWeight: 'bold'
            }}
          >
            <Link to={`/journey/${journey.slug || journey.filename}/experience`}>
              <Play className="h-4 w-4 mr-2" />
              Enter Journey
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default JourneyCard;
