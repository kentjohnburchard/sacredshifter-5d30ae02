
import React from 'react';
import { Play, Lock } from 'lucide-react';
import { Journey } from '@/types/journey';
import { ChakraTag, getChakraColor } from '@/types/chakras';
import { getArchetypeForChakra } from '@/utils/archetypes';
import { normalizeStringArray } from '@/utils/parsers';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ArchetypeSymbol from '@/components/circle/ArchetypeSymbol';
import { getChakraPulseStyle } from '@/lib/utils';

interface EnhancedJourneyCardProps {
  journey: Journey;
  className?: string;
}

const EnhancedJourneyCard: React.FC<EnhancedJourneyCardProps> = ({ 
  journey,
  className
}) => {
  const navigate = useNavigate();
  const chakraTag = journey.chakra_tag as ChakraTag || 'Crown';
  const archetype = getArchetypeForChakra(chakraTag);
  const chakraColor = getChakraColor(chakraTag) || '#8B5CF6'; // Default to purple
  
  const isPremium = journey.veil_locked;
  const frequencyText = journey.sound_frequencies || journey.frequencies?.join(', ');
  const tags = normalizeStringArray(journey.tags || []);

  const handleStartJourney = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default behavior
    e.stopPropagation(); // Stop event propagation
    
    try {
      // Get a valid journey ID for navigation
      let journeyId = '';
      
      // Prioritize slug if available
      if (journey.slug && typeof journey.slug === 'string' && journey.slug.trim() !== '') {
        journeyId = journey.slug.trim();
        console.log("Using journey slug for navigation:", journeyId);
      } 
      // Next try filename (without .md extension)
      else if (journey.filename && typeof journey.filename === 'string') {
        journeyId = journey.filename.replace(/\.md$/, '').trim();
        console.log("Using journey filename for navigation:", journeyId);
      }
      // Last resort, use ID
      else if (journey.id) {
        journeyId = journey.id.toString().trim();
        console.log("Using journey ID for navigation:", journeyId);
      }
      
      if (!journeyId) {
        toast.error("Cannot start journey: Missing journey identifier");
        console.error("Failed to navigate: No valid journey ID found", journey);
        return;
      }
      
      // Log the navigation
      console.log(`Navigating to journey experience: /journey/${journeyId}/experience`);
      
      // Navigate to the journey experience page
      navigate(`/journey/${journeyId}/experience`);
    } catch (error) {
      console.error("Error navigating to journey:", error);
      toast.error("Failed to start journey");
    }
  };
  
  return (
    <div className={`relative overflow-hidden rounded-xl h-full ${className}`}>
      {/* Background gradient with more pronounced chakra theming */}
      <div 
        className="absolute inset-0 bg-gradient-to-br z-0"
        style={{ 
          background: `linear-gradient(145deg, rgba(20, 20, 28, 0.95), rgba(30, 25, 45, 0.9))`,
          backdropFilter: 'blur(4px)'
        }}
      />
      
      {/* Sacred geometry background */}
      <div className="absolute inset-0 opacity-15 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
        <div className="w-full h-full" style={{ 
          backgroundImage: 'url(/assets/sacred-geometry.svg)', 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: 'scale(1.5) rotate(15deg)'
        }}/>
      </div>
      
      {/* Enhanced glowing border with chakra color */}
      <div 
        className="absolute inset-0 animate-pulse-subtle pointer-events-none z-0"
        style={{ 
          boxShadow: `inset 0 0 15px ${chakraColor}70, 0 0 25px ${chakraColor}50`,
          border: `1px solid ${chakraColor}60`,
          borderRadius: '0.75rem',
          ...getChakraPulseStyle(chakraColor, 'medium')
        }} 
      />

      {/* Archetype sigil/symbol overlay */}
      {archetype && (
        <div className="absolute top-3 right-3 z-10 opacity-70">
          <ArchetypeSymbol archetype={archetype} size="sm" glow={true} />
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col p-5">
        {/* Chakra tag with archetype */}
        {chakraTag && (
          <div 
            className="text-sm font-medium px-3 py-1.5 rounded-full backdrop-blur-sm mb-3 inline-block" 
            style={{ 
              backgroundColor: `${chakraColor}25`, 
              color: 'white',
              boxShadow: `0 0 10px ${chakraColor}40`,
              borderLeft: `2px solid ${chakraColor}` 
            }}
          >
            {chakraTag}
            {archetype && ` – ${archetype.name}`}
          </div>
        )}
        
        {/* Journey title */}
        <h3 className="text-xl font-playfair font-bold text-white mb-3 line-clamp-2">
          {journey.title}
        </h3>
        
        {/* Frequency */}
        {frequencyText && (
          <div className="mb-3 text-sm text-white/80 flex items-center">
            <span 
              className="inline-block w-2 h-2 rounded-full mr-2 animate-pulse" 
              style={{ backgroundColor: chakraColor }}
            />
            {frequencyText} Hz
          </div>
        )}

        {/* Intent/Description */}
        {journey.intent && (
          <div className="mb-4 text-sm text-white/70 line-clamp-3">
            {journey.intent}
          </div>
        )}
        
        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.slice(0, 3).map((tag, idx) => (
              <span 
                key={idx}
                className="text-xs px-2 py-0.5 rounded-full" 
                style={{ 
                  backgroundColor: `${chakraColor}30`,
                  color: 'white'
                }}
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        )}
        
        {/* Premium indicator */}
        {isPremium && (
          <div className="mb-2 flex items-center text-xs text-amber-300">
            <Lock className="h-3 w-3 mr-1" />
            <span>Premium Journey</span>
          </div>
        )}
        
        {/* Button */}
        <div className="mt-auto pt-3">
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: `0 0 15px ${chakraColor}70` }}
            whileTap={{ scale: 0.98 }}
            className="flex justify-center items-center py-2.5 px-4 w-full rounded-md text-white font-medium transition-all"
            onClick={handleStartJourney}
            style={{
              background: `linear-gradient(to right, ${chakraColor}, ${chakraColor}90)`,
              boxShadow: `0 4px 12px ${chakraColor}40`,
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
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
