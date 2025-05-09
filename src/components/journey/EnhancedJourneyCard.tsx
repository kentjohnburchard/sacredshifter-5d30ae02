
import React from 'react';
import { Play, Lock } from 'lucide-react';
import { Journey } from '@/types/journey';
import { ChakraTag, getChakraColor } from '@/types/chakras';
import { getArchetypeForChakra } from '@/utils/archetypes';
import { normalizeStringArray } from '@/utils/parsers';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface EnhancedJourneyCardProps {
  journey: Journey;
  className?: string;
}

const EnhancedJourneyCard: React.FC<EnhancedJourneyCardProps> = ({ 
  journey,
  className
}) => {
  const navigate = useNavigate();
  const chakraTag = journey.chakra_tag as ChakraTag;
  const archetype = getArchetypeForChakra(chakraTag);
  const chakraColor = getChakraColor(chakraTag) || '#8B5CF6'; // Default to purple
  
  const isPremium = journey.veil_locked;
  const frequencyText = journey.sound_frequencies || journey.frequencies?.join(', ');
  const tags = normalizeStringArray(journey.tags || []);

  const handleStartJourney = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior (page refresh)
    e.stopPropagation(); // Stop event propagation
    
    // Remove .md extension if present for proper routing
    const journeyId = journey.filename?.replace(/\.md$/, '') || 
                     journey.slug?.replace(/\.md$/, '') || 
                     journey.id;
    
    // Navigate to journey experience page using React Router's navigate
    navigate(`/journey/${journeyId}/experience`);
    console.log("Navigating to journey:", journeyId);
  };
  
  return (
    <div className={`relative overflow-hidden rounded-xl h-full ${className}`}>
      {/* Background gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-gray-900/90 to-purple-950/90 z-0"
        style={{ backdropFilter: 'blur(4px)' }}
      />
      
      {/* Sacred geometry background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
        <div className="w-full h-full" style={{ 
          backgroundImage: 'url(/assets/sacred-geometry.svg)', 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.15,
          transform: 'scale(1.5) rotate(15deg)'
        }}/>
      </div>
      
      {/* Glowing border */}
      <div 
        className="absolute inset-0 animate-pulse-subtle opacity-70 pointer-events-none z-0"
        style={{ 
          boxShadow: `inset 0 0 15px ${chakraColor}40, 0 0 25px ${chakraColor}30`,
          border: `1px solid ${chakraColor}40`,
          borderRadius: 'inherit',
        }} 
      />
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        <div className="p-4 flex-grow">
          {/* Chakra tag */}
          <div className="flex justify-between items-start mb-2">
            {chakraTag && (
              <div 
                className="text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm" 
                style={{ backgroundColor: `${chakraColor}20`, color: chakraColor }}
              >
                {chakraTag}
                {archetype && ` · ${archetype.name}`}
              </div>
            )}
            
            {/* Premium indicator */}
            {isPremium && (
              <div className="bg-black/40 backdrop-blur-sm p-1.5 rounded-full">
                <Lock className="h-4 w-4 text-amber-300" />
              </div>
            )}
          </div>
          
          {/* Journey title */}
          <h3 className="text-xl font-playfair font-bold text-white mb-2">
            {journey.title}
          </h3>
          
          {/* Frequency */}
          {frequencyText && (
            <div className="mb-3 text-sm text-white/70 flex items-center">
              <span 
                className="inline-block w-2 h-2 rounded-full mr-2 animate-pulse" 
                style={{ backgroundColor: chakraColor }}
              />
              {frequencyText} Hz
            </div>
          )}
        </div>
        
        {/* Button */}
        <div className="p-3 mt-auto">
          <motion.button
            whileHover={{ scale: 1.03 }}
            className="flex justify-center items-center py-2 px-4 w-full rounded-md text-white font-medium transition-all"
            onClick={handleStartJourney}
            style={{
              background: `linear-gradient(to right, ${chakraColor}, ${chakraColor}90)`,
            }}
          >
            <Play className="h-4 w-4 mr-2" />
            <span>Enter Journey</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedJourneyCard;
