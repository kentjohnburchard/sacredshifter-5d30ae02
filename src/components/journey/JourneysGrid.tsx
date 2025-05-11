
import React from 'react';
import { Journey } from '@/types/journey';
import EnhancedJourneyCard from './EnhancedJourneyCard';
import { motion } from 'framer-motion';

interface JourneysGridProps {
  journeys: Journey[];
  className?: string;
}

const JourneysGrid: React.FC<JourneysGridProps> = ({ journeys, className }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full ${className}`}>
      {journeys.map((journey, index) => (
        <motion.div
          key={journey.id || journey.filename || index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="h-full w-full"
          whileHover={{ 
            y: -5, 
            transition: { duration: 0.2 } 
          }}
        >
          <EnhancedJourneyCard journey={journey} className="h-full" />
        </motion.div>
      ))}
    </div>
  );
};

export default JourneysGrid;
