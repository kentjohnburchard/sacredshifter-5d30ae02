
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import JourneyCard from './JourneyCard';
import { fetchJourneys } from '@/services/journeyService';
import { Journey } from '@/types/journey';
import { ChakraTag, CHAKRA_COLORS } from '@/types/chakras';
import { normalizeJourney } from '@/utils/journeyUtils';
import { Button } from '@/components/ui/button';
import { Circle, Flame, Orbit, Sun, Heart, Waves, CircleDot } from 'lucide-react';

interface JourneyGalleryProps {
  variant?: 'grid' | 'slider';
  limit?: number;
  filterByChakra?: ChakraTag;
  defaultChakraFilter?: ChakraTag;
  showFilters?: boolean;
}

const CHAKRA_ICONS: Record<string, React.FC<{ className?: string }>> = {
  'Root': Flame,
  'Sacral': Orbit,
  'Solar Plexus': Sun,
  'Heart': Heart,
  'Throat': Waves,
  'Third Eye': CircleDot,
  'Crown': Circle
};

const JourneyGallery: React.FC<JourneyGalleryProps> = ({
  variant = 'grid',
  limit,
  filterByChakra,
  defaultChakraFilter,
  showFilters = true
}) => {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<ChakraTag | null>(defaultChakraFilter || null);
  
  // Fetch journeys on component mount
  useEffect(() => {
    const loadJourneys = async () => {
      try {
        setLoading(true);
        const fetchedJourneys = await fetchJourneys();
        
        // Normalize and sort journeys
        const normalizedJourneys = fetchedJourneys
          .map(normalizeJourney)
          .filter(journey => !journey.veil_locked); // Filter out veil locked journeys
          
        setJourneys(normalizedJourneys);
      } catch (error) {
        console.error('Error loading journeys:', error);
        setError('Failed to load journeys. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadJourneys();
  }, []);
  
  // Filter journeys based on active filter
  const filteredJourneys = journeys.filter(journey => {
    if (filterByChakra) {
      return journey.chakra_tag === filterByChakra;
    }
    if (activeFilter) {
      return journey.chakra_tag === activeFilter;
    }
    return true;
  });
  
  // Apply limit if specified
  const limitedJourneys = limit ? filteredJourneys.slice(0, limit) : filteredJourneys;
  
  // Get unique chakra tags for filtering
  const chakraTags = Array.from(new Set(journeys.map(journey => journey.chakra_tag)))
    .filter(Boolean) as ChakraTag[];
  
  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="w-full text-center py-12">
        <p className="text-white/70">{error}</p>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline" 
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    );
  }
  
  if (journeys.length === 0) {
    return (
      <div className="w-full text-center py-12">
        <p className="text-white/70">No journeys available.</p>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      {/* Chakra Filter Buttons */}
      {showFilters && chakraTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <Button
            key="all"
            variant="ghost"
            className={`rounded-full ${!activeFilter ? 'bg-white/10' : ''}`}
            onClick={() => setActiveFilter(null)}
          >
            All Journeys
          </Button>
          
          {chakraTags.map(chakra => {
            const ChakraIcon = CHAKRA_ICONS[chakra] || Circle;
            const chakraColor = CHAKRA_COLORS[chakra as ChakraTag] || '#FFFFFF';
            const isActive = activeFilter === chakra;
            
            return (
              <Button
                key={chakra}
                variant="ghost"
                className={`rounded-full transition-colors ${isActive ? 'bg-white/10' : ''}`}
                style={{
                  color: isActive ? chakraColor : `${chakraColor}80`,
                  borderColor: isActive ? chakraColor : 'transparent'
                }}
                onClick={() => setActiveFilter(chakra as ChakraTag)}
              >
                <ChakraIcon className="mr-1 h-4 w-4" />
                {chakra}
              </Button>
            );
          })}
        </div>
      )}
      
      {/* Journeys Grid or Slider */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter || 'all'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {variant === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {limitedJourneys.map((journey) => (
                <JourneyCard key={journey.id} journey={journey} />
              ))}
            </div>
          ) : (
            <div className="flex overflow-x-auto pb-6 snap-x snap-mandatory -mx-4 px-4 space-x-4 scroll-smooth no-scrollbar">
              {limitedJourneys.map((journey) => (
                <div 
                  key={journey.id} 
                  className="min-w-[280px] sm:min-w-[350px] snap-center"
                >
                  <JourneyCard journey={journey} variant="compact" />
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Show count */}
      <div className="mt-8 text-center text-sm text-white/50">
        {limitedJourneys.length} {limitedJourneys.length === 1 ? 'journey' : 'journeys'} available
        {activeFilter ? ` for ${activeFilter}` : ''}
      </div>
    </div>
  );
};

export default JourneyGallery;
