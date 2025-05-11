
import React, { useState, useEffect } from 'react';
import { Journey } from '@/types/journey';
import EnhancedJourneyCard from './EnhancedJourneyCard';
import JourneysGrid from './JourneysGrid';
import { Loader2 } from 'lucide-react';

interface JourneysListProps {
  journeys?: Journey[];
  className?: string;
  filter?: string;
  maxItems?: number;
  loading?: boolean;
}

const JourneysList: React.FC<JourneysListProps> = ({ 
  journeys = [], 
  className = '',
  filter = '',
  maxItems,
  loading = false
}) => {
  const [filteredJourneys, setFilteredJourneys] = useState<Journey[]>([]);
  
  useEffect(() => {
    // Apply filtering logic
    let result = [...journeys];
    
    if (filter && filter.trim() !== '') {
      const filterLower = filter.toLowerCase();
      
      // Filter by tags, title, or chakra
      result = result.filter(journey => {
        // Check if any tag matches
        const hasTags = Array.isArray(journey.tags) && journey.tags.length > 0;
        const hasMatchingTag = hasTags && journey.tags.some(tag => 
          tag && typeof tag === 'string' && tag.toLowerCase().includes(filterLower)
        );
        
        // Check title
        const hasTitle = journey.title && typeof journey.title === 'string';
        const hasMatchingTitle = hasTitle && journey.title.toLowerCase().includes(filterLower);
        
        // Combined chakra check - handle both fields safely
        const chakraTag = journey.chakra_tag || '';
        const chakra = journey.chakra || '';
        
        const hasMatchingChakra = 
          (typeof chakraTag === 'string' && chakraTag.toLowerCase().includes(filterLower)) ||
          (typeof chakra === 'string' && chakra.toLowerCase().includes(filterLower));
        
        return hasMatchingTag || hasMatchingTitle || hasMatchingChakra;
      });
    }
    
    // Apply maxItems limit
    if (maxItems && result.length > maxItems) {
      result = result.slice(0, maxItems);
    }
    
    setFilteredJourneys(result);
  }, [journeys, filter, maxItems]);

  if (loading) {
    return (
      <div className="p-8 text-center bg-purple-900/20 rounded-lg border border-purple-500/20">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400 mx-auto mb-2" />
        <h3 className="text-xl font-medium text-white mb-2">Loading Journeys</h3>
        <p className="text-white/70">
          Retrieving sacred experiences...
        </p>
      </div>
    );
  }

  if (filteredJourneys.length === 0) {
    return (
      <div className="p-8 text-center bg-purple-900/20 rounded-lg border border-purple-500/20">
        <h3 className="text-xl font-medium text-white mb-2">No journeys available</h3>
        <p className="text-white/70">
          {filter ? `No journeys match "${filter}"` : "Check back soon for new sacred experiences."}
        </p>
      </div>
    );
  }

  return <JourneysGrid journeys={filteredJourneys} className={className} />;
};

export default JourneysList;
