
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock } from 'lucide-react';
import { JourneyMetadata } from '../../types/journeys';

// Define background colors based on tags
const tagBackgroundMap: Record<string, string> = {
  chakra: 'bg-purple-950/50 border-purple-500/20',
  breathwork: 'bg-blue-950/50 border-blue-500/20',
  sound: 'bg-amber-950/50 border-amber-500/20',
  meditation: 'bg-emerald-950/50 border-emerald-500/20',
  hermetic: 'bg-indigo-950/50 border-indigo-500/20',
  default: 'bg-gray-900/80 border-gray-500/20'
};

interface SacredJourneyCardProps {
  journey: JourneyMetadata;
}

const SacredJourneyCard: React.FC<SacredJourneyCardProps> = ({ journey }) => {
  // Determine card background based on tags
  const getCardBackground = () => {
    if (!journey.tags || journey.tags.length === 0) return tagBackgroundMap.default;
    
    for (const tag of journey.tags) {
      const lowerTag = tag.toLowerCase();
      for (const [key, value] of Object.entries(tagBackgroundMap)) {
        if (lowerTag.includes(key)) {
          return value;
        }
      }
    }
    return tagBackgroundMap.default;
  };

  const cardBackground = getCardBackground();

  return (
    <motion.div
      whileHover={{ 
        scale: 1.03, 
        transition: { duration: 0.3 } 
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Card className={`h-full ${cardBackground} hover:shadow-lg transition-all duration-300 backdrop-blur-sm sacred-glass overflow-hidden`}>
        {journey.requiresVeil && (
          <div className="absolute top-3 right-3 z-10">
            <Badge variant="outline" className="bg-pink-500/20 text-white border-pink-500/30 flex items-center gap-1">
              <Lock size={14} />
              <span>Veil Locked</span>
            </Badge>
          </div>
        )}
        
        <CardHeader>
          <CardTitle className="text-xl font-playfair text-white">
            {journey.title}
          </CardTitle>
          <CardDescription className="text-gray-300">
            {journey.description.substring(0, 100)}{journey.description.length > 100 ? '...' : ''}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="relative">
            {/* Sacred geometry background effect */}
            <motion.div 
              className="absolute -inset-10 opacity-20 z-0"
              animate={{ 
                rotate: [0, 360],
                scale: [0.95, 1.05, 0.95]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" } 
              }}
              style={{
                backgroundImage: 'url("/sacred-geometry-bg.svg")',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                pointerEvents: 'none'
              }}
            />
            
            {/* Card content */}
            <div className="mb-4 relative z-10">
              <p className="text-gray-200 text-sm">
                {journey.excerpt || "Embark on a transformative journey of consciousness expansion"}
              </p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-wrap gap-2">
          {journey.tags && journey.tags.map(tag => (
            <Badge key={tag} variant="outline" className="bg-black/30 text-gray-200">
              {tag}
            </Badge>
          ))}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default SacredJourneyCard;
