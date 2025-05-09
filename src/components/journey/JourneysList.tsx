
import React from 'react';
import { Journey } from '@/types/journey';
import EnhancedJourneyCard from './EnhancedJourneyCard';
import JourneysGrid from './JourneysGrid';

interface JourneysListProps {
  journeys: Journey[];
  className?: string;
}

const JourneysList: React.FC<JourneysListProps> = ({ journeys, className }) => {
  if (journeys.length === 0) {
    return (
      <div className="p-8 text-center bg-purple-900/20 rounded-lg border border-purple-500/20">
        <h3 className="text-xl font-medium text-white mb-2">No journeys available</h3>
        <p className="text-white/70">Check back soon for new sacred experiences.</p>
      </div>
    );
  }

  return <JourneysGrid journeys={journeys} className={className} />;
};

export default JourneysList;
