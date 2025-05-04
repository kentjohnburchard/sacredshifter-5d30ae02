
import React from 'react';
import { Link } from 'react-router-dom';
import { JourneyMetadata } from '@/types/journeys';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Book, Calendar, Clock, Sparkles, Tag } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';

interface SacredJourneyCardProps {
  journey: JourneyMetadata;
}

const SacredJourneyCard: React.FC<SacredJourneyCardProps> = ({ journey }) => {
  const { liftTheVeil } = useTheme();
  const isVeilRequired = journey.requiresVeil;
  const journeyPath = `/journey/${journey.slug}`;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Link to={journeyPath}>
        <Card className={`
          overflow-hidden border-purple-500/30 h-full hover:border-purple-400/50 
          transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10
          ${isVeilRequired && !liftTheVeil ? 'bg-black/60 border-pink-500/30 hover:border-pink-400/50' : 'bg-black/60'}
        `}>
          <div className="relative">
            {journey.coverImage ? (
              <div className="h-44 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10"></div>
                <img 
                  src={journey.coverImage} 
                  alt={journey.title}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            ) : (
              <div className="h-44 bg-gradient-to-br from-purple-900/30 to-blue-900/30 flex items-center justify-center">
                <Book className="h-12 w-12 text-purple-400/50" />
              </div>
            )}
            
            {journey.featured && (
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-medium">
                  Featured
                </Badge>
              </div>
            )}
          </div>
          
          <CardHeader className="pb-2">
            <h3 className="text-xl font-bold text-white line-clamp-2">{journey.title}</h3>
            {isVeilRequired && (
              <div className="flex items-center gap-1 text-pink-400 text-sm">
                <Sparkles className="h-3 w-3" />
                <span>Veil Required</span>
              </div>
            )}
          </CardHeader>
          
          <CardContent className="pb-2">
            <p className="text-gray-300 text-sm line-clamp-3">
              {journey.description || journey.excerpt || "No description available."}
            </p>
          </CardContent>
          
          <CardFooter className="pt-2 flex flex-wrap gap-1 text-xs text-gray-400">
            {journey.date && (
              <div className="flex items-center mr-3">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(journey.date).toLocaleDateString()}
              </div>
            )}
            
            {journey.readingTime && (
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {journey.readingTime} min
              </div>
            )}
          </CardFooter>
          
          {journey.tags && journey.tags.length > 0 && (
            <div className="px-6 pb-4 flex flex-wrap gap-1">
              {journey.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="outline" className="bg-purple-500/10 text-xs">
                  {tag}
                </Badge>
              ))}
              {journey.tags.length > 3 && (
                <Badge variant="outline" className="bg-purple-500/10 text-xs">
                  +{journey.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </Card>
      </Link>
    </motion.div>
  );
};

export default SacredJourneyCard;
