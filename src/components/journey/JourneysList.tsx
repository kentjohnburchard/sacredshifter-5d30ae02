
import React, { useState, useEffect } from 'react';
import { Journey } from '@/types/journey';
import EnhancedJourneyCard from './EnhancedJourneyCard';
import JourneysGrid from './JourneysGrid';

interface JourneysListProps {
  journeys?: Journey[];
  className?: string;
  filter?: string;
  maxItems?: number;
}

const JourneysList: React.FC<JourneysListProps> = ({ 
  journeys = [], 
  className = '',
  filter = '',
  maxItems
}) => {
  const [filteredJourneys, setFilteredJourneys] = useState<Journey[]>([]);
  
  useEffect(() => {
    // Apply filtering logic
    let result = [...journeys];
    
    if (filter) {
      // Filter by tags, title, or chakra
      result = result.filter(journey => 
        journey.tags?.some(tag => tag.toLowerCase().includes(filter.toLowerCase())) ||
        journey.title?.toLowerCase().includes(filter.toLowerCase()) ||
        journey.chakra_tag?.toLowerCase() === filter.toLowerCase()
      );
    }
    
    // Apply maxItems limit
    if (maxItems && result.length > maxItems) {
      result = result.slice(0, maxItems);
    }
    
    setFilteredJourneys(result);
  }, [journeys, filter, maxItems]);

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
